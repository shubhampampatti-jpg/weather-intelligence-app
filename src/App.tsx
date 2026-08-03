import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import AIInsights from "./components/AIInsights";
import { LocationInfo, WeatherData } from "./types";
import { Loader2, CloudRain } from "lucide-react";

const DEFAULT_LOCATION: LocationInfo = {
  id: 5128581,
  name: "New York",
  latitude: 40.71427,
  longitude: -74.00597,
  country: "United States",
  admin1: "New York",
};

export default function App() {
  const [location, setLocation] = useState<LocationInfo>(DEFAULT_LOCATION);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      );
      if (!response.ok) throw new Error("Failed to fetch weather data");
      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(location.latitude, location.longitude);
  }, [location, fetchWeather]);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Open-meteo doesn't have a strict reverse geocoding API, 
          // let's just use the coordinates and a generic name
          setLocation({
            id: Date.now(),
            name: "Your Location",
            latitude,
            longitude,
            country: "",
          });
        } catch (e) {
          setLocation({
            id: Date.now(),
            name: "Your Location",
            latitude,
            longitude,
            country: "",
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        alert("Unable to retrieve your location");
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <CloudRain className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Weather <span className="text-blue-600 dark:text-blue-400">Intelligence</span>
            </h1>
          </div>
          <div className="w-full sm:w-auto flex-1 max-w-md">
            <SearchBar 
              onLocationSelect={setLocation} 
              isLoadingGeolocation={isLocating}
              onRequestGeolocation={handleGeolocation}
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && !weather ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
            <p className="font-medium text-slate-500">Forecasting...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-6 rounded-2xl max-w-md text-center">
              <p className="font-bold mb-2">Could not load weather</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : weather ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-8">
              <CurrentWeather weather={weather} location={location} />
              <AIInsights weather={weather} location={location} />
            </div>
            <div className="lg:col-span-4">
              <Forecast weather={weather} />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

