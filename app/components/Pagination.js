import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, category, search }) {
  if (totalPages <= 1) return null;

  // Функция для создания правильного URL с учетом текущих фильтров
  const createPageUrl = (pageNumber) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (pageNumber > 1) params.set("page", pageNumber.toString());

    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-20 pt-10 border-t border-gray-100">
      {/* Кнопка Назад */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
          aria-label="Предыдущая страница"
        >
          <ArrowLeft size={18} />
        </Link>
      ) : (
        <div className="w-10 h-10" /> // Заглушка для сохранения центровки
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
                  ? "bg-black text-white shadow-md"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-black"
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
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
          aria-label="Следующая страница"
        >
          <ArrowRight size={18} />
        </Link>
      ) : (
        <div className="w-10 h-10" /> // Заглушка для сохранения центровки
      )}
    </div>
  );
}