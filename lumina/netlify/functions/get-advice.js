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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Creazione del Prompt (ottimizzato per il tuo parsing in React)
    const prompt = `Sei un fotografo professionista esperto di luce a ${weatherData.name}.
    Condizioni attuali:
    - Meteo: ${weatherData.weather[0].description}
    - Temp: ${Math.round(weatherData.main.temp)}°C
    - Nuvole: ${weatherData.clouds.all}%
    - Umidità: ${weatherData.main.humidity}%
    - Visibilità: ${(weatherData.visibility / 1000).toFixed(1)} km

    ISTRUZIONI RISPOSTA:
    - Inizia con un TITOLO BREVE (max 5 parole) seguito da un punto fermo.
    - Dopo il punto, scrivi un CONSIGLIO TECNICO (ISO, apertura, filtri) di 2-3 frasi.
    - Rispondi in ITALIANO.
    - Sii molto creativo e specifico per il meteo indicato.`;

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