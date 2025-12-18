import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3rem 1rem",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "6rem",
          color: "#873884",
          marginBottom: "1rem",
          fontWeight: "bold",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "2rem",
          color: "#333",
          marginBottom: "1rem",
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#666",
          marginBottom: "2rem",
        }}
      >
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1.1rem",
          backgroundColor: "#873884",
          color: "white",
          borderRadius: "6px",
          display: "inline-block",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#6b2a68")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#873884")}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
