import { Sun, CloudRain, Cloud, Thermometer, Moon, Camera, Loader2 } from "lucide-react";

function WeatherBoard({ weatherData }: { weatherData: any }) {

    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
        return (
            <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] text-white flex items-center gap-2 bg-black/50 p-4 rounded-full">
                <Loader2 className="animate-spin" />
                <span>Sincronizzazione meteo...</span>
            </div>
        );
    }
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
                            Rapallo
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

            {/* Card 2: Linea Temporale Meteo */}
            <div className="bg-white/5 p-5 md:p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                <div className="relative flex items-center justify-between w-full px-2">
                    {/* Linea di base orizzontale */}
                    <div className="absolute top-[45%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2 z-0" />

                    {[
                        { time: "08:00", icon: <Sun className="w-5 h-5 text-yellow-400" />, active: false },
                        { time: "12:00", icon: <Sun className="w-5 h-5 text-yellow-500" />, active: true },
                        { time: "16:00", icon: <Cloud className="w-5 h-5 text-slate-300" />, active: false },
                        { time: "20:00", icon: <CloudRain className="w-5 h-5 text-blue-400" />, active: false },
                        { time: "00:00", icon: <Moon className="w-5 h-5 text-indigo-200" />, active: false },
                    ].map((item, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center gap-3 group">
                            {/* Punto di snodo sulla linea */}
                            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${item.active ? 'bg-yellow-400 ring-4 ring-yellow-400/20 scale-125' : 'bg-white/20'}`} />

                            <div className="flex flex-col items-center gap-1">
                                <div className={`transition-all duration-300 ${item.active ? 'scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'opacity-50 group-hover:opacity-100'}`}>
                                    {item.icon}
                                </div>
                                <span className={`text-[10px] font-medium tracking-tighter ${item.active ? 'text-white' : 'opacity-40'}`}>
                                    {item.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card 3: Consigli Scatto */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-2xl border border-white/5">
                <div className="p-2 bg-white/10 rounded-lg">
                    <Camera className="w-5 h-5 text-indigo-300" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold">Luce perfetta per scatti dorati</p>
                    <p className="text-[10px] opacity-60">Usa un filtro ND2 per risaltare i riflessi del mare.</p>
                </div>
                <button className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/10 transition-all">
                    Dettagli
                </button>
            </div>
        </div>
    );
}

export default WeatherBoard;