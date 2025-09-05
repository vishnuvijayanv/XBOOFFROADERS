import { commonAPI } from "./commonApi";
import { baseurl } from "./baseUrl";

//register function
export const registerAPI = async (user) => {
  return await commonAPI("POST", `${baseurl}/user/register`, user, "");
};

//login
export const loginAPI = async (ldata) => {
  return await commonAPI("POST", `${baseurl}/user/login`, ldata, "");
};

//get Profile
export const getProfileAPI = async (userID, reqHeader) => {
  return await commonAPI("GET", `${baseurl}/user/${userID}`, null, reqHeader);
};

//update profile

export const updateProfileAPI = async (userID, reqBody, reqheader) => {
  //project id is passed as path parameter
  return await commonAPI(
    "PUT",
    `${baseurl}/user/update/${userID}`,
    reqBody,
    reqheader
  );
};

//get all users
export const getAllUsersAPI = async (reqHeader) => {
  return await commonAPI("GET", `${baseurl}/user/allusers`, null, reqHeader);
};

//add / update site settings
export const addSiteSettingsAPI = async (reqBody, reqHeader) => {
  return await commonAPI(
    "POST",
    `${baseurl}/site/settings`,
    reqBody,
    reqHeader
  );
};

//get site settings
export const getSiteSettingsAPI = async () => {
  return await commonAPI("GET", `${baseurl}/site/settings`, null, "");
};

// ================== Ride APIs ==================

// Get all rides
export const getRidesAPI = async () => {
  return await commonAPI("GET", `${baseurl}/rides`, null, "");
};
export const getPreviousRides = async () => {
  return await commonAPI("GET", `${baseurl}/rides/previous`, null, "");
};

// Get single ride by ID
export const getRideByIdAPI = async (rideID) => {
  return await commonAPI("GET", `${baseurl}/rides/${rideID}`, null, "");
};

export const addRideAPI = async (reqBody, reqHeader) => {
  return await commonAPI("POST", `${baseurl}/rides/add`, reqBody, reqHeader);
};
// Update ride (poster / QR upload possible)
export const updateRideAPI = async (rideID, reqBody, reqHeader) => {
  return await commonAPI(
    "PUT",
    `${baseurl}/rides/update/${rideID}`,
    reqBody,
    reqHeader
  );
};

// Delete ride
export const deleteRideAPI = async (rideID, reqHeader) => {
  return await commonAPI(
    "DELETE",
    `${baseurl}/rides/delete/${rideID}`,
    null,
    reqHeader
  );
};

// ================== Booking APIs ==================

// Add new booking (user books a ride)
export const addBookingAPI = async (reqBody, reqHeader) => {
  return await commonAPI("POST", `${baseurl}/booking/add`, reqBody, reqHeader);
};

export const getUserBookingsAPI = async (userID, reqHeader) => {
  return await commonAPI(
    "GET",
    `${baseurl}/bookings/user/${userID}`,
    null,
    reqHeader
  );
};

// Get all rides with bookings and ratings (Admin view)
export const getAllRidesWithDetailsAPI = async (reqHeader) => {
  return await commonAPI(
    "GET",
    `${baseurl}/rides/all/details`,
    null,
    reqHeader
  );
};
// Get bookings for a particular upcoming ride
export const getUpcomingRideBookingsAPI = async (rideID, reqHeader) => {
  return await commonAPI(
    "GET",
    `${baseurl}/ride/${rideID}/bookings/upcoming`,
    null,
    reqHeader
  );
};

// Admin: Verify or reject booking (update status)
export const updateBookingStatusAPI = async (bookingID, status, reqHeader) => {
  return await commonAPI(
    "PUT",
    `${baseurl}/booking/${bookingID}/status`, // updated route
    { status }, // body
    reqHeader
  );
};

// ================== Notification APIs ==================

// Get latest notifications (limit 20)
export const getNotificationsAPI = async (userID, reqHeader) => {
  return await commonAPI(
    "GET",
    `${baseurl}/notifications/${userID}`,
    null,
    reqHeader
  );
};

// Mark a notification as read
export const markNotificationReadAPI = async (notificationID, reqHeader) => {
  return await commonAPI(
    "PUT",
    `${baseurl}/notifications/${notificationID}/read`,
    null,
    reqHeader
  );
};

// Delete a notification
export const deleteNotificationAPI = async (notificationID, reqHeader) => {
  return await commonAPI(
    "DELETE",
    `${baseurl}/notifications/${notificationID}`,
    null,
    reqHeader
  );
};

// ================== Rating APIs ==================

// Add rating for a ride
export const addRatingAPI = async (reqBody, reqHeader) => {
  return await commonAPI("POST", `${baseurl}/ratings/add`, reqBody, reqHeader);
};

// Get ratings for a specific ride
export const getRideRatingsAPI = async (rideID, reqHeader) => {
  return await commonAPI(
    "GET",
    `${baseurl}/ratings/ride/${rideID}`,
    null,
    reqHeader
  );
};

// Get ratings given by a specific user
export const getUserRatingsAPI = async (userID, reqHeader) => {
  return await commonAPI(
    "GET",
    `${baseurl}/ratings/user/${userID}`,
    null,
    reqHeader
  );
};


// ================== FCM Token APIs ==================

// Register or update FCM token for a user
export const registerFcmTokenAPI = async (reqBody, reqHeader) => {
  return await commonAPI(
    "POST",
    `${baseurl}/save-token`,
    reqBody,
    reqHeader
  );
};

// Remove FCM token (on logout or session expire)
export const removeFcmTokenAPI = async (reqBody, reqHeader) => {
  return await commonAPI(
    "POST",
    `${baseurl}/fcm/remove`,
    reqBody,
    reqHeader
  );
};
