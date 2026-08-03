import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { LocationInfo, GeocodingResponse } from "../types";

interface SearchBarProps {
  onLocationSelect: (location: LocationInfo) => void;
  isLoadingGeolocation: boolean;
  onRequestGeolocation: () => void;
}

export default function SearchBar({ onLocationSelect, isLoadingGeolocation, onRequestGeolocation }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchPlaces = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        );
        const data: GeocodingResponse = await response.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Failed to search locations:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchPlaces, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow shadow-sm"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <button
            onClick={onRequestGeolocation}
            disabled={isLoadingGeolocation}
            className="p-1.5 text-slate-400 hover:text-blue-500 focus:outline-none rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Use current location"
          >
            {isLoadingGeolocation ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <MapPin className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
          <ul className="max-h-60 overflow-y-auto py-1">
            {results.map((result) => (
              <li
                key={result.id}
                onClick={() => {
                  onLocationSelect(result);
                  setShowDropdown(false);
                  setQuery("");
                }}
                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {result.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {result.admin1 ? `${result.admin1}, ` : ""}{result.country}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
