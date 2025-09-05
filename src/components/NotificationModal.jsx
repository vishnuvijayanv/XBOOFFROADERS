import { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import {
  getNotificationsAPI,
  markNotificationReadAPI,
  deleteNotificationAPI,
} from "../services/allApi"; // adjust path if needed

export default function NotificationModal({ isOpen, onClose, token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // track which action is loading

  const reqHeader = { Authorization: `Bearer ${token}` };

  // Fetch notifications
  const fetchNotifications = async () => {
    const User = JSON.parse(localStorage.getItem("user"));
    console.log(User.logUser._id)
    setLoading(true);
    try {
      const res = await getNotificationsAPI(User.logUser._id,reqHeader);
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const handleMarkAsRead = async (id) => {
    setActionLoading(id);
    try {
      await markNotificationReadAPI(id, reqHeader);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    setActionLoading(id);
    try {
      await deleteNotificationAPI(id, reqHeader);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          <ul className="list-unstyled">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`d-flex justify-content-between align-items-center mb-2 ${
                  n.isRead ? "text-muted" : "fw-bold"
                }`}
              >
                <span>{n.message}</span>
                <div>
                  {!n.isRead && (
                    <Button
                      size="sm"
                      variant="success"
                      className="me-2"
                      onClick={() => handleMarkAsRead(n._id)}
                      disabled={actionLoading === n._id}
                    >
                      {actionLoading === n._id ? "..." : "Mark Read"}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(n._id)}
                    disabled={actionLoading === n._id}
                  >
                    {actionLoading === n._id ? "..." : "Delete"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
    </Modal>
  );
}
