/* eslint-disable react-hooks/rules-of-hooks */
import { Sun, CloudRain, Cloud, Thermometer, Moon, Camera, Loader2, Eye, Wind, Droplets } from "lucide-react";
import { useEffect, useState } from "react";
import { model } from '../../firebaseconfig';

function WeatherBoard({ weatherData }: { weatherData: any }) {

    const [photographyAdvice, setPhotographyAdvice] = useState({ title: "Caricamento consigli...", desc: "" });
    const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

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
            if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
                setPhotographyAdvice({ title: "Dati meteo non disponibili", desc: "Attendi per i consigli." });
                return;
            }

            setIsLoadingAdvice(true);
            try {
                const prompt = `Considerando le seguenti condizioni meteo a ${weatherData.name}:
                - Temperatura: ${Math.round(weatherData.main.temp)}°C (percepita: ${Math.round(weatherData.main.feels_like)}°C)
                - Condizione generale: ${weatherData.weather[0].description}
                - Nuvole: ${weatherData.clouds.all}%
                - Umidità: ${weatherData.main.humidity}%
                - Visibilità: ${(weatherData.visibility / 1000).toFixed(1)} km
                - Velocità del vento: ${Math.round(weatherData.wind.speed * 3.6)} km/h
                - Alba: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
                - Tramonto: ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
                Forniscimi un titolo accattivante e un consiglio dettagliato per una fotografia creativa da scattare ora, basato su queste condizioni. 
                Sii specifico con le raccomandazioni tecniche (es. esposizione, inquadratura).`;

                //Chiamata Gemini
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();
             
                // Parsing 
                const [title, ...descParts] = responseText.split('. ');
                setPhotographyAdvice({ title: title || "Consiglio fotografico", desc: descParts.join('. ') || responseText });

            } catch (error) {
                console.error("Errore nel recupero dei consigli da Gemini:", error);
                setPhotographyAdvice({ title: "Errore nel caricamento dei consigli", desc: "Riprova più tardi." });
            } finally {
                setIsLoadingAdvice(false);
            }
        };

        fetchAdvice();
    }, [weatherData]);

    return (
        <div className="flex flex-col gap-4 p-4 md:p-6 text-white rounded-[2.5rem]">
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

            {/* Card 4: Consigli Scatto Dinamici */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 md:p-6 rounded-2xl border border-white/5">
                <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                    <Camera className="w-5 h-5 md:w-7 md:h-7 text-indigo-300" />
                </div>
                <div className="flex-1">
                    <p className="text-sm md:text-lg lg:text-xl font-bold">{photographyAdvice.title}</p>
                    <p className="text-[10px] md:text-base opacity-60 leading-tight">
                        {isLoadingAdvice ? "Generazione consigli..." : photographyAdvice.desc}
                    </p>
                </div>
                <button className="text-[10px] md:text-sm font-bold bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/10 transition-all whitespace-nowrap">
                    {Math.round(weatherData.clouds.all)}% Clouds
                </button>
            </div>
        </div>
    );
}

export default WeatherBoard;