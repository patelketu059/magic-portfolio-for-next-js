import { Meta } from "@once-ui-system/core";
import { home, baseURL } from "@/resources";
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

export default function Home() {
  return <HomeClient />;
}
