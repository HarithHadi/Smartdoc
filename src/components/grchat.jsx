// src/components/GrChat.jsx
import React, { useState } from "react";
import { Input } from "./ui/input"
import { Textarea } from "@/components/ui/textarea"


// This component allows users to input code and generate documentation for it using the Groq API
function GrChat() {
  const [code, setCode] = useState("");
  const [doc, setDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  const generateDocs = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    setDoc("");

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // or llama3-8b-8192, etc.
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant that explains and documents code.",
            },
            {
              role: "user",
              content: `Can you generate documentation for the following code?\n\n${code}`,
            },
          ],
          temperature: 0.5,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error.message || "Unknown error.");
      } else {
        setDoc(data.choices?.[0]?.message?.content || "No documentation generated.");
      }
    } catch (err) {
      setError("Failed to connect to Groq API.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h1>Groq AI Code Documentation Generator</h1>

      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        placeholder="Paste your code here..."
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      

      <button onClick={generateDocs} disabled={loading}>
        {loading ? "Generating..." : "Generate Docs"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Generated Documentation:</h2>
      <pre style={{ background: "#f4f4f4", padding: "1rem", color: "#000", fontSize: "16px", width: "100%", height: "300px", overflow: "auto" }}>
        {doc}
      </pre>
    </div>
  );
}

export default GrChat;
