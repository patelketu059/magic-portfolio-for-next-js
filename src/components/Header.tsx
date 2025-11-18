"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { Fade, Row } from "@once-ui-system/core";

import { display, person } from "@/resources";
import HeaderNav from "./HeaderNav";
import styles from "./Header.module.scss";

export const TimeDisplay: React.FC<{ timeZone: string; locale?: string }> = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

const Header: React.FC = () => {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // Track whether viewport is at mobile width so we can set aria-hidden appropriately
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(max-width: 1024px)");
    const update = () => setIsMobile(m.matches);
    update();
    m.addEventListener?.("change", update);
    return () => m.removeEventListener?.("change", update);
  }, []);

  // Focus trap + ESC-to-close + body-scroll lock when mobile nav is open
  useEffect(() => {
    const hasBody = typeof document !== "undefined" && !!document.body;

    if (!mobileOpen) {
      if (hasBody) {
        try {
          document.body.style.overflow = "";
        } catch (e) {}
      }
      return;
    }

    const previousOverflow = hasBody ? document.body.style.overflow : "";
    if (hasBody) {
      try {
        document.body.style.overflow = "hidden";
      } catch (e) {}
    }

    const navEl = navRef.current;
    if (!navEl) return () => {
      if (hasBody) {
        try { document.body.style.overflow = previousOverflow; } catch (e) {}
      }
    };

    const focusable = Array.from(
      navEl.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (first) first.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }

      if (e.key === "Tab") {
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    const onPointerDown = (e: PointerEvent | MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      const navEl = navRef.current;
      const toggleEl = toggleRef.current;
      if (navEl && !navEl.contains(target) && toggleEl && !toggleEl.contains(target)) {
        setMobileOpen(false);
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("pointerdown", onPointerDown as EventListener);
    }

    return () => {
      if (typeof document !== "undefined") {
        try { document.removeEventListener("keydown", onKeyDown); } catch (e) {}
        try { document.removeEventListener("pointerdown", onPointerDown as EventListener); } catch (e) {}
      }
      if (hasBody) {
        try { document.body.style.overflow = previousOverflow; } catch (e) {}
      }
    };
  }, [mobileOpen]);

  return (
    <>
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      <Fade hide s={{ hide: false }} fillWidth position="fixed" bottom="0" to="top" height="80" zIndex={9} />

      <Row
        fitHeight
        className={styles.position}
        position="sticky"
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        paddingX="40"
        horizontal="between"
        vertical="center"
        s={{ position: "fixed" }}
      >
        <Row className={`${styles.side} ${styles.left}`} paddingLeft="12" vertical="center" textVariant="label-default-s" style={{ letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
          <Link href="/" aria-label="Home" className={styles.roleText} style={{ textDecoration: "none", color: "inherit" }}>
            {person.role}
          </Link>
        </Row>

        <Row gap="20" vertical="center" style={{ flex: 1, justifyContent: "center" }}>
          <HeaderNav
            pathname={pathname}
            navRef={(el) => { navRef.current = el; }}
            className={mobileOpen ? styles.open : ""}
            onLinkClick={() => setMobileOpen(false)}
            ariaHidden={isMobile && !mobileOpen}
            showLabels={!isMobile}
          />

          <div className={styles.mobileToggleWrap}>
          <button
            className={styles.mobileToggle}
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((s) => !s)}
            ref={toggleRef}
            type="button"
          >
            <span className={styles.navIcon} aria-hidden>
              {mobileOpen ? (
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden>
                  <title>Close menu</title>
                  <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden>
                  <title>Open menu</title>
                  <path d="M3 6H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 12H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 18H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </button>
            {/* mobile-only role label shown beneath the hamburger on small viewports */}
            <div className={styles.mobileRole} aria-hidden={false}>{person.role}</div>
            </div>
        </Row>

        <Row className={`${styles.side} ${styles.right}`} gap="12" vertical="center">
          {display.time && (
            <Row s={{ hide: true }}>
              <TimeDisplay timeZone={person.location} />
            </Row>
          )}
        </Row>
      </Row>
    </>
  );
};

export default Header;
/* removed duplicated trailing content */
