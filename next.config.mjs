/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["placehold.jp"],
    remotePatterns: [
      { protocol: "https", hostname: "placehold.jp" },
      { protocol: "https", hostname: "images.microcms-assets.io" },
      { protocol: "https", hostname: "jsljepgevyxoqrdhxgcw.supabase.co" },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
