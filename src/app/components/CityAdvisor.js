"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "I'm a 24yo ML engineer who hates pollution, where should I live?",
  "Best city for a fresh CS graduate with ₹8L package?",
  "I want affordable rent and good startup culture",
  "Which city has the best work-life balance for IT?",
];

export default function CityAdvisor({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! 👋 I'm your AI city advisor. Tell me about yourself — your field, budget, lifestyle preferences, or what you're looking for — and I'll recommend the best Indian city for you!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text) {
    const userMsg = text || input;
    if (!userMsg.trim()) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(1).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: history.slice(0, -1) }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Try again!" }]);
    }
    setLoading(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>

      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        style={{ background: "linear-gradient(135deg, #0d1b3e, #0a0f2e)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 24, width: "100%", maxWidth: 560, height: "80vh", display: "flex", flexDirection: "column", position: "relative" }}>

        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #f5c518, #e8a020)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧠</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>AI City Advisor</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Powered by Grok</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.5)", borderRadius: 50, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "85%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.role === "user" ? "linear-gradient(135deg, #f5c518, #e8a020)" : "rgba(255,255,255,0.07)",
                color: m.role === "user" ? "#0a0a1a" : "rgba(255,255,255,0.85)",
                fontSize: 13, lineHeight: 1.6, fontWeight: m.role === "user" ? 600 : 400,
              }}>
                {m.content}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 4, padding: "10px 14px", background: "rgba(255,255,255,0.07)", borderRadius: "16px 16px 16px 4px", width: "fit-content" }}>
              {[0, 1, 2].map((i) => (
                <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: "#f5c518" }} />
              ))}
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div style={{ padding: "0 1.5rem 0.75rem", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}
                style={{ fontSize: 11, padding: "5px 10px", borderRadius: 20, border: "1px solid rgba(245,197,24,0.25)", background: "rgba(245,197,24,0.08)", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: "0.75rem 1.5rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Tell me about yourself..."
            style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
          <motion.button onClick={() => send()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={loading}
            style={{ width: 42, height: 42, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #f5c518, #e8a020)", cursor: "pointer", fontSize: 18 }}>
            ➤
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}