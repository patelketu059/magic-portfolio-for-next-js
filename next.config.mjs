import mdx from "@next/mdx";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Emulate __dirname in ESM modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next.js uses this repo root when tracing output files
  outputFileTracingRoot: path.join(__dirname),
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default withMDX(nextConfig);
