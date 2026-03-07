"use client";
export const runtime = "edge";

import { NextStudio } from "next-sanity/studio";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { media } from "sanity-plugin-media";
import { presentationTool } from "sanity/presentation";

const ALL_SOCIAL_OPTIONS = [
  { title: "Twitter / X", value: "twitter" },
  { title: "LinkedIn", value: "linkedin" },
  { title: "GitHub", value: "github" },
  { title: "YouTube", value: "youtube" },
  { title: "Facebook", value: "facebook" },
  { title: "Instagram", value: "instagram" },
  { title: "TikTok", value: "tiktok" },
  { title: "Reddit", value: "reddit" },
  { title: "Telegram", value: "telegram" },
  { title: "WhatsApp", value: "whatsapp" },
  { title: "Discord", value: "discord" },
  { title: "Email", value: "email" },
  { title: "Copy Link / Website", value: "copy" },
];

const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  title: "ULTRA AI JOURNAL CMS",
  basePath: "/studio",
  plugins: [
    structureTool({
      // ИСПРАВЛЕНО: Красивая структура меню слева
      structure: (S) =>
        S.list()
          .title("Управление журналом")
          .items([
            S.listItem()
              .title("Публикации")
              .child(S.documentTypeList("post").title("Все статьи")),
            S.listItem()
              .title("Категории")
              .child(S.documentTypeList("category").title("Категории")),
            S.divider(),
            S.listItem()
              .title("Авторы")
              .child(S.documentTypeList("author").title("Авторы")),
            S.listItem()
              .title("Подписчики (Рассылка)")
              .child(S.documentTypeList("subscriber").title("База email")),
            S.divider(),
            S.listItem()
              .title("Настройки сайта")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
          ]),
    }),
    visionTool(),
    codeInput(),
    media(),
    presentationTool({
      previewUrl:
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000",
      resolve: {
        mainDocuments: [
          {
            route: "/post/:slug",
            filter: `_type == "post" && slug.current == $slug`,
          },
          {
            route: "/author/:slug",
            filter: `_type == "author" && slug.current == $slug`,
          },
          {
            route: "/",
            filter: `_type == "siteSettings"`,
          },
        ],
      },
    }),
  ],
  schema: {
    types: [
      {
        name: "category",
        type: "document",
        title: "Категории",
        fields: [
          {
            name: "title",
            type: "string",
            title: "Название (Например: Исследования)",
          },
          {
            name: "value",
            type: "string",
            title: "Значение в URL (Например: Research)",
          },
        ],
      },
      {
        name: "youtube",
        type: "object",
        title: "YouTube Video",
        fields: [
          {
            name: "url",
            type: "url",
            title: "Ссылка на видео YouTube",
            validation: (Rule) => Rule.required(),
          },
        ],
      },
      {
        name: "twitter",
        type: "object",
        title: "Twitter Post",
        fields: [
          {
            name: "url",
            type: "url",
            title:
              "Ссылка на твит (Например: https://twitter.com/user/status/123...)",
            validation: (Rule) => Rule.required(),
          },
        ],
      },
      {
        name: "siteSettings",
        type: "document",
        title: "Настройки сайта",
        groups: [
          { name: "general", title: "Общие", default: true },
          { name: "home", title: "Главная страница" },
          { name: "article", title: "Тексты в статьях" },
          { name: "stickyBar", title: "Плавающая панель" },
          { name: "sidebar", title: "Сайдбар (Рассылка)" },
        ],
        fields: [
          {
            name: "title",
            type: "string",
            title: "Название сайта",
            group: "general",
          },
          {
            name: "description",
            type: "text",
            title: "SEO Описание",
            group: "general",
          },
          {
            name: "footerText",
            type: "string",
            title: "Копирайт в футере",
            group: "general",
          },
          {
            name: "showRss",
            type: "boolean",
            title: "Показывать ссылку на RSS",
            group: "general",
          },
          {
            name: "rssTitle",
            type: "string",
            title: "Текст ссылки RSS",
            group: "general",
          },
          {
            name: "rssUrl",
            type: "string",
            title: "URL адрес RSS",
            group: "general",
          },
          {
            name: "baseUrl",
            type: "string",
            title: "Базовый URL сайта",
            group: "general",
          },
          {
            name: "defaultOgImage",
            type: "image",
            title: "OG Image по умолчанию",
            group: "general",
            options: { hotspot: true },
          },
          {
            name: "fontFamily",
            type: "string",
            title: "Шрифт сайта",
            group: "general",
            initialValue: "Inter",
            options: {
              list: [
                { title: "Inter", value: "Inter" },
                { title: "Geist", value: "Geist" },
              ],
            },
          },
          {
            name: "navItems",
            type: "array",
            title: "Меню навигации (Выберите категории)",
            group: "general",
            of: [{ type: "reference", to: [{ type: "category" }] }],
          },
          {
            name: "socials",
            type: "array",
            title: "Социальные сети футера",
            group: "general",
            of: [
              {
                type: "object",
                fields: [
                  {
                    name: "platform",
                    type: "string",
                    title: "Название (Например: YouTube)",
                  },
                  { name: "url", type: "url", title: "Ссылка" },
                  {
                    name: "iconName",
                    type: "string",
                    title: "Выберите иконку",
                    options: { list: ALL_SOCIAL_OPTIONS },
                  },
                ],
              },
            ],
          },
          {
            name: "heroTitle",
            type: "text",
            title: "Большой заголовок (Enter для переноса)",
            group: "home",
            rows: 3,
          },
          {
            name: "heroSubtitle",
            type: "text",
            title: "Подзаголовок",
            group: "home",
            rows: 2,
          },
          {
            name: "readingTimeText",
            type: "string",
            title: "Текст времени чтения",
            group: "article",
            initialValue: "min read",
          },
          {
            name: "shareTitle",
            type: "string",
            title: "Заголовок блока 'Поделиться' (Внизу статьи)",
            group: "article",
            initialValue: "Share this article",
          },
          {
            name: "shareOptions",
            type: "array",
            title: "Кнопки 'Поделиться' (Внизу статьи)",
            group: "article",
            of: [{ type: "string" }],
            options: { list: ALL_SOCIAL_OPTIONS },
            initialValue: [
              "twitter",
              "linkedin",
              "facebook",
              "reddit",
              "telegram",
              "copy",
            ],
          },
          {
            name: "showStickyBar",
            type: "boolean",
            title: "Включить плавающую панель (Sticky Bar)",
            group: "stickyBar",
            initialValue: true,
            description: "Показывать ли верхнюю панель при чтении статьи.",
          },
          {
            name: "stickyShareOptions",
            type: "array",
            title: "Кнопки на плавающей панели",
            group: "stickyBar",
            of: [{ type: "string" }],
            options: { list: ALL_SOCIAL_OPTIONS },
            initialValue: ["twitter", "linkedin", "copy"],
            description:
              "Рекомендуется не более 3-4 кнопок, чтобы не перегружать шапку.",
          },
          {
            name: "newsletterTitle",
            type: "string",
            title: "Заголовок рассылки",
            group: "sidebar",
          },
          {
            name: "newsletterText",
            type: "text",
            title: "Текст рассылки",
            group: "sidebar",
            rows: 2,
          },
          {
            name: "newsletterPlaceholder",
            type: "string",
            title: "Подсказка в поле Email (Placeholder)",
            group: "sidebar",
            initialValue: "Your email address",
          },
          {
            name: "newsletterButton",
            type: "string",
            title: "Текст на кнопке",
            group: "sidebar",
          },
        ],
      },
      {
        name: "post",
        type: "document",
        title: "Профессиональные публикации",
        groups: [
          // ИСПРАВЛЕНО: default: true сделает так, что вкладка "All fields" пропадет, и мы сразу будем в Контенте
          { name: "main", title: "Контент", default: true },
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
            name: "views",
            type: "number",
            title: "Просмотры",
            group: "seo",
            initialValue: 0,
            description: "Автоматически обновляется при просмотре статьи",
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
            name: "keyTakeaways",
            type: "array",
            title: "TL;DR / Ключевые мысли",
            group: "main",
            of: [{ type: "string" }],
            description:
              "Добавьте 3-4 главных тезиса статьи. Они красиво отобразятся перед основным текстом.",
          },
          {
            name: "body",
            type: "array",
            title: "Основной контент",
            group: "main",
            of: [
              {
                type: "block",
                // ИСПРАВЛЕНО: Убрали H1 из списка стилей, чтобы авторы не ломали SEO
                styles: [
                  { title: "Обычный текст", value: "normal" },
                  { title: "Заголовок 2 (H2)", value: "h2" },
                  { title: "Заголовок 3 (H3)", value: "h3" },
                  { title: "Цитата", value: "blockquote" },
                ],
              },
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
              { type: "youtube" },
              { type: "twitter" },
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
          {
            name: "aiDisclosureText",
            type: "string",
            title: "AI Disclosure Text",
            group: "seo",
            initialValue: "AI-Assisted Content",
            description:
              "Метка для Google (означает, что в тексте использовался ИИ). Оставьте пустым, чтобы не выводить на сайте.",
          },
        ],
      },
      {
        name: "author",
        type: "document",
        title: "Авторы",
        fields: [
          { name: "name", type: "string" },
          {
            name: "slug",
            type: "slug",
            title: "URL адрес автора",
            options: { source: "name", maxLength: 96 },
            validation: (Rule) => Rule.required(),
          },
          { name: "bio", type: "text" },
          { name: "avatar", type: "image", options: { hotspot: true } },
          {
            name: "socials",
            type: "array",
            title: "Ссылки автора",
            of: [
              {
                type: "object",
                fields: [
                  { name: "platform", type: "string", title: "Платформа" },
                  { name: "url", type: "url", title: "URL" },
                  {
                    name: "iconName",
                    type: "string",
                    title: "Выберите иконку",
                    options: { list: ALL_SOCIAL_OPTIONS },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "subscriber",
        type: "document",
        title: "Подписчики",
        fields: [
          {
            name: "email",
            type: "string",
            title: "Email адрес",
            validation: (Rule) => Rule.required().email(),
          },
          {
            name: "subscribedAt",
            type: "datetime",
            title: "Дата подписки",
            initialValue: () => new Date().toISOString(),
          },
        ],
        preview: {
          select: {
            title: "email",
            subtitle: "subscribedAt",
          },
        },
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
