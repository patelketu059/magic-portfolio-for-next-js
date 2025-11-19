import { notFound } from "next/navigation";

// Blog route removed. Return 404 for /blog.
export default function Blog() {
  notFound();
}
