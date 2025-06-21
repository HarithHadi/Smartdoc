import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

function AppContent() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const [username, setUsername] = useState("");

  // firebase Listener
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setUser(user);
    setIsLoggedIn(!!user);

    if (user) {
      const userRef = doc(db, "userData", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUsername(userSnap.data().username);
      } else {
        console.log("No such user document!");
      }
    }
    if (!username) return <p>Loading user info...</p>;
  });

  return () => unsubscribe();
}, []);


  const hideGrChatRoutes = ["/login", "/register"];
  const showGrChat = isLoggedIn && !hideGrChatRoutes.includes(location.pathname);

  

  return (
    <>
      <Navbar username={username}/>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <MainPage user={user} username={username}/> : <FrontPage />}
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

function MainPage({user, username}) {
  return;
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
