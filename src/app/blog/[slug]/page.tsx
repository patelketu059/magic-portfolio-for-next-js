import { notFound } from "next/navigation";

// Blog posts removed — return 404 for /blog/[slug]
export default function BlogPost() {
  notFound();
}
