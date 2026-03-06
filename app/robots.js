import { getSiteSettings } from "./config/site";

export default async function robots() {
  const siteConfig = await getSiteSettings();
  const baseUrl = siteConfig.baseUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
