export const runtime = "edge";
export const revalidate = 3600; // ИСПРАВЛЕНО: Кэш на 1 час

import { createClient } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import Search from "./components/Search";
import Pagination from "./components/Pagination";
import { getSiteSettings } from "./config/site";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

export default async function Page({ searchParams }) {
  const siteConfig = await getSiteSettings();

  const category = searchParams?.category || "";
  const search = searchParams?.search || "";
  const currentPage = Number(searchParams?.page) || 1;

  const start = (currentPage - 1) * siteConfig.postsPerPage;
  const end = start + siteConfig.postsPerPage;

  let conditions = `_type == "post"`;
  if (category) {
    // ДОБАВЛЕНО: Фильтруем по значению привязанной категории
    conditions += ` && category->value == $category`;
  }
  if (search) {
    conditions += ` && (title match $search || description match $search)`;
  }

  // ДОБАВЛЕНО: Запрашиваем categoryName из привязанной категории
  const query = `{
    "posts": *[${conditions}] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      "slug": slug.current,
      description,
      publishedAt,
      "categoryName": category->title,
      "categoryValue": category->value,
      "imageUrl": mainImage.asset->url
    },
    "total": count(*[${conditions}])
  }`;

  const queryParams = { start, end };
  if (category) queryParams.category = category;
  if (search) queryParams.search = `*${search}*`;

  const data = await client.fetch(query, queryParams, {
    next: { revalidate: 0 },
  });
  const posts = data.posts || [];
  const totalPosts = data.total || 0;

  const totalPages = Math.ceil(totalPosts / siteConfig.postsPerPage);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-[22px] font-bold tracking-tighter hover:opacity-70 transition-opacity"
            >
              {siteConfig.name}
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {siteConfig.navigation.map((item) => {
                const itemValue = item.value || "";
                const isActive = category === itemValue;
                const href = new URLSearchParams();
                if (itemValue) href.set("category", itemValue);
                if (search) href.set("search", search);

                return (
                  <Link
                    key={item.name}
                    href={`/?${href.toString()}`}
                    className={`text-[14px] transition-colors hover:text-black ${
                      isActive ? "text-black font-bold" : "text-gray-500"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <Link
            href="/studio"
            className="text-[11px] font-bold uppercase tracking-widest border border-black px-6 py-2.5 rounded-full hover:bg-black hover:text-white transition-all"
          >
            Admin {/* ИСПРАВЛЕНО: Перевод */}
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-[1400px] mx-auto px-6 pt-32 pb-20 w-full animate-fadeIn">
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-12 border-b border-gray-100">
            <div className="max-w-3xl">
              <h1 className="text-[56px] md:text-[84px] font-medium tracking-tightest leading-[0.9] mb-8 text-black whitespace-pre-line">
                {category
                  ? siteConfig.navigation.find(
                      (n) => (n.value || "") === category,
                    )?.name || category
                  : siteConfig.heroTitle}
              </h1>
              <p className="text-[20px] text-gray-500 font-light max-w-[500px] leading-relaxed">
                {category
                  ? `Posts in category «${siteConfig.navigation.find((n) => (n.value || "") === category)?.name || category}»` /* ИСПРАВЛЕНО: Перевод */
                  : siteConfig.heroSubtitle}
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <Search />
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-gray-400 text-[18px]">
              No articles found. {/* ИСПРАВЛЕНО: Перевод */}
            </p>
            <Link
              href="/"
              className="text-black underline mt-4 inline-block font-medium"
            >
              Reset filters {/* ИСПРАВЛЕНО: Перевод */}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/post/${post.slug}`}
                  className="group block transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] bg-gray-50 rounded-2xl overflow-hidden mb-6 relative border border-gray-100 shadow-sm">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200" />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                        {post.categoryName || "General"}
                      </span>
                      <span className="h-[1px] w-4 bg-gray-200" />
                      <span className="text-[11px] text-gray-400 uppercase font-medium">
                        {/* ИСПРАВЛЕНО: Формат даты США */}
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </span>
                    </div>
                    <h2 className="text-[24px] font-medium leading-tight group-hover:underline underline-offset-4 decoration-gray-300 text-black">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-[15px] leading-relaxed line-clamp-2 font-light">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              category={category}
              search={search}
            />
          </>
        )}
      </main>

      <footer className="border-t border-gray-100 py-16 px-6 mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
            {siteConfig.footerText}
          </span>
          <div className="flex gap-10 text-[12px] font-bold uppercase tracking-widest text-gray-400">
            {siteConfig.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black cursor-pointer transition-colors"
              >
                {social.platform}
              </a>
            ))}
            {siteConfig.showRss && (
              <Link
                href={siteConfig.rssUrl}
                target="_blank"
                className="hover:text-black cursor-pointer transition-colors"
              >
                {siteConfig.rssTitle}
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
