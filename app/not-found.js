export const runtime = "edge";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center px-6 animate-fadeIn transition-colors">
      <div className="text-center max-w-[500px]">
        <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 block">
          Error 404
        </span>
        <h1 className="text-[64px] font-medium tracking-tightest leading-[0.9] mb-8 text-black dark:text-white transition-colors">
          Page <br /> not found.
        </h1>
        <p className="text-[18px] text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-12 transition-colors">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full text-[14px] font-medium hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-200 dark:shadow-none"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
