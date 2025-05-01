// src/components/GrChat.jsx
import React, { useState } from "react";
import { Input } from "./ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


// This component allows users to input code and generate documentation for it using the Groq API
function GrChat() {
  // The code input by the user
  const [code, setCode] = useState("");
  // The geneated documentation
  const [doc, setDoc] = useState("");
  // Wether the API requesst is in progress
  const [loading, setLoading] = useState(false);
  // Any error messages from the API request
  const [error, setError] = useState("");


  // API key for the Groq API
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  // This function sends a POST request to the Groq API with the input code and model parameters update the component state with 
  // the generated documentation or any error messages
  const generateDocs = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    setDoc("");

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        // Headers can be found in the groq models website. here u can find formats that need to be followed to use the model
        // -H "Authorization: Bearer $GROQ_API_KEY" \
        // -H "Content-Type: application/json" \
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
              content: `Generate a Markdown summary explaining what the code does, including its components, state variables, and functions\n\n${code}`,
            },
          ],
          temperature: 0.5,
        }),
      });

      // This waits for the response of the api and puts it into the variable data
      const data = await response.json();

      // For errors
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
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingTop: "1rem" }}>
      
      <div style={{ paddingBottom : "3rem"}}>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            SmartDoc 📋
        </h1>

        <h5 className=" font-bold tracking-tight text-gray-900  dark:text-white">
          Your all-in-one tool for generating documentation from your code. Paste your code below and let SmartDoc do the rest!
        </h5>

      </div>
      
      <div style={{padding: "1rem"}}>
        <div style={{paddingBottom: "1rem"}}>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            placeholder="Paste your code here..."
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        </div>
        
        <div style={{paddingBottom: "1rem"}}>
          <Button onClick={generateDocs} disabled={loading}>
            {loading ? "Generating..." : "Generate Docs"}
          </Button>
        </div>
        
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          
          <h2 className="font-extrabold text-lef text-2xl" style={{paddingBottom : "1rem"}} >Generated Documentation:</h2>
          <pre style={{ background: "#f4f4f4", padding: "1rem", color: "#000", fontSize: "16px", width: "100%", height: "300px", overflow: "auto" }}>
            {doc}
          </pre>
        </div>


        

      </div>


      
    </div>
  );
}

export default GrChat;
