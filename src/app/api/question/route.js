export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  const category = searchParams.get("category") || "";
  const lang = searchParams.get("lang") || "Deutsch";

  const apikey = process.env.OPENAI_API_KEY;
  if (!apikey) {
    return new Response(
      JSON.stringify({ error: "Missing OpenAI key" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }

  const prompt = `Stelle eine tiefgründige Frage aus der Kategorie "${category}" auf ${lang}.`;

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apikey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const data = await openaiRes.json();

  return new Response(JSON.stringify({ question: data.choices[0].message.content }), {
    headers: { "content-type": "application/json" },
  });
}
