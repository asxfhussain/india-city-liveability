export async function POST(req) {
  const { city, metrics } = await req.json();

  const prompt = `Roast the Indian city of ${city} in a brutally funny, savage but lighthearted way. 

Here are its stats to use in the roast:
- Cost of living score: ${metrics.cost}/100 (higher = cheaper)
- Air quality score: ${metrics.air}/100
- Job market score: ${metrics.jobs}/100  
- Weather score: ${metrics.weather}/100
- Internet speed score: ${metrics.internet}/100
- Traffic score: ${metrics.traffic}/100
- Safety score: ${metrics.safety}/100
- Food scene score: ${metrics.food}/100

Write a 3-4 sentence roast that:
- Is savage and funny but not mean-spirited
- References specific real things about the city (landmarks, food, culture, weather, traffic)
- Uses the weak stats to roast it
- Feels fresh and specific, not generic
- Ends with a backhanded compliment

Only return the roast text, nothing else.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a savage but funny AI comedian who roasts Indian cities. Be specific, witty, and brutal but keep it fun." },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 1.0,
    }),
  });

  const data = await response.json();
  const roast = data.choices?.[0]?.message?.content || "This city is so boring even the AI refused to roast it.";
  return Response.json({ roast });
}