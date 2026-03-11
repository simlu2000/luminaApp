import { useState, useEffect } from "react";
import axios from "axios";
import { BackgroundGradientAnimation } from "../backgroundGradientAnimation/backgroundGradientAnimation";
import InfoCard from "../infoCard/InfoCard";
import { Loader2, MapPin } from "lucide-react";
import SunPositionChart from "../SunPositionChart/SunPositionChart";

function DashboardScreen() {
    /* Gestione dati meteo */
    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    const [currentLocation] = useState("Genova"); //default

    useEffect(() => {
        const fetchWeatherData = async () => {
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
                    async (_error) => {
                        console.log("GPS negato o non disponibile, uso città di default:", currentLocation);
                        const response = await axios.get(
                            `https://api.openweathermap.org/data/2.5/weather?q=${currentLocation}&units=metric&lang=it&appid=${API_KEY}`
                        );
                        setWeatherData(response.data);
                        setLoading(false);
                    }
                )
            } catch (error) {
                console.log("Error while fetching weather data. ")
                setLoading(false);
            }
        }

        fetchWeatherData();

        const interval = setInterval(() => {
            fetchWeatherData();
        }, 300000);

        return () => clearInterval(interval);
    }, [API_KEY, currentLocation]);

    if (loading) return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950">
            <Loader2 className="w-16 h-16 animate-spin text-white" />
        </div>
    );

    return (
        <div className="min-h-screen font-sans bg-slate-950 overflow-hidden text-lg">
            <BackgroundGradientAnimation weatherData={weatherData}>
                <div className="relative z-50 h-full w-full overflow-y-auto px-6 md:px-12 pb-24 pt-10">

                    <header className="max-w-7xl mt-[10vh] md:mt-12 lg:mt-24 mx-auto mb-14 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                        <div>
                            <h1 className="text-4xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl">
                                Lumina
                            </h1>
                            <p className="text-white/50 text-base md:text-lg uppercase tracking-[0.4em] font-semibold mt-2">
                                Shooting Dashboard
                            </p>
                        </div>

                        {/* Badge Località */}
                        <div className="bg-black/10 backdrop-blur-md px-8 py-4 mt-6 md:mt-0 rounded-full border border-white/20 text-white text-xl md:text-2xl font-bold shadow-xl flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-blue-400" />
                            <span>{weatherData?.name || "Ricerca posizione..."}</span>
                        </div>
                    </header>

                    {/* Dashboard Grid (Bento Layout) */}
                    <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* Colonna Laterale: Grafico Sole e Widget Extra */}
                        <div className="flex flex-col gap-8 order-1 lg:order-1">
                            {/* Grafico Sole */}
                            <div className="w-full transform transition-all hover:scale-[1.02]">
                                <SunPositionChart weatherData={weatherData} />
                            </div>

                            {/* Widget Extra: Quick Status */}
                            <div className="p-8 bg-black/10 backdrop-blur-xl rounded-[3rem] border border-white/10 text-white shadow-2xl">
                                <h4 className="text-sm md:text-base uppercase tracking-widest text-white/40 font-black mb-6">Visibilità Sensore</h4>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-3xl md:text-xl font-light tracking-tighter">
                                        {weatherData?.visibility / 1000}km
                                    </span>
                                    <div className={`h-4 w-16 rounded-full shadow-inner ${weatherData?.visibility > 8000 ? 'bg-green-400 shadow-green-500/50' : 'bg-orange-400 shadow-orange-500/50'}`} />
                                </div>
                                <p className="text-base md:text-xl mt-4 opacity-70 leading-relaxed font-medium">
                                    Condizioni ottimali per lenti 85mm+
                                </p>
                            </div>
                        </div>

                        {/* Colonna Principale: InfoCard (Dati Meteo e Foto Advice) */}
                        <div className="lg:col-span-2 h-auto order-2 lg:order-2 transform transition-all hover:scale-[1.01]">
                            <InfoCard weatherData={weatherData} />
                        </div>

                    </main>
                </div>
            </BackgroundGradientAnimation>
        </div>
    );
}

export default DashboardScreen;