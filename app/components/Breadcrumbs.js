import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ categoryValue, categoryName, title }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-10">
      <ol className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
        <li className="flex items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors flex items-center gap-1.5">
            <Home size={12} />
            Главная
          </Link>
        </li>
        
        {categoryName && (
          <li className="flex items-center gap-2">
            <ChevronRight size={12} className="text-gray-300" />
            <Link href={`/?category=${categoryValue}`} className="hover:text-black transition-colors">
              {categoryName}
            </Link>
          </li>
        )}
        
        <li className="flex items-center gap-2">
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-gray-900 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]">
            {title}
          </span>
        </li>
      </ol>
    </nav>
  );
}