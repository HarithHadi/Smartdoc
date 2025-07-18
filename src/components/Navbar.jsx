import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

import { auth } from "../firebase"; // Adjust path if needed
import { onAuthStateChanged, signOut } from "firebase/auth";
// import { boxShadow } from "html2canvas-pro/dist/types/css/property-descriptors/box-shadow";


export default function Navbar({username}) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);


  const buttonStyleLight = {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s",
  };

  const buttonStyleDark = {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 3,
        padding: "10px 20px",
      }}
    >
      {/* <div>{user?.email}</div> */}
      <NavigationMenu
        className="bg-background text-foreground"
        style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}
      >
        <NavigationMenuList style={{ display: "flex", gap: "20px" }}>
          {user && (
            <NavigationMenuItem>
              <Button className="shadow-none pointer-events-none" style={{backgroundColor: "#FFFFFF", color:"#36454F"}}>
                Hello {username} !
              </Button>
            </NavigationMenuItem>
          )}
          {/* Home Button */}
          <NavigationMenuItem>
            <Link to="/">
              <Button
                style={buttonStyleLight}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#000000";
                  e.target.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#FFFFFF";
                  e.target.style.color = "#000000";
                }}
              >
                Home
              </Button>
            </Link>
          </NavigationMenuItem>
          {!user && (
            <>
              {/* Login Button */}
              <NavigationMenuItem>
                <Link to="/login">
                  <Button
                    style={buttonStyleLight}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#000000";
                      e.target.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#FFFFFF";
                      e.target.style.color = "#000000";
                    }}
                  >
                    Login
                  </Button>
                </Link>
              </NavigationMenuItem>

              {/* Register Button */}
              <NavigationMenuItem>
                <Link to="/register">
                  <Button
                    style={buttonStyleDark}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#FFFFFF";
                      e.target.style.color = "#000000";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#000000";
                      e.target.style.color = "#FFFFFF";
                    }}
                  >
                    Register
                  </Button>
                </Link>
              </NavigationMenuItem>
            </>
          )}

          
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
