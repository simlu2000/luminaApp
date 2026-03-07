import WeatherBoard from "../weatherBoard/WeatherBoard";

function InfoCard({weatherData }: any) {
    return (
        <nav className="
        fixed 
        top-30 
        left-10 
        right-10 
        z-[100] 
        flex 
        justify-between 
        px-10  
        py-8
        backdrop-blur-md 
        border-b
        border-white/10
        text-white
        rounded-3xl
        "
            style={{ height: '80vh' }}
        >
            <WeatherBoard weatherData={weatherData}/>

        </nav>
    );
}

export default InfoCard;