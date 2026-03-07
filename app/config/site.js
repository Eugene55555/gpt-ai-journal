import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

export async function getSiteSettings() {
  const settings = await client.fetch(
    `*[_id == "siteSettings"][0]{
      ...,
      navItems[]->{ title, value },
      socials[]{ platform, url, iconName },
      showRss, rssTitle, rssUrl, baseUrl,
      "defaultOgImageUrl": defaultOgImage.asset->url,
      fontFamily
    }`,
    {},
    { next: { revalidate: 0 } },
  );

  return {
    name: settings?.title || "AI TALK",
    description:
      settings?.description ||
      "A journal about the future of intelligence and technology.",
    footerText:
      settings?.footerText ||
      `© ${new Date().getFullYear()} AI TALK. All rights reserved.`,
    baseUrl:
      settings?.baseUrl ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://gpt-ai-journal.pages.dev",
    publisher: settings?.title || "AI TALK Team",
    postsPerPage: 6,
    showRss: settings?.showRss ?? true,
    rssTitle: settings?.rssTitle || "RSS Feed",
    rssUrl: settings?.rssUrl || "/feed.xml",
    defaultOgImageUrl: settings?.defaultOgImageUrl || "",
    fontFamily: settings?.fontFamily || "Inter",
    heroTitle: settings?.heroTitle || "The future of\nintelligence.",
    heroSubtitle:
      settings?.heroSubtitle ||
      "Latest news, deep research, and updates from our platform.",
    readingTimeText: settings?.readingTimeText || "min read",
    shareTitle: settings?.shareTitle || "Share this article",
    shareOptions: settings?.shareOptions || [
      "twitter",
      "linkedin",
      "facebook",
      "copy",
    ],

    // ДОБАВЛЕНО: Получаем настройки Sticky Bar
    showStickyBar: settings?.showStickyBar ?? true,
    stickyShareOptions: settings?.stickyShareOptions || [
      "twitter",
      "linkedin",
      "copy",
    ],

    newsletterTitle: settings?.newsletterTitle || "Newsletter",
    newsletterText:
      settings?.newsletterText ||
      "Stay up to date with the latest AI breakthroughs.",
    newsletterPlaceholder:
      settings?.newsletterPlaceholder || "Your email address",
    newsletterButton: settings?.newsletterButton || "Subscribe →",
    navigation:
      settings?.navItems && settings.navItems.length > 0
        ? settings.navItems
            .filter((n) => n !== null)
            .map((n) => ({
              name: n.title || "Untitled",
              value: n.value || "",
            }))
        : [
            { name: "All", value: "" },
            { name: "Research", value: "Research" },
            { name: "Product", value: "Product" },
            { name: "Safety", value: "Safety" },
            { name: "News", value: "News" },
          ],
    socials: settings?.socials || [],
  };
}
