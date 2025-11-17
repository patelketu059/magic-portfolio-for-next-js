import { Meta } from "@once-ui-system/core";
import { home, baseURL, hiddenProjects } from "@/resources";
import HomeClient from "./HomeClient";
import { getPosts } from "@/utils/utils";

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
  // Read MDX files directly on the server first so preview deployments always render content.
  const allLocal = getPosts(["src", "app", "work", "projects"]);
  let initialPosts = allLocal.filter((p) => !hiddenProjects.includes(p.slug));

  // Optionally try the API to get an authoritative, possibly dynamic set — if it succeeds,
  // override the local list. This is best-effort and won't block rendering.
  try {
    const excludes = hiddenProjects && hiddenProjects.length > 0 ? `?exclude=${encodeURIComponent(hiddenProjects.join(","))}` : "";
    const res = await fetch(`/api/projects${excludes}`);
    if (res.ok) {
      const body = await res.json();
      if (body?.posts && Array.isArray(body.posts) && body.posts.length > 0) {
        initialPosts = body.posts;
      }
    }
  } catch (e) {
    // ignore and keep local posts
  }

  console.log('[DEBUG Home] initialPosts count (server):', Array.isArray(initialPosts) ? initialPosts.length : 0);

  return <HomeClient initialPosts={initialPosts} />;
}
