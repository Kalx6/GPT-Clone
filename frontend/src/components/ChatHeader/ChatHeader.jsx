import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./ChatHeader.module.css";

export default function ChatHeader() {
  const { user, logout } = useAuth();
  const initial = (user?.email?.[0] || "?").toUpperCase();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span>ChatGPT</span>
        <ChevronDown size={16} />
      </div>
      <div className={styles.right}>
        <div className={styles.avatar} title={user?.email}>
          {initial}
        </div>
        <button
          className={styles.logout}
          onClick={logout}
          title="Log out"
          aria-label="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
