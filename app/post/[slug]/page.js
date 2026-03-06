export const runtime = "edge";
export const revalidate = 3600;

import { createClient } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { Download, ArrowLeft } from "lucide-react";
import { Tweet } from "react-tweet";
import CodeBlock from "../../components/CodeBlock";
import TableOfContents from "../../components/TableOfContents";
import ProgressBar from "../../components/ProgressBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import FAQBlock from "../../components/FAQBlock";
import ShareButtons from "../../components/ShareButtons";
import SocialIcon from "../../components/SocialIcon";
import NewsletterForm from "../../components/NewsletterForm";
import YouTubeEmbed from "../../components/YouTubeEmbed";
import ThemeToggle from "../../components/ThemeToggle"; // ДОБАВЛЕНО
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

function calculateReadingTime(blocks) {
  if (!blocks || !Array.isArray(blocks)) return 1;
  const text = blocks
    .filter((block) => block._type === "block" && block.children)
    .map((block) => block.children.map((child) => child.text).join(""))
    .join(" ");

  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 225);
  return Math.max(1, readingTime);
}

const ptComponents = {
  block: {
    h2: ({ children }) => {
      const id = slugify(children.toString());
      return (
        <h2
          id={id}
          className="scroll-mt-32 text-[32px] font-medium mt-20 mb-6 text-gray-900 dark:text-white tracking-tight transition-colors"
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
          className="scroll-mt-32 text-[24px] font-medium mt-12 mb-4 text-gray-900 dark:text-white tracking-tight transition-colors"
        >
          {children}
        </h3>
      );
    },
    normal: ({ children }) => (
      <p className="mb-8 leading-[1.8] text-[18px] text-gray-800 dark:text-gray-300 font-light transition-colors">
        {children}
      </p>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.url) return null;
      return (
        <figure className="my-16">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111] shadow-sm dark:shadow-none transition-colors">
            <Image
              src={value.url}
              alt={value.alt || "Article image"}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-[13px] text-gray-400 dark:text-gray-500 mt-5 font-light tracking-wide italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    blockquote: ({ value }) => (
      <blockquote className="border-l-2 border-black dark:border-white pl-8 my-16 py-2 transition-colors">
        <p className="text-[24px] font-light italic leading-relaxed text-gray-900 dark:text-gray-100 transition-colors">
          {value.text}
        </p>
        {value.author && (
          <cite className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mt-6 block not-italic">
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
            className="flex items-center justify-between p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111] hover:bg-white dark:hover:bg-[#1a1a1a] hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-xl dark:hover:shadow-none transition-all duration-300 group no-underline"
          >
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-full bg-white dark:bg-[#222] flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300 shadow-sm dark:shadow-none">
                <Download size={18} />
              </div>
              <span className="text-[15px] font-medium text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                {value.buttonText || "Download file"}
              </span>
            </div>
            <span className="hidden sm:inline text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              PDF / DOCX
            </span>
          </a>
        </div>
      );
    },
    myCodeField: ({ value }) => <CodeBlock value={value} />,
    youtube: ({ value }) => <YouTubeEmbed url={value.url} />,
    twitter: ({ value }) => {
      if (!value?.url) return null;
      const match = value.url.match(
        /(?:twitter\.com|x\.com)\/.*\/status\/(\d+)/,
      );
      const tweetId = match ? match[1] : null;
      if (!tweetId) return null;
      return (
        <div className="my-10 flex justify-center tweet-container dark:hidden">
          <Tweet id={tweetId} />
        </div>
      );
    },
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
        socials[]{ platform, url, iconName },
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

  const readingTime = calculateReadingTime(post.body);

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
      timeRequired: `PT${readingTime}M`,
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

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/50 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity dark:text-white"
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
              Back to posts
            </Link>
          </div>
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
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full text-gray-600 dark:text-gray-300 transition-colors">
                  {post.categoryName || "UNCATEGORIZED"}
                </span>

                {post.aiDisclosureText && (
                  <span className="text-[10px] font-medium px-2 py-0.5 border border-gray-200 dark:border-gray-700 rounded text-gray-400 dark:text-gray-500 uppercase tracking-tighter transition-colors">
                    {post.aiDisclosureText}
                  </span>
                )}

                <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest transition-colors">
                  <time>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                  <span className="flex items-center gap-1">
                    {readingTime} {siteConfig.readingTimeText}
                  </span>
                </div>
              </div>

              <h1 className="text-[48px] md:text-[68px] font-medium tracking-tightest leading-[0.95] mb-10 text-black dark:text-white transition-colors">
                {post.title}
              </h1>

              {post.description && (
                <p className="text-[22px] md:text-[26px] text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-12 transition-colors">
                  {post.description}
                </p>
              )}

              <div className="flex items-center gap-5 py-8 border-y border-gray-100 dark:border-gray-800 transition-colors">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shrink-0 shadow-sm dark:shadow-none transition-colors">
                  {post.author?.avatarUrl ? (
                    <Image
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm font-bold text-gray-300 dark:text-gray-600">
                      A
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-200 transition-colors">
                    {post.author?.name || siteConfig.publisher}
                  </p>
                  <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1 font-light italic transition-colors">
                    {post.author?.bio || "Editorial"}
                  </p>

                  {post.author?.socials?.length > 0 && (
                    <div className="flex gap-4 mt-2">
                      {post.author.socials.map((s) => (
                        <a
                          key={s.platform}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white uppercase font-bold tracking-widest transition-colors"
                          title={s.platform}
                        >
                          {s.iconName ? (
                            <SocialIcon name={s.iconName} size={14} />
                          ) : (
                            <span>{s.platform}</span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </header>

            {post.imageUrl && (
              <div className="mb-20 relative aspect-video rounded-3xl overflow-hidden shadow-2xl dark:shadow-[0_20px_50px_rgb(0,0,0,0.5)] border border-gray-100/50 dark:border-gray-800/50 transition-shadow">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* ИСПРАВЛЕНО: dark:prose-invert для автоматической окраски контента */}
            <div className="prose prose-neutral dark:prose-invert max-w-none transition-colors">
              <PortableText value={post.body} components={ptComponents} />
            </div>

            {post.fileUrl && (
              <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 transition-colors">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6">
                  Additional Resources
                </h4>
                <a
                  href={`${post.fileUrl}?dl=`}
                  className="inline-flex items-center gap-4 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full text-[14px] font-medium hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-200 dark:shadow-none"
                >
                  <Download size={18} />
                  Download full report (PDF)
                </a>
              </div>
            )}

            <ShareButtons
              title={post.title}
              slug={params.slug}
              baseUrl={siteConfig.baseUrl}
              shareTitle={siteConfig.shareTitle}
              shareOptions={siteConfig.shareOptions}
            />

            <FAQBlock faq={post.faq} />

            {relatedPosts.length > 0 && (
              <div className="mt-32 pt-16 border-t-2 border-black dark:border-white transition-colors">
                <h3 className="text-[32px] font-medium tracking-tightest mb-10 dark:text-white">
                  Read Next
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp._id}
                      href={`/post/${rp.slug}`}
                      className="group block"
                    >
                      <div className="aspect-[16/10] bg-gray-50 dark:bg-[#111] rounded-2xl overflow-hidden mb-5 relative border border-gray-100 dark:border-gray-800/60 shadow-sm dark:shadow-none transition-colors">
                        {rp.imageUrl ? (
                          <Image
                            src={rp.imageUrl}
                            alt={rp.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
                        )}
                      </div>
                      <div className="space-y-3">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-medium tracking-widest block transition-colors">
                          {new Date(rp.publishedAt).toLocaleDateString(
                            "en-US",
                            { day: "numeric", month: "long" },
                          )}
                        </span>
                        <h4 className="text-[20px] font-medium leading-tight group-hover:underline underline-offset-4 decoration-gray-300 dark:decoration-gray-600 text-black dark:text-white transition-colors line-clamp-2">
                          {rp.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32 self-start border-l border-gray-50 dark:border-gray-800/50 pl-10 transition-colors">
            <div className="space-y-12">
              <TableOfContents blocks={post.body} />

              <NewsletterForm
                title={siteConfig.newsletterTitle}
                text={siteConfig.newsletterText}
                placeholder={siteConfig.newsletterPlaceholder}
                buttonText={siteConfig.newsletterButton}
              />
            </div>
          </aside>
        </div>
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
    </>
  );
}
