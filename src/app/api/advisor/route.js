const CITY_CONTEXT = `You are an expert Indian city liveability advisor. You have deep knowledge about these 15 Indian cities: Mumbai, Bengaluru, Delhi, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad, Jaipur, Chandigarh, Kochi, Indore, Surat, Nagpur, Vijayawada.

Key facts:
- Mumbai: rent ₹35K+, finance/media jobs, expensive, humid
- Bengaluru: rent ₹22K, best tech jobs, pleasant weather, traffic bad
- Delhi: rent ₹20K, great jobs, terrible air quality in winter
- Hyderabad: rent ₹16K, excellent tech jobs, best value for money
- Pune: rent ₹15K, good IT, pleasant weather, great for freshers
- Chennai: rent ₹14K, auto/IT hub, very hot and humid
- Kolkata: rent ₹10K, most affordable, limited top jobs, cultural
- Ahmedabad: rent ₹11K, business city, very hot summers
- Jaipur: rent ₹9K, limited jobs, extreme heat, good for remote workers
- Chandigarh: rent ₹12K, clean and planned, limited jobs
- Kochi: rent ₹13K, best air quality, growing IT, coastal
- Indore: rent ₹8K, cleanest city, limited top jobs
- Surat: rent ₹9K, diamond/textile hub
- Nagpur: rent ₹8K, geographic centre, limited jobs
- Vijayawada: rent ₹7K, emerging, very limited jobs

Give TOP 3 recommendations with specific reasons. Be honest about downsides. Use specific numbers. Keep it conversational and friendly.`;

export async function POST(req) {
  const { message, history } = await req.json();

  const messages = [
    ...history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
    { role: "user", content: message },
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: CITY_CONTEXT },
        ...messages,
      ],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  console.log("Groq response:", JSON.stringify(data));
  const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Try again!";
  return Response.json({ reply });
}