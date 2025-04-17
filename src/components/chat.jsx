import React, { useState } from 'react';

function Chat() {
  const [code, setCode] = useState("");
  const [doc, setDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const APIBody = {
     "model": "gpt-4o",
     "input": "Write a one-sentence bedtime story about a unicorn."
  }

  const generateDocs = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    setDoc("");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/response",
        {
          method: "POST",
          // -H "Content-Type: application/json" \
          // -H "Authorization: Bearer $OPENAI_API_KEY" \
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ inputs:`summarize: ${code}`}),
          body: JSON.stringify(APIBody)
        }
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (Array.isArray(data)) {
        setDoc(data[0]?.generated_text || "No output.");
      } else {
        setDoc(data.generated_text || JSON.stringify(data));
      }
    } catch (err) {
      setError("Failed to connect to Hugging Face API.");
    }

    setLoading(false);
  };
  console.log(code);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h1>Code Documentation Generator</h1>

      <textarea
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

export default Chat;
