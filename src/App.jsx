import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import GrChat from "./components/grchat";
import Navbar from "./components/Navbar";
import Login from "./lib/login";
import Register from "./lib/register";
import FrontPage from "./lib/frontpage";
// a firebase listener that detects when a user logs in or out
import { onAuthStateChanged } from "firebase/auth";
// auth is firebae's authentication instance
import { auth } from "./firebase";

function AppContent() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // firebase Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const hideGrChatRoutes = ["/login", "/register"];
  const showGrChat = isLoggedIn && !hideGrChatRoutes.includes(location.pathname);

  return (
    <>
      <Navbar user={user}/>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <MainPage user={user} /> : <FrontPage />}
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

function MainPage({user}) {
  return (
    <div className="p-4 text-center text-lg">
      Hello {user?.email}
      
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
