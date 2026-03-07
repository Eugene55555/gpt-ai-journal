import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  category,
  search,
}) {
  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (pageNumber > 1) params.set("page", pageNumber.toString());

    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 transition-colors">
      {/* Кнопка Назад */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Previous page"
        >
          <ArrowLeft size={18} />
        </Link>
      ) : (
        <div className="w-10 h-10" />
      )}

      {/* Номера страниц */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-[14px] font-medium transition-all ${
                isActive
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-md"
                  : "bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Кнопка Вперед */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Next page"
        >
          <ArrowRight size={18} />
        </Link>
      ) : (
        <div className="w-10 h-10" />
      )}
    </div>
  );
}
