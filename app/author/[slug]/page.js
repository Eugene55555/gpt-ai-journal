export const runtime = "edge";
export const revalidate = 3600;

import { createClient } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import { Eye, ArrowLeft } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import SocialIcon from "../../components/SocialIcon";
import { getSiteSettings } from "../../config/site";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

export async function generateMetadata({ params }) {
  const siteConfig = await getSiteSettings();
  const author = await client.fetch(
    `*[_type == "author" && slug.current == $slug][0]{ name, bio }`,
    { slug: params.slug },
    { next: { revalidate: 0 } },
  );
  if (!author) return { title: `Author not found | ${siteConfig.name}` };
  return {
    title: `${author.name} | ${siteConfig.name}`,
    description: author.bio || `Articles written by ${author.name}`,
    alternates: {
      canonical: `/author/${params.slug.toLowerCase()}`,
    },
  };
}

export default async function AuthorPage({ params }) {
  const siteConfig = await getSiteSettings();

  const author = await client.fetch(
    `*[_type == "author" && slug.current == $slug][0]{
      name,
      bio,
      socials[]{ platform, url, iconName },
      "avatarUrl": avatar.asset->url
    }`,
    { slug: params.slug },
    { next: { revalidate: 0 } },
  );

  if (!author) {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  const posts = await client.fetch(
    `*[_type == "post" && author->slug.current == $slug] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      publishedAt,
      "categoryName": category->title,
      "categoryValue": category->value,
      "imageUrl": mainImage.asset->url,
      views
    }`,
    { slug: params.slug },
    { next: { revalidate: 0 } },
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/50 transition-colors">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-[22px] font-bold tracking-tighter hover:opacity-70 transition-opacity dark:text-white"
          >
            {siteConfig.name}
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1400px] mx-auto px-6 pt-32 pb-20 w-full animate-fadeIn">
        <div className="mb-20 pb-16 border-b border-gray-100 dark:border-gray-800 transition-colors flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shrink-0 shadow-lg dark:shadow-none transition-colors">
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-4xl font-bold text-gray-300 dark:text-gray-600">
                A
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-[48px] md:text-[64px] font-medium tracking-tightest leading-[0.9] mb-6 text-black dark:text-white transition-colors">
              {author.name}
            </h1>
            <p className="text-[18px] md:text-[20px] text-gray-500 dark:text-gray-400 font-light max-w-[600px] leading-relaxed mb-8 transition-colors">
              {author.bio || "Staff Writer"}
            </p>
            {author.socials?.length > 0 && (
              <div className="flex justify-center md:justify-start gap-5">
                {author.socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-black hover:border-black dark:text-gray-400 dark:hover:text-white dark:hover:border-white transition-all shadow-sm hover:shadow-md"
                    title={s.platform}
                  >
                    {s.iconName ? (
                      <SocialIcon name={s.iconName} size={18} />
                    ) : (
                      <span>{s.platform[0]}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-[28px] font-medium tracking-tight mb-12 dark:text-white">
            Articles by {author.name}{" "}
            <span className="text-gray-400 dark:text-gray-600">
              ({posts.length})
            </span>
          </h2>
        </div>

        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-[18px]">
              No articles published yet.
            </p>
          </div>
        ) : (
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
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
