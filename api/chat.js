export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.deepai.org/api/text-generator", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.DEEPAI_API_KEY
  },
  body: JSON.stringify({
    text: `You are a helpful AI assistant.
Answer clearly and simply.

User: ${message}
AI:`
  })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.output || "Can you rephrase that in a simpler way?"
    });

  } catch (error) {
    res.status(500).json({
      reply: "Server error. Try again."
    });
  }
}
