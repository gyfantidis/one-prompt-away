import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Το /admin/analytics δεν έχει λόγο να μπει σε index.
      disallow: ["/admin", "/api/"],
    },
    sitemap: "https://oneprompt.gr/sitemap.xml",
    host: "https://oneprompt.gr",
  };
}
