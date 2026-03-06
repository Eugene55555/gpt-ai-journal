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
      showRss,
      rssTitle,
      rssUrl,
      baseUrl,
      "defaultOgImageUrl": defaultOgImage.asset->url,
      fontFamily
    }`,
    {},
    { next: { revalidate: 0 } },
  );

  return {
    name: settings?.title || "AI TALK PRO",
    description:
      settings?.description || "Журнал о будущем интеллекта и технологий",
    footerText:
      settings?.footerText || `© ${new Date().getFullYear()} AI TALK PRO`,
    baseUrl:
      settings?.baseUrl ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://gpt-ai-journal.pages.dev",
    publisher: settings?.title || "Команда AI TALK PRO",
    postsPerPage: 6,
    showRss: settings?.showRss ?? true,
    rssTitle: settings?.rssTitle || "RSS",
    rssUrl: settings?.rssUrl || "/feed.xml",
    defaultOgImageUrl: settings?.defaultOgImageUrl || "",
    fontFamily: settings?.fontFamily || "Inter",
    heroTitle: settings?.heroTitle || "Будущее\nинтеллекта.",
    heroSubtitle:
      settings?.heroSubtitle ||
      "Последние новости, глубокие исследования и обновления нашей платформы.",

    readingTimeText: settings?.readingTimeText || "min read",
    shareTitle: settings?.shareTitle || "Share this article",
    // ДОБАВЛЕНО: Безопасный дефолтный список кнопок, если в админке пусто
    shareOptions: settings?.shareOptions || [
      "twitter",
      "linkedin",
      "facebook",
      "copy",
    ],

    newsletterTitle: settings?.newsletterTitle || "Рассылка",
    newsletterText:
      settings?.newsletterText ||
      "Будьте в курсе последних прорывов в области ИИ.",
    newsletterPlaceholder:
      settings?.newsletterPlaceholder || "Your email address",
    newsletterButton: settings?.newsletterButton || "Подписаться →",

    navigation:
      settings?.navItems && settings.navItems.length > 0
        ? settings.navItems
            .filter((n) => n !== null)
            .map((n) => ({
              name: n.title || "Без названия",
              value: n.value || "",
            }))
        : [
            { name: "Все", value: "" },
            { name: "Исследования", value: "Research" },
            { name: "Продукты", value: "Product" },
            { name: "Безопасность", value: "Safety" },
            { name: "Новости", value: "News" },
          ],
    socials: settings?.socials || [],
  };
}
