"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  key: string;
  node: React.ReactNode;
  alt?: string;
};

interface PostsCarouselProps {
  slides: Slide[];
  interval?: number; // ms
}

export const PostsCarousel: React.FC<PostsCarouselProps> = ({ slides, interval = 3000 }) => {
  const [index, setIndex] = useState(0);
  const mounted = useRef(true);
  const hoverRef = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const t = setInterval(() => {
      if (hoverRef.current) return; // pause on hover
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearInterval(t);
  }, [slides, interval]);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
      style={{ width: "100%", overflow: "hidden", position: "relative" }}
      aria-roledescription="carousel"
    >
      <div
        style={{
          display: "flex",
          transition: "transform 480ms ease",
          transform: `translateX(-${index * 100}%)`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map((s) => (
          <div key={s.key} style={{ width: `${100 / slides.length}%`, flex: "0 0 auto" }}>
            {s.node}
          </div>
        ))}
      </div>

      {/* Simple indicators */}
      <div style={{ position: "absolute", left: 12, bottom: 12, display: "flex", gap: 8 }}>
        {slides.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: 8,
              height: 8,
              borderRadius: 8,
              border: "none",
              padding: 0,
              background: i === index ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PostsCarousel;
