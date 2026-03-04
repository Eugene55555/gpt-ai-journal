"use client";
export const runtime = "edge";

import { NextStudio } from "next-sanity/studio";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  title: "ULTRA AI JOURNAL CMS",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [
      {
        name: "post",
        type: "document",
        title: "Профессиональные публикации",
        // Группировка полей по вкладкам
        groups: [
          { name: "main", title: "Контент" },
          { name: "media", title: "Медиа" },
          { name: "seo", title: "SEO и настройки" },
        ],
        fields: [
          // 1. Заголовок с проверкой (Validation)
          {
            name: "title",
            type: "string",
            title: "Заголовок",
            group: "main",
            validation: (Rule) =>
              Rule.required()
                .min(10)
                .max(80)
                .error("Заголовок должен быть от 10 до 80 символов"),
          },
          // 2. Slug с автогенерацией
          {
            name: "slug",
            type: "slug",
            title: "URL адрес",
            group: "seo",
            options: { source: "title", maxLength: 96 },
            validation: (Rule) => Rule.required(),
          },
          // 3. Категории и Теги
          {
            name: "category",
            type: "string",
            title: "Категория",
            group: "seo",
            options: { list: ["Research", "Product", "Safety", "News"] },
          },
          {
            name: "tags",
            type: "array",
            title: "Теги",
            group: "seo",
            of: [{ type: "string" }],
            options: { layout: "tags" },
          },
          // 4. Даты
          {
            name: "publishedAt",
            type: "datetime",
            title: "Дата публикации",
            group: "seo",
          },
          // 5. Изображение с Hotspot и доп. полями
          {
            name: "mainImage",
            type: "image",
            title: "Главная обложка",
            group: "media",
            options: { hotspot: true },
            fields: [
              {
                name: "alt",
                type: "string",
                title: "Alt текст (для SEO)",
                options: { isHighlighted: true },
              },
              { name: "caption", type: "string", title: "Подпись под фото" },
            ],
          },
          // 6. Файлы (например, PDF отчет)
          {
            name: "downloadFile",
            type: "file",
            title: "Прикрепить файл (PDF/DOC)",
            group: "media",
          },
          // 7. Сложный редактор контента (Block Content)
          {
            name: "body",
            type: "array",
            title: "Основной контент",
            group: "main",
            of: [
              { type: "block" }, // Обычный текст
              { type: "image", options: { hotspot: true } }, // Картинки внутри текста
              // Добавляем таблицу или цитату как объект
              {
                type: "object",
                name: "blockquote",
                title: "Цитата",
                fields: [
                  { name: "text", type: "text", title: "Текст цитаты" },
                  { name: "author", type: "string", title: "Автор" },
                ],
              },
            ],
          },
          // 8. Ссылка на автора (Reference)
          {
            name: "author",
            type: "reference",
            title: "Автор статьи",
            group: "seo",
            to: [{ type: "author" }],
          },
        ],
      },
      // ВТОРОЙ ТИП ДОКУМЕНТА: АВТОРЫ
      {
        name: "author",
        type: "document",
        title: "Авторы",
        fields: [
          { name: "name", type: "string", title: "Имя автора" },
          { name: "bio", type: "text", title: "Биография" },
          {
            name: "avatar",
            type: "image",
            title: "Аватар",
            options: { hotspot: true },
          },
        ],
      },
    ],
  },
});

export default function StudioPage() {
  return (
    <div style={{ height: "100vh", width: "100vw", fixed: "top", left: 0 }}>
      <NextStudio config={config} />
    </div>
  );
}

if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    if (e.message.includes("scrollTop")) {
      e.stopImmediatePropagation();
    }
  });
}
