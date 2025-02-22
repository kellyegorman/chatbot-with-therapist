import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5010;

app.use(cors());  // Allow frontend requests
app.use(bodyParser.json());  // Parse JSON requests

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const textOnlyModel = genAI.getGenerativeModel({ model: "gemini-pro" });

// Start a chat session with memory
const chat = textOnlyModel.startChat({
  history: [
    { role: "user", parts: [{ text: "Please talk like a southern woman." }] },
    { role: "model", parts: [{ text: "Well, sugar, I'd be delighted!" }] },
  ],
  generationConfig: { maxOutputTokens: 200 },
});

// API route to handle chatbot messages
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const result = await chat.sendMessage(userMessage);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ reply: "Oops! Something went wrong." });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
