const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {

        const { weatherData } = JSON.parse(event.body);

        const API_KEY = process.env.key;

        console.log("Controllo Key:", API_KEY ? API_KEY.substring(0, 4) + "..." : "MANCANTE");

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

        const city = weatherData?.name || "città sconosciuta";
        const description = weatherData?.weather?.[0]?.description || "condizioni meteo sconosciute";
        console.log("DATA TO PROMPT: ", city, " ", description);

        const prompt = `Sei un fotografo a ${city}. Meteo: ${description}. Dai un titolo breve e un consiglio tecnico ISO/Apertura in italiano.`;
        console.log("PROMPT TO GEMINI: ", prompt);
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    { parts: [{ text: prompt }] }
                ]
            })
        });
        const data = await response.json();
        console.log("Gemini RAW:", JSON.stringify(data, null, 2));

        const adviceText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Nessun consiglio disponibile";

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ advice: adviceText })
        };

    } catch (error) {

        console.error("Crash Funzione:", error.message);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};