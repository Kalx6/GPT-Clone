import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  api,
  getToken,
  setToken,
  setUnauthorizedHandler,
} from "../services/api";

const USER_KEY = "authUser";
const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

function writeStoredUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* storage blocked */
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken);
  const [user, setUser] = useState(readStoredUser);

  const saveSession = useCallback((newToken, newUser) => {
    setToken(newToken);
    writeStoredUser(newUser);
    setTokenState(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => saveSession(null, null), [saveSession]);

  // Lets the axios interceptor log the user out when the token is rejected
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  const login = useCallback(
    async (email, password) => {
      const response = await api.post("/auth/login", { email, password });
      saveSession(response.data.data.token, response.data.data.user);
    },
    [saveSession],
  );

  const register = useCallback(
    async (email, password) => {
      await api.post("/auth/register", { email, password });
      await login(email, password);
    },
    [login],
  );

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(token), login, register, logout }),
    [user, token, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
