const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const body = JSON.parse(event.body);
    const { weatherData } = body;

    // Inizializza con la chiave corretta
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // CAMBIO CRUCIALE: Usiamo gemini-1.5-flash che è il modello standard
    // Se continua a dare 404, Google richiede esplicitamente questo ID
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Sei un fotografo professionista a ${weatherData.name}.
    Meteo attuale: ${weatherData.weather[0].description}, ${Math.round(weatherData.main.temp)}°C.
    
    ISTRUZIONI RISPOSTA:
    - Inizia con un TITOLO BREVE (max 5 parole) seguito da un punto fermo.
    - Dopo il punto, scrivi un CONSIGLIO TECNICO (ISO, apertura, filtri) di 2-3 frasi.
    - Personalizza il consiglio: se è un posto di mare o lago (come ${weatherData.name}), parla di riflessi e lungomare; se è montagna di vette; se è città di architettura.
    - Rispondi in ITALIANO.`;

    // Chiamata a Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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
      body: JSON.stringify({ error: error.message }),
    };
  }
};