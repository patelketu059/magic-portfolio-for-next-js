"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import bgStyles from "@/app/global-background.module.css";

type Props = {
  routes?: string[]; // show only on these routes; undefined => show everywhere
  preserve?: "meet" | "slice";
};

export default function GlobalBackground({ routes, preserve = "meet" }: Props) {
  const pathname = usePathname();
  const artRef = useRef<SVGGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (routes && pathname) {
      setVisible(routes.includes(pathname));
    }
  }, [pathname, routes]);

  useEffect(() => {
    const art = artRef.current;
    const svg = svgRef.current;
    if (!art || !svg) return;

    function recenter() {
      requestAnimationFrame(() => {
        try {
          const svgEl = svgRef.current;
          const artEl = artRef.current;
          if (!svgEl || !artEl) return;

          const svgRect = svgEl.getBoundingClientRect();
          const viewportCx = window.innerWidth / 2;
          const viewportCy = window.innerHeight / 2;

          // Calculate offset to center the SVG's internal center point (700, 400) in viewport
          const svgCx = svgRect.left + svgRect.width / 2;
          const svgCy = svgRect.top + svgRect.height / 2;
          const dx = viewportCx - svgCx;
          const dy = viewportCy - svgCy;

          // Apply translate to the artwork group
          artEl.style.transform = `translate(${dx}px, ${dy}px)`;
          artEl.style.transition = "transform 320ms ease";
        } catch (e) {
          // ignore
        }
      });
    }

    // initial center with delay for SVG rendering
    setTimeout(() => recenter(), 100);

    // handle resizes and visualViewport changes (zoom) and orientation
    const onResize = () => recenter();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onResize);
      window.visualViewport.addEventListener("scroll", onResize);
    }

    // also recenter after fonts/images load
    const loadHandler = () => recenter();
    window.addEventListener("load", loadHandler);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onResize);
        window.visualViewport.removeEventListener("scroll", onResize);
      }
      window.removeEventListener("load", loadHandler);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={bgStyles.globalBackground} aria-hidden>
      <svg
        ref={svgRef}
        className={bgStyles.composite}
        viewBox="-700 -400 1400 800"
        preserveAspectRatio={preserve === "slice" ? "xMidYMid slice" : "xMidYMid meet"}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Decorative rings"
      >
        <title>Decorative rings</title>

        <g ref={artRef} className={bgStyles.artwork}>
          <g className={bgStyles.ringsGroup} fill="none" strokeWidth="0.6">
            <g className={bgStyles.ringWrap1} transform="rotate(90)">
              {/* slightly broken / textured vertical figure-eight ring */}
              <path
                className={`${bgStyles.ring} ${bgStyles.wob1} ${bgStyles.brokenRing} ${bgStyles.streak1}`}
                d="M0 -340
                   C120 -300 140 -120 40 -20
                   C-60 80 -160 260 0 340
                   C160 260 80 80 -40 -20
                   C-140 -120 -120 -300 0 -340 Z"
                fill="none"
                stroke="#2e133f"
                strokeOpacity="0.04"
                transform="translate(0,-12) scale(1.03)"
              />
            </g>
            <ellipse className={`${bgStyles.ring} ${bgStyles.brokenRing} ${bgStyles.streak2}`} cx="0" cy="0" rx="540" ry="270" stroke="#2b0b3a" strokeOpacity="0.035" transform="translate(-6,6) scale(1.02) rotate(45)" />
            <g className={bgStyles.ringWrap2} transform="rotate(-30)">
              <ellipse className={`${bgStyles.ring} ${bgStyles.wob2} ${bgStyles.brokenRing} ${bgStyles.streak2}`} cx="0" cy="0" rx="440" ry="220" stroke="#1f1630" strokeOpacity="0.03" transform="translate(4,-6) scale(1.01)" />
            </g>
            <ellipse className={`${bgStyles.ring} ${bgStyles.brokenRing} ${bgStyles.streak3}`} cx="0" cy="0" rx="340" ry="170" stroke="#161224" strokeOpacity="0.028" transform="translate(-2,4) scale(1.015) rotate(60)" />
            <g className={bgStyles.ringWrap3} transform="rotate(135)">
              <ellipse className={`${bgStyles.ring} ${bgStyles.wob3} ${bgStyles.brokenRing} ${bgStyles.streak3}`} cx="0" cy="0" rx="240" ry="120" stroke="#0f0d16" strokeOpacity="0.025" transform="translate(2,-3) scale(1.02)" />
            </g>
          </g>

          {/* infinity symbols removed per user request */}
        </g>
      </svg>
    </div>
  );
}
