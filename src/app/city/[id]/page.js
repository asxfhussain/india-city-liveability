"use client";

import { useParams, useRouter } from "next/navigation";
import { CITIES, WEIGHTS } from "../../data/cities";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

function scoreLabel(key, val) {
  if (key === "cost") return val >= 75 ? "Very Affordable" : val >= 60 ? "Affordable" : val >= 45 ? "Moderate" : "Expensive";
  if (key === "air") return val >= 80 ? "Clean" : val >= 60 ? "Moderate" : val >= 40 ? "Polluted" : "Very Polluted";
  if (key === "jobs") return val >= 85 ? "Excellent" : val >= 70 ? "Good" : val >= 55 ? "Moderate" : "Limited";
  if (key === "weather") return val >= 80 ? "Pleasant" : val >= 60 ? "Moderate" : val >= 40 ? "Harsh" : "Very Harsh";
  if (key === "internet") return val >= 80 ? "Fast" : val >= 65 ? "Good" : val >= 50 ? "Average" : "Slow";
}

const CITY_DETAILS = {
  ban: { avgRent: "₹18,000 – ₹35,000", topCompanies: ["Infosys", "Wipro", "Flipkart", "Google", "Amazon"], neighbourhoods: ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout"], funFact: "Bengaluru has the highest number of tech startups in India." },
  hyd: { avgRent: "₹12,000 – ₹25,000", topCompanies: ["Microsoft", "Google", "Amazon", "TCS", "Cyberabad firms"], neighbourhoods: ["Gachibowli", "Banjara Hills", "Madhapur", "Jubilee Hills"], funFact: "Hyderabad is the only city with both a Rajiv Gandhi International Airport and a dedicated IT corridor." },
  mum: { avgRent: "₹25,000 – ₹60,000", topCompanies: ["Reliance", "HDFC", "Tata", "Bollywood Studios", "ICICI"], neighbourhoods: ["Bandra", "Andheri", "Powai", "Lower Parel"], funFact: "Mumbai's local train network carries 7.5 million passengers daily — more than many countries." },
  del: { avgRent: "₹15,000 – ₹35,000", topCompanies: ["Govt of India", "HCL", "Hero MotoCorp", "Zomato", "Paytm"], neighbourhoods: ["Connaught Place", "Hauz Khas", "Noida Sec 62", "Gurgaon"], funFact: "Delhi has more trees than any other Indian city — over 7 million." },
  pun: { avgRent: "₹10,000 – ₹22,000", topCompanies: ["Infosys", "Wipro", "Bajaj Auto", "Forbes Marshall", "KPIT"], neighbourhoods: ["Koregaon Park", "Baner", "Hinjewadi", "Viman Nagar"], funFact: "Pune has the highest number of engineering colleges in India." },
  che: { avgRent: "₹12,000 – ₹28,000", topCompanies: ["Ford", "Hyundai", "TCS", "Cognizant", "Zoho"], neighbourhoods: ["Anna Nagar", "Velachery", "OMR", "Adyar"], funFact: "Chennai is India's automobile capital — it produces 35% of the country's vehicles." },
  kol: { avgRent: "₹8,000 – ₹18,000", topCompanies: ["ITC", "Coal India", "Wipro", "TCS", "Bandhan Bank"], neighbourhoods: ["Salt Lake", "New Town", "Park Street", "Ballygunge"], funFact: "Kolkata has India's only underground metro that runs beneath a river." },
  ahm: { avgRent: "₹8,000 – ₹20,000", topCompanies: ["Adani", "Torrent", "Zydus", "Amul", "ISRO SAC"], neighbourhoods: ["SG Highway", "Prahlad Nagar", "Navrangpura", "Satellite"], funFact: "Ahmedabad was India's first UNESCO World Heritage City." },
  jai: { avgRent: "₹7,000 – ₹16,000", topCompanies: ["Govt sector", "Rajasthan IT", "Gem & jewellery firms", "Tourism"], neighbourhoods: ["Malviya Nagar", "Vaishali Nagar", "C-Scheme", "Mansarovar"], funFact: "Jaipur's entire old city was painted pink in 1876 to welcome the Prince of Wales." },
  chan: { avgRent: "₹9,000 – ₹20,000", topCompanies: ["Infosys", "Quark", "DLF", "IT Park firms"], neighbourhoods: ["Sector 17", "Sector 35", "Mohali", "Panchkula"], funFact: "Chandigarh was designed by Swiss-French architect Le Corbusier — India's only planned city." },
  kochi: { avgRent: "₹9,000 – ₹20,000", topCompanies: ["Infopark firms", "UST Global", "IBS Software", "BPCL"], neighbourhoods: ["Kakkanad", "Marine Drive", "Edapally", "Fort Kochi"], funFact: "Kochi has India's first solar-powered international airport." },
  ind: { avgRent: "₹6,000 – ₹14,000", topCompanies: ["Infosys BPO", "NPCI", "Brilliant", "IT Park firms"], neighbourhoods: ["Vijay Nagar", "Scheme 54", "AB Road", "Super Corridor"], funFact: "Indore has won India's Cleanest City award 7 years in a row." },
  sur: { avgRent: "₹7,000 – ₹15,000", topCompanies: ["Diamond industry", "Textile mills", "Reliance", "ONGC"], neighbourhoods: ["Adajan", "Vesu", "Athwa", "Piplod"], funFact: "Surat processes 90% of the world's diamonds." },
  nag: { avgRent: "₹6,000 – ₹14,000", topCompanies: ["Govt sector", "MIHAN firms", "Ballarpur Industries"], neighbourhoods: ["Dharampeth", "Sitabuldi", "Hingna", "MIHAN"], funFact: "Nagpur is the geographic centre of India — zero mile marker is here." },
  vij: { avgRent: "₹5,000 – ₹12,000", topCompanies: ["Govt AP", "IT SEZ firms", "Amara Raja", "Aurobindo"], neighbourhoods: ["Benz Circle", "MG Road", "Governorpet", "Kanuru"], funFact: "Vijayawada sits on the Krishna river delta and is one of India's fastest growing cities." },
};

export default function CityPage() {
  const { id } = useParams();
  const router = useRouter();
  const city = CITIES.find((c) => c.id === id);
  const details = CITY_DETAILS[id];
  const [liveWeather, setLiveWeather] = useState(null);
  const [liveAqi, setLiveAqi] = useState(null);

  useEffect(() => {
    fetch("/api/weather").then((r) => r.json()).then((d) => setLiveWeather(d[id]));
    fetch("/api/aqi").then((r) => r.json()).then((d) => setLiveAqi(d[id]));
  }, [id]);

  if (!city) return <div style={{ color: "#fff", padding: 40 }}>City not found</div>;

  const radarData = WEIGHTS.map((w) => ({
    metric: w.label,
    score: w.key === "weather" && liveWeather ? liveWeather.score
      : w.key === "air" && liveAqi ? liveAqi.score
      : city.metrics[w.key],
  }));

  const overallScore = Math.round(
    WEIGHTS.reduce((a, w) => {
      const val = w.key === "weather" && liveWeather ? liveWeather.score
        : w.key === "air" && liveAqi ? liveAqi.score
        : city.metrics[w.key];
      return a + val;
    }, 0) / WEIGHTS.length
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a1a, #0d1b3e, #0a0f2e)", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Back button */}
        <motion.button onClick={() => router.push("/")} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          whileHover={{ x: -4 }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to comparator
        </motion.button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "linear-gradient(135deg, rgba(245,197,24,0.15), rgba(232,160,32,0.05))", border: "1px solid rgba(245,197,24,0.25)", borderRadius: 24, padding: "2rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", margin: 0 }}>{city.name}</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", margin: "4px 0 12px", fontSize: 14 }}>{city.state}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, maxWidth: 500, lineHeight: 1.7 }}>{city.note}</p>
            </div>
            <div style={{ textAlign: "center", background: "rgba(245,197,24,0.1)", borderRadius: 20, padding: "16px 28px", border: "1px solid rgba(245,197,24,0.2)" }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: "#f5c518" }}>{overallScore}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Overall score</div>
            </div>
          </div>

          {/* Live data pills */}
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {liveWeather && (
              <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: 50, padding: "5px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                ☀️ {liveWeather.temp}°C right now
              </span>
            )}
            {liveAqi && (
              <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: 50, padding: "5px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                🌬️ AQI {liveAqi.aqi} · {scoreLabel("air", liveAqi.score)}
              </span>
            )}
            <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: 50, padding: "5px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              🏠 Avg rent {details.avgRent}
            </span>
          </div>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>

          {/* Metrics */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Liveability Metrics</h3>
            {WEIGHTS.map((w) => {
              const val = w.key === "weather" && liveWeather ? liveWeather.score
                : w.key === "air" && liveAqi ? liveAqi.score
                : city.metrics[w.key];
              return (
                <div key={w.key} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{w.icon} {w.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#f5c518" }}>{scoreLabel(w.key, val)}</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 6 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{ height: 6, borderRadius: 6, background: "linear-gradient(90deg, #f5c518, #e8a020)" }} />
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Radar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Radar View</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} />
                <Radar dataKey="score" stroke="#f5c518" fill="#f5c518" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>

          {/* Top companies */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>💼 Top Employers</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {details.topCompanies.map((co, i) => (
                <motion.div key={co} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #f5c518, #e8a020)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#0a0a1a" }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{co}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Neighbourhoods */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🏘️ Popular Neighbourhoods</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {details.neighbourhoods.map((n) => (
                <span key={n} style={{ padding: "6px 14px", borderRadius: 50, background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.2)", color: "#f5c518", fontSize: 12, fontWeight: 500 }}>
                  {n}
                </span>
              ))}
            </div>

            {/* Fun fact */}
            <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(245,197,24,0.07)", borderRadius: 12, border: "1px solid rgba(245,197,24,0.15)" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1 }}>DID YOU KNOW</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>{details.funFact}</p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}