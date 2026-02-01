let memory = [];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    memory.push(`User: ${message}`);
    if (memory.length > 6) memory.shift();

    const prompt = `
You are a helpful AI assistant.
Answer clearly and simply.

Conversation so far:
${memory.join("\n")}

AI:
`;

    const formData = new URLSearchParams();
    formData.append("text", prompt);

    const response = await fetch(
      "https://api.deepai.org/api/text-generator",
      {
        method: "POST",
        headers: {
          "api-key": process.env.DEEPAI_API_KEY
        },
        body: formData
      }
    );

    const data = await response.json();

    const reply =
      typeof data.output === "string" && data.output.trim() !== ""
        ? data.output
        : "I’m not sure I got that. Can you try asking differently?";

    memory.push(`AI: ${reply}`);

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({
      reply: "Server error. Please try again."
    });
  }
}
