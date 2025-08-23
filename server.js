const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Use your env variable name from Render (kju)
const API_KEY = process.env.kju;

app.use(bodyParser.json());
app.use(cors());

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "✅ Backend is alive and working!" });
});

// AI route
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
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

    res.json({
      answer: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Something went wrong with AI API",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
