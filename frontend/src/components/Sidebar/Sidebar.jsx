import { useEffect } from "react";
import {
  MessageSquare,
  Search,
  Image as ImageIcon,
  LayoutGrid,
  Microscope,
  Code2,
  FolderKanban,
  PanelLeftClose,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const MOBILE_QUERY = "(max-width: 767px)";

export default function Sidebar({ isOpen, onClose, onToggle }) {
  // Escape closes the drawer (on mobile only)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && window.matchMedia(MOBILE_QUERY).matches) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleItemClick = (event) => {
    event.preventDefault(); // these items are placeholders for now
    if (window.matchMedia(MOBILE_QUERY).matches) onClose();
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? "" : styles.overlayHidden}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* inert keeps a closed sidebar out of keyboard focus and screen readers */}
      <aside
        className={`${styles.sidebar} ${isOpen ? "" : styles.collapsed}`}
        inert={!isOpen}
      >
        <div className={styles.header}>
          <div className={styles.logo}>
            <button
              className={styles.iconBtn}
              onClick={onToggle}
              aria-label="Close sidebar"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>
          <button className={styles.iconBtn}>
            <MessageSquare size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <a href="#" className={styles.item} onClick={handleItemClick}>
            <MessageSquare size={18} />
            <span>New chat</span>
          </a>
          <a href="#" className={styles.item} onClick={handleItemClick}>
            <Search size={18} />
            <span>Search chats</span>
          </a>
          <a href="#" className={styles.item} onClick={handleItemClick}>
            <ImageIcon size={18} />
            <span>Images</span>
          </a>
          <a href="#" className={styles.item} onClick={handleItemClick}>
            <LayoutGrid size={18} />
            <span>Apps</span>
          </a>
          <a href="#" className={styles.item} onClick={handleItemClick}>
            <Microscope size={18} />
            <span>Deep research</span>
          </a>
          <a href="#" className={styles.item} onClick={handleItemClick}>
            <Code2 size={18} />
            <span>Codex</span>
          </a>
          <a href="#" className={styles.item} onClick={handleItemClick}>
            <FolderKanban size={18} />
            <span>Projects</span>
          </a>
        </nav>
      </aside>
    </>
  );
}
