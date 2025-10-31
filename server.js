import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyB7Nw0-q7NELjGnQBA-2O2IRu3iGG3w3_8";

app.post("/chat", async (req, res) => {
  const userQuery = req.body.query;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are TravelBuddy, an AI travel assistant. Respond helpfully and concisely to: ${userQuery}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t get an answer.";
    res.json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error contacting Gemini API." });
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
