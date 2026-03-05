"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ value }) {
  const [isCopied, setIsCopied] = useState(false);

  if (!value || !value.code) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value.code);
      setIsCopied(true);
      // Возвращаем иконку обратно через 2 секунды
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Не удалось скопировать текст: ", err);
    }
  };

  return (
    <div className="my-8 rounded-xl overflow-hidden bg-[#1E1E1E] shadow-lg border border-gray-800 relative group">
      {/* Шапка блока с названием языка и кнопкой */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] text-gray-400 text-[12px] font-mono uppercase tracking-wider border-b border-gray-800">
        <span>{value.language || "text"}</span>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10"
          title="Скопировать код"
        >
          {isCopied ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} />
          )}
          <span className="hidden sm:inline-block font-sans normal-case text-[13px]">
            {isCopied ? "Скопировано!" : "Копировать"}
          </span>
        </button>
      </div>

      {/* Сам код */}
      <SyntaxHighlighter
        language={value.language || "text"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          fontSize: "14px",
          backgroundColor: "transparent",
        }}
      >
        {value.code}
      </SyntaxHighlighter>
    </div>
  );
}