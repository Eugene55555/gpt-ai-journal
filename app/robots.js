export default function robots() {
  const baseUrl = "https://gpt-ai-journal.pages.dev"; // Замени на свой реальный домен

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}