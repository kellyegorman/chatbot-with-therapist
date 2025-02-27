import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5010;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const textOnlyModel = genAI.getGenerativeModel({
  model: "models/gemini-1.5-pro-002",
  generationConfig: { maxOutputTokens: 300, temperature: 0.8 }
});

const chat = textOnlyModel.startChat({
  history: [
    { role: "user", parts: [{ text: "Please talk like a CBT therapist conducting a session with a client, using warm and conversational language." }] },
    { role: "model", parts: [{ text: "Of course, I'm here to listen. What's on your mind?" }] },
    { role: "user", parts: [{ text: "Please ask a follow-up question at the end of each response to encourage conversation." }] },
    { role: "model", parts: [{ text: "I understand. I’ll be sure to keep the conversation flowing. How are you feeling today?" }] },
    
    { role: "user", parts: [{ text: "If user asks for advice, give a longer response. Tell them ways to cope and advice for managing their situations." }] },
    { role: "model", parts: [{ text: "Make your responses sound natural and empathetic, avoiding overly structured formats like numbered or bullet-point lists." }] },


    { role: "user", parts: [{ text: "Make your responses sound natural and empathetic, avoiding overly structured formats like numbered or bullet-point lists." }] },
    { role: "model", parts: [{ text: "Got it. I’ll keep things informal and engaging. What’s been on your mind lately?" }] }
  ],
  generationConfig: { maxOutputTokens: 200 },
});

// API route for chatbot messages
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message.trim();

  if (userMessage.toLowerCase() === "quit") {
    res.json({ reply: "Shutting down the server. Goodbye!" });

    setTimeout(() => {
      console.log("Server shutting down...");
      process.exit(0);
    }, 2000);

    return;
  }

  try {
    const result = await chat.sendMessage(userMessage);
    let reply = result.response.text();

    // Remove bullet points and numbered lists
    reply = reply.replace(/^\d+\.\s+/gm, "").replace(/^- /gm, "");

    res.json({ reply });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ reply: "Oops! Something went wrong." });
  }
});

// Start the server
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle Ctrl+C to exit gracefully
process.on("SIGINT", () => {
  console.log("\nShutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
