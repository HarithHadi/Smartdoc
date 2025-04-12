import { useState } from "react";

const CodeForm = () => {
  const [code, setCode] = useState("");
  const [doc, setDoc] = useState("");
  const [loading, setLoading] = useState(false);

  const generateDocs = async () => {
    if (!code.trim()) return;
  
    setLoading(true);
    setError("");
    setDoc("");
  
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/bigcode/santacoder",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: code }),
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
  
};

export default CodeForm;
