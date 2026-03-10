"use client"
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ScriptableContext
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function SunPositionChart({ weatherData }: { weatherData: any }) {
  const chartData = useMemo(() => {
    if (!weatherData) return null;

    const sunrise = weatherData.sys.sunrise;
    const sunset = weatherData.sys.sunset;
    const now = weatherData.dt;

    // Generiamo 24 punti per rappresentare la curva del sole (sinusoide)
    // Usiamo l'alba e il tramonto per centrare la curva
    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const dataPoints = Array.from({ length: 24 }, (_, i) => {
      // Calcolo matematico per simulare l'altezza del sole (-1 a 1)
      return Math.sin((i - 6) * (Math.PI / 12)); 
    });

    // Calcoliamo la posizione del "punto sole" attuale
    const currentHour = new Date(now * 1000).getHours();
    const currentMinute = new Date(now * 1000).getMinutes();
    const exactHour = currentHour + currentMinute / 60;

    return {
      labels,
      datasets: [
        {
          label: 'Altezza Sole',
          data: dataPoints,
          fill: true,
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: 2,
          pointRadius: (context: any) => {
            // Mostra il punto solo per l'ora corrente
            return Math.abs(context.dataIndex - exactHour) < 0.5 ? 8 : 0;
          },
          pointBackgroundColor: '#fbbf24',
          pointBorderColor: '#fff',
          pointHoverRadius: 8,
          tension: 0.4,
          // Gradiente dinamico: Giorno (Giallo) / Notte (Blu)
          backgroundColor: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
            gradient.addColorStop(0, 'rgba(251, 191, 36, 0.4)'); // Top (Giorno)
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)'); // Orizzonte
            gradient.addColorStop(1, 'rgba(49, 46, 129, 0.4)');   // Bottom (Notte)
            return gradient;
          },
        },
      ],
    };
  }, [weatherData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false, // Nascondiamo gli assi per un look pulito
        min: -1.2,
        max: 1.2,
      },
      x: {
        grid: { display: false },
        ticks: {
          color: 'rgba(255, 255, 255, 0.3)',
          font: { size: 10 },
          callback: (val: any, index: number) => (index % 6 === 0 ? chartData?.labels[index] : ''),
        }
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  if (!chartData) return null;

  return (
    <div className="w-full bg-black/20 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-white font-bold text-lg">Percorso Solare</h3>
          <p className="text-white/50 text-xs uppercase tracking-widest">Posizione attuale del sole</p>
        </div>
        <div className="text-right">
            <span className="text-yellow-400 font-mono text-sm">
                {new Date(weatherData.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
        </div>
      </div>
      
      <div className="h-32 relative">
        {/* Linea dell'Orizzonte */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 z-0" />
        
        <Line data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <p className="text-[10px] text-white/40 uppercase">Alba</p>
            <p className="text-sm text-orange-300 font-bold">
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
        </div>
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <p className="text-[10px] text-white/40 uppercase">Tramonto</p>
            <p className="text-sm text-indigo-300 font-bold">
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
        </div>
      </div>
    </div>
  );
}