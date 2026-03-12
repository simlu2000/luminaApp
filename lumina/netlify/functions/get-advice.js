exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

    try {
        const { weatherData } = JSON.parse(event.body);
        //const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
        const API_KEY = process.env.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;

        console.log("Controllo Key:", API_KEY ? API_KEY.substring(0, 4) + "..." : "MANCANTE");
        // Log di controllo (vedrai le prime 4 lettere nei log di Netlify)
        console.log("Controllo Key:", API_KEY ? API_KEY.substring(0, 4) + "..." : "MANCANTE");

        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const prompt = `Sei un fotografo a ${weatherData.name}. Meteo: ${weatherData.weather[0].description}. Dai un titolo breve e un consiglio tecnico ISO/Apertura in italiano. Sii conciso.`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Errore Google:", data);
            throw new Error(data.error?.message || "Errore Google API");
        }

        const adviceText = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ advice: adviceText }),
        };
    } catch (error) {
        console.error("Crash Funzione:", error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};