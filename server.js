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
const textOnlyModel = genAI.getGenerativeModel({ model: "gemini-pro" });

const chat = textOnlyModel.startChat({
  history: [
    { role: "user", parts: [{ text: "Please talk like Jake Peralta from Brooklyn 99." }] },
    { role: "model", parts: [{ text: "Cool cool no doubt no doubt!" }] },
  ],
  generationConfig: { maxOutputTokens: 200 },
});

// API route for chatbot messages
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message.trim().toLowerCase();

  if (userMessage === "quit") {
    res.json({ reply: "Shutting down the server. Goodbye!" });

    setTimeout(() => {
      console.log("Server shutting down...");
      process.exit(0); // Terminates the Node.js process
    }, 2000);

    return;
  }

  try {
    const result = await chat.sendMessage(req.body.message);
    res.json({ reply: result.response.text() });
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
