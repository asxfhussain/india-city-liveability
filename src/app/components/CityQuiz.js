"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CITIES, WEIGHTS } from "../data/cities";

const QUESTIONS = [
  {
    id: "budget",
    question: "What's your monthly budget for rent + living?",
    options: [
      { label: "Under ₹15,000", value: "low", icon: "🪙" },
      { label: "₹15,000 – ₹30,000", value: "mid", icon: "💵" },
      { label: "₹30,000 – ₹60,000", value: "high", icon: "💳" },
      { label: "₹60,000+", value: "very_high", icon: "💎" },
    ],
  },
  {
    id: "job",
    question: "What field do you work in?",
    options: [
      { label: "Tech / IT", value: "tech", icon: "💻" },
      { label: "Finance / Business", value: "finance", icon: "📈" },
      { label: "Creative / Media", value: "creative", icon: "🎨" },
      { label: "Student / Flexible", value: "student", icon: "🎓" },
    ],
  },
  {
    id: "weather",
    question: "What weather do you prefer?",
    options: [
      { label: "Cool & pleasant", value: "cool", icon: "🌤️" },
      { label: "I don't mind heat", value: "hot", icon: "☀️" },
      { label: "Coastal / humid", value: "coastal", icon: "🌊" },
      { label: "No preference", value: "any", icon: "🌍" },
    ],
  },
  {
    id: "air",
    question: "How much does air quality matter to you?",
    options: [
      { label: "Very important", value: "high", icon: "🌿" },
      { label: "Somewhat important", value: "mid", icon: "😐" },
      { label: "I don't mind pollution", value: "low", icon: "🏭" },
    ],
  },
  {
    id: "vibe",
    question: "What's your ideal city vibe?",
    options: [
      { label: "Hustle & opportunities", value: "hustle", icon: "🚀" },
      { label: "Chill & affordable", value: "chill", icon: "😌" },
      { label: "Cultural & historic", value: "culture", icon: "🏛️" },
      { label: "Up & coming", value: "emerging", icon: "⚡" },
    ],
  },
];

function getRecommendations(answers) {
  const scores = CITIES.map((city) => {
    let score = 0;

    // Budget
    if (answers.budget === "low" && city.metrics.cost >= 78) score += 30;
    else if (answers.budget === "mid" && city.metrics.cost >= 60) score += 30;
    else if (answers.budget === "high" && city.metrics.cost >= 40) score += 30;
    else if (answers.budget === "very_high") score += 20;

    // Job field
    if (answers.job === "tech" && ["ban", "hyd", "pun", "che"].includes(city.id)) score += 25;
    if (answers.job === "finance" && ["mum", "del", "ban"].includes(city.id)) score += 25;
    if (answers.job === "creative" && ["mum", "del", "ban", "pun"].includes(city.id)) score += 25;
    if (answers.job === "student" && city.metrics.cost >= 65) score += 20;

    // Weather
    if (answers.weather === "cool" && ["ban", "pun", "chan"].includes(city.id)) score += 20;
    if (answers.weather === "coastal" && ["mum", "kochi", "che"].includes(city.id)) score += 20;
    if (answers.weather === "hot") score += 10;
    if (answers.weather === "any") score += 10;

    // Air quality
    if (answers.air === "high" && city.metrics.air >= 65) score += 20;
    if (answers.air === "mid" && city.metrics.air >= 45) score += 15;
    if (answers.air === "low") score += 10;

    // Vibe
    if (answers.vibe === "hustle" && ["mum", "del", "ban", "hyd"].includes(city.id)) score += 15;
    if (answers.vibe === "chill" && ["ind", "chan", "kochi", "nag"].includes(city.id)) score += 15;
    if (answers.vibe === "culture" && ["del", "jai", "kol", "che"].includes(city.id)) score += 15;
    if (answers.vibe === "emerging" && ["hyd", "ind", "sur", "vij"].includes(city.id)) score += 15;

    return { city, score };
  });

  return scores.sort((a, b) => b.score - a.score).slice(0, 3);
}

export default function CityQuiz({ onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  function answer(value) {
    const newAnswers = { ...answers, [QUESTIONS[step].id]: value };
    setAnswers(newAnswers);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setResults(getRecommendations(newAnswers));
    }
  }

  const MEDAL = ["🥇", "🥈", "🥉"];
  const progress = ((step) / QUESTIONS.length) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>

      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        style={{ background: "linear-gradient(135deg, #0d1b3e, #0a0f2e)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 24, padding: "2rem", width: "100%", maxWidth: 520, position: "relative" }}>

        {/* Close button */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.5)", borderRadius: 50, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>

        {!results ? (
          <>
            {/* Progress bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Question {step + 1} of {QUESTIONS.length}</span>
                <span style={{ fontSize: 12, color: "#f5c518" }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
                <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
                  style={{ height: 4, borderRadius: 4, background: "linear-gradient(90deg, #f5c518, #e8a020)" }} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 24, lineHeight: 1.4 }}>
                  {QUESTIONS[step].question}
                </h2>
                <div style={{ display: "grid", gap: 10 }}>
                  {QUESTIONS[step].options.map((opt) => (
                    <motion.button key={opt.value} onClick={() => answer(opt.value)}
                      whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, border: "1px solid rgba(245,197,24,0.2)", background: "rgba(255,255,255,0.04)", cursor: "pointer", color: "#fff", fontSize: 14, fontWeight: 500, textAlign: "left" }}>
                      <span style={{ fontSize: 22 }}>{opt.icon}</span>
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Your ideal cities 🏙️</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Based on your preferences</p>
            <div style={{ display: "grid", gap: 12 }}>
              {results.map(({ city, score }, i) => (
                <motion.div key={city.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 16, background: i === 0 ? "linear-gradient(135deg, rgba(245,197,24,0.2), rgba(232,160,32,0.1))" : "rgba(255,255,255,0.04)", border: i === 0 ? "1px solid rgba(245,197,24,0.4)" : "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ fontSize: 28 }}>{MEDAL[i]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>{city.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{city.state}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4, lineHeight: 1.5 }}>{city.note}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#f5c518" }}>{score}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>match</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button onClick={() => { setStep(0); setAnswers({}); setResults(null); }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ width: "100%", marginTop: 20, padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #f5c518, #e8a020)", color: "#0a0a1a", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Retake Quiz
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}