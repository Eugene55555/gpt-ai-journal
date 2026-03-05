"use client";

import { Search as SearchIcon } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term) => {
    // Создаем новый объект параметров на основе текущих (чтобы не затереть категорию, если она выбрана)
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    
    // Обновляем URL без перезагрузки страницы
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative w-full max-w-[300px] md:max-w-md mb-10">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all text-[15px]"
        placeholder="Search articles..."
        // Устанавливаем начальное значение из URL, если мы обновили страницу
        defaultValue={searchParams.get("search")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}