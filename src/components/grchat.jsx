// src/components/GrChat.jsx
import React, { useState } from "react";
import { Input } from "./ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Tesseract, { createWorker } from "tesseract.js";
import html2pdf from 'html2pdf.js'


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

  // Stores the screenshots from the user
  const [image, setImage] = useState("");


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

  const handleOCR = async (file) =>{
    setLoading(true);
    try{
      const result = await Tesseract.recognize(file,'eng', {
        logger: m => console.log(m),
        
      });
      setCode(result.data.text);
    } catch (err) {
      console.error("OCR Error:", err);
      setDoc("Failed to read text from image")
    }
    setLoading(false);
  }

  const handleFileChange = (e) =>{
    const file = e.target.files[0];
    setImage(file);
    if(file){
      handleOCR(file);
    }
  }



  return (
    <div id="pre" style={{ maxWidth: "800px", margin: "0 auto", paddingTop: "1rem" }}>
      
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
            rows={8} // Reduced rows to make the box smaller
            placeholder="Paste your code here..."
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        </div>
        <div style={{paddingBottom: "1rem" ,alignItems : "center" }}>
          <h5 className=" font-bold tracking-tight text-gray-900  dark:text-white" style={{padding : "0.5rem"}}>Or post a screenshot of ur code here</h5>
          <Input 
              type="file"
              style={{
                width: "200px", // Adjusted width to make the box smaller
                height: "40px", // Adjusted height to make the box smaller
                alignContent : "center",
                boxSizing: "border-box",
                cursor : "pointer",
                margin: "0 auto", // Centers the input horizontally
                display: "block"
              }}
              onChange={handleFileChange}
              
            />
        </div>
        
        
        
        <div style={{paddingBottom: "1rem"}}>
          <Button onClick={generateDocs} disabled={loading}
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
          
          <h2 className="font-extrabold text-lef text-2xl" style={{paddingBottom : "1rem"}} >Generated Documentation:</h2>
          <pre style={{ background: "#f4f4f4", padding: "1rem", color: "#000", fontSize: "16px", width: "100%", height: "200px", overflow: "auto" ,textAlign: "left" }}>
            {doc}
          </pre>

        </div>
        


        

      </div>
      <Button 
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
          Download Documentation
      </Button>


      
    </div>
  );
}

export default GrChat;
