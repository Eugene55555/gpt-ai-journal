import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ categoryValue, categoryName, title }) {
  const categorySlug = categoryValue?.toLowerCase() || "";

  return (
    // ИСПРАВЛЕНО: Добавлена микроразметка Schema.org для хлебных крошек
    <nav aria-label="Breadcrumb" className="mb-10">
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400"
      >
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="flex items-center gap-2"
        >
          <Link
            itemProp="item"
            href="/"
            className="hover:text-black transition-colors flex items-center gap-1.5"
          >
            <Home size={12} />
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {categoryName && categorySlug && (
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-2"
          >
            <ChevronRight size={12} className="text-gray-300" />
            <Link
              itemProp="item"
              href={`/category/${categorySlug}`}
              className="hover:text-black transition-colors"
            >
              <span itemProp="name">{categoryName}</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
        )}

        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="flex items-center gap-2"
        >
          <ChevronRight size={12} className="text-gray-300" />
          <span
            itemProp="name"
            className="text-gray-900 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]"
          >
            {title}
          </span>
          <meta
            itemProp="item"
            content={typeof window !== "undefined" ? window.location.href : ""}
          />
          <meta itemProp="position" content={categoryName ? "3" : "2"} />
        </li>
      </ol>
    </nav>
  );
}
