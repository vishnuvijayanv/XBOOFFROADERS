import React, { useState, useEffect } from "react";
import logo from "../assets/img4.png";
import riderImage from "../assets/loader-logo.jpg";
import { registerAPI, loginAPI } from "../services/allApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showTerms, setShowTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    place: "",
    vehicleNumber: "",
    address: "",
    bloodGroup: "",
    mobile: "",
    password: "",
    agreed: false,
    UTYPE: "NRML",
    License: "",
    profile: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};
    if (isRegister) {
      if (!formData.name || formData.name.length < 2)
        newErrors.name = "Name is required";
      if (!formData.place) newErrors.place = "Place is required";
      if (
        !formData.vehicleNumber ||
        !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{1,4}$/i.test(formData.vehicleNumber)
      ) {
        newErrors.vehicleNumber =
          "Enter valid vehicle number (e.g. KL01AB1234)";
      }
      if (!formData.address || formData.address.length < 5)
        newErrors.address = "Address is required";
      if (
        !formData.bloodGroup ||
        !/^(A|B|AB|O)[+-]$/i.test(formData.bloodGroup)
      ) {
        newErrors.bloodGroup = "Enter valid blood group (e.g. A+, O-)";
      }
    }
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter valid 10-digit mobile number";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (isRegister && !formData.agreed) {
      newErrors.agreed = "You must agree to Terms & Conditions";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        if (isRegister) {
          const result = await registerAPI(formData);
          if (result.status >= 200 && result.status < 300) {
            toast.success(`${result.data.name} successfully registered!`);
            setFormData({
              name: "",
              place: "",
              vehicleNumber: "",
              address: "",
              bloodGroup: "",
              mobile: "",
              password: "",
              agreed: false,
              UTYPE: "NRML",
              License: "",
              Profile: "",
            });
            setIsRegister(false);
          } else {
            toast.error(result.response?.data || "Registration failed");
          }
        } else {
          let data = {
            mobile: formData.mobile,
            password: formData.password,
          };
          const result = await loginAPI(data);
          console.log(result.response?.data);
          if (result.status >= 200 && result.status < 300) {
            toast.success(`Welcome ${result.data.name || "User"}!`);
            console.log(result.data.token);

            // store token or navigate
            localStorage.setItem("user", JSON.stringify(result.data));
            localStorage.setItem("TOKEN", JSON.stringify(result.data.token));
            navigate("./home");
          } else {
            toast.error(result.response?.data);
          }
        }
      } catch (err) {
        toast.error(err.response?.data || "Something went wrong");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fff",
        padding: isMobile ? "20px" : "60px 100px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: "500px",
          width: "100%",
          padding: isMobile ? "20px" : "0",
        }}
      >
        {isMobile && (
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <img
              src={logo}
              alt="logo"
              style={{ height: "60px", borderRadius: "50%" }}
            />
          </div>
        )}

        <h2
          style={{
            textAlign: "left",
            color: "#f44336",
            marginBottom: "20px",
            fontSize: "2rem",
            borderBottom: "4px solid #f44336",
            display: "inline-block",
          }}
        >
          {isRegister ? "Register" : "Login"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {isRegister && (
            <>
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <Input
                label="Place"
                name="place"
                value={formData.place}
                onChange={handleChange}
                error={errors.place}
              />
              <Input
                label="Vehicle Number"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                error={errors.vehicleNumber}
              />
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
              <Input
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                error={errors.bloodGroup}
              />
            </>
          )}
          <Input
            label="Mobile Number"
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={handleChange}
            error={errors.mobile}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          {isRegister && (
            <label
              style={{
                fontSize: "0.9rem",
                color: "#333",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                name="agreed"
                checked={formData.agreed}
                onChange={handleChange}
                style={{ marginRight: "8px" }}
              />
              I agree to the
              <span
                onClick={() => setShowTerms(true)}
                style={{
                  color: "#f44336",
                  marginLeft: "5px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Terms and Conditions
              </span>
            </label>
          )}
          {errors.agreed && (
            <span style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.agreed}
            </span>
          )}

          <button
            type="submit"
            disabled={isRegister && !formData.agreed}
            style={{
              backgroundColor:
                isRegister && !formData.agreed ? "#ccc" : "#f44336",
              color: "#fff",
              padding: "14px",
              border: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "6px",
              cursor:
                isRegister && !formData.agreed ? "not-allowed" : "pointer",
              transform: "skewX(-10deg)",
            }}
          >
            {isRegister ? "Register" : "Login"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
            {isRegister ? "Already registered?" : "New here?"}
            <span
              onClick={() => {
                setErrors({});
                setIsRegister(!isRegister);
              }}
              style={{
                color: "#f44336",
                marginLeft: "6px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </p>
        </form>
      </div>

      {!isMobile && (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={riderImage}
            alt="bike rider"
            style={{
              maxWidth: "500px",
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {showTerms && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "500px",
              background: "#fff",
              padding: "30px",
              borderRadius: "15px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ color: "#f44336", marginBottom: "15px" }}>
              Terms and Conditions
            </h3>
            <p
              style={{ fontSize: "0.95rem", color: "#333", lineHeight: "1.5" }}
            >
              • All bikes are allowed.
              <br />
              • Valid documents required.
              <br />
              • Helmet, shoes, and riding gear required.
              <br />• Rash driving = disqualification.
            </p>
            <button
              onClick={() => setShowTerms(false)}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text", error }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <input
      type={type}
      name={name}
      placeholder={`Enter ${label}`}
      value={value}
      onChange={onChange}
      style={{
        padding: "12px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        background: "#f5f5f5",
        fontSize: "1rem",
      }}
    />
    {error && <span style={{ color: "red", fontSize: "0.8rem" }}>{error}</span>}
  </div>
);

export default Register;
