import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // ✅ Framer Motion
import aboutImg from "../assets/img1.jpg"; // Replace with your image path

const AboutUs = (props) => {
  // Initialize darkMode from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : true;
  });

  // Update darkMode whenever props changes
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setDarkMode(storedTheme === "dark");
  }, [props]);

  const accentColor = darkMode ? "#ea0c0cff" : "#f81818ff";

  return (
    <section
      id="aboutus"
      style={{
        padding: "80px 20px",
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#f0f0f0" : "#222",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "60px",
          flexWrap: "wrap",
        }}
      >
        {/* Left Text Section */}
        <motion.div
          style={{ flex: "1 1 400px", minWidth: "280px" }}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2
            style={{
              fontSize: "2.8rem",
              fontWeight: "700",
              marginBottom: "16px",
              color: darkMode ? "#fff" : "#222",
              borderBottom: `4px solid ${accentColor}`,
              paddingBottom: "6px",
              width: "fit-content",
              userSelect: "none",
            }}
          >
            About XBO Offroaders
          </h2>
          <div
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: darkMode ? "#ddd" : "#444",
              marginBottom: "24px",
              maxWidth: "480px",
              userSelect: "text",
            }}
          >
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.6,
                marginBottom: "15px",
              }}
            >
              At <strong><span className="text-danger">X</span>BO Offroaders</strong>, we live and breathe the thrill
              of adventure. Our passion is taking riders beyond the ordinary —
              into the wild trails, rugged terrains, and breathtaking landscapes
              that only true off-roaders dare to explore.
            </p>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.6,
                marginBottom: "15px",
              }}
            >
              Whether you’re a seasoned rider or a curious beginner, our
              community welcomes everyone. We organize thrilling group rides,
              provide expert tips, and ensure every journey is as safe as it is
              exciting.
            </p>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
              Join us, gear up, and let’s conquer the terrain together.
              <strong> Adventure is calling — are you ready?</strong>
            </p>
          </div>
          <a
            href="#upcoming"
            style={{
              display: "inline-block",
              backgroundColor: accentColor,
              color: "#fff",
              padding: "12px 28px",
              fontWeight: "600",
              fontSize: "1rem",
              textDecoration: "none",
              borderRadius: "2px",
              boxShadow: `0 3px 10px ${accentColor}88`,
              transition: "background-color 0.3s ease",
              userSelect: "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = darkMode
                ? "#e63737"
                : "#d6451c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = accentColor)
            }
          >
            Upcoming Rides
          </a>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          style={{
            position: "relative",
            flex: "1 1 450px",
            minWidth: "300px",
            maxWidth: "500px",
          }}
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src={aboutImg}
            alt="Race"
            style={{
              width: "100%",
              height: "auto",
              clipPath: "polygon(0 0, 100% 8%, 100% 92%, 0% 100%)",
              borderRadius: "4px",
              boxShadow: darkMode
                ? "0 6px 18px rgba(255, 77, 77, 0.5)"
                : "0 6px 18px rgba(230, 70, 30, 0.4)",
              userSelect: "none",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              right: "-30px",
              width: "80px",
              height: "70px",
              backgroundColor: accentColor,
              clipPath: "polygon(0 15%, 85% 0, 100% 100%, 15% 100%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              userSelect: "none",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "60px",
              width: "25px",
              height: "25px",
              backgroundColor: accentColor,
              clipPath: "polygon(0 15%, 85% 0, 100% 100%, 15% 100%)",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
              userSelect: "none",
            }}
          ></div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
