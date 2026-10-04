import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AuthPage from "./components/AuthPage/AuthPage.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

function Root() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <App /> : <AuthPage />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </StrictMode>,
);
