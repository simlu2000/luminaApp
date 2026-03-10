import { Sun, CloudRain, Cloud, Thermometer, Moon, Camera, Loader2, Eye, Wind, Droplets } from "lucide-react";

function WeatherBoard({ weatherData }: { weatherData: any }) {

    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
        return (
            <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] text-white flex items-center gap-2 bg-black/50 p-4 rounded-full">
                <Loader2 className="animate-spin" />
                <span>Loading weather...</span>
            </div>
        );
    }

    const getWeatherIcon = (main: string, size = "w-5 h-5") => {
        switch (main) {
            case "Clear": return <Sun className={`${size} text-yellow-400`} />;
            case "Clouds": return <Cloud className={`${size} text-slate-300`} />;
            case "Rain": return <CloudRain className={`${size} text-blue-400`} />;
            case "Snow": return <Moon className={`${size} text-indigo-200`} />;
            default: return <Sun className={`${size} text-yellow-400`} />;
        }
    };

    const getPhotographyAdvice = () => {
        const now = weatherData.dt;
        const sunrise = weatherData.sys.sunrise;
        const sunset = weatherData.sys.sunset;
        const clouds = weatherData.clouds.all; // % di nuvole
        const visibility = weatherData.visibility; // in metri
        const wind = weatherData.wind.speed; // m/s
        const hour = 3600;

        // 1. Caso Golden Hour
        if ((now >= sunrise && now < sunrise + hour) || (now >= sunset - hour && now < sunset)) {
            return {
                title: "Golden Hour in corso",
                desc: clouds > 50
                    ? "Luce calda diffusa dalle nuvole. Ottima per ritratti senza ombre dure."
                    : "Luce radente perfetta. Cerca i riflessi dorati."
            };
        }

        // 2. Caso Scarsa Visibilità / Foschia
        if (visibility < 5000) {
            return {
                title: "Atmosfera Soft",
                desc: "Foschia rilevata. Ottima per scatti minimalisti o bianco e nero ad alto contrasto."
            };
        }

        // 3. Caso Vento Forte (Mare mosso)
        if (wind > 8) {
            return {
                title: "Lunga Esposizione",
                desc: "Vento teso: usa un treppiede e filtri ND."
            };
        }

        // 4. Caso Cielo Limpido
        if (clouds < 10 && visibility > 9000) {
            return {
                title: "Cielo Terzo",
                desc: "Visibilità massima. Punta verso l'orizzonte o prova la fotografia astronomica stasera."
            };
        }

        // Default
        return {
            title: "Luce Neutra",
            desc: "Condizioni stabili. Ideale per street photography e architettura nel centro storico."
        };
    };

    const advice = getPhotographyAdvice();


    return (
        <div className="
            fixed top-4 md:top-10 left-4 md:left-10 right-4 md:right-10 
            z-[100] flex flex-col gap-4
            p-4 md:p-6
            backdrop-blur-xl bg-black/20 
            border border-white/10
            text-white rounded-[2.5rem] shadow-2xl
        ">
            {/* Sezione Superiore: Info Località e Temperatura */}
            <div className="flex justify-between items-center px-2">
                {/* Card 1: Info Località */}
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl flex-shrink-0 shadow-inner">
                        <Sun className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 animate-pulse" />
                    </div>
                    <div className="leading-tight">
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                            {weatherData?.name ? weatherData.name : 'Genova'}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-glow" />
                            <p className="text-[10px] md:text-xs opacity-60 uppercase tracking-widest">
                                {weatherData?.weather?.[0]?.main}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Temperatura */}
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-orange-400" />
                        <span className="text-3xl md:text-4xl font-light tracking-tighter">
                            {weatherData?.main?.temp ? Math.round(weatherData.main.temp) : "--"}°C
                        </span>
                    </div>
                    <p className="text-[10px] opacity-40">
                        Percepiti: {weatherData?.main?.feels_like ? Math.round(weatherData.main.feels_like) : "--"}°C                    </p>
                </div>
            </div>

            {/* Card 2: Linea Temporale Meteo Dinamica */}
            <div className="bg-white/5 p-5 md:p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                <div className="relative flex items-center justify-between w-full px-2">
                    <div className="absolute top-[45%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2 z-0" />

                    {[
                        {
                            time: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            icon: <Sun className="w-5 h-5 text-orange-300" />,
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
                            icon: <Moon className="w-5 h-5 text-indigo-300" />,
                            label: "Tramonto",
                            active: false
                        }
                    ].map((item, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center gap-3 group">
                            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${item.active ? 'bg-yellow-400 ring-4 ring-yellow-400/20 scale-125' : 'bg-white/20'}`} />

                            <div className="flex flex-col items-center gap-1">
                                <div className={`transition-all duration-300 ${item.active ? 'scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'opacity-50 group-hover:opacity-100'}`}>
                                    {item.icon}
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className={`text-[10px] font-bold ${item.active ? 'text-white' : 'opacity-80'}`}>
                                        {item.time}
                                    </span>
                                    <span className="text-[8px] uppercase opacity-40 tracking-tighter">
                                        {item.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
                <div style={{ marginTop: '5%' }} className="leading-tight">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                        {(() => {
                            const now = weatherData.dt;
                            const sunrise = weatherData.sys.sunrise;
                            const sunset = weatherData.sys.sunset;

                            if (now < sunrise) {
                                return "Next: Blue Hour (Sunrise)";
                            } else if (now < sunset) {
                                return "Next: Golden Hour (Sunset)";
                            } else {
                                return "Next: Blue Hour (Dawn)";
                            }
                        })()}
                    </h2>
                </div>
            </div>

            {/* Card 3: dati foto */}
            <div className="flex flex-col gap-3">
                {/* Prima riga: Umidità e Visibilità */}
                <div className="flex gap-3">
                    <div className="flex-1 flex items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-2xl border border-white/5">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Droplets className="w-5 h-5 text-blue-300" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase opacity-50">Umidità</p>
                            <p className="text-sm font-medium">{weatherData?.main?.humidity}%</p>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-2xl border border-white/5">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Eye className="w-5 h-5 text-cyan-300" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase opacity-50">Visibilità</p>
                            <p className="text-sm font-medium">
                                {weatherData?.visibility ? (weatherData.visibility / 1000).toFixed(1) : "--"} km
                            </p>
                        </div>
                    </div>
                </div>

                {/* Seconda riga: Vento e Direzione */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-2xl border border-white/5">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Wind className="w-5 h-5 text-blue-300" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-semibold uppercase opacity-50">Vento</p>
                        <p className="text-sm font-medium">
                            {weatherData?.wind?.speed ? Math.round(weatherData.wind.speed * 3.6) : "--"} km/h
                        </p>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        Direzione: {weatherData?.wind?.deg}°
                    </div>
                </div>
            </div>

            {/* Card 4: Consigli Scatto Dinamici */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-2xl border border-white/5">
                <div className="p-2 bg-white/10 rounded-lg">
                    <Camera className="w-5 h-5 text-indigo-300" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold">{advice.title}</p>
                    <p className="text-[10px] opacity-60 leading-tight">
                        {advice.desc}
                    </p>
                </div>
                <button className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/10 transition-all">
                    {Math.round(weatherData.clouds.all)}% Clouds
                </button>
            </div>
        </div>
    );
}

export default WeatherBoard;
