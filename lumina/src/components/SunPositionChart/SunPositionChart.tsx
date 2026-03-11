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
    if (!weatherData?.sys?.sunrise || !weatherData?.sys?.sunset || !weatherData?.dt) return null;

    const sunrise = weatherData.sys.sunrise;
    const sunset = weatherData.sys.sunset;
    const now = weatherData.dt;

    const sunriseDate = new Date(sunrise * 1000);
    const sunsetDate = new Date(sunset * 1000);
    
    const sunriseHour = sunriseDate.getHours() + sunriseDate.getMinutes() / 60;
    const sunsetHour = sunsetDate.getHours() + sunsetDate.getMinutes() / 60;
    
    const dayLength = sunsetHour - sunriseHour;
    const solarNoon = sunriseHour + (dayLength / 2);

    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    
    const dataPoints = Array.from({ length: 24 }, (_, i) => {
      const period = dayLength * 2; 
      return Math.cos(((i - solarNoon) * 2 * Math.PI) / period);
    });

    const nowDate = new Date(now * 1000);
    const currentHour = nowDate.getHours() + nowDate.getMinutes() / 60;

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
            return Math.abs(context.dataIndex - currentHour) < 0.5 ? 8 : 0;
          },
          pointBackgroundColor: '#fbbf24',
          pointBorderColor: '#fff',
          pointHoverRadius: 8,
          tension: 0.4,
          backgroundColor: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height || 150);
            gradient.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(1, 'rgba(49, 46, 129, 0.4)');
            return gradient;
          },
        },
      ],
      currentHour
    };
  }, [weatherData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        min: -1.2,
        max: 1.2,
      },
      x: {
        grid: { display: false },
        ticks: {
          color: 'rgba(255, 255, 255, 0.3)',
          font: { size: 10 },
          callback: function(_val: any, index: number) {
            return index % 6 === 0 ? `${index}:00` : '';
          },
        }
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  if (!chartData || !weatherData?.sys) return null;

  return (
    <div className="w-full bg-black/20 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-white font-bold text-lg">Percorso Solare</h3>
          <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">
            {weatherData.name || 'Località'} • Dinamica Luce
          </p>
        </div>
        <div className="text-right">
            <span className="text-yellow-400 font-mono text-sm font-bold bg-white/10 px-3 py-1 rounded-full">
                {new Date(weatherData.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
        </div>
      </div>
      
      <div className="h-32 relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 z-0" />
        <Line data={chartData} options={options as any} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
            <p className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">Alba</p>
            <p className="text-sm text-orange-300 font-bold">
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
        </div>
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
            <p className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">Tramonto</p>
            <p className="text-sm text-indigo-300 font-bold">
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
        </div>
      </div>
    </div>
  );
}