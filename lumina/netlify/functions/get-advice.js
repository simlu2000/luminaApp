const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
    // Configurazione CORS per permettere alla tua app React di chiamare la funzione
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    // Gestione pre-flight OPTIONS (necessaria per i browser)
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    //srichieste POST
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Metodo non consentito. Usa POST." })
        };
    }

    try {
        // 1. Recupero dati meteo inviati da React
        const body = JSON.parse(event.body);
        const { weatherData } = body;

        if (!weatherData) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Dati meteo mancanti." })
            };
        }

        // 2. Inizializzazione Gemini
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // 3. Creazione del Prompt (ottimizzato per il tuo parsing in React)
        const prompt = `Sei un fotografo professionista esperto di luce a ${weatherData.name}.
    Condizioni attuali:
    - Meteo: ${weatherData.weather[0].description}
    - Temp: ${Math.round(weatherData.main.temp)}°C
    - Nuvole: ${weatherData.clouds.all}%
    - Umidità: ${weatherData.main.humidity}%
    - Visibilità: ${(weatherData.visibility / 1000).toFixed(1)} km

   ISTRUZIONI RISPOSTA (RIGIDE):
    1. TITOLO BREVE (max 5 parole) seguito da un punto fermo.
    2. CONSIGLIO TECNICO di 2-3 frasi che includa ISO, apertura e suggerimenti compositivi.
    
    ANALISI DEL CONTESTO (Personalizza in base a dove si trova ${weatherData.name}):
    - Se è una località di MARE: suggerisci scatti sul bagnasciuga, lungomare o l'uso di filtri ND per l'acqua.
    - Se è una località di MONTAGNA: suggerisci di sfruttare le vette, i sentieri, o la luce che filtra tra i boschi.
    - Se c'è un LAGO: punta tutto sui riflessi simmetrici e la calma dello specchio d'acqua.
    - Se è una CITTÀ/METROPOLI: suggerisci architettura, contrasti urbani o street photography tra la gente.
    
    Il tono deve essere professionale e ispiratore. Rispondi in ITALIANO.`;

        // 4. Chiamata a Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 5. Ritorno della risposta a React
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ advice: text.trim() }),
        };

    } catch (error) {
        console.error("Errore funzione IA:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Errore durante la generazione dei consigli." }),
        };
    }
};