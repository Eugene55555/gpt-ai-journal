"use client";

import {
  Twitter,
  Linkedin,
  Facebook,
  MessageSquare,
  MessageCircle,
  Send,
  Mail,
  Link2,
  Check,
  Github,
  Youtube,
  Instagram,
  Music,
} from "lucide-react";
import { useState } from "react";

export default function ShareButtons({
  title,
  slug,
  baseUrl,
  shareTitle,
  shareOptions = [],
}) {
  const [copiedState, setCopiedState] = useState(null); // хранит имя соцсети, для которой скопирована ссылка

  const url = `${baseUrl}/post/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Read this article: ${encodedUrl}`,
  };

  const openPopup = (link) => {
    window.open(link, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const copyToClipboard = async (networkName) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedState(networkName);
      setTimeout(() => setCopiedState(null), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const renderButton = (option) => {
    const baseClass =
      "w-10 h-10 flex items-center justify-center rounded-full border transition-all";
    const normalClass = `${baseClass} border-gray-200 text-gray-500 hover:border-black hover:text-black hover:bg-gray-50`;
    const activeClass = `${baseClass} border-green-500 text-green-500 bg-green-50`;

    const isCopied = copiedState === option;
    const currentClass = isCopied ? activeClass : normalClass;
    const iconSize = 16;

    switch (option) {
      // Соцсети с поддержкой веб-шеринга
      case "twitter":
        return (
          <button
            key="tw"
            onClick={() => openPopup(shareLinks.twitter)}
            className={normalClass}
            title="Share on X (Twitter)"
          >
            <Twitter size={iconSize} />
          </button>
        );
      case "linkedin":
        return (
          <button
            key="in"
            onClick={() => openPopup(shareLinks.linkedin)}
            className={normalClass}
            title="Share on LinkedIn"
          >
            <Linkedin size={iconSize} />
          </button>
        );
      case "facebook":
        return (
          <button
            key="fb"
            onClick={() => openPopup(shareLinks.facebook)}
            className={normalClass}
            title="Share on Facebook"
          >
            <Facebook size={iconSize} />
          </button>
        );
      case "reddit":
        return (
          <button
            key="rd"
            onClick={() => openPopup(shareLinks.reddit)}
            className={normalClass}
            title="Share on Reddit"
          >
            <MessageSquare size={iconSize} />
          </button>
        );
      case "whatsapp":
        return (
          <button
            key="wa"
            onClick={() => openPopup(shareLinks.whatsapp)}
            className={normalClass}
            title="Share on WhatsApp"
          >
            <MessageCircle size={iconSize} />
          </button>
        );
      case "telegram":
        return (
          <button
            key="tg"
            onClick={() => openPopup(shareLinks.telegram)}
            className={normalClass}
            title="Share on Telegram"
          >
            <Send size={iconSize} />
          </button>
        );
      case "email":
        return (
          <button
            key="em"
            onClick={() => {
              window.location.href = shareLinks.email;
            }}
            className={normalClass}
            title="Share via Email"
          >
            <Mail size={iconSize} />
          </button>
        );

      // Платформы БЕЗ веб-шеринга (Копируют ссылку с красивой анимацией)
      case "instagram":
        return (
          <button
            key="ig"
            onClick={() => copyToClipboard("instagram")}
            className={currentClass}
            title="Copy link for Instagram"
          >
            {isCopied ? (
              <Check size={iconSize} />
            ) : (
              <Instagram size={iconSize} />
            )}
          </button>
        );
      case "tiktok":
        return (
          <button
            key="tk"
            onClick={() => copyToClipboard("tiktok")}
            className={currentClass}
            title="Copy link for TikTok"
          >
            {isCopied ? <Check size={iconSize} /> : <Music size={iconSize} />}
          </button>
        );
      case "youtube":
        return (
          <button
            key="yt"
            onClick={() => copyToClipboard("youtube")}
            className={currentClass}
            title="Copy link for YouTube"
          >
            {isCopied ? <Check size={iconSize} /> : <Youtube size={iconSize} />}
          </button>
        );
      case "github":
        return (
          <button
            key="gh"
            onClick={() => copyToClipboard("github")}
            className={currentClass}
            title="Copy link for GitHub"
          >
            {isCopied ? <Check size={iconSize} /> : <Github size={iconSize} />}
          </button>
        );
      case "discord":
        return (
          <button
            key="dc"
            onClick={() => copyToClipboard("discord")}
            className={currentClass}
            title="Copy link for Discord"
          >
            {isCopied ? (
              <Check size={iconSize} />
            ) : (
              <MessageSquare size={iconSize} />
            )}
          </button>
        );
      case "copy":
        return (
          <button
            key="cp"
            onClick={() => copyToClipboard("copy")}
            className={currentClass}
            title="Copy link"
          >
            {isCopied ? <Check size={iconSize} /> : <Link2 size={iconSize} />}
          </button>
        );

      default:
        return null;
    }
  };

  if (!shareOptions || shareOptions.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-16 pt-10 border-t border-gray-100">
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap">
        {shareTitle}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {shareOptions.map(renderButton)}
      </div>
    </div>
  );
}
