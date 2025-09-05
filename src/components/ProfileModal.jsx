import { useState, useEffect } from "react";
import {
  X,
  Edit,
  History,
  Users,
  ToggleLeft,
  CalendarClock,
} from "lucide-react";
import {
  updateProfileAPI,
  getProfileAPI,
  getAllUsersAPI,
} from "../services/allApi";
import { ToastContainer, toast } from "react-toastify"; // added
import "react-toastify/dist/ReactToastify.css"; // added
import { baseurl } from "../services/baseUrl";
import ManageXBO from "./ManageXBO";
import AddRide from "./AddRide";
import RideHistory from "./History";

const ProfileModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [licenseImage, setLicenseImage] = useState(null);
  const [uType, setUType] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [sections, setSections] = useState({
    about: true,
    gallery: true,
    previous: true,
    upcoming: true,
  });
  const [usersList, setUsersList] = useState([]);
  const [siteFooter, setSiteFooter] = useState({
    address: "",
    email: "",
    phone: "",
    copyright: "",
  });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    setTheme(localStorage.getItem("theme"));
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) handleGetProfile();
  }, [isOpen]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.logUser) {
      setUType(storedUser.logUser.UTYPE || "NRML");
      if (storedUser.logUser.UTYPE === "ADMIN" && isOpen) {
        fetchUsers();
      }
    }
    setCarouselImages(JSON.parse(localStorage.getItem("carouselImages")) || []);
    setSections(JSON.parse(localStorage.getItem("siteSections")) || sections);
    setUsersList(JSON.parse(localStorage.getItem("usersList")) || []);
    setSiteFooter(JSON.parse(localStorage.getItem("siteFooter")) || siteFooter);
    setUpcomingBookings(
      JSON.parse(localStorage.getItem("upcomingBookings")) || []
    );
  }, [isOpen]);

  if (!isOpen) return null;

  const colors = {
    bg: theme === "dark" ? "#000" : "#fff",
    bgAlt: theme === "dark" ? "#111" : "#f8f9fa",
    text: theme === "dark" ? "#fff" : "#000",
    border: "#e50914",
    tabInactive: theme === "dark" ? "#bbb" : "#555",
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      const updatedUser = { ...profileData, Profile: reader.result };
      setProfileData(updatedUser);
      localStorage.setItem("user", JSON.stringify({ logUser: updatedUser }));
    };
    reader.readAsDataURL(file);
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLicenseImage(reader.result);
      const updatedUser = { ...profileData, License: reader.result };
      setProfileData(updatedUser);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/register";
  };

  const validateFields = () => {
    const requiredFields = [
      "name",
      "mobile",
      "address",
      "place",
      "bloodGroup",
      "vehicleNumber",
    ];

    for (let field of requiredFields) {
      const input = document.querySelector(`[name="${field}"]`);
      if (!input || !input.value.trim()) {
        toast.error(`Please fill ${field} field`);
        return false;
      }
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateFields()) {
      toast.warning("Please fill all required fields before saving.");
      return; // stop if validation fails
    }
    try {
      const updatedProfile = { ...profileData };
      const reqBody = new FormData();

      const fields = [
        "name",
        "place",
        "vehicleNumber",
        "address",
        "bloodGroup",
        "mobile",
        "agreed",
        "password",
        "UTYPE",
      ];

      fields.forEach((field) => {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
          if (input.type === "checkbox") {
            reqBody.append(field, input.checked);
            updatedProfile[field] = input.checked;
          } else {
            reqBody.append(field, input.value);
            updatedProfile[field] = input.value;
          }
        }
      });

      const licenseFile = document.querySelector('[name="License"]')?.files[0];
      if (licenseFile) reqBody.append("License", licenseFile);

      const profileFile = document.querySelector('[name="Profile"]')?.files[0];
      if (profileFile) reqBody.append("Profile", profileFile);

      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = JSON.parse(localStorage.getItem("TOKEN"));
      const reqHeader = { Authorization: `Bearer ${token}` };

      const result = await updateProfileAPI(
        storedUser.logUser._id,
        reqBody,
        reqHeader
      );

      if (result.status === 200) {
        toast.success("Your profile has been updated successfully!");
        handleGetProfile();
      } else {
        toast.error("Unable to update your profile. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating your profile.");
    }
  };

  const handleGetProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser?.logUser?._id) {
        toast.error("User information not found. Please log in again.");
        return;
      }

      const token = JSON.parse(localStorage.getItem("TOKEN"));
      const reqHeader = { Authorization: `Bearer ${token}` };

      const result = await getProfileAPI(storedUser.logUser._id, reqHeader);

      if (result.status === 200) {
        const latestData = result.data;
        setProfileData(latestData);
        if (latestData.Profile)
          setProfileImage(
            latestData.Profile.length > 0
              ? `${baseurl}/${latestData.Profile}`
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          );
        if (latestData.License)
          setLicenseImage(
            latestData.License.length > 0
              ? `${baseurl}/${latestData.License}`
              : null
          );
      } else {
        toast.error("Unable to fetch your profile. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching your profile.");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await getAllUsersAPI(reqHeader);

      if (response.status === 200) {
        setUsersList(response.data); // ✅ update state with users
        localStorage.setItem("usersList", JSON.stringify(response.data));
      }
    } catch (err) {
      if (err.response) {
        console.error("Error fetching users:", err.response.data);
        toast.error(err.response.data);
      } else {
        console.error("Error fetching users:", err.message);
        toast.error("Something went wrong while fetching users");
      }
    }
  };

const tabs = [
  { id: "edit", label: "Edit Profile", icon: Edit },
  ...(uType === "ADMIN"
    ? [
        { id: "users", label: "Users", icon: Users },
        { id: "manage", label: "Manage Site", icon: ToggleLeft },
        { id: "upload", label: "Upload New", icon: CalendarClock },
      ]
    : []),
  { id: "rides", label: "Previous Rides", icon: History },
];

  return (
    <div
      className="profile-modal-container"
      style={{
        position: "fixed",
        inset: 0,
        background: colors.bg,
        color: colors.text,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "15px",
          background: colors.bg,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${colors.border}`,
        }}
      >
        <h3 style={{ margin: 0 }}>My Profile</h3>
        <X onClick={onClose} style={{ cursor: "pointer" }} />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "10px",
          background: colors.bgAlt,
          padding: "8px 10px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              borderRadius: "50px",
              border: "none",
              background:
                activeTab === tab.id
                  ? "linear-gradient(90deg, #e50914, #ff1e2d)"
                  : "transparent",
              color: activeTab === tab.id ? "#fff" : colors.tabInactive,
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: activeTab === "upload" ? "0px" : "20px",
          background: colors.bgAlt,
        }}
      >
        {/* Edit Profile */}
        {activeTab === "edit" && profileData && (
          <div
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              borderRadius: "20px",
              overflow: "hidden",
              fontFamily: "system-ui, sans-serif",
              background: theme === "dark" ? "#121212" : "#ffffff",
              boxShadow:
                theme === "dark"
                  ? "0 4px 20px rgba(0,0,0,0.8)"
                  : "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            {/* Cover Image */}
            <div
              style={{
                position: "relative",
                height: "160px",
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Profile Picture */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-55px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  textAlign: "center",
                }}
              >
                <label style={{ cursor: "pointer" }}>
                  <img
                    src={
                      profileImage ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Profile"
                    style={{
                      width: "110px",
                      height: "110px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `4px solid ${
                        theme === "dark" ? "#121212" : "#fff"
                      }`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    }}
                  />
                  <input
                    name="Profile"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleProfilePicChange}
                  />
                </label>
                <p
                  style={{ fontSize: "13px", marginTop: "6px", color: "#aaa" }}
                >
                  Tap to change photo
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: "80px 24px 28px" }}>
              <h3
                style={{
                  textAlign: "center",
                  marginBottom: "22px",
                  color: theme === "dark" ? "#fff" : "#222",
                }}
              >
                Edit Profile
              </h3>

              {/* Inputs */}
              <div
                style={{
                  display: "grid",
                  gap: "16px",
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                {[
                  {
                    name: "name",
                    placeholder: "Full Name",
                    value: profileData.name,
                  },
                  {
                    name: "mobile",
                    placeholder: "Mobile Number",
                    value: profileData.mobile,
                  },
                  {
                    name: "address",
                    placeholder: "Address",
                    value: profileData.address,
                  },
                  {
                    name: "place",
                    placeholder: "Place",
                    value: profileData.place,
                  },
                  {
                    name: "bloodGroup",
                    placeholder: "Blood Group",
                    value: profileData.bloodGroup,
                  },
                  {
                    name: "vehicleNumber",
                    placeholder: "Vehicle Number",
                    value: profileData.vehicleNumber,
                  },
                ].map((field, idx) => (
                  <input
                    key={idx}
                    name={field.name}
                    type="text"
                    defaultValue={field.value}
                    placeholder={field.placeholder}
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      border: `1px solid ${theme === "dark" ? "#333" : "#ccc"}`,
                      fontSize: "15px",
                      background: theme === "dark" ? "#1e1e1e" : "#fafafa",
                      color: theme === "dark" ? "#eee" : "#222",
                      outline: "none",
                      width: "100%",
                    }}
                  />
                ))}
              </div>

              {/* License Upload */}
              <div style={{ marginTop: "20px" }}>
                <label
                  style={{
                    fontWeight: "600",
                    marginBottom: "8px",
                    display: "block",
                    fontSize: "14px",
                  }}
                >
                  Upload License
                </label>
                <input
                  name="License"
                  type="file"
                  accept="image/*"
                  onChange={handleLicenseChange}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${theme === "dark" ? "#333" : "#ccc"}`,
                    borderRadius: "12px",
                    background: theme === "dark" ? "#1e1e1e" : "#fff",
                    cursor: "pointer",
                  }}
                />
                {licenseImage !== null && (
                  <div style={{ marginTop: "14px", textAlign: "center" }}>
                    <img
                      src={licenseImage}
                      alt="License Preview"
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: `2px solid ${
                          theme === "dark" ? "#444" : "#ddd"
                        }`,
                        boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <button
                style={{
                  marginTop: "24px",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(90deg, #07b312, #0fdc0f)",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                style={{
                  marginTop: "14px",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(90deg, #ff1e2d, #e50914)",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {activeTab === "users" && uType === "ADMIN" && (
          <div>
            <h3 style={{ marginBottom: "20px" }}>👥 Manage Users</h3>

            {usersList.length > 0 ? (
              <div
                style={{
                  overflowX: "auto",
                  background: colors.bg,
                  borderRadius: "12px",
                  padding: "10px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    color: colors.text,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: colors.bgAlt,
                        color: colors.text,
                        textAlign: "left",
                      }}
                    >
                      <th style={{ padding: "10px" }}>Profile</th>
                      <th style={{ padding: "10px" }}>Name</th>
                      <th style={{ padding: "10px" }}>Mobile</th>
                      <th style={{ padding: "10px" }}>Vehicle</th>
                      <th style={{ padding: "10px" }}>Blood</th>
                      <th style={{ padding: "10px" }}>Address</th>
                      <th style={{ padding: "10px" }}>License</th>
                      <th style={{ padding: "10px" }}>Type</th>
                      {/* <th style={{ padding: "10px" }}>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user) => (
                      <tr
                        key={user._id}
                        style={{ borderBottom: "1px solid #444" }}
                      >
                        {/* Profile Image */}
                        <td style={{ padding: "10px" }}>
                          <div style={{ position: "relative" }}>
                            <img
                              src={
                                user.Profile?.[0]
                                  ? `${baseurl}/${user.Profile[0]}`
                                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                              }
                              alt="profile"
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                setFullscreenImage(
                                  user.Profile?.[0]
                                    ? `${baseurl}/${user.Profile[0]}`
                                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                )
                              }
                            />
                          </div>
                        </td>

                        {/* Normal columns */}
                        <td style={{ padding: "10px" }}>{user.name}</td>
                        <td style={{ padding: "10px" }}>{user.mobile}</td>
                        <td style={{ padding: "10px" }}>
                          {user.vehicleNumber}
                        </td>
                        <td style={{ padding: "10px" }}>{user.bloodGroup}</td>
                        <td style={{ padding: "10px" }}>{user.address}</td>

                        {/* License Image */}
                        <td style={{ padding: "10px" }}>
                          <img
                            src={
                              user.License?.[0]
                                ? `${baseurl}/${user.License[0]}`
                                : "https://via.placeholder.com/100x60?text=No+License"
                            }
                            alt="license"
                            style={{
                              width: "100px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setFullscreenImage(
                                user.License?.[0]
                                  ? `${baseurl}/${user.License[0]}`
                                  : "https://via.placeholder.com/100x60?text=No+License"
                              )
                            }
                          />
                        </td>

                        {/* UTYPE */}
                        <td style={{ padding: "10px" }}>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "8px",
                              fontWeight: "600",
                              fontSize: "13px",
                              background:
                                user.UTYPE === "ADMIN" ? "#07b312" : "#666",
                              color: "#fff",
                            }}
                          >
                            {user.UTYPE === "ADMIN" ? "Admin" : "Normal"}
                          </span>
                        </td>

                        {/* Actions */}
                        {/* <td style={{ padding: "10px" }}>
                          <button
                            style={{
                              background: "#e50914",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              color: "#fff",
                              cursor: "pointer",
                              marginRight: "6px",
                            }}
                            onClick={() => toast.info(`Delete ${user.name}`)}
                          >
                            Delete
                          </button>
                          {user.UTYPE !== "ADMIN" && (
                            <button
                              style={{
                                background: "#ff9900",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                color: "#fff",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                toast.success(`Promote ${user.name}`)
                              }
                            >
                              Promote
                            </button>
                          )}
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No users found 🚫</p>
            )}
          </div>
        )}
        {activeTab === "manage" && uType === "ADMIN" && <ManageXBO />}
        {activeTab === "upload" && uType === "ADMIN" && (
          <AddRide tabId={activeTab} />
        )}
        {activeTab === "rides"  && <RideHistory />}
      </div>

      {/* 🔹 Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4000,
          }}
        >
          <img
            src={fullscreenImage}
            alt="fullscreen"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
              boxShadow: "0 0 30px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}

      {/* Toast Container */}
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
};

export default ProfileModal;
