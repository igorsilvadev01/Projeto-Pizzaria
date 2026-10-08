/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["node:sqlite"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
