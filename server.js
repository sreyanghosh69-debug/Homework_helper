const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root test endpoint
app.get("/", (req, res) => {
  res.json({ status: "✅ Backend is alive and working!" });
});

// Homework helper endpoint
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  console.log("📩 Incoming question:", question);

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
          "Authorization": `Bearer ${process.env.homework_helper}`, // env var
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ AI Response:", response.data);

    const answer =
      response.data.choices[0].message?.content || "No response from AI";

    res.json({ answer });
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Something went wrong with AI API",
      details: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
