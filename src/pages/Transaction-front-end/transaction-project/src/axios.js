import axios from "axios";

// ===============================
// GLOBAL AXIOS CONFIG
// ===============================

// Backend URL
axios.defaults.baseURL = "http://127.0.0.1:8000/api/v1";
axios.defaults.withCredentials = true; // send refresh cookies

// =================================
// REQUEST INTERCEPTOR
// Adds Access Token Automatically
// =================================
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =================================
// RESPONSE INTERCEPTOR
// Auto Refresh + Retry failed request
// =================================
axios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Token expired → try refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint (refresh token sent automatically via cookie)
        const res = await axios.post("/token/refresh/", {});

        const newAccess = res.data.access;
        localStorage.setItem("access_token", newAccess);

        // Set new token into original request header
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

        // Retry original API request
        return axios(originalRequest);

      } catch (err) {
        // Refresh failed → force logout
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
