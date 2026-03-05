"use client";

import { useEffect, useState } from "react";

export default function TableOfContents({ blocks }) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!blocks) return;
    
    const extractedHeadings = blocks
      .filter((b) => b._type === "block" && ["h2", "h3"].includes(b.style))
      .map((b) => {
        const text = b.children.map((c) => c.text).join("");
        const id = text
          .toLowerCase()
          .replace(/[^\w\sа-яё]/gi, "")
          .replace(/\s+/g, "-");
        return { id, text, level: b.style };
      });
    setHeadings(extractedHeadings);
  }, [blocks]);

  if (headings.length === 0) return null;

  return (
    <nav className="py-2">
      <h4 className="text-[12px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-6">
        Содержание
      </h4>
      <ul className="space-y-4 border-l border-gray-100">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${
              heading.level === "h3" ? "ml-4" : ""
            } -ml-[1px] border-l border-transparent hover:border-black transition-colors`}
          >
            <a
              href={`#${heading.id}`}
              className="block pl-4 text-[14px] text-gray-500 hover:text-black transition-colors leading-snug"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}