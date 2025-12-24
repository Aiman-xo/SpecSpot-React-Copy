import axios from "axios";

// ===============================
// AXIOS INSTANCE
// ===============================
const api = axios.create({
  baseURL: "https://specspot.duckdns.org/api/v1",
  withCredentials: true, // send refresh cookie
});

// ===============================
// REQUEST INTERCEPTOR
// Adds access token from sessionStorage
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// RESPONSE INTERCEPTOR
// Auto refresh + retry
// ===============================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token is sent via HttpOnly cookie
        const res = await axios.post("https://specspot.duckdns.org/api/token/refresh/",{},{
          withCredentials:true
        });

        const newAccess = res.data.access_token;
        // console.log(newAccess);

        // Store new access token in sessionStorage
        sessionStorage.setItem("access_token", newAccess);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);

      } catch (err) {
        console.log(err)
        // Refresh failed → logout
        
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
