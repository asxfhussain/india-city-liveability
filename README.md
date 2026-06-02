# 🏙️ India City Liveability Comparator

A full-stack web app that helps Indians make smarter relocation decisions by comparing 15 major cities across real-time and curated data points.

**Live demo → [india-city-liveability.vercel.app](https://india-city-liveability.vercel.app)**

---

## Features

- **Real-time data** — Live AQI from WAQI API and live weather from Open-Meteo API, updated on every load
- **8-metric comparison** — Cost of living, air quality, job market, weather, internet speed, traffic, safety, and food scene
- **Find my city quiz** — 5-question quiz that recommends the best city based on lifestyle preferences
- **Cost of living calculator** — Compare purchasing power across cities with salary slider and expense breakdown
- **AI city advisor** — Chat with an LLM (Llama 3.3 via Groq) that recommends cities based on natural language input
- **Roast my city** — AI-generated savage roast of any Indian city, unique every time
- **Relocators map** — Migration flow data showing where Indians are moving, with rankings and flow breakdown
- **City detail pages** — Deep dive into any city with neighbourhood rent guide, salary benchmarks, commute scores, healthcare index, top employers, and fun facts
- **Animated UI** — Framer Motion animations, glassmorphism cards, midnight gold theme

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| AI | Groq API (Llama 3.3 70B) |
| Live AQI | WAQI API |
| Live Weather | Open-Meteo API (free, no key) |
| Deployment | Vercel |

---

## Getting Started

```bash
git clone https://github.com/asxfhussain/india-city-liveability.git
cd india-city-liveability
npm install
```

Create a `.env.local` file:

```env
WAQI_TOKEN=your_waqi_token
GROQ_API_KEY=your_groq_key
```

Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Keys

| API | Get it at | Cost |
|-----|-----------|------|
| WAQI (AQI data) | [aqicn.org/api](https://aqicn.org/api) | Free |
| Groq (AI advisor + roast) | [console.groq.com](https://console.groq.com) | Free tier |
| Open-Meteo (weather) | No key needed | Free |

---

## Project Structure
src/
app/
page.js                  # Homepage
city/[id]/page.js        # City detail page
api/
weather/route.js       # Open-Meteo weather API
aqi/route.js           # WAQI AQI API
advisor/route.js       # Groq AI advisor
roast/route.js         # Groq city roast
components/
CityComparator.js      # Main comparator
CityQuiz.js            # Find my city quiz
CostCalculator.js      # Cost calculator
CityAdvisor.js         # AI chat UI
RoastMyCity.js         # Roast feature
RelocatorsMap.js       # Migration map
data/
cities.js              # City metrics data
---

## Screenshots

> Add screenshots here after taking them

---

## Author

**Asif Hussain** · 3rd Year AI & Data Science · MJCET Hyderabad

[GitHub](https://github.com/asxfhussain) · [LinkedIn](https://linkedin.com/in/asxfhussain)

---

## License

MIT
