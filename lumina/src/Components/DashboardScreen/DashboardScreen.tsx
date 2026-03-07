import { useState, useEffect } from "react";
import axios from "axios";
import { BackgroundGradientAnimation } from "../backgroundGradientAnimation/backgroundGradientAnimation";
import InfoCard from "../infoCard/InfoCard";
import { Loader2 } from "lucide-react";

function DashboardScreen() {
    /* Gestione dati meteo */
    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    const [currentLocation] = useState("Rapallo");
    //console.log("API",API_KEY)
    console.log(weatherData)
    useEffect(() => {
        const fetchWeather = async () => {
            if (!API_KEY) {
                console.error("API Key non trovata!");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${currentLocation}&units=metric&lang=it&appid=${API_KEY}`
                );
                setWeatherData((prevData: any) => {
                    const isDifferent = JSON.stringify(prevData) !== JSON.stringify(response.data);

                    if (isDifferent) {
                        console.log("Dati cambiati! Aggiorno la Dashboard.");
                        return response.data;
                    }

                    return prevData;
                });
                setLoading(false);
            } catch (error) {
                console.error("Errore nel recupero meteo:", error);
                setLoading(false);
            }
        };

        fetchWeather();

        const interval = setInterval(() => {
            fetchWeather();
        }, 300000);

        return () => clearInterval(interval);
    }, [API_KEY, currentLocation]);

    if (loading) return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
    );

    return (
        <div className="min-h-screen font-sans bg-slate-950 overflow-hidden">
            <BackgroundGradientAnimation>
                {/* Contenitore principale con scroll se necessario */}
                <div className="relative z-50 h-full w-full overflow-y-auto px-4 pb-20">

                    <div className="mt-[15%] md:mt-[10%]">
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center tracking-tight text-white drop-shadow-2xl">
                            Dashboard
                        </h1>
                    </div>

                    {/* Dati Meteo */}
                    <div className="mt-10 flex justify-center">
                        <div className="w-full max-w-4xl">
                            <InfoCard weatherData={weatherData} />
                        </div>
                    </div>

                    {/* Grafico */}
                    <div className="mt-10">
                    </div>
                </div>
            </BackgroundGradientAnimation>
        </div>
    );
}

export default DashboardScreen;