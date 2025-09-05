import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import img4 from "../assets/img4.png";
import ProfileModal from "./ProfileModal"; // Import the modal

function Header(props) {
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : false;
  });
  // useEffect(() => {
  //   // Theme handling
  //   localStorage.setItem("theme", darkMode ? "dark" : "light");
  //   if (props?.setIsThemeChanged) {
  //     props.setIsThemeChanged((prevState) => !prevState);
  //   }
  // }, [darkMode]);
  const [activeLink, setActiveLink] = useState("#home");
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Modal state

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#aboutus" },
    props.galleryEnabled && { label: "Gallery", href: "#gallery" },
    props.previousRideEnabled && { label: "Prev Rides", href: "#previous" },
    props.bookingEnabled && { label: "Upcoming", href: "#upcoming" },
    { label: "Contact us", href: "#contact" },
  ].filter(Boolean); // removes false/null when feature is disabled

  return (
    <>
      <div className={darkMode ? "bg-dark text-white" : "bg-light text-dark"}>
        <header
          className="d-none d-md-flex align-items-center justify-content-between px-4 py-3"
          style={{
            background: darkMode ? "#121212 " : "rgb(255, 255, 255)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1020,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {/* Logo */}
          <a
            href="#home"
            className="d-flex align-items-center text-decoration-none"
            style={{ color: "inherit" }}
          >
            <img
              src={img4}
              alt="Logo"
              style={{ height: 40, marginRight: 10 }}
            />
          </a>

          {/* Navigation */}
          <nav className="d-flex align-items-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className="text-decoration-none"
                style={{
                  color:
                    activeLink === link.href
                      ? "#e60000"
                      : darkMode
                      ? "#fff"
                      : "#000",
                  fontWeight: activeLink === link.href ? "bold" : 500,
                }}
                onMouseEnter={(e) => (e.target.style.color = "#e60000")}
                onMouseLeave={(e) =>
                  (e.target.style.color =
                    activeLink === link.href
                      ? "#e60000"
                      : darkMode
                      ? "#fff"
                      : "#000")
                }
              >
                {link.label}
              </a>
            ))}

            {/* Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                color: darkMode ? "#fff" : "#000",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#e60000")}
              onMouseLeave={(e) =>
                (e.target.style.color = darkMode ? "#fff" : "#000")
              }
            >
              Profile
            </button>

            <a
              href="#upcoming"
              className="btn  fw-bold rounded-pill px-3 shadow-sm text-light"
              style={{ backgroundColor: "#e60000" }}
            >
              Book Now
            </a>
          </nav>

          {/* Theme toggle */}
          {/* <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip>
                {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </Tooltip>
            }
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: "50px",
                padding: "5px",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
              onClick={() => setDarkMode(!darkMode)}
            >
              <div
                style={{
                  background: darkMode ? "#333" : "#fff",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: darkMode ? "#fff" : "#333",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                {darkMode ? <FaMoon /> : <FaSun />}
              </div>
            </div>
          </OverlayTrigger> */}
        </header>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}

export default Header;
