"use client";

export const runtime = "edge";

import { NextStudio } from "next-sanity/studio";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";

const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  title: "ULTRA AI JOURNAL CMS",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Контент")
          .items([
            S.listItem()
              .title("Настройки сайта")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !["siteSettings"].includes(listItem.getId())
            ),
          ]),
    }),
    visionTool(),
    codeInput(),
  ],
  schema: {
    types: [
      {
        name: "category",
        type: "document",
        title: "Категории",
        fields: [
          { name: "title", type: "string", title: "Название (Например: Исследования)" },
          { name: "value", type: "string", title: "Значение в URL (Например: Research)" },
        ],
      },
      {
        name: "siteSettings",
        type: "document",
        title: "Настройки сайта",
        groups: [
          { name: "general", title: "Общие" },
          { name: "home", title: "Главная страница" },
          { name: "sidebar", title: "Сайдбар (Рассылка)" },
        ],
        fields: [
          { name: "title", type: "string", title: "Название сайта", group: "general" },
          { name: "description", type: "text", title: "SEO Описание", group: "general" },
          { name: "footerText", type: "string", title: "Копирайт в футере", group: "general" },
          {
            name: "navItems", // ИСПРАВЛЕНО: Переименовали поле, чтобы сбросить конфликт в базе
            type: "array",
            title: "Меню навигации (Выберите категории)",
            group: "general",
            of: [
              {
                type: "reference",
                to: [{ type: "category" }]
              },
            ],
          },
          {
            name: "socials",
            type: "array",
            title: "Социальные сети",
            group: "general",
            of: [
              {
                type: "object",
                fields: [
                  { name: "platform", type: "string", title: "Платформа (Например: Twitter)" },
                  { name: "url", type: "url", title: "Ссылка" },
                ],
              },
            ],
          },
          { name: "heroTitle", type: "text", title: "Большой заголовок (Enter для переноса)", group: "home", rows: 3 },
          { name: "heroSubtitle", type: "text", title: "Подзаголовок", group: "home", rows: 2 },
          { name: "newsletterTitle", type: "string", title: "Заголовок рассылки", group: "sidebar" },
          { name: "newsletterText", type: "text", title: "Текст рассылки", group: "sidebar", rows: 2 },
          { name: "newsletterButton", type: "string", title: "Текст на кнопке", group: "sidebar" },
        ],
      },
      {
        name: "post",
        type: "document",
        title: "Профессиональные публикации",
        groups: [
          { name: "main", title: "Контент" },
          { name: "media", title: "Медиа" },
          { name: "seo", title: "SEO и настройки" },
        ],
        fields: [
          {
            name: "title",
            type: "string",
            title: "Заголовок",
            group: "main",
            validation: (Rule) => Rule.required().min(10).max(80),
          },
          {
            name: "description",
            type: "text",
            title: "Краткое описание (для карточек и SEO)",
            group: "seo",
            rows: 3,
            validation: (Rule) => Rule.max(200),
          },
          {
            name: "slug",
            type: "slug",
            title: "URL адрес",
            group: "seo",
            options: { source: "title", maxLength: 96 },
            validation: (Rule) => Rule.required(),
          },
          {
            name: "category",
            type: "reference", 
            title: "Категория",
            group: "seo",
            to: [{ type: "category" }],
            validation: (Rule) => Rule.required(),
          },
          {
            name: "tags",
            type: "array",
            title: "Теги",
            group: "seo",
            of: [{ type: "string" }],
            options: { layout: "tags" },
          },
          {
            name: "publishedAt",
            type: "datetime",
            title: "Дата публикации",
            group: "seo",
          },
          {
            name: "mainImage",
            type: "image",
            title: "Главная обложка",
            group: "media",
            options: { hotspot: true },
            fields: [
              { name: "alt", type: "string", title: "Alt текст" },
              { name: "caption", type: "string", title: "Подпись под фото" },
            ],
          },
          {
            name: "downloadFile",
            type: "file",
            title: "Прикрепить файл",
            group: "media",
          },
          {
            name: "body",
            type: "array",
            title: "Основной контент",
            group: "main",
            of: [
              { type: "block" },
              { type: "image", options: { hotspot: true } },
              {
                type: "object",
                name: "blockquote",
                fields: [
                  { name: "text", type: "text", title: "Текст цитаты" },
                  { name: "author", type: "string", title: "Автор" },
                ],
              },
              {
                type: "object",
                name: "inlineFile",
                fields: [
                  { name: "file", type: "file" },
                  { name: "buttonText", type: "string" },
                ],
              },
              { type: "code", name: "myCodeField" },
            ],
          },
          {
            name: "faq",
            type: "array",
            title: "Частые вопросы (FAQ)",
            group: "main",
            of: [
              {
                type: "object",
                fields: [
                  { name: "question", type: "string" },
                  { name: "answer", type: "text" },
                ],
              },
            ],
          },
          {
            name: "author",
            type: "reference",
            title: "Автор статьи",
            group: "seo",
            to: [{ type: "author" }],
          },
        ],
      },
      {
        name: "author",
        type: "document",
        title: "Авторы",
        fields: [
          { name: "name", type: "string" },
          { name: "bio", type: "text" },
          { name: "avatar", type: "image", options: { hotspot: true } },
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