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

        //console.log("Controllo Key:", API_KEY ? API_KEY.substring(0, 4) + "..." : "MANCANTE");

        //const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`;
        const city = weatherData?.name || "città sconosciuta";
        const description = weatherData?.weather?.[0]?.description || "condizioni meteo sconosciute";
        //console.log("DATA TO PROMPT: ", city, " ", description);

        /*const prompt = `
            Sei un fotografo professionista esperto di travel photography. 
            Ti trovi a ${weatherData.name}. Il meteo attuale è: ${weatherData.weather[0].description}.

            In base alla tua conoscenza della località ${weatherData.name} (identifica se è mare, montagna, città o lago) e alle condizioni meteo e luce attuali, fornisci i seguenti consigli:

            1. TITOLO: Un titolo creativo e breve per lo scatto.
            2. SETUP: Parametri tecnici consigliati (ISO, Apertura, Tempi) adatti a questa luce.
            3. SCENA: Suggerisci un soggetto o un'inquadratura specifica che valorizzi ${weatherData.name} con questo meteo (es. riflessi, prospettive urbane, dettagli naturali).
            4. TRUCCO: Un segreto professionale per rendere la foto emozionante.

            Sii estremamente sintetico (massimo 2 frasi per punto). Usa un tono pratico, ispirazionale e professionale. Rispondi in italiano.
            `; */
        //console.log("PROMPT TO GEMINI: ", prompt);

        const prompt = `
            You are a professional photographer specialized in travel photography.
            You are currently in ${weatherData.name}. The current weather is: ${weatherData.weather[0].description}.

            Based on your knowledge of the location ${weatherData.name} (identify whether it is a seaside, mountain, city, or lake location) and the current weather and lighting conditions, provide the following advice:

            1. TITLE: A short and creative title for the shot.
            2. SETUP: Recommended technical settings (ISO, Aperture, Shutter Speed) suitable for the current light.
            3. SCENE: Suggest a specific subject or framing that enhances ${weatherData.name} with this weather (e.g., reflections, urban perspectives, natural details).
            4. TRICK: A professional secret to make the photo more emotional and impactful.

            Be extremely concise (maximum 2 sentences per point). Use a practical, inspirational, and professional tone. Respond in Italian.
            `;
            
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