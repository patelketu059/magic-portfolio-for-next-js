"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Fade, Row } from "@once-ui-system/core";

import { routes, display, person } from "@/resources";
import { iconLibrary } from "@/resources/icons";
import { ThemeToggle } from "./ThemeToggle";
import type { IconType } from "react-icons";
import styles from "./Header.module.scss";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
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

export default TimeDisplay;

export const Header = () => {
  const pathname = usePathname() ?? "";

  return (
    <>
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
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
        s={{
          position: "fixed",
        }}
      >
        <Row className={`${styles.side} ${styles.left}`} paddingLeft="12" vertical="center" textVariant="label-default-s" style={{ letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            {person.role}
          </Link>
        </Row>
        <Row gap="20" vertical="center" style={{ flex: 1, justifyContent: "center" }}>
          <nav className={styles.navigation}>
            {routes["/"] && (
              <Link href="/" aria-label="Home" className={`${styles.toggleBtn} ${styles.navLink}`} data-active={pathname === "/"}>
                {(() => {
                  const Icon = iconLibrary.home as IconType | undefined;
                  return Icon ? <Icon className={styles.navIcon} aria-hidden /> : null;
                })()}
              </Link>
            )}
            {routes["/work"] && (
              <Link href="/work" aria-label="Projects" className={`${styles.toggleBtn} ${styles.navLink}`} data-active={pathname.startsWith("/work")}>
                {(() => {
                  const Icon = iconLibrary.grid as IconType | undefined;
                  return Icon ? <Icon className={styles.navIcon} aria-hidden /> : null;
                })()}
              </Link>
            )}
            {display.themeSwitcher && (
              <div className={styles.toggleBtn} aria-hidden>
                <ThemeToggle />
              </div>
            )}
          </nav>
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
