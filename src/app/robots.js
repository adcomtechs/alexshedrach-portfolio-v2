import { siteConfig } from "@/lib/config/site";

const isProduction = process.env.VERCEL_ENV === "production";

export default function robots() {
  return {
    rules: isProduction
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/"],
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
