"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQBlock({ faq }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faq || faq.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t border-gray-100">
      {/* ИСПРАВЛЕНО: Английский язык */}
      <h3 className="text-[32px] font-medium tracking-tightest mb-10 text-black dark:text-white transition-colors">
        Frequently Asked Questions
      </h3>
      <div className="space-y-4">
        {faq.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-[#111] transition-all hover:border-gray-300 dark:hover:border-gray-700 shadow-sm dark:shadow-none"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
            >
              <span className="text-[18px] font-medium text-gray-900 dark:text-gray-200 pr-6 transition-colors">
                {item.question}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  openIndex === index
                    ? "rotate-180 bg-black text-white dark:bg-white dark:text-black"
                    : "bg-gray-50 dark:bg-[#1a1a1a] text-gray-500"
                }`}
              >
                <ChevronDown size={18} />
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6 pt-2 text-[16px] text-gray-600 dark:text-gray-400 font-light leading-relaxed transition-colors">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
