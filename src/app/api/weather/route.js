const CITY_COORDS = {
  mum:  { lat: 19.076, lon: 72.877 },
  ban:  { lat: 12.972, lon: 77.594 },
  del:  { lat: 28.613, lon: 77.209 },
  hyd:  { lat: 17.385, lon: 78.486 },
  pun:  { lat: 18.520, lon: 73.856 },
  che:  { lat: 13.083, lon: 80.270 },
  kol:  { lat: 22.572, lon: 88.363 },
  ahm:  { lat: 23.023, lon: 72.572 },
  jai:  { lat: 26.912, lon: 75.787 },
  chan: { lat: 30.733, lon: 76.779 },
  kochi:{ lat: 9.931,  lon: 76.267 },
  ind:  { lat: 22.719, lon: 75.857 },
  sur:  { lat: 21.170, lon: 72.831 },
  nag:  { lat: 21.146, lon: 79.088 },
  vij:  { lat: 16.506, lon: 80.648 },
};

function weatherScore(temp, rain) {
  let score = 100;
  if (temp > 35) score -= (temp - 35) * 4;
  if (temp < 10) score -= (10 - temp) * 3;
  if (rain > 5) score -= rain * 2;
  return Math.max(10, Math.min(100, Math.round(score)));
}

export async function GET() {
  try {
    const results = {};
    await Promise.all(
      Object.entries(CITY_COORDS).map(async ([id, { lat, lon }]) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation&timezone=Asia/Kolkata`;
        const res = await fetch(url);
        const data = await res.json();
        const temp = data.current.temperature_2m;
        const rain = data.current.precipitation;
        results[id] = {
          temp: Math.round(temp),
          rain: Math.round(rain),
          score: weatherScore(temp, rain),
        };
      })
    );
    return Response.json(results);
  } catch {
    return Response.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
