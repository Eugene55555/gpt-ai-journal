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
    <div className="p-8 rounded-3xl bg-black dark:bg-[#111] text-white space-y-5 shadow-2xl shadow-gray-300/50 dark:shadow-none dark:border dark:border-gray-800 transition-colors">
      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
        {title}
      </h4>
      <p className="text-[14px] font-light text-gray-300 leading-relaxed">
        {text}
      </p>
      <div className="h-[1px] bg-gray-800" />

      {status === "success" ? (
        <div className="py-6 text-center animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-3">
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
          <p className="text-green-400 font-medium text-[14px]">{message}</p>
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
            className="w-full bg-gray-900 dark:bg-black border border-gray-800 dark:border-gray-700 text-white text-[13px] px-4 py-3 rounded-xl focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 bg-white dark:bg-gray-100 text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 dark:hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
          >
            {status === "loading" ? (
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
            ) : (
              buttonText
            )}
          </button>

          {status === "error" && (
            <p className="text-red-400 text-[12px] text-center pt-2 leading-tight">
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
