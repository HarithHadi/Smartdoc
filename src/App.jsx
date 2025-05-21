import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import GrChat from "./components/grchat";
import Navbar from "./components/Navbar";
import Login from "./lib/login";
import Register from "./lib/register";
import FrontPage from "./lib/frontpage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const hideGrChatRoutes = ["/login", "/register"];
  const showGrChat = isLoggedIn && !hideGrChatRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <MainPage /> : <FrontPage />}
        />
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <Register /> : <Navigate to="/" replace />}
        />
      </Routes>
      {showGrChat && <GrChat />}
    </>
  );
}

function MainPage() {
  return (
    <div className="p-4 text-center text-lg">
      Welcome to Smartdoc!
      {/* You can put other main content here */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
