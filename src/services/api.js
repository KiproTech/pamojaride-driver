// ==============================
// Dynamic API Base URL
// ==============================
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
};

// ==============================
// Centralized Headers
// ==============================
const getHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ==============================
// Centralized API Request Helper
// ==============================
export const apiRequest = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: { ...getHeaders(), ...options.headers },
    body: options.body || null,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    if ((res.status === 401 || res.status === 403) && !endpoint.startsWith("/auth/")) {
      clearToken();
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(message);
  }

  return data;
};

// ==============================
// Helpers
// ==============================
const unwrapArray = (res) => (Array.isArray(res?.data) ? res.data : []);

// ==============================
// 🔥 DO NOT CHANGE FIELD NAMES
// ==============================
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

// ==============================
// 🔥 DASHBOARD NORMALIZER
// ==============================
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
// AUTH APIs
// ==============================
export const loginUser = async (email, password) => {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data?.success && data.token) {
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

export const registerUser = async (full_name, email, password, phone) => {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ full_name, email, password, phone }),
  });

  if (data?.success && data.token) {
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

// ==============================
// DASHBOARD API
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

// ✅ Updated endpoint to match backend
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

export const createTrip = (trip) =>
  apiRequest("/trips", { method: "POST", body: JSON.stringify(trip) });

export const startTrip = (id) =>
  apiRequest(`/trips/${id}/start`, { method: "PATCH" });

export const completeTrip = (id) =>
  apiRequest(`/trips/${id}/complete`, { method: "PATCH" });

/// ==============================
/// ==============================
// BOOKINGS APIs
// ==============================

/**
 * Fetch active bookings for a trip
 * @param {number|string} tripId
 * @returns {Promise<Array>}
 */
export const fetchActiveBookings = async (tripId) => {
  if (!tripId) return [];
  try {
    const res = await apiRequest(`/bookings/${tripId}/active`);
    const bookings = unwrapArray(res).map((b) => normalizeBooking(b, "active"));
    return bookings;
  } catch (err) {
    console.error("fetchActiveBookings error:", err);
    return [];
  }
};

/**
 * Fetch cancelled bookings for a trip
 * @param {number|string} tripId
 * @returns {Promise<Array>}
 */
export const fetchCancelledBookings = async (tripId) => {
  if (!tripId) return [];
  try {
    const res = await apiRequest(`/bookings/${tripId}/cancelled`);
    const bookings = unwrapArray(res).map((b) => normalizeBooking(b, "cancelled"));
    return bookings;
  } catch (err) {
    console.error("fetchCancelledBookings error:", err);
    return [];
  }
};

/**
 * Cancel a booking and return updated booking
 * @param {number|string} bookingId
 * @param {function} onUpdateSeats - callback to update seats in UI
 */
export const cancelBooking = async (bookingId, onUpdateSeats) => {
  if (!bookingId) throw new Error("Invalid booking ID");
  try {
    const res = await apiRequest(`/bookings/${bookingId}/cancel`, {
      method: "PUT",
    });

    if (res.success) {
      // Update seats locally if callback provided
      if (typeof onUpdateSeats === "function") onUpdateSeats(-1);
      return res;
    } else {
      throw new Error(res.message || "Failed to cancel booking");
    }
  } catch (err) {
    console.error("cancelBooking error:", err);
    throw err;
  }
};