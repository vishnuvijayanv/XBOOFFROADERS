// PreviousRides.jsx
import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getPreviousRides } from "../services/allApi";
import { baseurl } from "../services/baseUrl";
import { motion } from "framer-motion"; // ✅ Animation

function PreviousRides(props) {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [defaultReviewCount, setDefaultReviewCount] = useState(3);

  // 🚴 Ride display limit
  const [showAllRides, setShowAllRides] = useState(false);
  const [defaultRideCount, setDefaultRideCount] = useState(3);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme || "light");
  }, [props]);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await getPreviousRides();
      if (response?.data) {
        setRides(response.data);
      } else {
        setRides([]);
      }
    } catch (error) {
      console.error("Error fetching previous rides:", error);
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  // 📱 Responsive review & ride count
  useEffect(() => {
    const updateCounts = () => {
      if (window.innerWidth < 768) {
        setDefaultReviewCount(3);
        setDefaultRideCount(3);
      } else {
        setDefaultReviewCount(8);
        setDefaultRideCount(8);
      }
    };

    updateCounts();
    window.addEventListener("resize", updateCounts);

    return () => window.removeEventListener("resize", updateCounts);
  }, []);

  const openModal = (args) => {
    setSelectedRide(args);
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme);
  };

  return (
    <div
      id="previous"
      className="py-5 container-fluid"
      style={{
        backgroundColor: theme === "dark" ? "#0d0d0d" : "rgb(255, 255, 255)",
        minHeight: "100vh",
      }}
    >
      {/* Title */}
      <motion.h2
        style={{
          fontSize: "2.5rem",
          fontWeight: 800,
          marginBottom: 50,
          textAlign: "center",
          color: theme === "dark" ? "#fff" : "#222",
          letterSpacing: "1px",
          textTransform: "uppercase",
          position: "relative",
        }}
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <span style={{ color: "#e63737" }}>✦</span> Adventure Memories{" "}
        <span style={{ color: "#e63737" }}>✦</span>
        <div
          style={{
            width: 80,
            height: 4,
            background: "red",
            margin: "10px auto 0",
            borderRadius: 2,
          }}
        ></div>
      </motion.h2>

      {/* Loader */}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spinner animation="border" variant="danger" />
        </div>
      ) : rides.length === 0 ? (
        <motion.p
          style={{
            textAlign: "center",
            color: theme === "dark" ? "#aaa" : "#555",
            fontSize: "1.2rem",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          🚴 No adventures completed yet. Be the first to create memories!
        </motion.p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              padding: "0 1rem",
            }}
          >
            {rides
              .slice(0, showAllRides ? rides.length : defaultRideCount)
              .map((ride, index) => (
                <motion.div
                  key={ride._id}
                  onClick={() => openModal(ride)}
                  style={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                    backgroundColor: "#000",
                    color: "#fff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {/* Background Image */}
                  <img
                    src={
                      ride.poster
                        ? `${baseurl}${ride.poster}`
                        : "https://via.placeholder.com/400x200?text=Adventure+Ride"
                    }
                    alt={ride.title}
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                      filter: "brightness(75%)",
                      transition: "0.3s ease-in-out",
                    }}
                  />

                  {/* Overlay Text */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "1.2rem",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))",
                      color: "#fff",
                    }}
                  >
                    <h4 style={{ fontWeight: 700, marginBottom: "5px" }}>
                      {ride.title}
                    </h4>
                    <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                      {ride.location} | Ended on{" "}
                      {new Date(ride.endAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      left: "15px",
                      background: "red",
                      color: "#fff",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      padding: "6px 12px",
                      borderRadius: "50px",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
                    }}
                  >
                    Completed
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Show More/Less button */}
          {rides.length > defaultRideCount && (
            <div className="text-center mt-4">
              <motion.button
                onClick={() => setShowAllRides(!showAllRides)}
                style={{
                  border: "none",
                  background: "none",
                  color: "red",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAllRides ? "Show Less ▲" : "Show More ▼"}
              </motion.button>
            </div>
          )}
        </>
      )}

      {/* Ride Details Modal */}
      <Modal
        show={!!selectedRide}
        onHide={() => setSelectedRide(null)}
        centered
        size="lg"
        contentClassName={theme === "dark" ? "bg-dark text-white" : ""}
      >
        {selectedRide && (
          <>
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "red", fontWeight: 700 }}>
                {selectedRide.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <motion.img
                src={
                  selectedRide.poster
                    ? `${baseurl}${selectedRide.poster}`
                    : "https://via.placeholder.com/600x300?text=Adventure+Ride"
                }
                alt={selectedRide.title}
                style={{
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "1.2rem",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h5 style={{ color: "red", marginBottom: "1rem" }}>
                  🌍 Adventure Recap
                </h5>
                <p>
                  <strong>📍 Location:</strong> {selectedRide.location}
                </p>
                <p>
                  <strong>📌 Meeting Point:</strong> {selectedRide.meetingPoint}
                </p>
                <p>
                  <strong>🕒 Start:</strong>{" "}
                  {new Date(selectedRide.startAt).toLocaleString()}
                </p>
                <p>
                  <strong>🏁 End:</strong>{" "}
                  {new Date(selectedRide.endAt).toLocaleString()}
                </p>
                <p style={{ marginTop: "1rem" }}>{selectedRide.description}</p>
              </motion.div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
}

export default PreviousRides;
