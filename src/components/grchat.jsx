// src/components/GrChat.jsx
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Tesseract, { createWorker } from "tesseract.js";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import SidebarHistory  from "./Sidebarhistory";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


// This component allows users to input code and generate documentation for it using the Groq API
function GrChat({username}) {
  const [code, setCode] = useState("");
  const [doc, setDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("Unititled Document");
  const [open, setOpen] = useState(false);
  const [selectedCodeId, setSelectedCodeId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [codes, setCodes] = useState([]);

    useEffect(() => {
    console.log("Updated doc:", doc);
    }, [doc]);


  // API key for the Groq API
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;


  const generateDocs = async () => {
    // if input is empty
    if (!code.trim()){
      setError("Please enter your code or upload a screenshot")
      return
    };
  
  // Checks if the code is likely code.
  const isLikelyCode = /[{}();=]|(function|const|let|var|class|if|else|import|export)/.test(code);

  if (!isLikelyCode) {
    setError("Invalid code format.");
    return;
  }

    setLoading(true);
    setError("");
    setDoc("");
    setSelectedCodeId(null);
    // setIsSaved(false);

    try {
      // uncomment this to simulate timeout
      // await new Promise((_, reject) =>
      //   setTimeout(() => reject(new Error("Simulated timeout")), 5000)
      // );
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
      } else { //If the API returns a choices array, like OpenAI/Groq typically does.
        //Takes the first message in the choices array, then get its content. If nothing founf sets to "No Documentation Generated"
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
  }


  const generatePdf = async () => {
  const element = document.getElementById("pdf-content");
  const now = new Date();
  const fileName = `SmartDoc-${now.toISOString().slice(0,10)}.pdf`;

  if (!element) {
    console.error("Element not found");
    return;
  }
  const originalBackground = element.style.backgroundColor;
  try {
    element.style.backgroundColor = "#ffffff";

    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    // calculate width/height based on canvas size and PDF page size
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;

    if (imgHeight < pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      // For content taller than one page
      let heightLeft = imgHeight;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;

        if (heightLeft > 0) {
          pdf.addPage();
        }
      }
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("PDF generation failed:", error);
  } finally{
    element.style.backgroundColor = originalBackground;
  }
};


  const saveCodetoFirestore = async (code, doc) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const docRef = await addDoc(collection(db, "userData", user.uid, "codes"), {
      title: title,
      code: code,
      document : doc,
      createdAt: serverTimestamp(),
    });

    console.log("Code saved to Firestore with ID:", docRef.id);
    setSelectedCodeId(docRef.id); // This is what you want
    setIsSaved(true);
    await fetchCodes();
  } catch (err) {
    console.error("Error saving code:", err);
  }
};
  const fetchCodes = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const codesRef = collection(db, "userData", user.uid, "codes");
    const snapshot = await getDocs(codesRef);
    const codeList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCodes(codeList);
    
  };

  useEffect(() => {
    fetchCodes();
  }, []);


  return (
    
    <SidebarProvider open={open} onOpenChange={setOpen}>
       <div className={`fixed top-4 left-4 z-50 transition-all duration-300 ${
        open ? "left-65" : "left-4"
      }`}>
          <SidebarTrigger/>
        </div>

    <SidebarHistory username={username} codes={codes} fetchCodes={fetchCodes}  onSelectCode={(savedCode, id, document) => {setCode(savedCode); setSelectedCodeId(id); setIsSaved(true); setDoc(document);}} />
      
    <div id="pre" style={{ maxWidth: "100%", margin: "0 0", paddingTop: "1rem" }}>      
      <div style={{ paddingBottom : "3rem"}}>
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
            onChange={(e) => {setCode(e.target.value), setIsSaved(false);
              if(e.target.value.trim()==""){
                setDoc("");
              }
            }}
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

        <div style={{ paddingBottom: "1rem", gap: "20px" }}>
          <Button
            onClick={generateDocs}
            disabled={loading || isSaved}
            style={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f3f3f3";
              e.target.style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#000000";
              e.target.style.color = "#FFFFFF";
            }}
          >
            {loading ? "Generating..." : isSaved ? "Generated" : "Generate Docs"}
            
          </Button>
        </div>

        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          
          
          
          {doc && (
            <>
              <h2 className="font-extrabold text-lef text-2xl" style={{paddingBottom : "1rem"}} >Generated Documentation:</h2>
              <div
                className="prose max-w-none"
                style={{
                  background: "#f4f4f4",
                  padding: "1rem",
                  color: "#000",
                  fontSize: "16px",
                  width: "100%",
                  overflow: "auto",
                  textAlign: "left",
                  borderRadius: "5px"
                }}
                id="pdf-content"
              >
                <ReactMarkdown  
                  remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }} {...props} />,
                      h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }} {...props} />,
                      h3: ({ node, ...props }) => <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '1.0rem', marginBottom: '0.75rem' }} {...props} />,
                      h4: ({ node, ...props }) => <h2 style={{ fontWeight: 'bold', marginTop: '1.0rem', marginBottom: '0.75rem' }} {...props} />,
                      ul: ({ node, ...props }) => <ul style={{ paddingLeft: '1.5rem',marginTop: '0.5rem', marginBottom: '0.75rem'}}{...props}/>,
                      li: ({ node, ...props }) => <li style={{ marginBottom: "0.5rem", listStyleType: "disc" }} {...props} />,
                      p: ({ node, ...props }) => <p style={{ marginBottom: '1rem' }} {...props} />,
                      
                    }}
                  >{doc}
                </ReactMarkdown>

              </div>
              <div style={{ padding:"1rem"}}>
                <Button 
                        onClick={generatePdf}
                        style={{
                          backgroundColor: "#000000",
                          color: "#FFFFFF",
                          padding: "10px 20px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          transition: "background-color 0.3s, color 0.3s",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f3f3f3";
                            e.target.style.color = "#000000";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#000000";
                            e.target.style.color = "#FFFFFF";
                        }}
                        >
                            Download Documentation
                </Button>
                {!isSaved && (
                  <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" className="ml-4"
                    style={{
                            backgroundColor: "#000000",
                            color: "#FFFFFF",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            transition: "background-color 0.3s, color 0.3s",
                          }}
                    onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f3f3f3";
                            e.target.style.color = "#000000";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#000000";
                            e.target.style.color = "#FFFFFF";
                        }}
                    >Save Document</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md [&>button]:hidden" >
                    <DialogHeader>
                      <DialogTitle>Save Document</DialogTitle>
                      <DialogDescription>
                        This will be the title of your document.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                          Link
                        </Label>
                        <Input
                          defaultValue="Title name"
                          required
                          onChange={(e)=> setTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
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
                            e.target.style.backgroundColor = "#f3f3f3";
                            e.target.style.color = "#000000";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#000000";
                            e.target.style.color = "#FFFFFF";
                        }}                         
                         type="button" variant="default" onClick={() => saveCodetoFirestore(code, doc)}
                         >
                          Save
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                )}
                

              </div>
              
            </>
          )}

        </div>
      </div> 
    </div>
    </SidebarProvider>
    
  );
}

export default GrChat;
