export const CITIES = [
  { id: "mum", name: "Mumbai", state: "Maharashtra", metrics: { cost: 38, air: 42, jobs: 88, weather: 58, internet: 72 }, note: "Financial capital with top jobs but high costs & moderate air quality" },
  { id: "ban", name: "Bengaluru", state: "Karnataka", metrics: { cost: 52, air: 61, jobs: 95, weather: 82, internet: 85 }, note: "India's tech hub with best job market, pleasant weather & fast internet" },
  { id: "del", name: "Delhi", state: "Delhi NCR", metrics: { cost: 55, air: 12, jobs: 80, weather: 30, internet: 78 }, note: "Political capital with great jobs & affordable cost but very poor air quality" },
  { id: "hyd", name: "Hyderabad", state: "Telangana", metrics: { cost: 65, air: 58, jobs: 88, weather: 62, internet: 80 }, note: "Rising IT hub with affordable living, decent air quality & growing job market" },
  { id: "pun", name: "Pune", state: "Maharashtra", metrics: { cost: 60, air: 55, jobs: 82, weather: 72, internet: 79 }, note: "Student & startup city with balanced scores across all metrics" },
  { id: "che", name: "Chennai", state: "Tamil Nadu", metrics: { cost: 62, air: 52, jobs: 78, weather: 45, internet: 74 }, note: "South India's industrial hub with moderate heat & good job options" },
  { id: "kol", name: "Kolkata", state: "West Bengal", metrics: { cost: 72, air: 35, jobs: 62, weather: 42, internet: 61 }, note: "Most affordable metro but struggles with air quality & heat/humidity" },
  { id: "ahm", name: "Ahmedabad", state: "Gujarat", metrics: { cost: 75, air: 45, jobs: 70, weather: 38, internet: 72 }, note: "Business-friendly city with low costs but intense summer heat" },
  { id: "jai", name: "Jaipur", state: "Rajasthan", metrics: { cost: 80, air: 48, jobs: 55, weather: 35, internet: 62 }, note: "Cultural gem with very low costs but extreme heat & fewer job options" },
  { id: "chan", name: "Chandigarh", state: "Punjab/Haryana", metrics: { cost: 70, air: 52, jobs: 58, weather: 60, internet: 68 }, note: "India's planned city — clean, green & liveable but smaller job market" },
  { id: "kochi", name: "Kochi", state: "Kerala", metrics: { cost: 68, air: 75, jobs: 60, weather: 52, internet: 71 }, note: "Best air quality among metros, high literacy & growing startup scene" },
  { id: "ind", name: "Indore", state: "Madhya Pradesh", metrics: { cost: 82, air: 62, jobs: 52, weather: 55, internet: 64 }, note: "India's cleanest city award winner — affordable & underrated" },
  { id: "sur", name: "Surat", state: "Gujarat", metrics: { cost: 78, air: 50, jobs: 65, weather: 48, internet: 66 }, note: "Diamond & textile hub, affordable but hot summers" },
  { id: "nag", name: "Nagpur", state: "Maharashtra", metrics: { cost: 80, air: 58, jobs: 50, weather: 45, internet: 60 }, note: "India's geographic centre — low cost, decent air but limited top jobs" },
  { id: "vij", name: "Vijayawada", state: "Andhra Pradesh", metrics: { cost: 82, air: 65, jobs: 48, weather: 42, internet: 62 }, note: "Emerging city with very low costs and improving infrastructure" },
];

export const WEIGHTS = [
  { key: "cost", label: "Cost of living", icon: "💰" },
  { key: "air", label: "Air quality", icon: "🌬️" },
  { key: "jobs", label: "Job market", icon: "💼" },
  { key: "weather", label: "Weather", icon: "☀️" },
  { key: "internet", label: "Internet speed", icon: "📶" },
];