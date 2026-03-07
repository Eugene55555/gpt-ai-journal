"use client";

import { useState, useEffect } from "react";
import { Link2, Check, ArrowUp, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import SocialIcon from "./SocialIcon";

export default function StickyActionBar({
  title,
  slug,
  baseUrl,
  siteName,
  shareOptions = [],
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsVisible(currentScroll > 100);

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
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

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

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const renderSocialButton = (network) => {
    if (network === "copy") {
      return (
        <button
          key="copy"
          onClick={copyToClipboard}
          className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${
            isCopied
              ? "border-green-500 text-green-500 bg-green-50 dark:bg-green-500/10"
              : "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
          title="Copy Link"
        >
          {isCopied ? <Check size={14} /> : <Link2 size={14} />}
        </button>
      );
    }

    if (shareLinks[network]) {
      return (
        <a
          key={network}
          href={shareLinks[network]}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          title={`Share on ${network}`}
        >
          <SocialIcon name={network} size={14} />
        </a>
      );
    }
    return null;
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] transition-transform duration-300 transform ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 min-w-0">
            <Link
              href="/"
              className="text-[22px] font-bold tracking-tighter hover:opacity-70 transition-opacity dark:text-white shrink-0"
            >
              {siteName}
            </Link>

            <div className="hidden lg:block w-[1px] h-4 bg-gray-200 dark:bg-gray-800" />

            {/* ИСПРАВЛЕНО: ТЕПЕРЬ ТУТ ТОЧНО SPAN! Никаких ложных H2 перед основным контентом */}
            <span className="text-[14px] font-medium text-gray-500 dark:text-gray-400 truncate hidden lg:block max-w-[400px]">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              {shareOptions.map(renderSocialButton)}
            </div>

            <div className="hidden sm:block w-[1px] h-4 bg-gray-200 dark:bg-gray-800 mx-1" />

            <ThemeToggle />

            <Link
              href="/"
              className="group flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all ml-1"
              title="Back to posts"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </Link>

            <button
              onClick={scrollToTop}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-all ml-1"
              title="Scroll to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="h-[2px] bg-transparent w-full absolute bottom-0 left-0">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
