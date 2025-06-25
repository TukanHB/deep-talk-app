export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";
  const lang = searchParams.get("lang") || "Deutsch";
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing OpenAI key" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }

  const prompt = `Stelle eine tiefgr\u00fcndige Frage aus der Kategorie "${category}" auf ${lang}.`;

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Du generierst kurze, tiefgr\u00fcndige Fragen." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 50,
    }),
  });

  if (!openaiRes.ok) {
    const errorText = await openaiRes.text();
    console.error("OpenAI error:", errorText);
    return new Response(
      JSON.stringify({ error: "OpenAI request failed" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }

  const data = await openaiRes.json();
  const question = data.choices?.[0]?.message?.content?.trim();
  return new Response(
    JSON.stringify({ question }),
    { status: 200, headers: { "content-type": "application/json" } }
  );
}
