export const runtime = "edge";
export const revalidate = 3600;

import { createClient } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import { Eye, ArrowLeft } from "lucide-react";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import SocialIcon from "../../components/SocialIcon";
import ThemeToggle from "../../components/ThemeToggle";
import { getSiteSettings } from "../../config/site";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

export async function generateMetadata({ params }) {
  const siteConfig = await getSiteSettings();
  const category = siteConfig.navigation.find(
    (n) => n.value.toLowerCase() === params.slug.toLowerCase(),
  );

  if (!category) return { title: `Category not found | ${siteConfig.name}` };

  return {
    title: `${category.name} | ${siteConfig.name}`,
    description: `Read all articles about ${category.name}`,
    alternates: {
      canonical: `/category/${params.slug.toLowerCase()}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const siteConfig = await getSiteSettings();

  const currentCategory = siteConfig.navigation.find(
    (n) => n.value.toLowerCase() === params.slug.toLowerCase(),
  );

  if (!currentCategory) {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  const categoryValue = currentCategory.value;
  const search = searchParams?.search || "";
  const currentPage = Number(searchParams?.page) || 1;

  const start = (currentPage - 1) * siteConfig.postsPerPage;
  const end = start + siteConfig.postsPerPage;

  let conditions = `_type == "post" && category->value == $categoryValue`;
  if (search) {
    conditions += ` && (title match $search || description match $search)`;
  }

  const query = `{
    "posts": *[${conditions}] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      "slug": slug.current,
      description,
      publishedAt,
      "categoryName": category->title,
      "categoryValue": category->value,
      "imageUrl": mainImage.asset->url,
      views
    },
    "total": count(*[${conditions}])
  }`;

  const queryParams = { start, end, categoryValue };
  if (search) queryParams.search = `*${search}*`;

  const data = await client.fetch(query, queryParams, {
    next: { revalidate: 0 },
  });
  const posts = data.posts || [];
  const totalPosts = data.total || 0;

  const totalPages = Math.ceil(totalPosts / siteConfig.postsPerPage);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/50 transition-colors">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-[22px] font-bold tracking-tighter hover:opacity-70 transition-opacity dark:text-white"
            >
              {siteConfig.name}
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {siteConfig.navigation.map((item) => {
                const itemValue = item.value || "";
                const baseHref = itemValue
                  ? `/category/${itemValue.toLowerCase()}`
                  : "/";
                const isActive =
                  itemValue.toLowerCase() === params.slug.toLowerCase();

                return (
                  <Link
                    key={item.name}
                    href={baseHref}
                    className={`text-[14px] transition-colors hover:text-black dark:hover:text-white ${
                      isActive
                        ? "text-black dark:text-white font-bold"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1400px] mx-auto px-6 pt-32 pb-20 w-full animate-fadeIn">
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-12 border-b border-gray-100 dark:border-gray-800 transition-colors">
            <div className="max-w-3xl">
              <h1 className="text-[56px] md:text-[84px] font-medium tracking-tightest leading-[0.9] mb-8 text-black dark:text-white whitespace-pre-line">
                {currentCategory.name}
              </h1>
              <p className="text-[20px] text-gray-500 dark:text-gray-400 font-light max-w-[500px] leading-relaxed">
                Posts in category «{currentCategory.name}»
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <Search />
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-[18px]">
              No articles found in this category.
            </p>
            <Link
              href="/"
              className="text-black dark:text-white underline mt-4 inline-block font-medium"
            >
              Back to all posts
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/post/${post.slug}`}
                  className="group block transition-transform duration-300 ease-out hover:-translate-y-1.5"
                >
                  <div className="aspect-[16/10] bg-gray-50 dark:bg-[#111] rounded-2xl overflow-hidden mb-5 relative border border-gray-100 dark:border-gray-800/60 shadow-sm dark:shadow-none transition-shadow duration-300 group-hover:shadow-xl dark:group-hover:shadow-[0_10px_40px_rgb(0,0,0,0.4)]">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {post.categoryName || "General"}
                      </span>
                      <span className="h-[1px] w-4 bg-gray-200 dark:bg-gray-700" />
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 uppercase font-medium">
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </span>
                      <span className="h-[1px] w-4 bg-gray-200 dark:bg-gray-700" />
                      <span className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest">
                        <Eye size={12} />
                        {post.views || 0}
                      </span>
                    </div>
                    <h2 className="text-[22px] md:text-[24px] font-medium leading-tight group-hover:underline underline-offset-4 decoration-gray-300 dark:decoration-gray-600 text-black dark:text-white transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed line-clamp-2 font-light">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              search={search}
            />
          </>
        )}
      </main>

      <footer className="border-t border-gray-100 dark:border-gray-800/50 py-16 px-6 mt-auto transition-colors">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-[12px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {siteConfig.footerText}
          </span>
          <div className="flex gap-8 text-[12px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {siteConfig.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black dark:hover:text-white cursor-pointer transition-colors flex items-center gap-2"
                title={social.platform}
              >
                {social.iconName ? (
                  <SocialIcon name={social.iconName} size={18} />
                ) : (
                  <span>{social.platform}</span>
                )}
              </a>
            ))}
            {siteConfig.showRss && (
              <Link
                href={siteConfig.rssUrl}
                target="_blank"
                className="hover:text-black dark:hover:text-white cursor-pointer transition-colors flex items-center"
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
