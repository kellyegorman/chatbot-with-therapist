import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);

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
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      {/* Header with Image and Name */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
      <img
  src="/brookyn-99-jake.png" 
  alt="Jake Peralta"
  style={{ width: "60px", height: "60px", borderRadius: "50%", marginTop: "10px" }}
/>
<h2 style={{ 
  margin: 0, 
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", 
  fontWeight: "600"
}}>
  Jake Peralta
</h2>

      </div>

      {/* Chat Box */}
      <div style={{ height: "400px", overflowY: "scroll", border: "1px solid gray", padding: "10px", marginTop: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.role === "user" ? "right" : "left", margin: "5px 0" }}>
            <span style={{
              display: "inline-block",
              padding: "10px",
              borderRadius: "10px",
              background: msg.role === "user" ? "lightblue" : "lightgray"
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input Box and Send Button */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
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
            fontFamily: "Verdana"
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 15px",
            marginLeft: "10px",
            borderRadius: "10px",
            background: "lightblue",
            border: "none",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
