"use client";

import {
  AvatarGroup,
  Column,
  Flex,
  Heading,
  SmartLink,
  Text,
} from "@once-ui-system/core";
import { useEffect, useRef, useState } from "react";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
  isProjectPage?: boolean;
  cardId?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
  isProjectPage = false,
  cardId,
}) => {
  return (
    <Column fillWidth gap="m">
      <div style={{ width: "100%", maxWidth: "100%", height: "100%", margin: "0 auto", overflow: "hidden", borderRadius: "1rem" }}>
        {/* Simple image carousel with 3s autoplay */}
        <ImageCarousel images={images} title={title} id={cardId} />
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "0.75rem 0 1.5rem 0" }}>
        {title && (
          <Heading
            as="h2"
            wrap="balance"
            variant={isProjectPage ? "display-strong-m" : "heading-strong-xl"}
            style={{ textAlign: "center", width: "100%", fontSize: isProjectPage ? "2.5rem" : undefined }}
          >
            {title}
          </Heading>
        )}
        {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
          <Column flex={7} gap="16">
            {/* AvatarGroup removed from carousel and card */}
            {!isProjectPage && description?.trim() && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap", wordBreak: "break-word", textAlign: "center", maxWidth: "clamp(520px, 65vw, 900px)" }}>
                <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak" style={{ margin: 0, wordBreak: "break-word", whiteSpace: "pre-line", textAlign: "center" }}>
                  {description}
                  {!isProjectPage && content?.trim() && (
                    <SmartLink
                      suffixIcon="arrowRight"
                      style={{ marginLeft: 8, display: "inline-block", verticalAlign: "middle", width: "fit-content", position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                      href={href}
                      onClick={(e) => {
                        // Prevent parent carousel/slide from intercepting clicks so the link works
                        e.stopPropagation();
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      <Text variant="body-default-s" style={{ display: "inline" }}>Read case study</Text>
                    </SmartLink>
                  )}
                </Text>
              </div>
            )}
            <Flex gap="24" wrap>
              {link && (
                <SmartLink
                  suffixIcon="arrowUpRightFromSquare"
                  style={{ margin: "0", width: "fit-content", position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                  href={link}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <Text variant="body-default-s">View project</Text>
                </SmartLink>
              )}
            </Flex>
          </Column>
        )}
  </div>
    </Column>
  );
};

// Simple image carousel component used inside ProjectCard
const ImageCarousel: React.FC<{ images: string[]; title?: string; interval?: number; id?: string }> = ({ images = [], title = "", interval = 3000, id }) => {
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const hoverRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!images || images.length <= 1 || !isMounted) return;
    const t = setInterval(() => {
      if (hoverRef.current) return;
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images, interval, isMounted]);

  const handleMouseEnter = () => {
    hoverRef.current = true;
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
  };

  const carouselHeight = "clamp(220px, 30vw, 420px)";

  if (!images || images.length === 0) {
    return (
      <div style={{ width: "100%", height: carouselHeight, display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a1a" }}>
        <Text variant="body-default-s" onBackground="neutral-weak">No images available</Text>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", position: "relative", overflow: "hidden", height: carouselHeight }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* shiftPercent is percent of the inner container width to move so the correct child is visible */}
      {/** For an inner width of N*100% the correct translate percent (relative to inner) is index*(100/N)% */}
      <div style={{ display: "flex", transition: isMounted ? "transform 480ms ease" : "none", transform: `translateX(-${(index * 100) / images.length}%)`, width: `${images.length * 100}%`, height: "100%" }}>
        {images.map((img, i) => (
          <div key={`${id ?? title}-${img}-${i}`} style={{ width: `${100 / images.length}%`, flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", height: "100%" }}>
            {/* Use intrinsic image size and constrain with maxWidth/maxHeight so image keeps original aspect and is scaled down */}
            <img 
              src={img} 
              alt={`${title} screenshot ${i + 1}`} 
              style={{ width: "auto", maxWidth: "100%", height: "auto", maxHeight: carouselHeight, objectFit: "contain", display: "block" }} 
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "0.75rem", display: "flex", justifyContent: "center", gap: "0.5rem", zIndex: 10 }}>
          {images.map((img, i) => (
            <button 
              key={`${id ?? title}-${img}-dot-${i}`} 
              type="button" 
              onClick={() => setIndex(i)} 
              style={{ 
                width: "0.5rem", 
                height: "0.5rem", 
                borderRadius: "0.5rem", 
                border: "none", 
                padding: 0, 
                background: i === index ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                transition: "background 200ms ease"
              }} 
              aria-label={`View slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
