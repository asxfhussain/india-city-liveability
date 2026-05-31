const CITY_STATIONS = {
  mum: "mumbai",
  ban: "bangalore",
  del: "delhi",
  hyd: "hyderabad",
  pun: "pune",
  che: "chennai",
  kol: "kolkata",
  ahm: "ahmedabad",
  jai: "jaipur",
  chan: "chandigarh",
  kochi: "kochi",
  ind: "indore",
  sur: "surat",
  nag: "nagpur",
  vij: "vijayawada",
};

function aqiToScore(aqi) {
  if (aqi <= 50) return 100;
  if (aqi <= 100) return 80;
  if (aqi <= 150) return 60;
  if (aqi <= 200) return 40;
  if (aqi <= 300) return 20;
  return 10;
}

export async function GET() {
  const token = process.env.WAQI_TOKEN;
  try {
    const results = {};
    await Promise.all(
      Object.entries(CITY_STATIONS).map(async ([id, city]) => {
        const res = await fetch(`https://api.waqi.info/feed/${city}/?token=${token}`);
        const data = await res.json();
        if (data.status === "ok") {
          const aqi = data.data.aqi;
          results[id] = { aqi, score: aqiToScore(aqi) };
        }
      })
    );
    return Response.json(results);
  } catch {
    return Response.json({ error: "Failed to fetch AQI" }, { status: 500 });
  }
}