import { notFound } from "next/navigation";
import { getPosts } from "@/utils/utils";
import {
  Meta,
  Schema,
  AvatarGroup,
  Button,
  Column,
  Flex,
  Heading,
  Media,
  Text,
  SmartLink,
  Row,
  Avatar,
  Line,
} from "@once-ui-system/core";
import { baseURL, about, person, work, hiddenProjects } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import { ProjectCard } from "@/components/ProjectCard";
import { Metadata } from "next";
import { Projects } from "@/components/work/Projects";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const posts = getPosts(["src", "app", "work", "projects"]);
  let post = posts.find((post) => post.slug === slugPath);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image || `/api/og/generate?title=${post.metadata.title}`,
    path: `${work.path}/${post.slug}`,
  });
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  let post = getPosts(["src", "app", "work", "projects"]).find((post) => post.slug === slugPath);

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  // For specific projects we want images to be centered relative to the full viewport
  const wideImageSlugs = [
    "AI-image-generation",
    "Neural-Machine-Translation",
  ];
  const isWideImagePage = wideImageSlugs.includes(post.slug);

  return (
      <Column
      as="section"
      horizontal="center"
      gap="l"
      style={{
        width: "100%",
        maxWidth: "clamp(640px, 90vw, 950px)",
        margin: "0 auto",
        /* Responsive vertical (top) and horizontal gutters: vertical uses clamp, horizontal uses global gutter */
        padding: "clamp(1.5rem, 4vw, 3rem) var(--gutter-horizontal)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%" }}>
        <ProjectCard
          href={post.metadata.link || post.slug}
          images={post.metadata.images || []}
          title={post.metadata.title}
          content={post.content}
          description={post.metadata.summary || ""}
          avatars={avatars}
          link={post.metadata.link || ""}
          isProjectPage={true}
        />
      </div>
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${post.slug}`}
        title={post.metadata.title}
        description={post.metadata.summary}
        datePublished={post.metadata.publishedAt}
        dateModified={post.metadata.publishedAt}
        image={
          post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`
        }
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      {/* ProjectCard now handles the carousel and project info at the top */}
      {
        // If this project needs images centered across the full page, add a modifier class
      }
      <Column
        fillWidth
        horizontal="center"
        as="article"
        className={`projectArticle${isWideImagePage ? ' page-wide-images' : ''}`}
        style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
      >
        <CustomMDX source={post.content} />
      </Column>
      <Column
        fillWidth
        gap="40"
        horizontal="center"
        marginTop="40"
        style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
      >
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          Related projects
        </Heading>
        <Projects exclude={[post.slug, ...hiddenProjects]} range={[2]} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
