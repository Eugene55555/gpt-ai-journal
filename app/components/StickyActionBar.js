"use client";

import { useState, useEffect } from "react";
import { Twitter, Linkedin, Link2, Check, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function StickyActionBar({ title, slug, baseUrl }) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Показываем панель после 300px скролла
      const currentScroll = window.scrollY;
      if (currentScroll > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Считаем прогресс чтения
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareUrl = `${baseUrl}/post/${slug}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      {/* Прогресс-бар сверху */}
      <div className="h-[2px] bg-gray-100 dark:bg-gray-800 w-full">
        <div
          className="h-full bg-black dark:bg-white transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Основная панель */}
      <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-10">
          {/* Левая часть: Название статьи */}
          <div className="flex items-center gap-4 min-w-0 overflow-hidden">
            <Link href="/" className="shrink-0">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-bold text-xs">
                AI
              </div>
            </Link>
            <h2 className="text-[14px] font-medium text-black dark:text-white truncate hidden md:block">
              {title}
            </h2>
          </div>

          {/* Правая часть: Действия */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hidden sm:block mr-2">
              Share
            </span>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <Twitter size={14} />
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <Linkedin size={14} />
            </a>

            <button
              onClick={copyToClipboard}
              className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${
                isCopied
                  ? "border-green-500 text-green-500 bg-green-50 dark:bg-green-500/10"
                  : "border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {isCopied ? <Check size={14} /> : <Link2 size={14} />}
            </button>

            <div className="w-[1px] h-4 bg-gray-100 dark:bg-gray-800 mx-2" />

            <button
              onClick={scrollToTop}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-all"
              title="Scroll to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
