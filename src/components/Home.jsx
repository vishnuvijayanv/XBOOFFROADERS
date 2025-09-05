import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaMoon, FaSun } from "react-icons/fa";
import { Carousel } from "react-bootstrap";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import AboutUs from "./AboutUs";
import Gallery from "./Gallery";
import NextRideBooking from "./NextRideBooking";
import Footer from "./Footer";
import FloatingContactMenu from "./FloatingContactMenu";
import { getSiteSettingsAPI } from "../services/allApi";
import PreviousRides from "./PreviousRides";

function Home(props) {
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : true;
  });
  const [images, setImages] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [galleryEnabled, setGalleryEnabled] = useState(false);
  const [previousRideEnabled, setPreviousRideEnabled] = useState(false);
  const [bookingEnabled, setBookingEnabled] = useState(false);
  const [carouselImages, setCarouselImages] = useState([img1, img2, img3]);
  const [term, setTerm] = useState("");
  const [termsList, setTermsList] = useState([]);
  const [contactsList, setContactsList] = useState([]);

  useEffect(() => {
    // Theme handling
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    if (props?.setIsThemeChanged) {
      props.setIsThemeChanged((prevState) => !prevState);
    }
  }, [darkMode]);

  useEffect(() => {
    // Load carousel images from localStorage
    const storedImages = localStorage.getItem("carouselImages");
    if (storedImages) {
      try {
        const parsed = JSON.parse(storedImages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCarouselImages(parsed);
        }
      } catch (err) {
        console.error("Failed to parse stored carousel images:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSiteSettingsAPI();
        if (result?.data) {
          const data1 = result.data;
          setImages(
            data1.data.carouselImages.map((img) => ({
              url: img.imageUrl,
              file: null,
            }))
          );

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

  return (
    <div
      id="home"
      className={darkMode ? "bg-dark text-white" : "bg-light text-dark"}
    >

      {isMobile && (
        <div className="position-absolute m-3" style={{ zIndex: 1000 }}>
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
        </div>
      )}
      {/* Inline animation styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          opacity: 0;
          animation: fadeInUp 1s ease forwards;
        }
      `}</style>

      {/* ✅ Carousel updated to use localStorage images */}
      <Carousel fade controls={false} indicators={false} interval={4000}>
        {carouselImages.map((img, idx) => (
          <Carousel.Item key={idx}>
            <div
              style={{
                height: "100vh",
                backgroundImage: `linear-gradient(${
                  darkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)"
                },
                  ${darkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)"}
                ), url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "0 1rem",
              }}
            >
              <h1
                className="fade-in"
                style={{
                  fontFamily: "'Teko', sans-serif",
                  fontSize: "4rem",
                  fontWeight: "bold",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
                  color: "#fff",
                  marginBottom: "1rem",
                  animationDelay: "0s",
                }}
              >
                Conquer the Terrain
              </h1>

              <p
                className="fade-in"
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: "1.3rem",
                  letterSpacing: "1px",
                  color: "#f3f3f3",
                  textShadow: "1px 1px 4px rgba(0,0,0,0.4)",
                  marginBottom: "2rem",
                  animationDelay: "0.3s",
                  animationFillMode: "forwards",
                }}
              >
                Discover the thrill of off-road biking. Performance, power, and
                passion in one ride.
              </p>

              <a
                href="#upcoming"
                className="btn btn-lg rounded-pill px-4 shadow-lg text-light fade-in"
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  letterSpacing: "1px",
                  backgroundColor: "#fc3b3b",
                  borderColor: "#fc3b3b",
                  transition: "transform 0.2s",
                  animationDelay: "0.6s",
                  animationFillMode: "forwards",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Book Now
              </a>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Sections */}
      <AboutUs id="aboutus" />
      {galleryEnabled && <Gallery />}
      {previousRideEnabled && <PreviousRides isThemeChanged={darkMode} />}
      {bookingEnabled && <NextRideBooking />}
      <Footer
        darkMode={darkMode}
        galleryEnabled={galleryEnabled}
        previousRideEnabled={previousRideEnabled}
        bookingEnabled={bookingEnabled}
        contactsList={props.contactsList}
      />
    </div>
  );
}

export default Home;
