import { notFound } from "next/navigation";

// Blog has been removed from this site. Return 404 for /blog.
export default function Blog() {
  notFound();
}
