import WeatherBoard from "../weatherBoard/WeatherBoard";

function InfoCard({ weatherData }: any) {
    return (
        <div className="
        top-[10vh]
        left-2 md:left-10
        right-2 md:right-10
        z-[100] 
        bg-black/10
        flex 
        justify-between 
        px-4 md:px-10
        h-auto
        backdrop-blur-md 
        border-b
        border-white/10
        rounded-[40px]
        text-white
        rounded-3xl
        mx-auto //centratura
        max-w-6xl           // Evita troppo larga su schermi max
        "
            style={{ height: '80vh' }}
        >
            <WeatherBoard weatherData={weatherData} />

        </div>
    );
}

export default InfoCard;
