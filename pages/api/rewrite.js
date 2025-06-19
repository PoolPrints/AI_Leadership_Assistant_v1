import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Missing input text." });
  }

  const prompt = `
You are a leadership coach. Rewrite the following feedback note from a manager to a team member.

1. Provide a PROFESSIONAL version.
2. Provide an EMPATHETIC version.
3. Identify any tone risks (e.g., too vague, too harsh, unclear ask).
4. Suggest a 1-sentence closing CTA (call to action).

--- INPUT START ---
${text}
--- INPUT END ---

Respond in the following JSON format:
{
  "professional": "...",
  "empathetic": "...",
  "risks": ["...", "..."],
  "cta": "..."
}
`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = completion.data.choices[0].message?.content || "";
    const clean = content.trim().replace(/```json|```/g, "");
    const json = JSON.parse(clean);

    res.status(200).json(json);
  } catch (err) {
    console.error("Rewrite API error:", err.message);
    res.status(500).json({ error: "Failed to process rewrite" });
  }
}
