import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // If your disk is full (common in containers), you can move Next's output directory
  // to a different mount (example: /dev/shm) via NEXT_DIST_DIR.
  // Default remains ".next".
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

export default nextConfig;
