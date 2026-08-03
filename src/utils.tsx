import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, SunDim } from "lucide-react";

export function getWeatherIcon(code: number) {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  switch (true) {
    case code === 0:
      return <Sun className="w-full h-full text-amber-500" />;
    case code === 1 || code === 2:
      return <SunDim className="w-full h-full text-amber-400" />;
    case code === 3:
      return <Cloud className="w-full h-full text-slate-400" />;
    case code >= 45 && code <= 48:
      return <CloudFog className="w-full h-full text-slate-400" />;
    case code >= 51 && code <= 57:
      return <CloudDrizzle className="w-full h-full text-blue-400" />;
    case code >= 61 && code <= 67:
      return <CloudRain className="w-full h-full text-blue-500" />;
    case code >= 71 && code <= 77:
      return <CloudSnow className="w-full h-full text-slate-300" />;
    case code >= 80 && code <= 82:
      return <CloudRain className="w-full h-full text-blue-600" />;
    case code >= 85 && code <= 86:
      return <CloudSnow className="w-full h-full text-slate-300" />;
    case code >= 95 && code <= 99:
      return <CloudLightning className="w-full h-full text-purple-500" />;
    default:
      return <Cloud className="w-full h-full text-slate-400" />;
  }
}

export function getWeatherDescription(code: number): string {
  switch (true) {
    case code === 0: return "Clear sky";
    case code === 1: return "Mainly clear";
    case code === 2: return "Partly cloudy";
    case code === 3: return "Overcast";
    case code === 45 || code === 48: return "Fog";
    case code >= 51 && code <= 55: return "Drizzle";
    case code === 56 || code === 57: return "Freezing Drizzle";
    case code >= 61 && code <= 65: return "Rain";
    case code === 66 || code === 67: return "Freezing Rain";
    case code >= 71 && code <= 75: return "Snow fall";
    case code === 77: return "Snow grains";
    case code >= 80 && code <= 82: return "Rain showers";
    case code >= 85 && code <= 86: return "Snow showers";
    case code === 95: return "Thunderstorm";
    case code >= 96 && code <= 99: return "Thunderstorm with hail";
    default: return "Unknown";
  }
}
