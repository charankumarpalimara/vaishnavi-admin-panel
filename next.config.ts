import path from "node:path";
import fs from "node:fs";
import type { NextConfig } from "next";

// If in monorepo, allow Turbopack to resolve packages hoisted to parent workspace root
const hasParentMonorepo = fs.existsSync(
  path.resolve(__dirname, "..", "package.json"),
);

const nextConfig: NextConfig = {
  turbopack: {
    root: hasParentMonorepo
      ? path.resolve(__dirname, "..")
      : path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
