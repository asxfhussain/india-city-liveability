"use client";

import { CITIES, WEIGHTS } from "../data/cities";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";

const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#ec4899"];

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
    fetch("/api/weather").then((r) => r.json()).then(setLiveWeather);
    fetch("/api/aqi").then((r) => r.json()).then(setLiveAqi);
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", padding: "2rem 1rem" }}>
      
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto 2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏙️</div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: -0.5 }}>India City Liveability</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>Real-time comparison across 15 major cities</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* City Selector */}
        <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderRadius: 20, padding: "1.25rem 1.5rem", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, marginBottom: 12 }}>SELECT UP TO 4 CITIES</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CITIES.map((c) => (
              <button key={c.id} onClick={() => toggleCity(c.id)} style={{
                padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.2s",
                background: selected.includes(c.id) ? "linear-gradient(135deg, #6366f1, #22d3ee)" : "rgba(255,255,255,0.08)",
                color: selected.includes(c.id) ? "#fff" : "rgba(255,255,255,0.6)",
                boxShadow: selected.includes(c.id) ? "0 4px 15px rgba(99,102,241,0.4)" : "none",
                transform: selected.includes(c.id) ? "scale(1.05)" : "scale(1)",
              }}>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Weights */}
        <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderRadius: 20, padding: "1.25rem 1.5rem", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, marginBottom: 16 }}>ADJUST YOUR PRIORITIES</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
            {WEIGHTS.map((w) => (
              <div key={w.key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{w.icon} {w.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#22d3ee" }}>{Math.round(weights[w.key] * 100)}%</span>
                </div>
                <input type="range" min="0" max="2" step="0.1" value={weights[w.key]}
                  onChange={(e) => setWeights({ ...weights, [w.key]: parseFloat(e.target.value) })}
                  style={{ width: "100%", accentColor: "#6366f1" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Best match banner */}
        {topCity && (
          <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(34,211,238,0.2))", borderRadius: 16, padding: "14px 20px", border: "1px solid rgba(99,102,241,0.4)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🏆</span>
            <span style={{ color: "#fff", fontSize: 14 }}>
              <strong style={{ color: "#22d3ee" }}>{topCity.name}</strong> is your best match with a score of <strong style={{ color: "#22d3ee" }}>{calcScore(topCity, weights, liveWeather, liveAqi)}/100</strong> based on your priorities
            </span>
          </div>
        )}

        {/* City Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: "1.5rem" }}>
          {selectedCities.map((c, i) => (
            <div key={c.id} style={{
              background: i === 0 ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.15))" : "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)", borderRadius: 20, padding: "1.25rem",
              border: i === 0 ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: i === 0 ? "0 8px 32px rgba(99,102,241,0.2)" : "none",
              transition: "transform 0.2s",
            }}>
              {i === 0 && (
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 600, background: "linear-gradient(135deg, #6366f1, #22d3ee)", color: "#fff", padding: "3px 10px", borderRadius: 50, marginBottom: 10 }}>
                  ✦ Best match
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>{c.name}</h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "2px 0 10px" }}>{c.state}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: COLORS[i] }}>{calcScore(c, weights, liveWeather, liveAqi)}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>/100</span>
                </div>
              </div>

              {WEIGHTS.map((w) => {
                const val = w.key === "air" && liveAqi[c.id] ? liveAqi[c.id].score
                  : w.key === "weather" && liveWeather[c.id] ? liveWeather[c.id].score
                  : c.metrics[w.key];
                const label = w.key === "air" && liveAqi[c.id] ? `${liveAqi[c.id].score} (AQI ${liveAqi[c.id].aqi})`
                  : w.key === "weather" && liveWeather[c.id] ? `${liveWeather[c.id].score} (${liveWeather[c.id].temp}°C)`
                  : c.metrics[w.key];
                return (
                  <div key={w.key} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{w.icon} {w.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{label}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>
                      <div style={{ height: 4, borderRadius: 4, width: `${val}%`, background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}88)`, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                );
              })}
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 10, lineHeight: 1.6 }}>{c.note}</p>
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>Metric Comparison</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.5)" }} />
              {selectedCities.map((c, i) => (
                <Radar key={c.id} name={c.name} dataKey={c.name} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} />
              ))}
              <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 24 }}>
          Data from Open-Meteo, WAQI & curated indices · Updates on load
        </p>
      </div>
    </div>
  );
}