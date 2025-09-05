import React, { useEffect, useState } from "react";
import {
  getUserBookingsAPI,
  getAllRidesWithDetailsAPI,
  addRatingAPI,
} from "../services/allApi";
import { baseurl } from "../services/baseUrl";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "react-toastify/dist/ReactToastify.css";

function RideHistory() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [reviews, setReviews] = useState({});
  const [user, setUser] = useState(null);

  // For admin: toggle bookings/ratings
  const [expandedAdmin, setExpandedAdmin] = useState({});

  const fetchData = async () => {
    try {
      const User = JSON.parse(localStorage.getItem("user"));
      if (!User?.logUser?._id) return;
      setUser(User);

      const token = User.token;
      const reqHeader = { Authorization: `Bearer ${token}` };

      let response;
      if (User.logUser.UTYPE === "ADMIN") {
        response = await getAllRidesWithDetailsAPI(reqHeader);
      } else {
        response = await getUserBookingsAPI(User.logUser._id, reqHeader);
      }

      const bookings = response.data;
      const initialReviews = {};
      bookings.forEach((b) => {
        initialReviews[b._id] = {
          rating: b.rating || 0,
          review: b.review || "",
        };
      });

      setReviews(initialReviews);
      setData(bookings);
    } catch (err) {
      console.error("Error fetching ride history:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  const toggleAdminExpand = (rideId) =>
    setExpandedAdmin((prev) => ({
      ...prev,
      [rideId]: !prev[rideId],
    }));

  const handleStarClick = (bookingId, rating) => {
    setReviews((prev) => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], rating },
    }));
  };

  const handleReviewChange = (bookingId, value) => {
    setReviews((prev) => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], review: value },
    }));
  };

  const submitReview = async (booking) => {
    const reviewData = reviews[booking._id];
    if (!reviewData?.rating || !reviewData?.review) {
      toast.error("Please add both rating and review.");
      return;
    }

    try {
      const reqHeader = { Authorization: `Bearer ${user.token}` };
      const reqBody = {
        userId: user.logUser._id,
        rideId: booking.rideId._id,
        rating: reviewData.rating,
        review: reviewData.review,
      };

      const res = await addRatingAPI(reqBody, reqHeader);

      if (res.status === 200) {
        toast.success("Review submitted successfully!");
        await fetchData();
        setReviews((prev) => ({ ...prev, [booking._id]: {} }));
      } else {
        toast.error(res.data?.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Error submitting review.");
    }
  };

  const exportToExcel = (ride) => {
    if (!ride.bookings?.length) {
      toast.error("No bookings to export.");
      return;
    }

    const worksheetData = ride.bookings.map((b) => ({
      Name: b.name,
      Mobile: b.mobile,
      Vehicle: b.vehicleNumber,
      Place: b.place,
      BloodGroup: b.bloodGroup,
      Status: b.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${ride.title}_Bookings.xlsx`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme === "dark" ? "#000" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ color: "red" }}>
        🚴{" "}
        {user?.logUser?.UTYPE === "ADMIN"
          ? "All Rides (Admin)"
          : "Ride History"}
      </h2>

      <div style={{ marginTop: "20px" }}>
        {data.length === 0 ? (
          <p>No records found.</p>
        ) : (
          data.map((item) => {
            const isExpanded = expanded === item._id;
            const rideEnded = item.rideId
              ? new Date(item.rideId.endAt) < new Date()
              : new Date(item.endAt) < new Date();
            const displayStatus =
              item.status === "verified" && rideEnded
                ? "completed"
                : item.status;

            return (
              <div
                key={item._id}
                style={{
                  border: "1px solid red",
                  borderRadius: "12px",
                  padding: "15px",
                  marginBottom: "20px",
                  background: theme === "dark" ? "#111" : "#f9f9f9",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "15px",
                      alignItems: "center",
                    }}
                  >
                    {item.rideId?.poster || item.poster ? (
                      <img
                        src={`${baseurl}${item.rideId?.poster || item.poster}`}
                        alt="Ride Poster"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    ) : null}
                    <div style={{ minWidth: "200px", flex: "1 1 200px" }}>
                      <h3 style={{ color: "red", marginBottom: "4px" }}>
                        {item.rideId?.title || item.title}
                      </h3>
                      {user?.logUser?.UTYPE === "NRML" && (
                        <>
                          <p style={{ margin: 0 }}>
                            <b>Status:</b>{" "}
                            <span
                              style={{
                                fontWeight: "bold",
                                color:
                                  displayStatus === "verified"
                                    ? "green"
                                    : displayStatus === "completed"
                                    ? "blue"
                                    : "orange",
                              }}
                            >
                              {displayStatus}
                            </span>
                          </p>
                          <p style={{ margin: 0 }}>
                            <b>Date:</b>{" "}
                            {new Date(
                              item.rideId?.startAt
                            ).toLocaleDateString()}
                          </p>
                        </>
                       )} 
                      {user?.logUser?.UTYPE === "ADMIN" && (
                        <p style={{ margin: 0 }}>
                          <b>Date:</b>{" "}
                          {new Date(item.startAt).toLocaleDateString()} -{" "}
                          {new Date(item.endAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                  >
                    <button
                      onClick={() => toggleExpand(item._id)}
                      style={{
                        background: "red",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>

                    {user?.logUser?.UTYPE === "ADMIN" && (
                      <>
                        <button
                          onClick={() => exportToExcel(item)}
                          style={{
                            background: "green",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Export Excel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      marginTop: "15px",
                      borderTop: "1px solid red",
                      paddingTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <p>
                      <b>Description:</b>{" "}
                      {item.rideId?.description || item.description}
                    </p>
                    <p>
                      <b>Location:</b> {item.rideId?.location || item.location}
                    </p>
                    <p>
                      <b>Meeting Point:</b>{" "}
                      {item.rideId?.meetingPoint || item.meetingPoint}
                    </p>
                    <p>
                      <b>Start:</b>{" "}
                      {new Date(
                        item.rideId?.startAt || item.startAt
                      ).toLocaleString()}
                    </p>
                    <p>
                      <b>End:</b>{" "}
                      {new Date(
                        item.rideId?.endAt || item.endAt
                      ).toLocaleString()}
                    </p>
                    {user?.logUser?.UTYPE === "ADMIN" && (
                      <button
                        onClick={() => toggleAdminExpand(item._id)}
                        style={{
                          background: "orange",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        {expandedAdmin[item._id]
                          ? "Hide Bookings"
                          : "Show Bookings"}
                      </button>
                    )}
{console.log(user)
}
                    {user?.logUser?.UTYPE === "NRML" &&
                      displayStatus === "completed" && (
                        <div
                          style={{
                            marginTop: "20px",
                            padding: "15px",
                            border: "1px dashed red",
                            borderRadius: "10px",
                          }}
                        >
                          <h4 style={{ color: "red" }}>⭐ Add Your Review</h4>
                          <div
                            style={{ fontSize: "24px", marginBottom: "10px" }}
                          >
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                onClick={() => handleStarClick(item._id, star)}
                                style={{
                                  cursor: "pointer",
                                  color:
                                    (reviews[item._id]?.rating ||
                                      item.rating ||
                                      0) >= star
                                      ? "gold"
                                      : theme === "dark"
                                      ? "#555"
                                      : "#ccc",
                                  marginRight: "5px",
                                }}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <textarea
                            placeholder="Write your review..."
                            value={reviews[item._id]?.review || ""}
                            onChange={(e) =>
                              handleReviewChange(item._id, e.target.value)
                            }
                            style={{
                              width: "100%",
                              minHeight: "80px",
                              borderRadius: "6px",
                              padding: "10px",
                              marginBottom: "10px",
                            }}
                          />
                          <button
                            onClick={() => submitReview(item)}
                            style={{
                              background: "red",
                              color: "#fff",
                              border: "none",
                              padding: "10px 18px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            Submit Review
                          </button>
                        </div>
                      )}

                    {/* Admin bookings & ratings */}
                    {user?.logUser?.UTYPE === "ADMIN" &&
                      expandedAdmin[item._id] && (
                        <div style={{ marginTop: "15px" }}>
                          <h3 style={{ color: "red" }}>📋 Bookings</h3>
                          {item.bookings?.length === 0 ? (
                            <p>No bookings yet.</p>
                          ) : (
                            item.bookings.map((b) => (
                              <div
                                key={b._id}
                                style={{
                                  borderBottom: "1px solid #ccc",
                                  padding: "8px 0",
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "10px",
                                }}
                              >
                                <p style={{ flex: "1 1 45%" }}>
                                  <b>Name:</b> {b.name} | <b>Status:</b>{" "}
                                  {b.status}
                                </p>
                                <p style={{ flex: "1 1 45%" }}>
                                  <b>Mobile:</b> {b.mobile} | <b>Vehicle:</b>{" "}
                                  {b.vehicleNumber}
                                </p>
                                <p style={{ flex: "1 1 45%" }}>
                                  <b>Place:</b> {b.place} | <b>Blood Group:</b>{" "}
                                  {b.bloodGroup}
                                </p>
                              </div>
                            ))
                          )}

                          <h3 style={{ marginTop: "15px", color: "red" }}>
                            ⭐ Ratings
                          </h3>
                          {item.ratings?.length === 0 ? (
                            <p>No ratings yet.</p>
                          ) : (
                            item.ratings.map((r) => (
                              <div
                                key={r._id}
                                style={{
                                  borderBottom: "1px solid #ccc",
                                  padding: "8px 0",
                                }}
                              >
                                <p>
                                  <b>User ID:</b> {r.userId}
                                </p>
                                <p>
                                  <b>Rating:</b> {"⭐".repeat(r.rating)}
                                </p>
                                <p>
                                  <b>Review:</b> {r.review || "-"}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

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

export default RideHistory;
