// Chatbot.js
import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Helper to extract sentiment score and compute gradient color
  const getSentimentColor = (text) => {
    const regex = /\s*\[Sentiment: .* \(score:\s*([\d.]+)\)\]$/;
    const match = text.match(regex);
    if (match && match[1]) {
      const score = parseFloat(match[1]);
      // Compute red-to-green gradient:
      // score = 0  -> red (rgb(255,0,0))
      // score = 1  -> green (rgb(0,255,0))
      const red = Math.round((1 - score) * 255);
      const green = Math.round(score * 255);
      return { color: `rgb(${red}, ${green}, 0)`, cleanedText: text.replace(regex, "") };
    }
    // Default for no sentiment info:
    return { color: "lightgray", cleanedText: text };
  };

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    if (input.toLowerCase() === "quit") {
      alert("Closing chatbot...");
      window.close();
      return;
    }

    try {
      const response = await axios.post("http://localhost:5010/chat", {
        message: input,
      });

      const botMessage = { role: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/office_2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          textAlign: "center",
        }}
      >
        {/* Header with Image and Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <img
            src="/therapist.png"
            alt="My Therapist"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              marginTop: "10px",
            }}
          />
          <h2
            style={{
              margin: 0,
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              fontWeight: "600",
            }}
          >
            My Therapist
          </h2>
        </div>

        {/* Chat Box */}
        <div
          style={{
            height: "400px",
            overflowY: "scroll",
            border: "1px solid gray",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "15px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.map((msg, index) => {
            let displayText = msg.text;
            let backgroundColor =
              msg.role === "user" ? "dodgerblue" : "lightgray";

            // If the message is from the bot, check for sentiment score
            if (msg.role === "bot") {
              const { color, cleanedText } = getSentimentColor(msg.text);
              backgroundColor = color;
              displayText = cleanedText;
            }

            return (
              <div
                key={index}
                style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  margin: "5px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    borderRadius: "10px",
                    background: backgroundColor,
                    color: msg.role === "user" ? "white" : "black",
                  }}
                >
                  {displayText}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input Box and Send Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{
              flex: "1",
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid gray",
              outline: "none",
              fontFamily: "Verdana",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "10px 15px",
              marginLeft: "10px",
              borderRadius: "15px",
              background: "dodgerblue",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
