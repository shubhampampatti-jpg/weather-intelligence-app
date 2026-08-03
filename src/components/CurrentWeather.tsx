import React from "react";
import { format } from "date-fns";
import { Droplets, Wind, Thermometer, CloudRain } from "lucide-react";
import { WeatherData, LocationInfo } from "../types";
import { getWeatherIcon, getWeatherDescription } from "../utils";

interface CurrentWeatherProps {
  weather: WeatherData;
  location: LocationInfo;
}

export default function CurrentWeather({ weather, location }: CurrentWeatherProps) {
  const current = weather.current;
  const description = getWeatherDescription(current.weather_code);
  const todayMax = weather.daily.temperature_2m_max[0];
  const todayMin = weather.daily.temperature_2m_min[0];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            {location.name}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {format(new Date(), "EEEE, MMMM d")}
          </p>
          
          <div className="flex items-center gap-4 mt-6">
            <div className="text-6xl font-bold tracking-tighter text-slate-900 dark:text-white">
              {Math.round(current.temperature_2m)}°
            </div>
            <div className="flex flex-col justify-center border-l border-slate-200 dark:border-slate-700 pl-4">
              <span className="text-lg font-medium text-slate-700 dark:text-slate-300 capitalize">
                {description}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Feels like {Math.round(current.apparent_temperature)}°
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              High: {Math.round(todayMax)}°
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1">
              Low: {Math.round(todayMin)}°
            </span>
          </div>
        </div>

        <div className="w-32 h-32 sm:w-48 sm:h-48 shrink-0 relative">
          {getWeatherIcon(current.weather_code)}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-500">
            <Thermometer className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Humidity</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{current.relative_humidity_2m}%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 dark:bg-sky-900/20 rounded-xl text-sky-500">
            <Wind className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Wind</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{current.wind_speed_10m} km/h</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-500">
            <CloudRain className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Precipitation</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{current.precipitation} mm</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl text-cyan-500">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dew Point</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {/* Rough estimate since open-meteo doesn't always provide dew point in standard response without extra params */}
              {Math.round(current.temperature_2m - ((100 - current.relative_humidity_2m) / 5))}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
