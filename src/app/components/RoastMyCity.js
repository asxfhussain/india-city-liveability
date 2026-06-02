"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CITIES } from "../data/cities";

export default function RoastMyCity({ onClose }) {
  const [selected, setSelected] = useState(null);
  const [roast, setRoast] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getRoast(cityId) {
    setSelected(cityId);
    setRoast(null);
    setLoading(true);

    const city = CITIES.find(c => c.id === cityId);

    const res = await fetch("/api/roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: city.name, metrics: city.metrics }),
    });
    const data = await res.json();
    setRoast(data.roast);
    setLoading(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>

      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        style={{ background: "linear-gradient(135deg, #0d1b3e, #0a0f2e)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 24, padding: "1.5rem", width: "100%", maxWidth: 560, position: "relative" }}>

        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.5)", borderRadius: 50, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>🔥 Roast My City</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Pick your city and get brutally roasted by AI. Don't take it personally 😈</p>

        {/* City grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {CITIES.map((c) => (
            <motion.button key={c.id} onClick={() => getRoast(c.id)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{
                padding: "7px 16px", borderRadius: 50, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none",
                background: selected === c.id ? "linear-gradient(135deg, #f5c518, #e8a020)" : "rgba(255,255,255,0.07)",
                color: selected === c.id ? "#0a0a1a" : "rgba(255,255,255,0.6)",
                boxShadow: selected === c.id ? "0 4px 20px rgba(245,197,24,0.4)" : "none",
              }}>
              {c.name}
            </motion.button>
          ))}
        </div>

        {/* Roast result */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "2rem" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ fontSize: 32, display: "inline-block", marginBottom: 12 }}>🔥</motion.div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Cooking up a roast...</p>
            </motion.div>
          )}

          {roast && !loading && (
            <motion.div key="roast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "linear-gradient(135deg, rgba(245,197,24,0.1), rgba(232,160,32,0.05))", border: "1px solid rgba(245,197,24,0.25)", borderRadius: 16, padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🔥</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#f5c518" }}>{CITIES.find(c => c.id === selected)?.name} got roasted</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, margin: 0 }}>{roast}</p>
              <motion.button onClick={() => getRoast(selected)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ marginTop: 14, padding: "8px 18px", borderRadius: 50, border: "1px solid rgba(245,197,24,0.3)", background: "transparent", color: "#f5c518", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                🔄 Roast again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 16, textAlign: "center" }}>All roasts are AI-generated and purely for fun 😄</p>
      </motion.div>
    </motion.div>
  );
}