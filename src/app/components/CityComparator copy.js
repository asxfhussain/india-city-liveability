"use client";

import { CITIES, WEIGHTS } from "../data/cities";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";

const COLORS = ["#185FA5", "#0F6E56", "#BA7517", "#993556"];

function calcScore(city, weights, liveWeather, liveAqi) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const sum = WEIGHTS.reduce((a, w) => {
    let val = city.metrics[w.key];
    if (w.key === "weather" && liveWeather[city.id]) val = liveWeather[city.id].score;
    if (w.key === "air" && liveAqi[city.id]) val = liveAqi[city.id].score;
    return a + val * weights[w.key];
  }, 0);
  return Math.round(sum / total);
}

export default function CityComparator() {
  const [selected, setSelected] = useState(["ban", "hyd", "pun", "mum"]);
  const [weights, setWeights] = useState({ cost: 1, air: 1, jobs: 1, weather: 1, internet: 1 });

const [liveWeather, setLiveWeather] = useState({});
const [liveAqi, setLiveAqi] = useState({});

useEffect(() => {
  fetch("/api/weather")
    .then((r) => r.json())
    .then((data) => setLiveWeather(data));
  fetch("/api/aqi")
    .then((r) => r.json())
    .then((data) => setLiveAqi(data));
}, []);

  function toggleCity(id) {
    if (selected.includes(id)) {
      if (selected.length > 1) setSelected(selected.filter((x) => x !== id));
    } else {
      if (selected.length < 4) setSelected([...selected, id]);
      else setSelected([...selected.slice(1), id]);
    }
  }

  const selectedCities = CITIES.filter((c) => selected.includes(c.id))
    .sort((a, b) => calcScore(b, weights, liveWeather, liveAqi) - calcScore(a, weights, liveWeather, liveAqi));

  const radarData = WEIGHTS.map((w) => {
    const entry = { metric: w.label };
    selectedCities.forEach((c) => { entry[c.name] = c.metrics[w.key]; });
    return entry;
  });

  const topCity = selectedCities[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-gray-900 mb-1">India City Liveability Comparator</h1>
      <p className="text-gray-500 text-sm mb-6">Compare cost of living, air quality, jobs, weather & internet across 15 cities</p>

      <div className="mb-6">
        <p className="text-xs font-medium text-gray-400 mb-2">SELECT UP TO 4 CITIES</p>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <button key={c.id} onClick={() => toggleCity(c.id)}
              className={`px-3 py-1 rounded-full text-sm border transition-all ${selected.includes(c.id) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-medium text-gray-400 mb-3">ADJUST YOUR PRIORITIES</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {WEIGHTS.map((w) => (
            <div key={w.key}>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{w.icon} {w.label}</span>
                <span className="font-medium text-gray-700">{Math.round(weights[w.key] * 100)}%</span>
              </div>
              <input type="range" min="0" max="2" step="0.1" value={weights[w.key]}
                onChange={(e) => setWeights({ ...weights, [w.key]: parseFloat(e.target.value) })}
                className="w-full" />
            </div>
          ))}
        </div>
      </div>

      {topCity && (
        <div className="mb-6 bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-800">
          <strong>{topCity.name}</strong> is your best match with a score of <strong>{calcScore(topCity, weights, liveWeather, liveAqi)}/100</strong> based on your priorities.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {selectedCities.map((c, i) => (
          <div key={c.id} className={`bg-white rounded-xl p-4 border ${i === 0 ? "border-blue-400 border-2" : "border-gray-200"}`}>
            {i === 0 && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mb-2 inline-block">Best match</span>}
            <h3 className="font-medium text-gray-900">{c.name}</h3>
            <p className="text-xs text-gray-400 mb-2">{c.state}</p>
            <p className="text-3xl font-medium text-blue-600 mb-3">{calcScore(c, weights, liveWeather, liveAqi)}<span className="text-sm text-gray-400">/100</span></p>
            {WEIGHTS.map((w) => (
              <div key={w.key} className="mb-1">
               <div className="flex justify-between text-xs text-gray-500">
                <span>{w.label}</span>
                <span>
                   {w.key === "air" && liveAqi[c.id]
                     ? `${liveAqi[c.id].score} (AQI ${liveAqi[c.id].aqi})`
                    : w.key === "weather" && liveWeather[c.id]
                    ? `${liveWeather[c.id].score} (${liveWeather[c.id].temp}°C)`
                    : c.metrics[w.key]}
                 </span>
              </div>
              <div className="h-1 bg-gray-100 rounded">
                <div className="h-1 bg-blue-400 rounded" style={{ width: `${c.metrics[w.key]}%` }} />
              </div>
            </div>
            ))}
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-4">Metric comparison (radar)</p>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            {selectedCities.map((c, i) => (
              <Radar key={c.id} name={c.name} dataKey={c.name} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}