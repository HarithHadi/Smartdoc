import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FrontPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        Welcome to Smartdoc
      </h1>
      <p style={{ maxWidth: "400px", marginBottom: "2rem", fontSize: "1.1rem" }}>
        SmartDoc helps you summarize your code and save your documents with ease.
      </p>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/login">
          <Button
            style={{
              backgroundColor: "#FFFFFF",
              color: "#000000",
              padding: "10px 25px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
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
        <Link to="/register">
          <Button
            style={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              padding: "10px 25px",
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
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
}
