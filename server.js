import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS (so frontend can call backend)
app.use(cors());
app.use(express.json());

// Environment variable for API key
const API_KEY = process.env.OPENAI_API_KEY; // or DEEPSEEK_API_KEY

// Route: Handle homework questions
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    // Call OpenAI/DeepSeek API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // or "deepseek-chat" if using DeepSeek
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();

    res.json({
      answer: data.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
