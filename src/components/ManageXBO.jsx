import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Trash2, PlusCircle, Upload, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addSiteSettingsAPI, getSiteSettingsAPI } from "../services/allApi"; // 🔹 import APIs

function ManageXBO(props) {
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : true;
  });

  const [images, setImages] = useState([]);
  const [galleryEnabled, setGalleryEnabled] = useState(false);
  const [previousRideEnabled, setPreviousRideEnabled] = useState(false);
  const [bookingEnabled, setBookingEnabled] = useState(false);
  const [term, setTerm] = useState("");
  const [termsList, setTermsList] = useState([]);

  const [selectedIcon, setSelectedIcon] = useState("");
  const [contactDetail, setContactDetail] = useState("");
  const [contactsList, setContactsList] = useState([]);

  // ✅ Load settings from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSiteSettingsAPI();
        if (result?.data) {
          const data1 = result.data;
          console.log(data1.data.carouselImages );

          setImages(
            data1.data.carouselImages.map((img) => ({
              url: img.imageUrl,
              file: null,
            }))
          );

          setGalleryEnabled(data1.data.enabledSections?.gallery || false);
          setPreviousRideEnabled(data1.data.enabledSections?.previousRides || false);
          setBookingEnabled(data1.data.enabledSections?.booking || false);

          setTermsList(data1.data.termsAndConditions || []);
          setContactsList(data1.data.contact || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load site settings");
      }
    };

    fetchData();
  }, []);

  const handleAddContact = () => {
    if (!selectedIcon || contactDetail.trim() === "") {
      toast.warning("Please select an icon and enter detail before adding.");
      return;
    }
    setContactsList([
      ...contactsList,
      { type: selectedIcon, value: contactDetail },
    ]);
    setContactDetail("");
    setSelectedIcon("");
  };

  const getIcon = (type) => {
    switch (type) {
      case "phone":
        return "📞";
      case "mail":
        return "✉️";
      case "whatsapp":
        return "💬";
      case "facebook":
        return "📘";
      case "instagram":
        return "📸";
      case "linkedin":
        return "🔗";
      case "twitter":
        return "🐦";
      default:
        return "🔗";
    }
  };

  useEffect(() => {
    setDarkMode(localStorage.getItem("theme") === "dark");
  }, [props.isThemeChanged]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      toast.warning("You can upload a maximum of 3 images.");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTerm = () => {
    if (term.trim() !== "") {
      setTermsList([...termsList, term.trim()]);
      setTerm("");
    }
  };

  // ✅ Save settings to backend
  const handleSave = async () => {
    // if (images.length < 3) {
    //   toast.warning("Add 3 images for carousel.");
    //   return;
    // }

    const schema = {
      carouselImages: images.map((img) => ({
        imageUrl: img.url, // if uploaded, this should later come from backend storage
        caption: "",
      })),
      termsAndConditions: termsList,
      contact: contactsList,
      enabledSections: {
        gallery: galleryEnabled,
        previousRides: previousRideEnabled,
        booking: bookingEnabled,
      },
    };

    try {
      const result = await addSiteSettingsAPI(schema, {
        "Content-Type": "application/json",
      });
      if (result.status === 200 || result.status === 201) {
        toast.success("Site settings saved successfully!");
      } else {
        toast.error(result.response.data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving site settings.");
    }
  };

  return (
    <div className="container py-4">
      {/* Image Uploader */}
      {/* <div
        className={`card shadow-lg border rounded border-info mb-4 ${
          darkMode ? "bg-dark text-light" : "bg-white"
        }`}
      >
        <div
          className={`card-header fw-bold ${
            darkMode ? "bg-secondary text-light" : "bg-light"
          }`}
        >
          <Upload size={18} className="me-2" />
          Carousel Images
        </div>
        <div className="card-body">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="form-control"
          />
          <small className="text-muted d-block mt-2">
            Upload max 3 images for carousel
          </small>

          {images.length > 0 && (
            <Carousel
              className="mt-4 shadow-sm rounded"
              data-bs-theme={darkMode ? "dark" : "light"}
            >
              {images.map((img, index) => (
                <Carousel.Item key={index}>
                  <div className="position-relative">
                    <img
                      src={img.url}
                      alt={`carousel-${index}`}
                      className="d-block w-100 rounded"
                      style={{ maxHeight: "400px", objectFit: "cover" }}
                    />

                    <button
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow"
                      style={{ zIndex: 10 }} // make sure button is above image
                      onClick={(e) => {
                        e.stopPropagation(); // prevent carousel drag/swipe
                        e.preventDefault(); // prevent unwanted default behavior
                        removeImage(index);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </div>
      </div> */}

      {/* Toggle Section */}
      <div
        className={`card shadow-lg border rounded border-info mb-4 ${
          darkMode ? "bg-dark text-light " : "bg-white"
        }`}
      >
        <div
          className={`card-header fw-bold ${
            darkMode ? "bg-secondary text-light" : "bg-light"
          }`}
        >
          Features
        </div>
        <div className="card-body">
          {[
            {
              label: "Enable Gallery",
              state: galleryEnabled,
              setter: setGalleryEnabled,
            },
            {
              label: "Enable Previous Ride",
              state: previousRideEnabled,
              setter: setPreviousRideEnabled,
            },
            {
              label: "Enable Booking",
              state: bookingEnabled,
              setter: setBookingEnabled,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              <span>{item.label}</span>
              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={item.state}
                  onChange={() => item.setter(!item.state)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div
        className={`card shadow-lg border rounded border-info mb-4 ${
          darkMode ? "bg-dark text-light" : "bg-white"
        }`}
      >
        <div
          className={`card-header fw-bold ${
            darkMode ? "bg-secondary text-light" : "bg-light"
          }`}
        >
          Terms & Conditions
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <textarea
              className="form-control"
              rows="2"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Write a term..."
            />
            <button
              type="button"
              onClick={handleAddTerm}
              className="btn btn-primary"
            >
              Add
            </button>
          </div>

          {termsList.length > 0 && (
            <ul className="list-group list-group-flush">
              {termsList.map((t, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {t}
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      setTermsList(termsList.filter((_, i) => i !== index))
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div
        className={`card shadow-lg border rounded border-info ${
          darkMode ? "bg-dark text-light" : "bg-white"
        }`}
      >
        <div
          className={`card-header fw-bold ${
            darkMode ? "bg-secondary text-light" : "bg-light"
          }`}
        >
          Contact Section
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <select
              className="form-select"
              value={selectedIcon}
              onChange={(e) => setSelectedIcon(e.target.value)}
            >
              <option value="">Choose Icon</option>
              <option value="phone">📞 Phone</option>
              <option value="mail">✉️ Mail</option>
              <option value="whatsapp">💬 WhatsApp</option>
              <option value="facebook">📘 Facebook</option>
              <option value="instagram">📸 Instagram</option>
              <option value="linkedin">🔗 LinkedIn</option>
              <option value="twitter">🐦 Twitter</option>
            </select>
            <input
              type="text"
              className="form-control"
              value={contactDetail}
              onChange={(e) => setContactDetail(e.target.value)}
              placeholder="Enter detail or URL..."
            />
            <button
              type="button"
              onClick={handleAddContact}
              className="btn btn-success"
            >
              <PlusCircle size={18} className="me-1" /> Add
            </button>
          </div>

          {contactsList.length > 0 && (
            <div className="d-flex flex-wrap gap-2">
              {contactsList.map((c, index) => (
                <div
                  key={index}
                  className="badge rounded-pill bg-light text-dark border d-flex align-items-center px-3 py-2 shadow-sm"
                >
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-dark me-2"
                  >
                    {getIcon(c.type)} {c.url}
                  </a>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger p-0"
                    onClick={() =>
                      setContactsList(
                        contactsList.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        style={{
          marginTop: "24px",
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          border: "none",
          background: "green",
          color: "#fff",
          fontWeight: "700",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
        onClick={handleSave}
      >
        Save Changes
      </button>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={darkMode?"dark":"light"}
      />
    </div>
  );
}

export default ManageXBO;
