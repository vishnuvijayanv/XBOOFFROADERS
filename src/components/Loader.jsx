import React, { useEffect, useState } from "react";
import logo from "../assets/loader-logo.jpg";

const Loader = () => {
  const fullText = "Loading your offroad adventure...";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 70);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #efececff, #f8f2f2ff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Spinning Ring */}
      <div
        style={{
          position: "relative",
          width: "180px",
          height: "180px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "6px solid rgba(255,255,255,0.1)",
            borderTop: "6px solid #fc3b3b",
            borderRadius: "50%",
            animation: "spin 2s linear infinite",
          }}
        />
        <img
          src={logo}
          alt="BO Offroaders"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 0 20px rgba(252, 59, 59, 0.6)",
            animation: "pulse 2s infinite",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Typing Effect Text */}
      <p
        style={{
          fontSize: "1.4rem",
          fontFamily: "'Macondo', cursive",
          textAlign: "center",
          letterSpacing: "2px",
          color: "#ee0c0cff",
          textShadow: "0 0 6px rgba(252, 59, 59, 0.6)",
          textTransform: "uppercase",
        }}
      >
        {displayedText}
        <span
          style={{
            display: "inline-block",
            width: "10px",
            animation: "blink 0.8s infinite",
          }}
        >
          |
        </span>
      </p>

      {/* Animations + Font Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.05); }
          }

          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
