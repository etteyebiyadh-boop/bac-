import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["framer-motion", "lucide-react"]
};

export default nextConfig;
