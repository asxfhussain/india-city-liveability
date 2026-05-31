"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CITIES } from "../data/cities";

const AVG_RENT = {
  mum: 35000, ban: 22000, del: 20000, hyd: 16000, pun: 15000,
  che: 14000, kol: 10000, ahm: 11000, jai: 9000, chan: 12000,
  kochi: 13000, ind: 8000, sur: 9000, nag: 8000, vij: 7000,
};

const COST_INDEX = {
  mum:   { food: 1.0,  transport: 1.0,  utilities: 1.0  },
  ban:   { food: 0.88, transport: 0.85, utilities: 0.90 },
  del:   { food: 0.82, transport: 0.78, utilities: 0.85 },
  hyd:   { food: 0.75, transport: 0.72, utilities: 0.80 },
  pun:   { food: 0.78, transport: 0.74, utilities: 0.82 },
  che:   { food: 0.76, transport: 0.70, utilities: 0.78 },
  kol:   { food: 0.65, transport: 0.62, utilities: 0.70 },
  ahm:   { food: 0.68, transport: 0.64, utilities: 0.72 },
  jai:   { food: 0.60, transport: 0.56, utilities: 0.65 },
  chan:  { food: 0.70, transport: 0.66, utilities: 0.74 },
  kochi: { food: 0.72, transport: 0.68, utilities: 0.76 },
  ind:   { food: 0.58, transport: 0.52, utilities: 0.62 },
  sur:   { food: 0.62, transport: 0.56, utilities: 0.66 },
  nag:   { food: 0.58, transport: 0.52, utilities: 0.62 },
  vij:   { food: 0.52, transport: 0.48, utilities: 0.58 },
};

function calcEquivalent(salary, fromCity, toCity) {
  const fromExpenses = AVG_RENT[fromCity] + 8000 * COST_INDEX[fromCity].food + 3000 * COST_INDEX[fromCity].transport + 2500 * COST_INDEX[fromCity].utilities;
  const toExpenses = AVG_RENT[toCity] + 8000 * COST_INDEX[toCity].food + 3000 * COST_INDEX[toCity].transport + 2500 * COST_INDEX[toCity].utilities;
  return Math.round(toExpenses + (salary - fromExpenses));
}

function formatINR(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

function breakdown(salary, cityId) {
  const idx = COST_INDEX[cityId];
  const rent = AVG_RENT[cityId];
  const food = Math.round(8000 * idx.food);
  const transport = Math.round(3000 * idx.transport);
  const utilities = Math.round(2500 * idx.utilities);
  const savings = salary - rent - food - transport - utilities;
  return { rent, food, transport, utilities, savings };
}
export default function CostCalculator({ onClose }) {
  const [salary, setSalary] = useState(50000);
  const [fromCity, setFromCity] = useState("mum");
  const [toCity, setToCity] = useState("hyd");

  const equivalent = calcEquivalent(salary, fromCity, toCity);
  const fromBreakdown = breakdown(salary, fromCity);
  const toBreakdown = breakdown(equivalent, toCity);
  const fromExpenses = fromBreakdown.rent + fromBreakdown.food + fromBreakdown.transport + fromBreakdown.utilities;
  const toExpenses = toBreakdown.rent + toBreakdown.food + toBreakdown.transport + toBreakdown.utilities;
  const savingsDiff = fromExpenses - toExpenses;
  const fromCityData = CITIES.find((c) => c.id === fromCity);
  const toCityData = CITIES.find((c) => c.id === toCity);
  const selectStyle = {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(245,197,24,0.2)",
    borderRadius: 10, padding: "8px 12px", color: "#fff", fontSize: 13, cursor: "pointer", width: "100%",
  };

  const BREAKDOWN_ITEMS = [
    { key: "rent", label: "🏠 Rent", color: "#f5c518" },
    { key: "food", label: "🍱 Food", color: "#22d3ee" },
    { key: "transport", label: "🚇 Transport", color: "#a78bfa" },
    { key: "utilities", label: "⚡ Utilities", color: "#34d399" },
    { key: "savings", label: "💰 Savings", color: "#fb923c" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>

      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        style={{ background: "linear-gradient(135deg, #0d1b3e, #0a0f2e)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 24, padding: "2rem", width: "100%", maxWidth: 600, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>

        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.5)", borderRadius: 50, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4 }}>💸 Cost of Living Calculator</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>What salary do you need in your target city to maintain your lifestyle?</p>

        {/* Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: 1 }}>FROM CITY</label>
            <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} style={selectStyle}>
              {CITIES.map((c) => <option key={c.id} value={c.id} style={{ background: "#0d1b3e" }}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: 1 }}>TO CITY</label>
            <select value={toCity} onChange={(e) => setToCity(e.target.value)} style={selectStyle}>
              {CITIES.map((c) => <option key={c.id} value={c.id} style={{ background: "#0d1b3e" }}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: 1 }}>YOUR MONTHLY SALARY IN {fromCityData?.name.toUpperCase()}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
             <input type="range" min="10000" max="500000" step="5000" value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#f5c518" }} />
             <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))}
               style={{ width: 110, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(245,197,24,0.3)", borderRadius: 8, padding: "6px 10px", color: "#f5c518", fontSize: 14, fontWeight: 700, textAlign: "right" }} />
           </div>
        </div>

        {/* Result banner */}
       <motion.div key={equivalent} initial={{ scale: 0.97 }} animate={{ scale: 1 }}
            style={{ background: "linear-gradient(135deg, rgba(245,197,24,0.2), rgba(232,160,32,0.1))", border: "1px solid rgba(245,197,24,0.35)", borderRadius: 16, padding: "1.25rem", marginBottom: 20, textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "0 0 6px" }}>
                With ₹{salary.toLocaleString()} salary, moving from {fromCityData?.name} → {toCityData?.name}
            </p>
            <p style={{ color: "#f5c518", fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>
                You'd save {formatINR(Math.abs(savingsDiff))} {savingsDiff >= 0 ? "more" : "less"} every month
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 4px" }}>
                {fromCityData?.name} expenses: {formatINR(fromExpenses)} → {toCityData?.name} expenses: {formatINR(toExpenses)}
            </p>
            <p style={{ color: savingsDiff >= 0 ? "#34d399" : "#f87171", fontSize: 13, margin: 0 }}>
                {savingsDiff >= 0 ? "✅ Your money goes further in " : "⚠️ Higher cost of living in "}{toCityData?.name}
            </p>
        </motion.div>

        {/* Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[{ city: fromCityData, bd: fromBreakdown, salary }, { city: toCityData, bd: breakdown(salary, toCity), salary }].map(({ city, bd, salary: s }, ci) => (
            <div key={ci} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "1rem", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>{city?.name} — {formatINR(s)}/mo</p>
              {BREAKDOWN_ITEMS.map(({ key, label, color }) => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color }}>{formatINR(bd[key])}</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (bd[key] / s) * 100)}%` }} transition={{ duration: 0.6 }}
                      style={{ height: 4, borderRadius: 4, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </motion.div>
    </motion.div>
  );
}