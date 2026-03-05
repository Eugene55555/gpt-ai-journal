import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

export async function getSiteSettings() {
  // ИСПРАВЛЕНО: Теперь запрашиваем navItems[]-> вместо navigation
  const settings = await client.fetch(
    `*[_id == "siteSettings"][0]{
      ...,
      navItems[]->{
        title,
        value
      }
    }`,
    {},
    { next: { revalidate: 0 } }
  );

  return {
    name: settings?.title || "AI TALK PRO",
    description: settings?.description || "Журнал о будущем интеллекта и технологий",
    footerText: settings?.footerText || `© ${new Date().getFullYear()} AI TALK PRO`,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://gpt-ai-journal.pages.dev",
    publisher: settings?.title || "Команда AI TALK PRO",
    postsPerPage: 6,
    
    heroTitle: settings?.heroTitle || "Будущее\nинтеллекта.",
    heroSubtitle: settings?.heroSubtitle || "Последние новости, глубокие исследования и обновления нашей платформы.",
    
    newsletterTitle: settings?.newsletterTitle || "Рассылка",
    newsletterText: settings?.newsletterText || "Будьте в курсе последних прорывов в области ИИ.",
    newsletterButton: settings?.newsletterButton || "Подписаться →",

    // ИСПРАВЛЕНО: Читаем данные из нового чистого массива navItems
    navigation: settings?.navItems && settings.navItems.length > 0 
      ? settings.navItems
          .filter(n => n !== null)
          .map(n => ({ name: n.title || "Без названия", value: n.value || "" }))
      : [
          { name: "Все", value: "" },
          { name: "Исследования", value: "Research" },
          { name: "Продукты", value: "Product" },
          { name: "Безопасность", value: "Safety" },
          { name: "Новости", value: "News" },
        ],
        
    socials: settings?.socials || [
      { platform: "Twitter", url: "#" },
      { platform: "GitHub", url: "#" },
    ],
  };
}