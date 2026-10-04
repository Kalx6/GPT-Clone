import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./AuthPage.module.css";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (isLogin) await login(email, password);
      else await register(email, password);
      // On success this screen unmounts, so there is nothing to reset
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(isLogin ? "register" : "login");
    setError("");
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>

        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className={styles.input}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className={styles.input}
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          minLength={isLogin ? undefined : 8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && <p className={styles.hint}>At least 8 characters.</p>}

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
        </button>

        <p className={styles.switch}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" className={styles.link} onClick={switchMode}>
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </form>
    </div>
  );
}
