import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "pg"],
  // In development, allow HMR/websocket connections from external hosts
  // (e.g. an ngrok URL). Set NEXT_ALLOWED_DEV_ORIGIN in your .env
  // or replace the default string below with your host.
  allowedDevOrigins: [process.env.NEXTAUTH_URL ?? "vexingly-subtract-cosmos.ngrok-free.dev"],
}

export default nextConfig