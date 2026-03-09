/**
 * API client for backend. Uses VITE_API_URL and sends Bearer token from localStorage.
 */

// Dev: use proxy. Prod: Railway backend (or VITE_API_URL from env).
const BASE_URL = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_URL || "https://micropay-backend-production.up.railway.app");

function getToken() {
  return localStorage.getItem("staffToken");
}

export function setToken(token) {
  if (token) localStorage.setItem("staffToken", token);
  else localStorage.removeItem("staffToken");
}

export async function api(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (networkErr) {
    const err = new Error("Network error. Backend chal raha hai? URL check karein.");
    err.data = { message: err.message };
    throw err;
  }
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    const err = new Error(data.message || res.statusText || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** Staff auth */
export const staffApi = {
  login: (email, password) =>
    api("/api/staff/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => api("/api/staff/me"),
  logout: () => setToken(null),
};

/** FAQs */
export const faqApi = {
  list: () => api("/api/staff/faqs"),
  create: (body) => api("/api/staff/faqs", { method: "POST", body: JSON.stringify(body) }),
  bulkCreate: (faqs) =>
    api("/api/staff/faqs/bulk", { method: "POST", body: JSON.stringify({ faqs }) }),
  update: (id, body) =>
    api(`/api/staff/faqs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id) => api(`/api/staff/faqs/${id}`, { method: "DELETE" }),
};

/** Managers (admin only) */
export const managersApi = {
  list: () => api("/api/staff/managers"),
  create: (body) =>
    api("/api/staff/managers", { method: "POST", body: JSON.stringify(body) }),
  delete: (id) => api(`/api/staff/managers/${id}`, { method: "DELETE" }),
};
