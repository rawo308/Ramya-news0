import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Article images are admin-entered URLs (Cloudinary or any direct
      // image link), not public user input, so allow any https host.
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
