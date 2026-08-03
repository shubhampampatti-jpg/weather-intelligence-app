import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Sparkles, RefreshCw } from "lucide-react";
import { WeatherData, LocationInfo } from "../types";

interface AIInsightsProps {
  weather: WeatherData;
  location: LocationInfo;
}

export default function AIInsights({ weather, location }: AIInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weatherData: {
            current: weather.current,
            daily: {
              today_max: weather.daily.temperature_2m_max[0],
              today_min: weather.daily.temperature_2m_min[0],
              condition: weather.daily.weather_code[0],
            }
          },
          locationName: location.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setInsights(data.insights);
    } catch (err: any) {
      setError(err.message || "Failed to load AI insights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.name]); // Re-fetch when location changes

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-900/40 rounded-3xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-24 h-24 text-indigo-500" />
      </div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-lg font-bold">Weather Intelligence</h3>
        </div>
        <button
          onClick={fetchInsights}
          disabled={isLoading}
          className="p-2 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors disabled:opacity-50"
          title="Refresh insights"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="relative z-10 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {isLoading && !insights ? (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-4 bg-indigo-200/50 dark:bg-indigo-800/50 rounded w-3/4"></div>
            <div className="h-4 bg-indigo-200/50 dark:bg-indigo-800/50 rounded w-full"></div>
            <div className="h-4 bg-indigo-200/50 dark:bg-indigo-800/50 rounded w-5/6"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 dark:text-red-400">{error}</p>
        ) : insights ? (
          <div className="prose prose-sm prose-indigo dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2">
            <Markdown>{insights}</Markdown>
          </div>
        ) : null}
      </div>
    </div>
  );
}
