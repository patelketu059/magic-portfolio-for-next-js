"use client";

import {
  AvatarGroup,
  Carousel,
  Column,
  Flex,
  Heading,
  SmartLink,
  Text,
} from "@once-ui-system/core";

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
      <div style={{ width: "100%", maxWidth: 850, height: "100%", maxHeight: 400, margin: "0 auto", overflow: "hidden", borderRadius: 16 }}>
              <Carousel
                sizes="480px"
                items={images.map((image) => ({
                  slide: (
                    <div
                      style={{
                        width: "100%",
                        height: "320px",
                        maxHeight: "320px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#000"
                      }}
                    >
                      <img
                        src={image}
                        alt={title}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          display: "block",
                          background: "#000"
                        }}
                      />
                    </div>
                  ),
                  alt: title,
                }))}
              />
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
