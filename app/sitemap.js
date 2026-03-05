import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false, // Здесь false, чтобы поисковик всегда получал самую свежую карту
});

export default async function sitemap() {
  const baseUrl = "https://gpt-ai-journal.pages.dev"; // Замени на свой реальный домен

  // Получаем все посты из Sanity (только нужные поля для скорости)
  const posts = await client.fetch(`
    *[_type == "post"]{
      "slug": slug.current,
      _updatedAt
    }
  `);

  // Формируем массив адресов постов
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Добавляем главную страницу и сливаем массивы
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...postUrls,
  ];
}