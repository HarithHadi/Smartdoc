
//App.jsx
import { useState } from "react";
import "./App.css";
import Chat from "./components/chat";
import GrChat from "./components/grchat";
import Navbar from "./components/Navbar"


function App() {
  return (
    <>
      <Navbar/>
      <GrChat />
    </>
  );
}

export default App;
