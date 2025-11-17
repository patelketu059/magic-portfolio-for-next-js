import { Meta } from "@once-ui-system/core";
import { home, baseURL, hiddenProjects } from "@/resources";
import HomeClient from "./HomeClient";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default async function Home() {
  // Request the filtered project list from the server API so server-rendered HTML
  // contains the visible projects (keeps data-fetching at the API layer).
  let initialPosts = [];
  try {
    const excludes = hiddenProjects && hiddenProjects.length > 0 ? `?exclude=${encodeURIComponent(hiddenProjects.join(","))}` : "";
    // Use a relative URL so the request targets the current deployment (works in Vercel previews)
    const res = await fetch(`/api/projects${excludes}`);
    if (res.ok) {
      const body = await res.json();
      initialPosts = body.posts || [];
    }
  } catch (e) {
    // swallow — fallback to empty list
    initialPosts = [];
  }

  return <HomeClient initialPosts={initialPosts} />;
}
