exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    const { weatherData } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) throw new Error("Chiave API mancante su Netlify");

    // Endpoint V1 STABILE (evitiamo v1beta che dà errore 404)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `Sei un fotografo professionista. Analizza il meteo a ${weatherData.name} (${weatherData.weather[0].description}) e dai un consiglio tecnico (ISO, apertura) in italiano. Inizia con un titolo breve seguito da un punto.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error?.message || "Errore API Google");

    const adviceText = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ advice: adviceText }),
    };
  } catch (error) {
    console.error("ERRORE:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};