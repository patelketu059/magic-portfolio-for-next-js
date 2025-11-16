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
}) => {
  return (
    <Column fillWidth gap="m">
      <div style={{ width: "100%", maxWidth: "100%", height: "100%", margin: "0 auto", overflow: "hidden", borderRadius: 16 }}>
        {/* Simple image carousel with 3s autoplay */}
        <ImageCarousel images={images} title={title} />
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0 24px 0" }}>
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, flexWrap: "wrap", wordBreak: "break-word", textAlign: "center", maxWidth: 900 }}>
                <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak" style={{ margin: 0, wordBreak: "break-word", whiteSpace: "pre-line", textAlign: "center" }}>
                  {description}
                  {!isProjectPage && content?.trim() && (
                    <SmartLink
                      suffixIcon="arrowRight"
                      style={{ marginLeft: 8, display: "inline-block", verticalAlign: "middle", width: "fit-content" }}
                      href={href}
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
                  style={{ margin: "0", width: "fit-content" }}
                  href={link}
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
const ImageCarousel: React.FC<{ images: string[]; title?: string; interval?: number }> = ({ images = [], title = "", interval = 3000 }) => {
  const [index, setIndex] = useState(0);
  const hoverRef = useRef(false);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const t = setInterval(() => {
      if (hoverRef.current) return;
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div style={{ width: "100%", position: "relative", overflow: "hidden" }} onMouseEnter={() => (hoverRef.current = true)} onMouseLeave={() => (hoverRef.current = false)}>
      <div style={{ display: "flex", transition: "transform 480ms ease", transform: `translateX(-${index * 100}%)`, width: `${images.length * 100}%` }}>
        {images.map((img, i) => (
          <div key={`${img}-${i}`} style={{ width: `${100 / images.length}%`, flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
            <img src={img} alt={`${title} - ${i + 1}`} style={{ width: "100%", height: "320px", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 12, bottom: 12, display: "flex", gap: 8 }}>
        {images.map((_, i) => (
          <button key={`dot-${i}`} type="button" onClick={() => setIndex(i)} style={{ width: 8, height: 8, borderRadius: 8, border: "none", padding: 0, background: i === index ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)" }} />
        ))}
      </div>
    </div>
  );
};
