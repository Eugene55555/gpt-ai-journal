export const runtime = "edge";
export const revalidate = 3600; // ИСПРАВЛЕНО: Кэш на 1 час

import { createClient } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { Download, ArrowLeft } from "lucide-react";
import CodeBlock from "../../components/CodeBlock";
import TableOfContents from "../../components/TableOfContents";
import ProgressBar from "../../components/ProgressBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import FAQBlock from "../../components/FAQBlock";
import { getSiteSettings } from "../../config/site";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\sа-яё]/gi, "")
    .replace(/\s+/g, "-");

const ptComponents = {
  block: {
    h2: ({ children }) => {
      const id = slugify(children.toString());
      return (
        <h2
          id={id}
          className="scroll-mt-32 text-[32px] font-medium mt-20 mb-6 text-gray-900 tracking-tight"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(children.toString());
      return (
        <h3
          id={id}
          className="scroll-mt-32 text-[24px] font-medium mt-12 mb-4 text-gray-900 tracking-tight"
        >
          {children}
        </h3>
      );
    },
    normal: ({ children }) => (
      <p className="mb-8 leading-[1.8] text-[18px] text-gray-800 font-light">
        {children}
      </p>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.url) return null;
      return (
        <figure className="my-16">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
            <Image
              src={value.url}
              alt={value.alt || "Article image"} // ИСПРАВЛЕНО: Перевод
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-[13px] text-gray-400 mt-5 font-light tracking-wide italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    blockquote: ({ value }) => (
      <blockquote className="border-l-2 border-black pl-8 my-16 py-2">
        <p className="text-[24px] font-light italic leading-relaxed text-gray-900">
          {value.text}
        </p>
        {value.author && (
          <cite className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-6 block not-italic">
            — {value.author}
          </cite>
        )}
      </blockquote>
    ),
    inlineFile: ({ value }) => {
      if (!value?.url) return null;
      return (
        <div className="my-12">
          <a
            href={`${value.url}?dl=`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 group no-underline"
          >
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-300 shadow-sm">
                <Download size={18} />
              </div>
              <span className="text-[15px] font-medium text-gray-900 group-hover:text-black transition-colors">
                {value.buttonText || "Download file"}{" "}
                {/* ИСПРАВЛЕНО: Перевод */}
              </span>
            </div>
            <span className="hidden sm:inline text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              PDF / DOCX
            </span>
          </a>
        </div>
      );
    },
    myCodeField: ({ value }) => <CodeBlock value={value} />,
  },
};

export async function generateMetadata({ params }) {
  const siteConfig = await getSiteSettings();
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ title, description, "imageUrl": mainImage.asset->url }`,
    { slug: params.slug },
    { next: { revalidate: 0 } },
  );
  if (!post) return { title: `404 | ${siteConfig.name}` };
  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.description || siteConfig.description,
    openGraph: {
      images: [post.imageUrl || siteConfig.defaultOgImageUrl],
    },
  };
}

export default async function PostPage({ params }) {
  const siteConfig = await getSiteSettings();

  // ДОБАВЛЕНО: Получаем aiDisclosureText и socials
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      description,
      publishedAt,
      _updatedAt,
      aiDisclosureText, 
      "categoryId": category._ref,
      "categoryName": category->title,
      "categoryValue": category->value,
      "imageUrl": mainImage.asset->url,
      "fileUrl": downloadFile.asset->url,
      faq,
      author->{
        name,
        bio,
        socials, 
        "avatarUrl": avatar.asset->url
      },
      body[]{
        ...,
        _type == "image" => { ..., "url": asset->url },
        _type == "inlineFile" => { ..., "url": file.asset->url }
      }
    }`,
    { slug: params.slug },
    { next: { revalidate: 0 } },
  );

  if (!post) {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  // Поиск похожих по связи с категорией
  const relatedPosts = await client.fetch(
    `*[_type == "post" && category._ref == $categoryId && _id != $currentId] | order(publishedAt desc)[0...2]{
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "imageUrl": mainImage.asset->url
    }`,
    { categoryId: post.categoryId, currentId: post._id },
    { next: { revalidate: 0 } },
  );

  const jsonLdArray = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image: post.imageUrl ? [post.imageUrl] : [],
      datePublished: post.publishedAt,
      dateModified: post._updatedAt,
      author: [
        {
          "@type": "Person",
          name: post.author?.name || siteConfig.publisher,
        },
      ],
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.baseUrl}/logo.png`,
        },
      },
    },
  ];

  if (post.faq && post.faq.length > 0) {
    jsonLdArray.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArray) }}
      />
      <ProgressBar />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity"
          >
            {siteConfig.name}
          </Link>
          <Link
            href="/"
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to posts {/* ИСПРАВЛЕНО: Перевод */}
          </Link>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 pt-32 pb-32 animate-fadeIn">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          <div className="flex-grow lg:max-w-[800px] w-full">
            <Breadcrumbs
              categoryValue={post.categoryValue}
              categoryName={post.categoryName}
              title={post.title}
            />

            <header className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                  {post.categoryName || "UNCATEGORIZED"}{" "}
                  {/* ИСПРАВЛЕНО: Перевод */}
                </span>

                {/* ДОБАВЛЕНО: Бейдж AI Disclosure */}
                {post.aiDisclosureText && (
                  <span className="text-[10px] font-medium px-2 py-0.5 border border-gray-200 rounded text-gray-400 uppercase tracking-tighter">
                    {post.aiDisclosureText}
                  </span>
                )}

                <time className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                  {/* ИСПРАВЛЕНО: Формат даты США */}
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>

              <h1 className="text-[48px] md:text-[68px] font-medium tracking-tightest leading-[0.95] mb-10 text-black">
                {post.title}
              </h1>

              {post.description && (
                <p className="text-[22px] md:text-[26px] text-gray-500 font-light leading-relaxed mb-12">
                  {post.description}
                </p>
              )}

              <div className="flex items-center gap-5 py-8 border-y border-gray-100">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-50 border border-gray-100 shrink-0 shadow-sm">
                  {post.author?.avatarUrl ? (
                    <Image
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm font-bold text-gray-300">
                      A
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-widest text-gray-900">
                    {post.author?.name || siteConfig.publisher}
                  </p>
                  <p className="text-[13px] text-gray-400 mt-1 font-light italic">
                    {post.author?.bio || "Editorial"}{" "}
                    {/* ИСПРАВЛЕНО: Перевод */}
                  </p>

                  {/* ДОБАВЛЕНО: Соцсети автора под его именем */}
                  {post.author?.socials?.length > 0 && (
                    <div className="flex gap-3 mt-2">
                      {post.author.socials.map((s) => (
                        <a
                          key={s.platform}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-gray-400 hover:text-black uppercase font-bold tracking-widest transition-colors"
                        >
                          {s.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </header>

            {post.imageUrl && (
              <div className="mb-20 relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100/50">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose prose-neutral max-w-none">
              <PortableText value={post.body} components={ptComponents} />
            </div>

            {post.fileUrl && (
              <div className="mt-20 pt-10 border-t border-gray-100">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                  Additional Resources {/* ИСПРАВЛЕНО: Перевод */}
                </h4>
                <a
                  href={`${post.fileUrl}?dl=`}
                  className="inline-flex items-center gap-4 bg-black text-white px-8 py-4 rounded-full text-[14px] font-medium hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-200"
                >
                  <Download size={18} />
                  Download full report (PDF) {/* ИСПРАВЛЕНО: Перевод */}
                </a>
              </div>
            )}

            <FAQBlock faq={post.faq} />

            {relatedPosts.length > 0 && (
              <div className="mt-32 pt-16 border-t-2 border-black">
                <h3 className="text-[32px] font-medium tracking-tightest mb-10">
                  Read Next {/* ИСПРАВЛЕНО: Перевод */}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp._id}
                      href={`/post/${rp.slug}`}
                      className="group block"
                    >
                      <div className="aspect-[16/10] bg-gray-50 rounded-2xl overflow-hidden mb-5 relative border border-gray-100 shadow-sm">
                        {rp.imageUrl ? (
                          <Image
                            src={rp.imageUrl}
                            alt={rp.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200" />
                        )}
                      </div>
                      <div className="space-y-3">
                        <span className="text-[10px] text-gray-400 uppercase font-medium tracking-widest block">
                          {/* ИСПРАВЛЕНО: Формат даты США */}
                          {new Date(rp.publishedAt).toLocaleDateString(
                            "en-US",
                            { day: "numeric", month: "long" },
                          )}
                        </span>
                        <h4 className="text-[20px] font-medium leading-tight group-hover:underline underline-offset-4 decoration-gray-300 line-clamp-2">
                          {rp.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32 self-start border-l border-gray-50 pl-10">
            <div className="space-y-12">
              <TableOfContents blocks={post.body} />
              <div className="p-8 rounded-3xl bg-black text-white space-y-5 shadow-2xl shadow-gray-300/50">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  {siteConfig.newsletterTitle}
                </h4>
                <p className="text-[14px] font-light text-gray-300 leading-relaxed">
                  {siteConfig.newsletterText}
                </p>
                <div className="h-[1px] bg-gray-800" />
                <button className="w-full py-3 text-[11px] font-bold uppercase tracking-widest text-white hover:text-gray-400 transition-colors">
                  {siteConfig.newsletterButton}
                </button>
              </div>
            </div>
          </aside>
        </div>
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
            {post.author?.socials?.length > 0 && (
              <div className="h-[1px] w-4 bg-gray-200 mx-4 hidden sm:block" />
            )}
            {post.author?.socials?.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors hidden sm:block"
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
    </>
  );
}
