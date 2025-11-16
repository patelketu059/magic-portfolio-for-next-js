"use client";

import { useEffect, useState } from "react";

interface TypingAnimationProps {
  text: string;
  speed?: number;
}

export function TypingAnimation({ text, speed = 150 }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Typing effect
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    // Cursor blink effect
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      {displayedText}
      <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
    </span>
  );
}
