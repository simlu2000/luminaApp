/* eslint-disable react-hooks/rules-of-hooks */
import { Sun, CloudRain, Cloud, Thermometer, Moon, Camera, Loader2, Eye, Wind, Droplets } from "lucide-react";
import { useEffect, useState } from "react";

function WeatherBoard({ weatherData }: { weatherData: any }) {

    const [photographyAdvice, setPhotographyAdvice] = useState({
        title: "Caricamento consigli...",
        setup: "",
        scene: "",
        trick: ""
    }); const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
        return (
            <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] text-white flex items-center gap-2 bg-black/50 p-4 rounded-full">
                <Loader2 className="animate-spin" />
                <span className="text-sm md:text-base">Loading weather...</span>
            </div>
        );
    }

    const getWeatherIcon = (main: string, size = "w-5 h-5 md:w-6 md:h-6") => {
        switch (main) {
            case "Clear": return <Sun className={`${size} text-yellow-400`} />;
            case "Clouds": return <Cloud className={`${size} text-slate-300`} />;
            case "Rain": return <CloudRain className={`${size} text-blue-400`} />;
            case "Snow": return <Moon className={`${size} text-indigo-200`} />;
            default: return <Sun className={`${size} text-yellow-400`} />;
        }
    };

    useEffect(() => {
        const fetchAdvice = async () => {
            if (!weatherData?.weather?.[0]) return;

            setIsLoadingAdvice(true);
            try {
                const response = await fetch('/.netlify/functions/get-advice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ weatherData })
                });

                if (!response.ok) throw new Error("Errore dal server Netlify");

                const data = await response.json();
                const responseText = data.advice;

                // 1. rimozione ** e sostituzione con stringa vuota 
                const textWithoutStars = responseText.replace(/\*\*/g, "");

                // 2. rimozione introduzioni gemini
                const cleanText = textWithoutStars.replace(/^(.*?)(?=1\.)/s, "").trim();

                // 3. Parsing Avanzato: split basato sulla numerazione "1. TITOLO:", "2. SETUP:", ecc.
                const sections = cleanText.split(/\d\.\s+.*?:/g).filter(Boolean);
                if (sections.length >= 4) {
                    setPhotographyAdvice({
                        title: sections[0].trim(),
                        setup: sections[1].trim(),
                        scene: sections[2].trim(),
                        trick: sections[3].trim()
                    });
                } else {
                    // Fallback se Gemini risponde con un formato diverso
                    setPhotographyAdvice({
                        title: "Consiglio Fotografico",
                        setup: "Parametri automatici consigliati",
                        scene: responseText,
                        trick: "Sperimenta con diverse angolazioni."
                    });
                }

                console.log("Gemini parsed data: ", sections);

            } catch (error) {
                console.error("Errore nel recupero dei consigli:", error);
                setPhotographyAdvice({
                    title: "Servizio non disponibile",
                    setup: "N/A",
                    scene: "Non è stato possibile caricare i consigli al momento.",
                    trick: "Riprova più tardi."
                });
            } finally {
                setIsLoadingAdvice(false);
            }
        };

        fetchAdvice();
    }, [weatherData]);

    return (
        <div className="flex flex-col w-full gap-4 p-4 md:p-6 text-white rounded-[2.5rem]">
            {/* Sezione Superiore: Info Località e Temperatura */}
            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl flex-shrink-0 shadow-inner">
                        <Sun className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 animate-pulse" />
                    </div>
                    <div className="leading-tight">
                        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                            {weatherData?.name ? weatherData.name : 'Genova'}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-glow" />
                            <p className="text-[10px] md:text-sm opacity-60 uppercase tracking-widest font-medium">
                                {weatherData?.weather?.[0]?.main}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                        <span className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tighter">
                            {weatherData?.main?.temp ? Math.round(weatherData.main.temp) : "--"}°C
                        </span>
                    </div>
                    <p className="text-[10px] md:text-sm opacity-40">
                        Percepiti: {weatherData?.main?.feels_like ? Math.round(weatherData.main.feels_like) : "--"}°C
                    </p>
                </div>
            </div>

            {/* Card 2: Linea Temporale Meteo Dinamica */}
            <div className="bg-white/5 p-5 md:p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                <div className="relative flex items-center justify-between w-full px-2">
                    <div className="absolute top-[45%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2 z-0" />

                    {[
                        {
                            time: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            icon: <Sun className="w-5 h-5 md:w-7 md:h-7 text-orange-300" />,
                            label: "Alba",
                            active: false
                        },
                        {
                            time: new Date(weatherData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            icon: getWeatherIcon(weatherData.weather[0].main),
                            label: "Ora",
                            active: true
                        },
                        {
                            time: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            icon: <Moon className="w-5 h-5 md:w-7 md:h-7 text-indigo-300" />,
                            label: "Tramonto",
                            active: false
                        }
                    ].map((item, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center gap-3 group">
                            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-500 ${item.active ? 'bg-yellow-400 ring-4 ring-yellow-400/20 scale-125' : 'bg-white/20'}`} />

                            <div className="flex flex-col items-center gap-1">
                                <div className={`transition-all duration-300 ${item.active ? 'scale-110' : 'opacity-50 group-hover:opacity-100'}`}>
                                    {item.icon}
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <span className={`text-[10px] md:text-lg lg:text-xl font-bold ${item.active ? 'text-white' : 'opacity-80'}`}>
                                        {item.time}
                                    </span>
                                    <span className="text-[8px] md:text-xs uppercase opacity-40 tracking-tighter font-semibold">
                                        {item.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 md:mt-8 text-center leading-tight">
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-bold tracking-tight opacity-90">
                        {(() => {
                            const now = weatherData.dt;
                            const sunrise = weatherData.sys.sunrise;
                            const sunset = weatherData.sys.sunset;

                            if (now < sunrise) return "Next: Blue Hour (Sunrise)";
                            if (now < sunset) return "Next: Golden Hour (Sunset)";
                            return "Next: Blue Hour (Dawn)";
                        })()}
                    </h2>
                </div>
            </div>

            {/* Card 3: dati foto */}
            <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                    <div className="flex-1 flex items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 md:p-6 rounded-2xl border border-white/5">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Droplets className="w-5 h-5 md:w-6 md:h-6 text-blue-300" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] md:text-sm font-semibold uppercase opacity-50 tracking-wider">Umidità</p>
                            <p className="text-sm md:text-xl lg:text-2xl font-medium">{weatherData?.main?.humidity}%</p>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 md:p-6 rounded-2xl border border-white/5">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Eye className="w-5 h-5 md:w-6 md:h-6 text-cyan-300" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] md:text-sm font-semibold uppercase opacity-50 tracking-wider">Visibilità</p>
                            <p className="text-sm md:text-xl lg:text-2xl font-medium">
                                {weatherData?.visibility ? (weatherData.visibility / 1000).toFixed(1) : "--"} km
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 md:p-6 rounded-2xl border border-white/5">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Wind className="w-5 h-5 md:w-6 md:h-6 text-blue-300" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] md:text-sm font-semibold uppercase opacity-50 tracking-wider">Vento</p>
                        <p className="text-sm md:text-xl lg:text-2xl font-medium">
                            {weatherData?.wind?.speed ? Math.round(weatherData.wind.speed * 3.6) : "--"} km/h
                        </p>
                    </div>
                    <div className="text-[10px] md:text-sm font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        Dir: {weatherData?.wind?.deg}°
                    </div>
                </div>
            </div>

            {/* Card 4: Consigli Fotografici Dinamici */}
            <div className="flex flex-col gap-5 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 p-6 md:p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/20 rounded-2xl">
                            <Camera className="w-6 h-6 text-indigo-300" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold">Pro Advice</p>
                            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                                {isLoadingAdvice ? "Analizzando la luce..." : photographyAdvice.title}
                            </h3>
                        </div>
                    </div>
                    <div className="hidden md:block px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-medium">
                        {Math.round(weatherData.clouds.all)}% Clouds
                    </div>
                </div>

                {/* Contenuto */}
                {!isLoadingAdvice ? (
                    <div className="flex flex-col gap-4 mt-4">

                        {/* Setup Tecnico */}
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Thermometer className="w-4 h-4 text-orange-400" />
                                <span className="text-[10px] font-bold uppercase opacity-60">Setup Tecnico</span>
                            </div>
                            <p className="text-sm text-indigo-100 leading-relaxed italic">{photographyAdvice.setup}</p>
                        </div>

                        {/* Soggetto / Scena Consigliata */}
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Eye className="w-4 h-4 text-cyan-400" />
                                <span className="text-[10px] font-bold uppercase opacity-60">Soggetto Consigliato</span>
                            </div>
                            <p className="text-sm text-cyan-50 leading-relaxed">{photographyAdvice.scene}</p>
                        </div>

                        {/* Trucco / Consiglio Speciale */}
                        <div className="p-4 bg-indigo-500/10 rounded-2xl border-l-4 border-indigo-400/50">
                            <p className="text-sm leading-relaxed text-white/80">
                                <span className="font-bold text-indigo-300">Il trucco: </span>
                                {photographyAdvice.trick}
                            </p>
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center py-10 gap-3">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        <p className="text-sm opacity-50 animate-pulse">
                            Gemini sta studiando lo scatto migliore per {weatherData.name}...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeatherBoard;