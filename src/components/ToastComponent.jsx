// ToastNotification.jsx
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const ToastNotification = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: type === "success" ? "#28a745" : "#dc3545",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        zIndex: 9999,
        fontFamily: "'Russo One', sans-serif",
        minWidth: "250px",
        maxWidth: "400px",
      }}
    >
      {message}
    </div>
  );
};

export default ToastNotification;
