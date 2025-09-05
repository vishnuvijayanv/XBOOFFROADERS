import { useState, useEffect } from "react";
import {
  Home,
  Info,
  Image as ImageIcon,
  History,
  CalendarClock,
  Phone,
  User,
  Bell,
} from "lucide-react";
import ProfileModal from "./ProfileModal";
import NotificationModal from "./NotificationModal";
import { getNotificationsAPI } from "../services/allApi"; // your API path

const BottomNavBar = (props) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [activeSection, setActiveSection] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token"); // assuming JWT stored in localStorage
  const reqHeader = { Authorization: `Bearer ${token}` };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsAPI(reqHeader);
      const data = res.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    if (isMobile) fetchNotifications();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  useEffect(() => {
    setDarkMode(localStorage.getItem("theme") === "dark");

    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id], div[id]");
      let current = "home";
      let minDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < minDistance && rect.bottom > 0) {
          minDistance = distance;
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [props.isThemeChanged]);

  if (!isMobile) return null;

  const navItems = [
    { label: "Home", href: "#home", icon: Home },
    { label: "About", href: "#aboutus", icon: Info },
    props.galleryEnabled && {
      label: "Gallery",
      href: "#gallery",
      icon: ImageIcon,
    },
    props.previousRideEnabled && {
      label: "Trips",
      href: "#previous",
      icon: History,
    },
    props.bookingEnabled && {
      label: "Upcoming",
      href: "#upcoming",
      icon: CalendarClock,
    },
    { label: "Contact", href: "#contact", icon: Phone },
    { label: "Profile", href: "#profile", icon: User },
  ].filter(Boolean);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          bottom: "0px",
          left: "50%",
          transform: "translateX(-50%)",
          background: darkMode ? "rgba(30,30,30,0.8)" : "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.href.replace("#", "");
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (item.href === "#profile") {
                  e.preventDefault();
                  setShowProfile(true);
                }
                if (item.href === "#notifications") {
                  e.preventDefault();
                  setShowNotifications(true);
                }
              }}
              style={{
                flex: 1,
                textAlign: "center",
                textDecoration: "none",
                color: "#333",
                fontSize: "12px",
                paddingTop: "5px",
              }}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <Icon
                  size={22}
                  style={{
                    color: isActive ? "#e50914" : darkMode ? "#fff" : "#333", // icon color
                    transition: "color 0.2s ease",
                  }}
                />
                {item.label === "Notifications" && unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -8,
                      background: "#e50914",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: "bold",
                      borderRadius: "50%",
                      padding: "2px 5px",
                      lineHeight: "1",
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onUpdateNotifications={fetchNotifications} // optional: allow modal to refresh
      />
    </>
  );
};

export default BottomNavBar;
