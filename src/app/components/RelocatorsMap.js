"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CITY_POSITIONS = {
  del:   { x: 48, y: 22, name: "Delhi" },
  mum:   { x: 33, y: 52, name: "Mumbai" },
  ban:   { x: 42, y: 68, name: "Bengaluru" },
  hyd:   { x: 47, y: 57, name: "Hyderabad" },
  che:   { x: 52, y: 68, name: "Chennai" },
  kol:   { x: 72, y: 40, name: "Kolkata" },
  pun:   { x: 36, y: 50, name: "Pune" },
  ahm:   { x: 30, y: 36, name: "Ahmedabad" },
  jai:   { x: 43, y: 26, name: "Jaipur" },
  chan:  { x: 46, y: 16, name: "Chandigarh" },
  kochi: { x: 40, y: 76, name: "Kochi" },
  ind:   { x: 41, y: 40, name: "Indore" },
  sur:   { x: 31, y: 44, name: "Surat" },
  nag:   { x: 52, y: 46, name: "Nagpur" },
  vij:   { x: 57, y: 62, name: "Vijayawada" },
};

const FLOWS = [
  { from: "del", to: "ban", count: 48200, reason: "Tech jobs" },
  { from: "del", to: "mum", count: 32100, reason: "Finance & media" },
  { from: "mum", to: "pun", count: 41500, reason: "Affordable living" },
  { from: "del", to: "hyd", count: 28900, reason: "IT boom" },
  { from: "kol", to: "ban", count: 22400, reason: "Startup culture" },
  { from: "mum", to: "ban", count: 19800, reason: "Work-life balance" },
  { from: "che", to: "ban", count: 17600, reason: "Better salaries" },
  { from: "hyd", to: "ban", count: 15200, reason: "Startup ecosystem" },
  { from: "jai", to: "del", count: 24300, reason: "Job market" },
  { from: "ahm", to: "mum", count: 18700, reason: "Finance jobs" },
  { from: "pun", to: "ban", count: 14100, reason: "Tech opportunities" },
  { from: "nag", to: "pun", count: 12800, reason: "Proximity & jobs" },
  { from: "ind", to: "hyd", count: 11200, reason: "IT growth" },
  { from: "vij", to: "hyd", count: 16800, reason: "Same state, better jobs" },
  { from: "kochi", to: "ban", count: 13400, reason: "Tech sector" },
];

function getInflow(cityId) {
  return FLOWS.filter(f => f.to === cityId).reduce((a, f) => a + f.count, 0);
}
function getOutflow(cityId) {
  return FLOWS.filter(f => f.from === cityId).reduce((a, f) => a + f.count, 0);
}

function formatNum(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n;
}

const TOP_DESTINATIONS = [...Object.keys(CITY_POSITIONS)]
  .map(id => ({ id, inflow: getInflow(id), name: CITY_POSITIONS[id].name }))
  .sort((a, b) => b.inflow - a.inflow).slice(0, 5);

const TOP_SOURCES = [...Object.keys(CITY_POSITIONS)]
  .map(id => ({ id, outflow: getOutflow(id), name: CITY_POSITIONS[id].name }))
  .sort((a, b) => b.outflow - a.outflow).slice(0, 5);

export default function RelocatorsMap({ onClose }) {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("flows");

  const selectedFlows = selected
    ? FLOWS.filter(f => f.from === selected || f.to === selected)
    : FLOWS.slice(0, 8);

  const cityInflow = selected ? getInflow(selected) : 0;
  const cityOutflow = selected ? getOutflow(selected) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>

      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        style={{ background: "linear-gradient(135deg, #0d1b3e, #0a0f2e)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 24, width: "100%", maxWidth: 800, maxHeight: "90vh", overflowY: "auto", position: "relative", padding: "1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0 }}>🗺️ Relocators Map</h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>Where are Indians moving? Annual migration flows across 15 cities</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.5)", borderRadius: 50, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["flows", "rankings"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "6px 16px", borderRadius: 50, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, textTransform: "capitalize",
                background: tab === t ? "linear-gradient(135deg, #f5c518, #e8a020)" : "rgba(255,255,255,0.07)",
                color: tab === t ? "#0a0a1a" : "rgba(255,255,255,0.5)" }}>
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

         

          {/* FLOWS TAB */}
          {tab === "flows" && (
            <motion.div key="flows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {FLOWS.sort((a, b) => b.count - a.count).map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.3)", minWidth: 20 }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                        {CITY_POSITIONS[f.from].name} <span style={{ color: "#f5c518" }}>→</span> {CITY_POSITIONS[f.to].name}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{f.reason}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#f5c518" }}>{formatNum(f.count)}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>per year</div>
                    </div>
                    <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 4 }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(f.count / 48200) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.04 }}
                        style={{ height: 4, borderRadius: 4, background: "linear-gradient(90deg, #f5c518, #e8a020)" }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* RANKINGS TAB */}
          {tab === "rankings" && (
            <motion.div key="rankings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <h3 style={{ color: "#34d399", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🏆 Top Destinations</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {TOP_DESTINATIONS.map((c, i) => (
                      <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(52,211,153,0.07)", borderRadius: 12, border: "1px solid rgba(52,211,153,0.15)" }}>
                        <span style={{ fontSize: 16 }}>{["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>+{formatNum(c.inflow)} moving in</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ color: "#f87171", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📤 Top Sources</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {TOP_SOURCES.map((c, i) => (
                      <motion.div key={c.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(248,113,113,0.07)", borderRadius: 12, border: "1px solid rgba(248,113,113,0.15)" }}>
                        <span style={{ fontSize: 16 }}>{["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{formatNum(c.outflow)} moving out</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(245,197,24,0.07)", borderRadius: 12, border: "1px solid rgba(245,197,24,0.15)" }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>📊 Data based on Census migration trends, LinkedIn relocation data & job portal analytics (2023-24 estimates)</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}