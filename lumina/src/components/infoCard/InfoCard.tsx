import WeatherBoard from "../weatherBoard/WeatherBoard";

function InfoCard({weatherData }: any) {
    return (
        <div className="
        fixed 
        top-[10vh]
        left-2 md:left-10
        right-2 md:right-10
        z-[100] 
        flex 
        justify-between 
        px-4 md:px-10
        py-8
        backdrop-blur-md 
        border-b
        border-white/10
        text-white
        rounded-3xl
        mx-auto //centratura
        max-w-6xl           // Evita troppo larga su schermi max
        "
            style={{ height: '80vh' }}
        >
            <WeatherBoard weatherData={weatherData}/>

        </div>
    );
}

export default InfoCard;
