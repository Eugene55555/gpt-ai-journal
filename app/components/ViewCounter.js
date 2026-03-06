"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export default function ViewCounter({ slug, initialViews }) {
  const [views, setViews] = useState(initialViews || 0);

  useEffect(() => {
    // Защита от накрутки: проверяем, читал ли уже пользователь эту статью в текущей сессии
    if (sessionStorage.getItem(`viewed-${slug}`)) {
      return;
    }

    const registerView = async () => {
      try {
        const res = await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });

        const data = await res.json();

        if (data.views) {
          setViews(data.views);
          sessionStorage.setItem(`viewed-${slug}`, "true"); // Запоминаем, что просмотр учтен
        }
      } catch (e) {
        console.error("Failed to track view", e);
      }
    };

    registerView();
  }, [slug]);

  return (
    <span
      className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest transition-colors"
      title={`${views} Views`}
    >
      <Eye size={14} />
      {views > 0 ? views.toLocaleString("en-US") : "..."}
    </span>
  );
}
