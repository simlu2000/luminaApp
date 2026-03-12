const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

    try {
        const { weatherData } = JSON.parse(event.body);

        // Inizializzazione esplicita
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Specifichiamo il modello 1.5-flash
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const prompt = `Sei un fotografo professionista a ${weatherData.name}.
        Meteo attuale: ${weatherData.weather[0].description}, ${Math.round(weatherData.main.temp)}°C.
        
        ISTRUZIONI RISPOSTA:
        - Inizia con un TITOLO BREVE (max 5 parole) seguito da un punto fermo.
        - Dopo il punto, scrivi un CONSIGLIO TECNICO (ISO, apertura, filtri) di 2-3 frasi.
        - Personalizza il consiglio: se è un posto di mare o lago (come ${weatherData.name}), parla di riflessi e lungomare; se è montagna di vette; se è città di architettura.
        - Rispondi in ITALIANO.`;

        // Generazione contenuto
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ advice: text }),
        };
    } catch (error) {
        console.error("ERRORE DETTAGLIATO:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};