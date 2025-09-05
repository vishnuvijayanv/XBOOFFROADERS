import React, { useMemo, useRef, useState, useEffect } from "react";
import { PlusCircle, Save, Edit3, Trash2, Upload, X, Eye } from "lucide-react";
import { ToastContainer, toast } from "react-toastify"; // added
import "react-toastify/dist/ReactToastify.css"; // added
import {
  getRidesAPI,
  updateRideAPI,
  deleteRideAPI,
  addRideAPI,
  getUpcomingRideBookingsAPI,
  updateBookingStatusAPI,
} from "../services/allApi"; // adjust path
import { baseurl } from "../services/baseUrl";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
function AddRide(props) {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState("");
  const [termInput, setTermInput] = useState("");
  const [terms, setTerms] = useState([]);
  const [rides, setRides] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [bookingsByRide, setBookingsByRide] = useState({});
  const [expandedBooking, setExpandedBooking] = useState(null);

  const posterInputRef = useRef(null);
  const qrInputRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : true;
  });

  // Generate previews & cleanup
  useEffect(() => {
    if (!posterFile) {
      setPosterPreview("");
      return;
    }
    const url = URL.createObjectURL(posterFile);
    setPosterPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [posterFile]);

  useEffect(() => {
    if (!qrFile) {
      setQrPreview("");
      return;
    }
    const url = URL.createObjectURL(qrFile);
    setQrPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [qrFile]);

  useEffect(() => {
    if (props) {
      fetchRides();
    }
  }, [props]);

  const fetchRides = async () => {
    try {
      const { data } = await getRidesAPI();
      setRides(data !== undefined ? data : []); // backend returns list of rides
    } catch (err) {
      setRides([])
      toast.error("Failed to fetch rides");
      console.error(err);
    }
  };

  // Helpers
  const composeDateTime = (d, t) => {
    if (!d || !t) return null;
    // Produce ISO string in local time for now
    const iso = new Date(`${d}T${t}`);
    return isNaN(iso.getTime()) ? null : iso.toISOString();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setMeetingPoint("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setPosterFile(null);
    setQrFile(null);
    setTerms([]);
    setTermInput("");
    setEditingIndex(null);
    setPosterPreview("");
    setQrPreview("");
    if (posterInputRef.current) posterInputRef.current.value = "";
    if (qrInputRef.current) qrInputRef.current.value = "";
  };

  const validate = () => {
    const errors = [];
    if (!title.trim()) {
      toast.warning("Title is required.");
      return;
    }
    if (!description.trim()) {
      toast.warning("Description is required.");
      return;
    }
    if (!location.trim()) {
      toast.warning("Location is required.");
      return;
    }
    if (!meetingPoint.trim()) {
      toast.warning("Meeting point is required.");
      return;
    }
    if (!startDate || !startTime) {
      toast.warning("Start date & time are required.");
      return;
    }
    if (!endDate || !endTime) {
      toast.warning("End date & time are required.");
      return;
    }
    if (!posterFile && editingIndex === null) {
      toast.warning("Poster is required.");
      return;
    }
    if (!qrFile && editingIndex === null) {
      toast.warning("Payment QR is required.");
      return;
    }

    const startISO = composeDateTime(startDate, startTime);
    const endISO = composeDateTime(endDate, endTime);
    if (startISO && endISO && new Date(endISO) <= new Date(startISO)) {
      toast.warning("End time must be after start time.");
    }
    return errors;
  };

  const handleAddTerm = () => {
    const val = termInput.trim();
    if (!val) return;
    setTerms((prev) => [...prev, val]);
    setTermInput("");
  };

  const handleRemoveTerm = (idx) => {

    setTerms((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePosterChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPosterFile(file);
  };

  const handleQrChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setQrFile(file);
  };

  const handleSave = async (e) => {
    const errors = validate();
    if (errors.length) return;
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("meetingPoint", meetingPoint);
      formData.append("startAt", composeDateTime(startDate, startTime));
      formData.append("endAt", composeDateTime(endDate, endTime));
      terms.forEach((t, i) => formData.append(`terms[${i}]`, t));
      if (posterFile) formData.append("poster", posterFile);
      if (qrFile) formData.append("paymentQR", qrFile);

      let response;

      if (editingIndex !== null) {
        // 🔄 Update ride
        console.log(rides);

        const rideID = rides[editingIndex]._id;
        response = await updateRideAPI(rideID, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // ➕ Add ride
        response = await addRideAPI(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // ✅ Success handling
      if (response?.status >= 200 && response?.status < 300) {
        toast.success(
          editingIndex !== null
            ? "Ride updated successfully"
            : "Ride added successfully"
        );

        // Refresh rides
        const { data } = await getRidesAPI();
        if (data) setRides(data);

        // Clear form only after success
        resetForm();
      } else {
        toast.error(response.response?.data?.error);
      }
    } catch (err) {
      // ❌ Error handling based on status code
      if (err.response) {
        if (err.response.status === 400) {
          toast.error("Bad Request: Please check your inputs");
        } else if (err.response.status === 401) {
          toast.error("Unauthorized: Please login again");
        } else if (err.response.status === 404) {
          toast.error("Ride not found");
        } else if (err.response.status === 500) {
          toast.error("Server error, please try later");
        } else {
          toast.error(err.response.data?.message || "Operation failed");
        }
      } else {
        toast.error("Network error, please try again");
      }

      console.error("Save error:", err);
      // 🚫 Do NOT reset fields on error
    }
  };

  const handleDelete = async (idx) => {
    console.log(idx);
    
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This ride will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      target: document.body, // <--- ensures it's outside modal stacking context
      customClass: {
        popup: "my-swal-popup",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const rideID =idx._id;
      await deleteRideAPI(rideID, {}); // JWT header if required
      toast.success("Ride deleted successfully");

      // Refresh rides
      const { data } = await getRidesAPI();
      setRides(data);
    } catch (err) {
      toast.error("Failed to delete ride");
      console.error(err);
    }
  };

  const handleViewBookings = async (rideID) => {
    try {
      const { data } = await getUpcomingRideBookingsAPI(rideID, {
        headers: { "Content-Type": "application/json" },
      });

      setBookingsByRide((prev) => ({
        ...prev,
        [rideID]: data || [],
      }));
    } catch (err) {
      toast.error("Failed to fetch upcoming bookings");
      console.error(err);
    }
  };

  const styles = {
    wrapper: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: "24px 16px",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      color: darkMode ? "#f9fafb" : "#111827",
    },
    title: {
      fontSize: 24,
      fontWeight: 800,
      marginBottom: 16,
      color: darkMode ? "#f9fafb" : "#111827",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 16,
    },
    card: {
      background: darkMode ? "#1f2937" : "#fff",
      border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
      borderRadius: 16,
      padding: 16,
      boxShadow: darkMode
        ? "0 2px 10px rgba(0,0,0,0.6)"
        : "0 2px 10px rgba(0,0,0,0.04)",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: 12,
      fontSize: 14,
      color: darkMode ? "#f9fafb" : "#111827",
    },
    formRow: {
      display: "flex",
      flexDirection: "column",
      marginBottom: 12,
    },
    label: {
      fontSize: 13,
      color: darkMode ? "#d1d5db" : "#6b7280",
      marginBottom: 6,
      fontWeight: 600,
    },
    input: {
      border: darkMode ? "1px solid #4b5563" : "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "10px 12px",
      outline: "none",
      fontSize: 14,
      backgroundColor: darkMode ? "#111827" : "#fff",
      color: darkMode ? "#f9fafb" : "#111827",
    },
    twoCol: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
    },
    uploadRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginTop: 8,
    },
    uploadBox: {
      border: "1px dashed #cbd5e1",
      borderRadius: 12,
      padding: 12,
      background: darkMode ? "#111827" : "#fafafa",
    },
    uploadBtn: {
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 12px",
      borderRadius: 10,
      background: darkMode ? "#374151" : "#f3f4f6",
      border: darkMode ? "1px solid #4b5563" : "1px solid #e5e7eb",
      color: darkMode ? "#f9fafb" : "#111827",
      cursor: "pointer",
    },
    previewWrap: {
      position: "relative",
      marginTop: 12,
      width: "100%",
      height: 160,
      borderRadius: 12,
      overflow: "hidden",
      background: "#f9fafb",
    },
    previewImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    previewRemove: {
      position: "absolute",
      top: 8,
      right: 8,
      background: "#ef4444",
      color: "#fff",
      border: "none",
      borderRadius: 999,
      width: 28,
      height: 28,
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    },
    termRow: {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 8,
    },
    addBtn: {
      padding: "10px 14px",
      borderRadius: 10,
      background: darkMode ? "#2563eb" : "#eaedf1ff",
      border: "none",
      cursor: "pointer",
      fontWeight: 700,
    },
    termList: {
      listStyle: "none",
      paddingLeft: 0,
      marginTop: 10,
      display: "grid",
      gap: 8,
    },
    termItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "8px 10px",
      fontSize: 14,
    },
    termDeleteBtn: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#ef4444",
    },
    actions: {
      display: "flex",
      gap: 8,
      marginTop: 16,
    },
    primaryBtn: {
      display: "inline-flex",
      alignItems: "center",
      padding: "10px 14px",
      borderRadius: 12,
      border: "none",
      background: "#16a34a",
      color: "#fff",
      fontWeight: 800,
      cursor: "pointer",
    },
    secondaryBtn: {
      padding: "10px 14px",
      borderRadius: 12,
      border: darkMode ? "1px solid #4b5563" : "1px solid #e5e7eb",
      background: darkMode ? "#374151" : "#fff",
      color: darkMode ? "#f9fafb" : "#111827",
      fontWeight: 700,
      cursor: "pointer",
    },
    rideRow: {
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 12,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },
    thumb: {
      width: 72,
      height: 72,
      borderRadius: 8,
      background: "#f3f4f6",
      display: "grid",
      placeItems: "center",
      overflow: "hidden",
      border: "1px solid #e5e7eb",
    },
    thumbFallback: {
      fontSize: 10,
      color: "#6b7280",
      padding: 6,
      textAlign: "center",
    },
  };

  const mq = window?.matchMedia
    ? window.matchMedia("(min-width: 900px)")
    : null;
  if (mq && mq.matches) {
    styles.grid.gridTemplateColumns = "1.2fr 1fr";
  }

  const handleEdit = (idx) => {
    const ride = rides[idx];
    setEditingIndex(idx);

    setTitle(ride.title);
    setDescription(ride.description);
    setLocation(ride.location);
    setMeetingPoint(ride.meetingPoint);

    // Convert datetime to date + time inputs
    const start = new Date(ride.startAt);
    const end = new Date(ride.endAt);
    setStartDate(start.toISOString().slice(0, 10)); // yyyy-mm-dd
    setStartTime(start.toISOString().slice(11, 16)); // hh:mm
    setEndDate(end.toISOString().slice(0, 10));
    setEndTime(end.toISOString().slice(11, 16));

    setTerms(ride.terms || []);

    // Poster & QR: show from server, reset file upload
    setPosterFile(null);
    setPosterPreview(ride.poster ? `${baseurl}${ride.poster}` : "");
    setQrFile(null);
    setQrPreview(ride.paymentQR ? `${baseurl}${ride.paymentQR}` : "");

    // reset input fields
    if (posterInputRef.current) posterInputRef.current.value = "";
    if (qrInputRef.current) qrInputRef.current.value = "";
  };

  const handleApprove = async (rideID, bookingID) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        // add auth token if required
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const res = await updateBookingStatusAPI(bookingID, "verified", headers);

      if (res?.status >= 200 && res?.status < 300) {
        toast.success("Booking approved successfully");

        // Refresh bookings for this ride
        handleViewBookings(rideID);
      } else {
        toast.error(
          res?.response?.data?.message || "Failed to approve booking"
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while approving booking");
    }
  };

  const handleReject = async (rideID, bookingID) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        // add auth token if required
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const res = await updateBookingStatusAPI(bookingID, "rejected", headers);

      if (res?.status >= 200 && res?.status < 300) {
        toast.success("Booking rejected successfully");

        // Refresh bookings for this ride
        handleViewBookings(rideID);
      } else {
        toast.error(res?.response?.data?.message || "Failed to reject booking");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while rejecting booking");
    }
  };

  // Export all booked users as Excel
  const handleExportBookings = () => {
    // Combine all bookings into one array
    const allBookings = Object.values(bookingsByRide).flat();

    if (!allBookings.length) {
      toast.warning("No bookings to export");
      return;
    }

    // Map to Excel-friendly format
    const excelData = allBookings.map((b) => ({
      Name: b.name,
      Mobile: b.mobile,
      VehicleNumber: b.vehicleNumber,
      BloodGroup: b.bloodGroup,
      Address: b.address,
      Status: b.status,
      RideTitle: rides.find((r) => r._id === b.rideID)?.title || "",
      StartDate: rides.find((r) => r._id === b.rideID)
        ? new Date(
            rides.find((r) => r._id === b.rideID).startAt
          ).toLocaleString()
        : "",
      EndDate: rides.find((r) => r._id === b.rideID)
        ? new Date(rides.find((r) => r._id === b.rideID).endAt).toLocaleString()
        : "",
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Convert to Excel buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save as file
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "Bookings.xlsx");
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Add Ride</h2>

      <div style={styles.grid}>
        {/* Left: Form */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <PlusCircle size={18} />
            <span style={{ marginLeft: 8, fontWeight: 700 }}>Ride Details</span>
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Ride title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, minHeight: 90, resize: "vertical" }}
              placeholder="Describe the ride..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={styles.twoCol}>
            <div style={styles.formRow}>
              <label style={styles.label}>Location</label>
              <input
                style={styles.input}
                type="text"
                placeholder="City / Area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Meeting Point</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Specific meeting spot"
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.twoCol}>
            <div style={styles.formRow}>
              <label style={styles.label}>Start Date</label>
              <input
                style={styles.input}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Start Time</label>
              <input
                style={styles.input}
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.twoCol}>
            <div style={styles.formRow}>
              <label style={styles.label}>End Date</label>
              <input
                style={styles.input}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>End Time</label>
              <input
                style={styles.input}
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.uploadRow}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Ride Poster</label>
              <div style={styles.uploadBox}>
                <input
                  ref={posterInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  style={{ display: "none" }}
                  id="poster-input"
                />
                <button
                  type="button"
                  onClick={() => posterInputRef.current?.click()}
                  style={styles.uploadBtn}
                >
                  <Upload size={16} />
                  <span style={{ marginLeft: 8 }}>Upload Poster</span>
                </button>
                {posterPreview && (
                  <div style={styles.previewWrap}>
                    <img
                      src={posterPreview}
                      alt="poster preview"
                      style={styles.previewImg}
                    />
                    <button
                      type="button"
                      style={styles.previewRemove}
                      onClick={() => setPosterFile(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label style={styles.label}>Payment QR</label>
              <div style={styles.uploadBox}>
                <input
                  ref={qrInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleQrChange}
                  style={{ display: "none" }}
                  id="qr-input"
                />
                <button
                  type="button"
                  onClick={() => qrInputRef.current?.click()}
                  style={styles.uploadBtn}
                >
                  <Upload size={16} />
                  <span style={{ marginLeft: 8 }}>Upload QR</span>
                </button>
                {qrPreview && (
                  <div style={styles.previewWrap}>
                    <img
                      src={qrPreview}
                      alt="qr preview"
                      style={styles.previewImg}
                    />
                    <button
                      type="button"
                      style={styles.previewRemove}
                      onClick={() => setQrFile(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>Terms & Conditions</label>
            <div style={styles.termRow}>
              <input
                type="text"
                style={styles.input}
                placeholder="Type a term and press Add"
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTerm();
                  }
                }}
              />
              <button
                type="button"
                style={styles.addBtn}
                onClick={handleAddTerm}
              >
                Add
              </button>
            </div>
            {terms.length > 0 && (
              <ul style={styles.termList}>
                {terms.map((t, i) => (
                  <li key={i} style={styles.termItem}>
                    <span>• {t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTerm(i)}
                      style={styles.termDeleteBtn}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.primaryBtn}
              onClick={(e) => handleSave(e)}
            >
              <Save size={16} />
              <span style={{ marginLeft: 8 }}>
                {editingIndex !== null ? "Update Ride" : "Add Ride"}
              </span>
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                style={styles.secondaryBtn}
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Right: Rides Admin List */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <Edit3 size={18} />
            <span style={{ marginLeft: 8, fontWeight: 700 }}>
              Rides (Admin)
            </span>
          </div>

          {rides && rides.length === 0 ? (
            <div style={{ color: "#6b7280", fontSize: 14 }}>
              No rides yet. Add a ride from the left.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {rides &&
                rides.map((r, idx) => (
                  <div key={r.id} style={styles.rideRow}>
                    <div
                      style={{ display: "flex", gap: 12, alignItems: "center" }}
                    >
                      <div style={styles.thumb}>
                        {r.poster ? (
                          <img
                            src={`${baseurl}${r.poster}`}
                            alt="thumb"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        ) : (
                          <div style={styles.thumbFallback}>No Poster</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{r.title}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          {new Date(r.startAt).toLocaleString()} →{" "}
                          {new Date(r.endAt).toLocaleString()}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          {r.location} • Meet: {r.meetingPoint}
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex-column"
                      style={{ display: "flex", gap: 8 }}
                    >
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => handleEdit(idx)}
                        style={{
                          ...styles.iconBtn,
                          border: "1px solid #ebde25ff",
                          color: "#a6e724ff",
                          padding: "4px 8px",
                          borderRadius: 8,
                        }}
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        onClick={() => handleDelete(r)}
                        style={{
                          ...styles.iconBtn,
                          border: "1px solid #cb0d0dff",
                          color: "#ee3030ff",
                          padding: "4px 8px",
                          borderRadius: 8,
                        }}
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* ✅ View Bookings */}
                      <button
                        type="button"
                        title="View Bookings"
                        onClick={() => handleViewBookings(r._id)}
                        style={{
                          ...styles.iconBtn,
                          border: "1px solid #2563eb",
                          color: "#2563eb",
                          padding: "4px 8px",
                          borderRadius: 8,
                        }}
                      >
                        View Bookings
                      </button>
                      <button
                        onClick={handleExportBookings}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 10,
                          border: "none",
                          background: "#2563eb",
                          color: "#fff",
                          fontWeight: 700,
                          cursor: "pointer",
                          marginBottom: 12,
                        }}
                      >
                        Export Bookings
                      </button>

                      {bookingsByRide[r._id] && (
                        <div className="row" style={{ marginTop: 12 }}>
                          {bookingsByRide[r._id].length === 0 ? (
                            <span style={{ color: "#6b7280", fontSize: 14 }}>
                              No upcoming bookings
                            </span>
                          ) : (
                            <div
                              className="col-md-12"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                                marginTop: 8,
                              }}
                            >
                              {bookingsByRide[r._id].map((b) => (
                                <div
                                  key={b._id}
                                  style={{
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 12,
                                    padding: 12,
                                    background: "#fff",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  {/* User Info */}
                                  <div style={{ marginBottom: 8 }}>
                                    <div
                                      style={{ fontWeight: 600, fontSize: 15 }}
                                    >
                                      {b.name}
                                    </div>
                                    <div
                                      style={{ fontSize: 13, color: "#374151" }}
                                    >
                                      {b.mobile} • {b.vehicleNumber} •{" "}
                                      {b.bloodGroup}
                                    </div>
                                    <div
                                      style={{ fontSize: 13, color: "#6b7280" }}
                                    >
                                      {b.address}
                                    </div>
                                    <div
                                      style={{ fontSize: 13, color: "#6b7280" }}
                                    >
                                      {b.status === "pending" ? (
                                        <p className="fw-bold text-warning">
                                          {b.status}
                                        </p>
                                      ) : b.status === "rejected" ? (
                                        <p className="fw-bold text-danger">
                                          {b.status}
                                        </p>
                                      ) : (
                                        <p className="fw-bold text-success">
                                          {b.status}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Buttons */}
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 8,
                                      marginTop: 8,
                                      justifyContent: "flex-start", // buttons align nicely on small screens
                                    }}
                                  >
                                    {/* Screenshot Button */}
                                    <button
                                      onClick={() => setExpandedBooking(b)}
                                      style={{
                                        flex: "1 1 120px", // min width 120px, grows to fill
                                        border: "1px solid #2563eb",
                                        background: "#fff",
                                        color: "#2563eb",
                                        fontSize: 13,
                                        padding: "8px 12px",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 4,
                                        minWidth: 120,
                                      }}
                                    >
                                      <Eye size={16} /> Screenshot
                                    </button>

                                    {b.status == "pending" && (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleApprove(r._id, b._id)
                                          }
                                          style={{
                                            flex: "1 1 100px",
                                            minWidth: 100,
                                            background: "#16a34a",
                                            color: "#fff",
                                            fontSize: 13,
                                            padding: "8px 12px",
                                            borderRadius: 8,
                                            cursor: "pointer",
                                          }}
                                        >
                                          Approve
                                        </button>

                                        <button
                                          onClick={() =>
                                            handleReject(r._id, b._id)
                                          }
                                          style={{
                                            flex: "1 1 100px",
                                            minWidth: 100,
                                            background: "#dc2626",
                                            color: "#fff",
                                            fontSize: 13,
                                            padding: "8px 12px",
                                            borderRadius: 8,
                                            cursor: "pointer",
                                          }}
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Screenshot Modal */}
                    {expandedBooking && (
                      <div
                        style={{
                          position: "fixed",
                          inset: 0,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 9999,
                          padding: 16,
                        }}
                        onClick={() => setExpandedBooking(null)} // click outside closes modal
                      >
                        <div
                          style={{
                            position: "relative",
                            maxWidth: "90%",
                            maxHeight: "90%",
                            background: "#fff",
                            borderRadius: 12,
                            overflow: "hidden",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                          }}
                          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                        >
                          <button
                            onClick={() => setExpandedBooking(null)}
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              background: "#ef4444",
                              border: "none",
                              color: "#fff",
                              width: 28,
                              height: 28,
                              borderRadius: 999,
                              cursor: "pointer",
                              display: "grid",
                              placeItems: "center",
                              zIndex: 10,
                            }}
                          >
                            <X size={16} />
                          </button>
                          <img
                            src={
                              `${baseurl}/${expandedBooking.paymentScreenshot}` ||
                              ""
                            } // adjust according to your data
                            alt="Booking Screenshot"
                            style={{
                              display: "block",
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default AddRide;
