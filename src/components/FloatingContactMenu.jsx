import React, { useState, useEffect } from "react";
import { MdMessage } from "react-icons/md";
import {
  FaTimes,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function FloatingContactMenu({ hasBottomNavbar = true, setIsThemeChanged }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : true;
  });
  // Dragging states
  const [position, setPosition] = useState({
    x: window.innerWidth - 80, // initially right side
    y: window.innerHeight - (isMobile && hasBottomNavbar ? 120 : 80),
  });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState(null);

  const fabData = [
    {
      id: 1,
      name: "Facebook",
      icon: <FaFacebookF size={20} />,
      color: "#1877F2",
      link: "https://facebook.com/yourpage",
      angle: -90,
    },
    {
      id: 2,
      name: "Instagram",
      icon: <FaInstagram size={20} />,
      color: "#E4405F",
      link: "https://instagram.com/yourprofile",
      angle: -135,
    },
    {
      id: 3,
      name: "WhatsApp",
      icon: <FaWhatsapp size={20} />,
      color: "#25D366",
      link: "https://wa.me/919876543210",
      angle: -180,
    },
  ];


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setDarkMode(localStorage.getItem("theme") === "dark");
  }, [setIsThemeChanged]);


  // Dragging Handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - rel.x,
        y: e.clientY - rel.y,
      });
    };

    const handleMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, rel]);

  const startDrag = (e) => {
    e.preventDefault();
    setDragging(true);
    setRel({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const distance = 80; // expansion distance

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 2000,
        }}
      >
        {/* Social icons positioned relative to FAB */}
        {fabData.map((item) => (
          <OverlayTrigger
            key={item.id}
            placement="left"
            overlay={<Tooltip>{item.name}</Tooltip>}
          >
            <a
              href={item.link || "#"}
              onClick={(e) => {
                if (item.action) {
                  e.preventDefault();
                  item.action();
                }
              }}
              target={item.link ? "_blank" : "_self"}
              rel="noopener noreferrer"
              style={{
                position: "absolute",
                transform: open
                  ? `translate(${
                      distance * Math.cos((item.angle * Math.PI) / 180)
                    }px,
                                ${
                                  distance *
                                  Math.sin((item.angle * Math.PI) / 180)
                                }px)`
                  : "translate(0,0)",
                transition: "transform 0.3s ease, opacity 0.3s ease",
                width: "50px",
                height: "50px",
                backgroundColor: item.color,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                opacity: open ? 1 : 0,
                pointerEvents: open ? "auto" : "none",
              }}
            >
              {item.icon}
            </a>
          </OverlayTrigger>
        ))}

        {/* FAB main button */}
        <div
          onMouseDown={startDrag}
          onClick={() => !dragging && setOpen(!open)} // prevent auto open when dragging
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: darkMode ? "#fff":"#000" ,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
            transition: "background 0.3s",
          }}
          className="mb-3"
        >
          {open ? (
            <FaTimes className="text-danger" size={24} />
          ) : (
            <MdMessage className="text-danger" size={28} />
          )}
        </div>
      </div>
    </>
  );
}

export default FloatingContactMenu;
