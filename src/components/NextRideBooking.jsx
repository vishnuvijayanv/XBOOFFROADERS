import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaUpload } from "react-icons/fa";
import { getRidesAPI } from "../services/allApi";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { baseurl } from "../services/baseUrl";
import { toast, ToastContainer } from "react-toastify";
import { addBookingAPI } from "../services/allApi";
import { motion } from "framer-motion"; // ✅ Added for scroll animations

export default function RideBooking(props) {
  const [theme, setTheme] = useState("light");
  const [file, setFile] = useState(null);
  const [hasBooked, setHasBooked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    vehicleNumber: "",
    address: "",
    bloodGroup: "",
    mobile: "",
  });
  const [rides, setRides] = useState([]);
  const [storedUser, setStoredUser] = useState(null);

  // Get user details
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setStoredUser(user.logUser);
    }
  }, []);

  // Auto-fill form data
  useEffect(() => {
    if (storedUser) {
      setFormData({
        name: storedUser.name || "",
        place: storedUser.place || "",
        address: storedUser.address || "",
        mobile: storedUser.mobile || "",
        bloodGroup: storedUser.bloodGroup || "",
        vehicleNumber: storedUser.vehicleNumber || "",
      });
    }
  }, [storedUser]);

  // Get theme
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme || "light");
  }, [props]);

  // Fetch rides
  useEffect(() => {
    if (props) {
      fetchRides();
    }
  }, [props]);

  const fetchRides = async () => {
    try {
      const { data } = await getRidesAPI();
      setRides(data !== undefined ? data : []);
    } catch (err) {
      toast.error("Failed to fetch rides");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Booking
  const handleBook = async (rideId) => {
    if (!file) {
      toast.error("Please upload payment screenshot");
      return;
    }

    try {
      const bookingData = new FormData();
      bookingData.append("userId", storedUser._id);
      bookingData.append("name", formData.name);
      bookingData.append("place", formData.place);
      bookingData.append("vehicleNumber", formData.vehicleNumber);
      bookingData.append("address", formData.address);
      bookingData.append("bloodGroup", formData.bloodGroup);
      bookingData.append("mobile", formData.mobile);
      bookingData.append("rideId", rideId);
      bookingData.append("paymentScreenshot", file);

      const token = localStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      const response = await addBookingAPI(bookingData, reqHeader);

      if (response.status === 201) {
        toast.success("Booking request submitted successfully!");
        setHasBooked(true);
      } else {
        toast.error(response.response.data?.message || "Failed to book ride");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  // If booked already
  if (hasBooked) {
    return (
      <div
        className={`booking-container ${theme}`}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <DotLottieReact
          src="https://lottie.host/e1579969-fb84-4e1e-afd0-26b5deb1648d/PA9QrE2zR6.lottie"
          loop
          autoplay
        />
        <p className="p-3 d-flex justify-content-center">
          Please wait while the admin verifies your details. You’ll be notified
          shortly. Have a great day 🚴
        </p>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .ride-card {
          display: flex;
          flex-direction: column;
          margin-bottom: 30px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        @media(min-width: 768px) {
          .ride-card { flex-direction: row; }
        }
        .ride-left { flex: 1; }
        .ride-left img { width: 100%; height: 100%; object-fit: cover; }
        .ride-right { flex: 1; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; }
        .form-grid { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 20px; }
        @media(min-width: 600px) { .form-grid { grid-template-columns: 1fr 1fr; } }
        input { padding: 10px; border-radius: 8px; border: 1px solid #ccc; outline: none; background: inherit; }
        input:focus { border-color: #e50914; }
        .upload-btn { padding: 10px 15px; border: 1px solid #e50914; border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px; color: #e50914; }
        .book-btn { margin-top: 20px; width: 100%; padding: 12px; border: none; border-radius: 10px; background: #e50914; color: #fff; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.3s ease; }
        .book-btn:hover { background: #b71c1c; }
      `}</style>

      {rides && rides.length > 0 ? (
        rides.map((ride, idx) => (
          <motion.div
            id="upcoming"
            key={ride._id}
            className="ride-card"
            style={{
              background: theme === "dark" ? "#121212" : "#fff",
              color: theme === "dark" ? "#eee" : "#111",
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Left: Poster */}
            <div className="ride-left p-2">
              <img src={`${baseurl}${ride.poster}`} alt="Ride Poster" />
            </div>

            {/* Right: Details + Form */}
            <div className="ride-right">
              <div>
                <h2 style={{ color: "#e50914" }}>{ride.title}</h2>
                <p>{ride.description}</p>
                <div style={{ margin: "10px 0" }}>
                  <div style={{ marginBottom: "6px" }}>
                    <FaCalendarAlt style={{ color: "#e50914" }} />{" "}
                    {new Date(ride.startAt).toLocaleString()} -{" "}
                    {new Date(ride.endAt).toLocaleString()}
                  </div>
                  <div>
                    <FaMapMarkerAlt style={{ color: "#e50914" }} />{" "}
                    {ride.location} (Meeting Point: {ride.meetingPoint})
                  </div>
                </div>

                {ride.terms?.length > 0 && (
                  <div className="terms mt-2">
                    <h6>Terms & Conditions:</h6>
                    <ul>
                      {ride.terms.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Form */}
                <div className="form-grid">
                  {[
                    "name",
                    "place",
                    "vehicleNumber",
                    "address",
                    "bloodGroup",
                    "mobile",
                  ].map((field) => (
                    <input
                      key={field}
                      name={field}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      style={{
                        background: theme === "dark" ? "#1f1f1f" : "#fafafa",
                        color: theme === "dark" ? "#fff" : "#000",
                      }}
                    />
                  ))}
                </div>

                {/* QR & Upload */}
                <div style={{ marginTop: "20px" }}>
                  <h5
                    style={{
                      color: "#e50914",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Pay & Upload Screenshot
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <img
                      src={`${baseurl}${ride.paymentQR}`}
                      alt="QR Code"
                      style={{ width: "160px", borderRadius: "8px" }}
                    />
                  </div>
                  <label className="upload-btn mt-3">
                    <FaUpload /> {file ? file.name : "Upload Screenshot"}
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
              <button className="book-btn" onClick={() => handleBook(ride._id)}>
                Book Now
              </button>
            </div>
          </motion.div>
        ))
      ) : (
        <motion.section
          id="upcoming"
          className={`booking-wrapper booking-container ${theme} d-flex flex-column align-items-center justify-content-center text-center`}
          style={{
            minHeight: "60vh",
            background: theme === "dark" ? "rgb(18, 18, 18)" : "white",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <DotLottieReact
            autoplay
            loop
            src="https://lottie.host/69e8751a-455d-4a13-a73e-dc74f6f87384/NPBBauz5ay.lottie"
            style={{ width: "400px", marginBottom: "20px" }}
          />
          <h2 style={{ color: theme === "dark" ? "#ffffff" : "#222222" }}>
            No Upcoming Rides
          </h2>
          <p
            style={{
              maxWidth: "400px",
              color: theme === "dark" ? "#dddddd" : "#444444",
            }}
          >
            We’re preparing the next adventure for you. Stay tuned and check
            back soon!
          </p>
        </motion.section>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={theme}
      />
    </div>
  );
}
