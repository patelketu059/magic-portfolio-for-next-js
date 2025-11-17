"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { Fade, Row } from "@once-ui-system/core";

import { display, person } from "@/resources";
import HeaderNav from "./HeaderNav";
import styles from "./Header.module.scss";

export type TimeDisplayProps = {
  timeZone: string;
  locale?: string;
};

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
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

export const Header: React.FC = () => {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(max-width: 1024px)");
    const update = () => setIsMobile(m.matches);
    update();
    m.addEventListener?.("change", update);
    return () => m.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const navEl = navRef.current;
    if (!navEl) return () => { document.body.style.overflow = previousOverflow; };

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

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown as EventListener);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown as EventListener);
      document.body.style.overflow = previousOverflow;
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
          />

          <button
            className={styles.mobileToggle}
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((s) => !s)}
            ref={toggleRef}
            type="button"
          >
            <span className={mobileOpen ? styles.hamburgerOpen : styles.hamburger} aria-hidden />
          </button>
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
