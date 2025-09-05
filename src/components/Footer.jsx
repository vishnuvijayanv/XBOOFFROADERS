// Footer.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

function Footer({ galleryEnabled, previousRideEnabled, bookingEnabled, contactsList = [] }) {
  const [theme, setTheme] = useState("light");
  const [visible, setVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme || "light");
  }, []);

  // ✅ Animate on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  // ✅ Map API contact `type` → proper icon
  const getIcon = (type) => {
    switch (type) {
      case "phone":
        return <FaPhoneAlt />;
      case "email":
        return <FaEnvelope />;
      case "facebook":
        return <FaFacebook />;
      case "instagram":
        return <FaInstagram />;
      case "youtube":
        return <FaYoutube />;
      case "whatsapp":
        return <FaWhatsapp />;
      default:
        return null;
    }
  };

  return (
    <footer
      ref={footerRef}
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#rgb(255, 255, 255)",
        color: theme === "dark" ? "#f5f5f5" : "#222",
        padding: "2rem 1rem 1rem",
        borderTop: theme === "dark" ? "1px solid #333" : "1px solid #ddd",
        transform: visible ? "translateY(0)" : "translateY(50px)",
        opacity: visible ? 1 : 0,
        transition: "all 0.8s ease-out",
      }}
    >
      {/* Decorative Shapes */}
      {/* <div
        id="contact"
        style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "120px",
          height: "120px",
          background: "rgba(255, 0, 0, 0.15)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      ></div> */}
      {/* <div
        style={{
          position: "absolute",
          bottom: "-40px",
          right: "-40px",
          width: "100px",
          height: "100px",
          background: "rgba(255, 0, 0, 0.15)",
          transform: "rotate(45deg)",
          zIndex: 0,
        }}
      ></div> */}

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row text-center text-md-start">
          {/* Quick Links */}
          <div className="col-md-4 mb-4 order-2 order-md-1">
            <h5 style={{ fontWeight: "700", color: "red" }}>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a className="fw-bold" href="#home" style={{ color: theme === "dark" ? "#ccc" : "#333", textDecoration: "none" }}>Home</a></li>
              <li><a className="fw-bold" href="#aboutus" style={{ color: theme === "dark" ? "#ccc" : "#333", textDecoration: "none" }}>About Us</a></li>
              {galleryEnabled && <li><a className="fw-bold" href="#gallery" style={{ color: theme === "dark" ? "#ccc" : "#333", textDecoration: "none" }}>Gallery</a></li>}
              {previousRideEnabled && <li><a className="fw-bold" href="#previous" style={{ color: theme === "dark" ? "#ccc" : "#333", textDecoration: "none" }}>Prev Trips</a></li>}
              {bookingEnabled && <li><a className="fw-bold" href="#upcoming" style={{ color: theme === "dark" ? "#ccc" : "#333", textDecoration: "none" }}>Upcoming</a></li>}
              <li><a className="fw-bold" href="#contact" style={{ color: theme === "dark" ? "#ccc" : "#333", textDecoration: "none" }}>Contact</a></li>
            </ul>
          </div>

          {/* Contact + Social (Dynamic from API) */}
          <div className="col-md-4 mb-4 order-3 order-md-2">
            <h5 style={{ fontWeight: "700", color: "red" }}>Follow Us</h5>
            <div className="d-flex flex-column align-items-center align-items-md-start">
              {contactsList.map((c) => (
                <div key={c._id} className="mb-2 d-flex align-items-center gap-2">
                  <span style={{ color: "red" }}>{getIcon(c.type)}</span>
                  {c.type === "email" ? (
                    <a className="fw-bold" href={`mailto:${c.value}`} style={{ color: theme === "dark" ? "#ccc" : "#333", textDecoration: "none" }}>{c.value}</a>
                  ) : c.type === "phone" || c.type === "whatsapp" ? (
                    <a className="fw-bold" href={`tel:${c.value}`} style={{ color: theme === "dark" ? "#ccc" : "#333", textDecoration: "none" }}>{c.value}</a>
                  ) : (
                    <a className="fw-bold" href={c.value} target="_blank" rel="noopener noreferrer" style={{ color: theme === "dark" ? "#ccc" : "#333", textDecoration: "none" }}>
                      {c.value}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Send Message Section */}
          <div className="col-md-4 mb-4 order-1 order-md-3">
            <h5 className="fw-bold" style={{ fontWeight: "700", color: "red" }}>Send a Message</h5>
            <form>
              <input
                type="text"
                placeholder="Your Name"
                className="form-control mb-2"
                style={{
                  background: theme === "dark" ? "#2a2a2a" : "#fff",
                  color: theme === "dark" ? "#fff" : "#000",
                  border: theme === "dark" ? "1px solid #444" : "1px solid #ccc",
                }}
              />
              <input
                type="email"
                placeholder="Your Email"
                className="form-control mb-2"
                style={{
                  background: theme === "dark" ? "#2a2a2a" : "#fff",
                  color: theme === "dark" ? "#fff" : "#000",
                  border: theme === "dark" ? "1px solid #444" : "1px solid #ccc",
                }}
              />
              <textarea
                placeholder="Your Message"
                rows="3"
                className="form-control mb-2"
                style={{
                  background: theme === "dark" ? "#2a2a2a" : "#fff",
                  color: theme === "dark" ? "#fff" : "#000",
                  border: theme === "dark" ? "1px solid #444" : "1px solid #ccc",
                }}
              ></textarea>
              <button
                type="submit"
                className="btn w-100 fw-bold"
                style={{
                  background: "red",
                  color: "#fff",
                  fontWeight: "600",
                  border: "none",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="text-center mt-4"
          style={{
            fontSize: "0.9rem",
            borderTop: theme === "dark" ? "1px solid #333" : "1px solid #ddd",
            paddingTop: "1rem",
          }}
        >
          © {new Date().getFullYear()} <span className="text-danger">X</span>BO Offroaders. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
