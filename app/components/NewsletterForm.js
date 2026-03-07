"use client";

import { useState } from "react";

export default function NewsletterForm({
  title,
  text,
  placeholder,
  buttonText,
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setMessage("Thank you! You've been successfully subscribed.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    // ИСПРАВЛЕНО: Светлый стильный фон вместо тяжелого черного
    <div className="p-8 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 transition-colors shadow-sm">
      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
        {title}
      </h4>
      <p className="text-[14px] font-light text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
        {text}
      </p>

      {status === "success" ? (
        <div className="py-6 text-center animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-3 border border-green-100">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <p className="text-green-600 font-medium text-[14px]">{message}</p>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={placeholder}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 text-black dark:text-white text-[13px] px-4 py-3 rounded-xl focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center shadow-md"
          >
            {status === "loading" ? (
              <span className="w-4 h-4 border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin"></span>
            ) : (
              buttonText
            )}
          </button>
          {status === "error" && (
            <p className="text-red-500 text-[12px] text-center pt-2 leading-tight">
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
