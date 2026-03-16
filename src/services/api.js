// ==============================
// Dynamic API Base URL
// ==============================
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


export { BASE_URL };

// ==============================
// Token Handling
// ==============================
export const setToken = (token) => {
  if (token && token !== "undefined") localStorage.setItem("token", token);
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  return token && token !== "undefined" ? token : null;
};

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("passenger");
};

// ==============================A
// Notification System
// ==============================
const notify = (message, type = "success", duration = 3000) => {
  const container = document.createElement("div");
  container.textContent = message;
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.right = "20px";
  container.style.background = type === "success" ? "#4caf50" : "#f44336";
  container.style.color = "#fff";
  container.style.padding = "12px 20px";
  container.style.borderRadius = "8px";
  container.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  container.style.zIndex = 9999;
  container.style.fontFamily = "sans-serif";
  container.style.transition = "opacity 0.3s ease";
  document.body.appendChild(container);
  setTimeout(() => {
    container.style.opacity = "0";
    setTimeout(() => document.body.removeChild(container), 300);
  }, duration);
};

// ==============================
// Centralized Headers & Request Helper
// ==============================
const getHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: { ...getHeaders(), ...options.headers },
    body: options.body || null,
  });

  let data = {};
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Invalid JSON response from server");
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    notify(message, "error");
    if ((res.status === 401 || res.status === 403) && !endpoint.startsWith("/auth/")) {
      clearToken();
    }
    throw new Error(message);
  }

  return data;
};

// ==============================
// Helpers
// ==============================
const unwrapArray = (res) => (Array.isArray(res?.data) ? res.data : []);

const normalizeTrip = (t = {}) => ({
  id: t.id,
  driver_id: t.driver_id,
  start_location: t.start_location,
  end_location: t.end_location,
  departure_datetime: t.departure_datetime,
  seats_available: t.seats_available ?? 0,
  price_per_seat: t.price_per_seat ?? 0,
  status: t.status,
  created_at: t.created_at,
  cancelled_by: t.cancelled_by,
  cancelled_at: t.cancelled_at,
});

const normalizeBooking = (b = {}, type = "active") => ({
  id: b.id,
  passenger_name: b.name ?? b.passenger_name,
  seat_number: b.seat ?? b.seat_number,
  phone: b.contact ?? b.phone,
  created_at: b.bookedAt ?? b.created_at,
  cancelled_at: b.cancelled_at,
  cancelled_by: b.cancelled_by,
  refund_status: b.refund_status ?? (type === "cancelled" ? "Pending" : undefined),
  amount_paid: b.amount_paid ?? 0,
  status: b.status ?? type,
});

const normalizeDashboard = (data = {}) => ({
  completed_trips: Number(data.completed_trips) || 0,
  upcoming_trips: Number(data.upcoming_trips) || 0,
  earnings_today: Number(data.earnings_today) || 0,
  ongoing_trips: Array.isArray(data.ongoing_trips)
    ? data.ongoing_trips.map(normalizeTrip)
    : [],
  notifications: Array.isArray(data.notifications) ? data.notifications : [],
});

// ==============================
// DRIVER AUTH
// ==============================
export const loginUser = async (email, password) => {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data?.success && data.token) {
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("role", "driver"); // <-- store role
    notify("Login successful!");
  }

  return data;
};

export const registerUser = async (full_name, email, password, phone) => {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ full_name, email, password, phone }),
  });

  if (data?.success) notify(data.message || "Driver registered successfully!");
  return data;
};

// ==============================
// PASSENGER AUTH
// ==============================
export const loginPassenger = async (email, password) => {
  const data = await apiRequest("/auth/passenger/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data?.success && data.token) {
    setToken(data.token);
    localStorage.setItem("passenger", JSON.stringify(data.passenger));
    localStorage.setItem("role", "passenger"); // <-- store role
    notify("Passenger login successful!");
  }

  return data;
};

export const registerPassenger = async (full_name, email, password, phone) => {
  const data = await apiRequest("/auth/passenger/register", {
    method: "POST",
    body: JSON.stringify({ full_name, email, password, phone }),
  });

  if (data?.success) notify(data.message || "Passenger registered successfully!");
  return data;
};


// ==============================
// DASHBOARD APIs
// ==============================
export const fetchDashboard = async () => {
  const res = await apiRequest("/dashboard");
  return normalizeDashboard(res?.data);
};

// ==============================
// TRIPS APIs
// ==============================
export const fetchTrips = async () =>
  unwrapArray(await apiRequest("/trips")).map(normalizeTrip);

export const fetchTripsWithBookings = async () =>
  unwrapArray(await apiRequest("/trips/with-bookings")).map((t) => ({
    ...normalizeTrip(t),
    active_bookings: Array.isArray(t.active_bookings)
      ? t.active_bookings.map((b) => normalizeBooking(b, "active"))
      : [],
    cancelled_bookings: Array.isArray(t.cancelled_bookings)
      ? t.cancelled_bookings.map((b) => normalizeBooking(b, "cancelled"))
      : [],
  }));

export const fetchTripById = async (id) => {
  if (!id) throw new Error("Trip ID is required");
  const res = await apiRequest(`/trips/${id}`);
  return res?.data ? normalizeTrip(res.data) : null;
};

export const createTrip = async (trip) => {
  const res = await apiRequest("/trips", { method: "POST", body: JSON.stringify(trip) });
  if (res?.success) notify(res.message || "Trip created successfully!");
  return res;
};

export const startTrip = async (id) => {
  const res = await apiRequest(`/trips/${id}/start`, { method: "PATCH" });
  if (res?.success) notify(res.message || "Trip started successfully!");
  return res;
};

export const completeTrip = async (id) => {
  const res = await apiRequest(`/trips/${id}/complete`, { method: "PATCH" });
  if (res?.success) notify(res.message || "Trip completed successfully!");
  return res;
};

// ==============================
// BOOKINGS APIs
// ==============================
export const fetchActiveBookings = async (tripId) => {
  if (!tripId) return [];
  try {
    const res = await apiRequest(`/bookings/${tripId}/active`);
    return unwrapArray(res).map((b) => normalizeBooking(b, "active"));
  } catch (err) {
    notify(err.message, "error");
    return [];
  }
};

export const fetchCancelledBookings = async (tripId) => {
  if (!tripId) return [];
  try {
    const res = await apiRequest(`/bookings/${tripId}/cancelled`);
    return unwrapArray(res).map((b) => normalizeBooking(b, "cancelled"));
  } catch (err) {
    notify(err.message, "error");
    return [];
  }
};

export const cancelBooking = async (bookingId, onUpdateSeats) => {
  if (!bookingId) throw new Error("Invalid booking ID");
  try {
    const res = await apiRequest(`/bookings/${bookingId}/cancel`, { method: "PUT" });
    if (res.success) {
      if (typeof onUpdateSeats === "function") onUpdateSeats(-1);
      notify(res.message || "Booking cancelled!");
      return res;
    }
    throw new Error(res.message || "Failed to cancel booking");
  } catch (err) {
    notify(err.message, "error");
    throw err;
  }
};

// ==============================
// EMAIL & PASSWORD RESET
// ==============================
// ==============================
// EMAIL & PASSWORD RESET
// ==============================
export const verifyEmail = async (email) => {
  return await apiRequest("/auth/passenger/verify-email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (email, password) => {
  return await apiRequest("/auth/passenger/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

// ==============================
// PASSENGER PROFILE APIs
// ==============================
export const getPassengerProfile = async () => {
  const res = await apiRequest("/users/passenger/profile");
  return res.data;
};

export const updatePassengerProfile = async (profileData) => {
  const res = await apiRequest("/users/passenger/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
  if (res?.success) notify(res.message || "Profile updated successfully!");
  return res;
};

export const changePassengerPassword = async (passwordData) => {
  const res = await apiRequest("/users/change-password", {
    method: "PUT",
    body: JSON.stringify(passwordData),
  });
  if (res?.success) notify(res.message || "Password changed successfully!");
  return res;
};

// ==============================
// PROFILE PICTURE UPLOAD
// ==============================
export const updateProfilePicture = async (file) => {
  if (!file) throw new Error("No file provided");

  const token = getToken();
  const formData = new FormData();
  formData.append("profile_picture", file);

  const res = await fetch(`${BASE_URL}/users/profile-picture`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set Content-Type! Let the browser handle FormData
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    notify(data.message || "Image upload failed", "error");
    throw new Error(data.message || "Image upload failed");
  }

  notify("Profile picture updated!");
  return data; // data.profile_picture contains the path
};





export const getImageUrl = (path) => {
  if (!path) return null;

  // If the path is already a full URL (e.g., production CDN)
  if (path.startsWith("http")) return path;

  // Remove "/api" from BASE_URL to access static files
  const base = BASE_URL.replace("/api", "");

  // Ensure leading slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${base}${cleanPath}`;
};


// ==============================
// DRIVER PROFILE API
// ==============================
export const fetchDriverProfile = async () => {
  const res = await apiRequest("/users/driver/profile"); // make sure your backend route exists
  return res.data;
};