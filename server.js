const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API key stored in Render environment variable
const API_KEY = process.env.homework_helper;

app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",  // provider endpoint (hidden from users)
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer =
      response.data.choices[0].message?.content || "No response from the AI";

    res.json({ answer });
  } catch (error) {
    console.error("AI API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong with the AI service" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


