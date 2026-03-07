"use client";

import { useEffect, useState } from "react";

export default function TableOfContents({ blocks }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!blocks) return;

    const extractedHeadings = blocks
      .filter((b) => b._type === "block" && ["h2", "h3"].includes(b.style))
      .map((b) => {
        const text = b.children
          ? b.children.map((c) => c.text || "").join("")
          : "";
        const id = text
          .toLowerCase()
          .replace(/[^\w\sа-яё]/gi, "")
          .replace(/\s+/g, "-");
        return { id, text, level: b.style };
      })
      .filter((h) => h.id !== "");

    setHeadings(extractedHeadings);
  }, [blocks]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      let currentActiveId = "";

      // Ищем заголовок, который находится ближе всего к верху экрана
      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        // 150px - это отступ с учетом плавающей шапки
        if (rect.top <= 150) {
          currentActiveId = el.id;
        } else {
          // Так как заголовки идут по порядку, если этот ниже экрана, дальше искать нет смысла
          break;
        }
      }

      // Если пользователь доскроллил в самый верх (до первого заголовка), сбрасываем подсветку
      if (window.scrollY < 200) {
        currentActiveId = "";
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Запускаем один раз при загрузке

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="py-2">
      <h4 className="text-[12px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-6">
        Table of Contents
      </h4>
      <ul className="space-y-4 border-l border-gray-100 dark:border-gray-800">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li
              key={heading.id}
              className={`${
                heading.level === "h3" ? "ml-4" : ""
              } -ml-[1px] border-l-2 transition-colors duration-200 ${
                isActive
                  ? "border-black dark:border-white"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <a
                href={`#${heading.id}`}
                className={`block pl-4 text-[14px] leading-snug transition-colors ${
                  isActive
                    ? "text-black dark:text-white font-medium"
                    : "text-gray-500 hover:text-black dark:hover:text-white"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
