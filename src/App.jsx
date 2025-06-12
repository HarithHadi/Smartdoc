
//App.jsx
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Chat from "./components/chat";
import GrChat from "./components/grchat";
import Navbar from "./components/Navbar";
import Login from "./components/Login";


function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path ="/" element = {<GrChat />} />
        <Route path ="/Login" element = {<Login />} />
      </Routes>
    </Router>
      


  );
}

export default App;
