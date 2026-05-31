"use client";
import { CITIES, WEIGHTS } from "../data/cities";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CityQuiz from "./CityQuiz";
import { useRouter } from "next/navigation";
import CostCalculator from "./CostCalculator";
import CityAdvisor from "./CityAdvisor";

const COLORS = ["#f5c518", "#e8a020", "#ffd700", "#c9a84c"];

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

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const step = 16;
    const increment = (value / duration) * step;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.round(start));
    }, step);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

export default function CityComparator() {
  const [selected, setSelected] = useState(["ban", "hyd", "pun", "mum"]);
  const [weights, setWeights] = useState({ cost: 1, air: 1, jobs: 1, weather: 1, internet: 1 });
  const [liveWeather, setLiveWeather] = useState({});
  const [liveAqi, setLiveAqi] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const router = useRouter();
  const [showCalc, setShowCalc] = useState(false);
  const [showAdvisor, setShowAdvisor] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/weather").then((r) => r.json()),
      fetch("/api/aqi").then((r) => r.json()),
    ]).then(([weather, aqi]) => {
      setLiveWeather(weather);
      setLiveAqi(aqi);
      setLoaded(true);
    });
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a1a, #0d1b3e, #0a0f2e)", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>

      {/* Floating orbs */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "10%", left: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,197,24,0.12), transparent 70%)" }} />
        <motion.div animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "50%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,160,32,0.08), transparent 70%)" }} />
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }}
              style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #f5c518, #e8a020)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 8px 24px rgba(245,197,24,0.35)" }}>
              🏙️
            </motion.div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: -1 }}>India City Liveability</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>Real-time · 15 cities · Live AQI & Weather</p>
            </div>
          </div>
        </motion.div>

        <motion.button onClick={() => setShowQuiz(true)}
            whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 50, border: "none", background: "linear-gradient(135deg, #f5c518, #e8a020)", color: "#0a0a1a", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: "1.25rem", boxShadow: "0 4px 20px rgba(245,197,24,0.35)" }}>
            ✨ Find my ideal city
        </motion.button>

        <motion.button onClick={() => setShowCalc(true)}
            whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 50, border: "1px solid rgba(245,197,24,0.3)", background: "transparent", color: "#f5c518", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: "1.25rem" }}>
            💸 Cost calculator
        </motion.button>

        <motion.button onClick={() => setShowAdvisor(true)}
          whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 50, border: "1px solid rgba(245,197,24,0.3)", background: "transparent", color: "#f5c518", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: "1.25rem" }}>
          🧠 AI city advisor
        </motion.button>

        {/* City Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", borderRadius: 20, padding: "1.25rem 1.5rem", border: "1px solid rgba(245,197,24,0.15)", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>SELECT UP TO 4 CITIES</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CITIES.map((c, i) => (
              <motion.button key={c.id} onClick={() => toggleCity(c.id)}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
                style={{
                  padding: "7px 18px", borderRadius: 50, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none",
                  background: selected.includes(c.id) ? "linear-gradient(135deg, #f5c518, #e8a020)" : "rgba(255,255,255,0.07)",
                  color: selected.includes(c.id) ? "#0a0a1a" : "rgba(255,255,255,0.55)",
                  boxShadow: selected.includes(c.id) ? "0 4px 20px rgba(245,197,24,0.4)" : "none",
                  fontWeight: selected.includes(c.id) ? 700 : 500,
                }}>
                {c.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Weights */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", borderRadius: 20, padding: "1.25rem 1.5rem", border: "1px solid rgba(245,197,24,0.15)", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 16 }}>ADJUST YOUR PRIORITIES</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
            {WEIGHTS.map((w) => (
              <div key={w.key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{w.icon} {w.label}</span>
                  <motion.span key={weights[w.key]} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                    style={{ fontSize: 11, fontWeight: 600, color: "#f5c518" }}>
                   {weights[w.key] === 0 ? "Off" : weights[w.key] <= 0.7 ? "Low" : weights[w.key] <= 1.3 ? "Medium" : "High"}
                  </motion.span>
                </div>
                <input type="range" min="0" max="2" step="0.1" value={weights[w.key]}
                  onChange={(e) => setWeights({ ...weights, [w.key]: parseFloat(e.target.value) })}
                  style={{ width: "100%", accentColor: "#f5c518", cursor: "pointer" }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Best match banner */}
        <AnimatePresence mode="wait">
          {topCity && (
            <motion.div key={topCity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}
              style={{ background: "linear-gradient(135deg, rgba(245,197,24,0.15), rgba(232,160,32,0.08))", borderRadius: 16, padding: "14px 20px", border: "1px solid rgba(245,197,24,0.3)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 10 }}>
              <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }} style={{ fontSize: 22 }}>🏆</motion.span>
              <span style={{ color: "#fff", fontSize: 14 }}>
                <strong style={{ color: "#f5c518" }}>{topCity.name}</strong> is your best match with a score of{" "}
                <strong style={{ color: "#f5c518" }}>{calcScore(topCity, weights, liveWeather, liveAqi)}/100</strong> based on your priorities
              </span>
              {!loaded && <span style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>⟳ Loading live data...</span>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* City Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16, marginBottom: "1.5rem" }}>
          <AnimatePresence>
            {selectedCities.map((c, i) => (
             <motion.div key={c.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                onClick={() => router.push(`/city/${c.id}`)}
                style={{
                  background: i === 0 ? "linear-gradient(135deg, rgba(245,197,24,0.15), rgba(232,160,32,0.08))" : "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)", borderRadius: 20, padding: "1.25rem",
                  border: i === 0 ? "1px solid rgba(245,197,24,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  cursor: "pointer",
                }}>
                {i === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: "inline-block", fontSize: 11, fontWeight: 700, background: "linear-gradient(135deg, #f5c518, #e8a020)", color: "#0a0a1a", padding: "3px 12px", borderRadius: 50, marginBottom: 10, letterSpacing: 0.5 }}>
                    ✦ BEST MATCH
                    
                  </motion.div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: 0 }}>{c.name}</h3>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "3px 0 0" }}>{c.state}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 32, fontWeight: 800, color: COLORS[i] }}>
                      <AnimatedNumber value={calcScore(c, weights, liveWeather, liveAqi)} />
                    </span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>/100</span>
                  </div>
                </div>

                {WEIGHTS.map((w) => {
                  const val = w.key === "air" && liveAqi[c.id] ? liveAqi[c.id].score
                    : w.key === "weather" && liveWeather[c.id] ? liveWeather[c.id].score
                    : c.metrics[w.key];
                  function scoreLabel(key, val) {
                    if (key === "cost") return val >= 75 ? "Very Affordable" : val >= 60 ? "Affordable" : val >= 45 ? "Moderate" : "Expensive";
                    if (key === "air") return val >= 80 ? "Clean" : val >= 60 ? "Moderate" : val >= 40 ? "Polluted" : "Very Polluted";
                    if (key === "jobs") return val >= 85 ? "Excellent" : val >= 70 ? "Good" : val >= 55 ? "Moderate" : "Limited";
                    if (key === "weather") return val >= 80 ? "Pleasant" : val >= 60 ? "Moderate" : val >= 40 ? "Harsh" : "Very Harsh";
                    if (key === "internet") return val >= 80 ? "Fast" : val >= 65 ? "Good" : val >= 50 ? "Average" : "Slow";
                  }

                  const label = w.key === "air" && liveAqi[c.id]
                    ? `${scoreLabel("air", liveAqi[c.id].score)} · AQI ${liveAqi[c.id].aqi}`
                    : w.key === "weather" && liveWeather[c.id]
                    ? `${scoreLabel("weather", liveWeather[c.id].score)} · ${liveWeather[c.id].temp}°C`
                    : scoreLabel(w.key, c.metrics[w.key]);
                  return (
                    <div key={w.key} style={{ marginBottom: 9 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{w.icon} {w.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{label}</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 5 }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                          style={{ height: 5, borderRadius: 5, background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}88)` }} />
                      </div>
                    </div>
                  );
                })}
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 12, lineHeight: 1.7 }}>{c.note}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(245,197,24,0.15)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>Metric Comparison</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.4)" }} />
              {selectedCities.map((c, i) => (
                <Radar key={c.id} name={c.name} dataKey={c.name} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
              ))}
              <Legend wrapperStyle={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 24, paddingBottom: 16 }}>
          Live data from Open-Meteo & WAQI · Scores update on each load
        </p>
        <AnimatePresence>
          {showQuiz && <CityQuiz onClose={() => setShowQuiz(false)} />}
          {showCalc && <CostCalculator onClose={() => setShowCalc(false)} />}    
          {showAdvisor && <CityAdvisor onClose={() => setShowAdvisor(false)} />}  
        </AnimatePresence>
      </div>
    </div>
  );
}