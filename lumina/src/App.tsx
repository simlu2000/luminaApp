import './index.css';
import { BackgroundGradientAnimation } from "./components/backgroundGradientAnimation/backgroundGradientAnimation";
function App() {
  return (
    <div className="min-h-screen font-sans bg-slate-950">
      {/* Il componente ora avvolge tutto il contenuto */}
      <BackgroundGradientAnimation>
        <div className="relative z-50 flex flex-col items-center justify-center min-h-screen text-white px-6 py-16">
          
          <main className="max-w-3xl mx-auto backdrop-blur-md bg-black/20 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center tracking-tight drop-shadow-2xl">
              Welcome in Lumina
            </h1>

            <p className="text-xl mb-10 text-center text-white/80 leading-relaxed">
              Light. Timing. Perfect shot.
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
              <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-2xl">🎯</span> 
                <span>Exact astronomical calculation for your location</span>
              </li>
              <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-2xl">🎯</span> 
                <span>OpenWeather data integration for the perfect shot</span>
              </li>
              <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-2xl">🎯</span> 
                <span>Creative tips based on current conditions</span>
              </li>
               <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-2xl">🎯</span> 
                <span>Track the golden and blue hour</span>
              </li>
             
            </ul>
            
            <div className="mt-10 flex justify-center">
              <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105">
                Find the golden hour
              </button>
            </div>
          </main>

        </div>
      </BackgroundGradientAnimation>
    </div>
  );
}

export default App;