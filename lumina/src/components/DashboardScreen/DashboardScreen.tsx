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

    const [currentLocation] = useState("Genova"); //default
    //console.log(weatherData)

    const getPosition = () => {
      return new Promise((resolve, reject) => { //richiesta permesso recupero posizione gps
            navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };
    
    useEffect(() => {
       const fetchWeather = async () => {
        setLoading(true);
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const response = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=it&appid=${API_KEY}`
                    );
                    setWeatherData(response.data);
                    setLoading(false);
                },
                async (error) => {
                    console.log("GPS negato o non disponibile, uso città di default:", currentLocation);
                    const response = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?q=${currentLocation}&units=metric&lang=it&appid=${API_KEY}`
                    );
                    setWeatherData(response.data);
                    setLoading(false);
                }
            );
        } catch (error) {
            console.error("Errore critico nel recupero meteo:", error);
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
            <BackgroundGradientAnimation weatherData = {weatherData}>
                {/* Contenitore principale con scroll se necessario */}
                <div className="relative z-50 h-full w-full overflow-y-auto px-4 pb-20">

                    <div className="mt-[10vh] md:mt-[15vh]">
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center tracking-tight text-white drop-shadow-2xl">
                            Dashboard
                        </h1>
                    </div>

                    {/* Dati Meteo */}
                    <div className="mt-[10vh]  flex justify-center">
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
