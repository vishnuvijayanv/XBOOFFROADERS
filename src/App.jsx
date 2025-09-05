import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loader from "./components/Loader";
import Register from "./components/Register";
import Home from "./components/Home";
import Header from "./components/Header";
import BottomNavBar from "./components/BottomNavBar";
import AboutUs from "./components/AboutUs";
import Gallery from "./components/Gallery";
import PreviousRides from "./components/PreviousRides";
import { getSiteSettingsAPI } from "./services/allApi";
import "sweetalert2/dist/sweetalert2.min.css";
import { getFCMToken, onMessageListener } from "./firebase";
import { registerFcmTokenAPI, removeFcmTokenAPI } from "./services/allApi";
import { toast } from "react-toastify"; // ✅ add this

// ✅ Reusable Protected Route Component
function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("user");
  return isLoggedIn ? children : <Navigate to="/register" replace />;
}

function AppWrapper() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const [isThemeChanged, setIsThemeChanged] = useState(false);
  const [images, setImages] = useState([]);
  const [galleryEnabled, setGalleryEnabled] = useState(false);
  const [previousRideEnabled, setPreviousRideEnabled] = useState(false);
  const [bookingEnabled, setBookingEnabled] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);
  const [term, setTerm] = useState("");
  const [termsList, setTermsList] = useState([]);
  const [contactsList, setContactsList] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, [location]);

  const showLayout = location.pathname === "/" && isLoggedIn;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSiteSettingsAPI();
        if (result?.data) {
          const data1 = result.data;
          // setImages(
          //   data1.data.carouselImages.map((img) => ({
          //     url: img.imageUrl,
          //     file: null,
          //   }))
          // );

          setGalleryEnabled(data1.data.enabledSections?.gallery || false);
          setPreviousRideEnabled(
            data1.data.enabledSections?.previousRides || false
          );
          setBookingEnabled(data1.data.enabledSections?.booking || false);

          setTermsList(data1.data.termsAndConditions || []);
          setContactsList(data1.data.contact || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const registerFcm = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.logUser?._id) return;

      try {
        const token = await getFCMToken(() => {});
        if (token) {
          await registerFcmTokenAPI(
            { userId: user.logUser._id, token },
            {} // optional headers if you need auth
          );
          console.log("✅ FCM token registered:", token);
        }
      } catch (err) {
        console.error("❌ Error registering FCM token:", err);
      }
    };

    if (isLoggedIn) registerFcm();
  }, [isLoggedIn]);

  // On logout remove token
  const handleLogout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.logUser?._id) {
      await removeFcmTokenAPI({ userId: user.logUser._id });
    }
    localStorage.clear();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    onMessageListener((payload) => {
      console.log("Notification received in foreground:", payload);
      toast.info(
        <div>
          <strong>{payload.notification?.title}</strong>
          <div>{payload.notification?.body}</div>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );
    });
  }, []);


  return (
    <>
      {showLayout && !isMobile && (
        <Header
          setIsThemeChanged={setIsThemeChanged}
          isThemeChanged={isThemeChanged}
          galleryEnabled={galleryEnabled}
          previousRideEnabled={previousRideEnabled}
          bookingEnabled={bookingEnabled}
        />
      )}
      {showLayout && isMobile && (
        <BottomNavBar
          isThemeChanged={isThemeChanged}
          galleryEnabled={galleryEnabled}
          previousRideEnabled={previousRideEnabled}
          bookingEnabled={bookingEnabled}
        />
      )}
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#fff",
            color: "#000",
            padding: "10px 15px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          <h4>{notification.title}</h4>
          <p>{notification.body}</p>
        </div>
      )}

      <Routes>
        {/* Public route */}
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home
                isThemeChanged={isThemeChanged}
                setIsThemeChanged={setIsThemeChanged}
                contactsList={contactsList}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aboutus"
          element={
            <ProtectedRoute>
              <AboutUs isThemeChanged={isThemeChanged} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Gallery isThemeChanged={isThemeChanged} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/previous"
          element={
            <ProtectedRoute>
              <PreviousRides isThemeChanged={isThemeChanged} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/" : "/register"} />}
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Router>
      <div style={{ backgroundColor: "#000", minHeight: "100vh" }}>
        <AppWrapper />
      </div>
    </Router>
  );
}

export default App;
