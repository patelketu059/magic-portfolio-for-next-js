"use client";

import Link from "next/link";
import { iconLibrary } from "@/resources/icons";
import { ThemeToggle } from "./ThemeToggle";
import type { IconType } from "react-icons";
import styles from "./Header.module.scss";
import { routes, display } from "@/resources";

type HeaderNavProps = {
  pathname: string;
  className?: string;
  onLinkClick?: () => void;
  navRef?: (el: HTMLElement | null) => void;
  ariaHidden?: boolean;
  showLabels?: boolean;
};

export const HeaderNav: React.FC<HeaderNavProps> = ({ pathname, className = "", onLinkClick, navRef, ariaHidden, showLabels = true }) => {
  const navIsOpen = (className || "").includes(styles.open);
  const showThemeLabel = showLabels || navIsOpen;

  return (
    <nav ref={(el) => navRef?.(el as HTMLElement | null)} aria-hidden={ariaHidden ? true : undefined} className={`${styles.navigation} ${className}`}>
      {routes["/"] && (
        <Link href="/" aria-label="Home" title="Home" className={`${styles.toggleBtn} ${styles.navLink}`} data-active={pathname === "/"} onClick={() => onLinkClick?.()}>
          {(() => {
            const Icon = iconLibrary.home as IconType | undefined;
            return Icon ? <Icon className={styles.navIcon} aria-hidden /> : null;
          })()}
          {showLabels && <span className={styles.navLabel}>Home</span>}
        </Link>
      )}

      <Link href="/experience" aria-label="Experience" title="Experience" className={`${styles.toggleBtn} ${styles.navLink}`} data-active={pathname.startsWith("/experience") || pathname === "/experience"} onClick={() => onLinkClick?.()}>
        <span className={styles.navIcon} aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden>
            <title>Experience</title>
            <path d="M10 2H14V4H19C20.1 4 21 4.9 21 6V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V6C3 4.9 3.9 4 5 4H10V2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 10H17V8H7V10Z" fill="currentColor" />
          </svg>
        </span>
        {showLabels && <span className={styles.navLabel}>Experience</span>}
      </Link>

      {routes["/work"] && (
        <Link href="/work" aria-label="Projects" title="Projects" className={`${styles.toggleBtn} ${styles.navLink}`} data-active={pathname.startsWith("/work")} onClick={() => onLinkClick?.()}>
          {(() => {
            const Icon = iconLibrary.grid as IconType | undefined;
            return Icon ? <Icon className={styles.navIcon} aria-hidden /> : null;
          })()}
          {showLabels && <span className={styles.navLabel}>Projects</span>}
        </Link>
      )}

      {display.themeSwitcher && (
        <div className={styles.toggleBtn} aria-hidden title="Theme">
          <ThemeToggle />
          {showThemeLabel && <span className={styles.navLabel}>Theme</span>}
        </div>
      )}
    </nav>
  );
};

export default HeaderNav;
