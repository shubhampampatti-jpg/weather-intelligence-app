import React from "react";
import { format } from "date-fns";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { WeatherData } from "../types";
import { getWeatherIcon } from "../utils";

interface ForecastProps {
  weather: WeatherData;
}

export default function Forecast({ weather }: ForecastProps) {
  // Extract next 24 hours for the chart
  const now = new Date();
  const currentHourIndex = weather.hourly.time.findIndex(
    (t) => new Date(t).getTime() >= now.getTime()
  ) || 0;
  
  const hourlyData = weather.hourly.time
    .slice(currentHourIndex, currentHourIndex + 24)
    .map((time, idx) => ({
      time: format(new Date(time), "ha"),
      temp: Math.round(weather.hourly.temperature_2m[currentHourIndex + idx]),
    }));

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          24-Hour Forecast
        </h3>
        <div className="h-48 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }} 
                dx={-10}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                formatter={(value: number) => [`${value}°`, 'Temperature']}
              />
              <Area 
                type="monotone" 
                dataKey="temp" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTemp)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          7-Day Forecast
        </h3>
        <div className="flex flex-col gap-4">
          {weather.daily.time.map((time, idx) => (
            <div key={time} className="flex items-center justify-between group">
              <span className="w-24 text-sm font-medium text-slate-600 dark:text-slate-300">
                {idx === 0 ? "Today" : format(new Date(time), "EEEE")}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8">
                  {getWeatherIcon(weather.daily.weather_code[idx])}
                </div>
              </div>
              <div className="flex items-center gap-3 w-32 justify-end">
                <span className="text-sm font-bold text-slate-900 dark:text-white w-8 text-right">
                  {Math.round(weather.daily.temperature_2m_max[idx])}°
                </span>
                <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-amber-400 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-400 w-8 text-left">
                  {Math.round(weather.daily.temperature_2m_min[idx])}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
