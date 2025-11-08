"use client";
import React from "react";

export function ScrollToTopButton() {
  // Only show after scrolling down a bit
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 120);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return visible ? (
    <button
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        border: "none",
        borderRadius: 24,
        padding: "0.75rem 1.5rem",
        fontSize: 18,
        cursor: "pointer",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        transition: "opacity 0.2s",
      }}
      aria-label="Scroll to top"
    >
      ↑ Top
    </button>
  ) : null;
}
