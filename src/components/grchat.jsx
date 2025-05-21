// src/components/GrChat.jsx
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Tesseract from "tesseract.js";
import { marked } from "marked";
import DOMPurify from "dompurify";

function GrChat() {
  const [code, setCode] = useState("");
  const [doc, setDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");

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
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant that explains and documents code.",
            },
            {
              role: "user",
              content: `Generate a Markdown summary explaining what the code does, including its components, state variables, and functions\n\n${code}`,
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

  const handleOCR = async (file) => {
    setLoading(true);
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m),
      });
      setCode(result.data.text);
    } catch (err) {
      console.error("OCR Error:", err);
      setDoc("Failed to read text from image");
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      handleOCR(file);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingTop: "1rem" }}>
      <div style={{ paddingBottom: "3rem" }}>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          SmartDoc 📋
        </h1>
        <h5 className="font-bold tracking-tight text-gray-900 dark:text-white">
          Your all-in-one tool for generating documentation from your code. Paste your code below and let SmartDoc do the rest!
        </h5>
      </div>

      <div style={{ padding: "1rem" }}>
        <div style={{ paddingBottom: "1rem" }}>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            placeholder="Paste your code here..."
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        </div>

        <div style={{ paddingBottom: "1rem", alignItems: "center" }}>
          <h5 className="font-bold tracking-tight text-gray-900 dark:text-white" style={{ padding: "0.5rem" }}>
            Or post a screenshot of your code here
          </h5>
          <Input
            type="file"
            style={{
              width: "200px",
              height: "40px",
              alignContent: "center",
              boxSizing: "border-box",
              cursor: "pointer",
              margin: "0 auto",
              display: "block"
            }}
            onChange={handleFileChange}
          />
        </div>

        <div style={{ paddingBottom: "1rem" }}>
          <Button
            onClick={generateDocs}
            disabled={loading}
            style={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#FFFFFF";
              e.target.style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#000000";
              e.target.style.color = "#FFFFFF";
            }}
          >
            {loading ? "Generating..." : "Generate Docs"}
          </Button>
        </div>

        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <h2 className="font-extrabold text-left text-2xl" style={{ paddingBottom: "1rem" }}>
            Generated Documentation:
          </h2>

          <div
            style={{
              background: "#f4f4f4",
              padding: "1rem",
              color: "#000",
              fontSize: "16px",
              width: "100%",
              minHeight: "200px",
              overflow: "auto",
              textAlign: "left",
              borderRadius: "8px",
            }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(doc)) }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default GrChat;
