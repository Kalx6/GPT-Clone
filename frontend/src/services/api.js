import axios from "axios";

const TOKEN_KEY = "authToken";

let token = null;
try {
  token = localStorage.getItem(TOKEN_KEY);
} catch {
  /* storage blocked: token stays in memory only */
}

let onUnauthorized = () => {};

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/api`,
});

export function getToken() {
  return token;
}

export function setToken(newToken) {
  token = newToken;
  try {
    if (newToken) localStorage.setItem(TOKEN_KEY, newToken);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage blocked */
  }
}

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

api.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith("/auth/");
    // A 401 from login/register just means wrong credentials, not an expired session
    if (error.response?.status === 401 && token && !isAuthCall) {
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);
