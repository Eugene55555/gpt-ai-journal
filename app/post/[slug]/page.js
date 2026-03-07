export const runtime = "edge";
export const revalidate = 3600;

import { createClient } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { Download, ArrowLeft, Sparkles, Eye } from "lucide-react";
import { Tweet } from "react-tweet";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import CodeBlock from "../../components/CodeBlock";
import TableOfContents from "../../components/TableOfContents";
import Breadcrumbs from "../../components/Breadcrumbs";
import FAQBlock from "../../components/FAQBlock";
import ShareButtons from "../../components/ShareButtons";
import SocialIcon from "../../components/SocialIcon";
import NewsletterForm from "../../components/NewsletterForm";
import YouTubeEmbed from "../../components/YouTubeEmbed";
import ThemeToggle from "../../components/ThemeToggle";
import ViewCounter from "../../components/ViewCounter";
import StickyActionBar from "../../components/StickyActionBar";
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

const extractTextFromBlock = (blockChildren) => {
  if (!blockChildren || !Array.isArray(blockChildren)) return "";
  return blockChildren.map((child) => child.text || "").join("");
};

function calculateReadingTime(blocks) {
  if (!blocks || !Array.isArray(blocks)) return 1;
  const text = blocks
    .filter((block) => block._type === "block" && block.children)
    .map((block) => block.children.map((child) => child.text).join(""))
    .join(" ");

  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 225));
}

const ptComponents = {
  block: {
    h1: ({ value, children }) => {
      const id = slugify(extractTextFromBlock(value.children));
      return <h2 id={id}>{children}</h2>;
    },
    h2: ({ value, children }) => {
      const id = slugify(extractTextFromBlock(value.children));
      return <h2 id={id}>{children}</h2>;
    },
    h3: ({ value, children }) => {
      const id = slugify(extractTextFromBlock(value.children));
      return <h3 id={id}>{children}</h3>;
    },
  },
  marks: {
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-black dark:text-white underline decoration-gray-300 dark:decoration-gray-600 underline-offset-4 hover:decoration-black dark:hover:decoration-white transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.url) return null;
      return (
        <figure className="my-12 md:my-16 group">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111] shadow-sm dark:shadow-none transition-colors cursor-zoom-in">
            <Zoom zoomMargin={40} classDialog="custom-zoom-overlay">
              <Image
                src={value.url}
                alt={value.alt || ""}
                fill
                className="object-cover"
              />
            </Zoom>
          </div>
          {value.caption && (
            <figcaption className="text-center text-[12px] md:text-[13px] text-gray-400 dark:text-gray-500 mt-4 md:mt-5 font-light tracking-wide italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    inlineFile: ({ value }) => {
      if (!value?.url) return null;
      let extension = "FILE";
      try {
        const urlParts = value.url.split("?")[0].split(".");
        if (urlParts.length > 1) {
          extension = urlParts[urlParts.length - 1].toUpperCase();
        }
      } catch (e) {}

      return (
        <div className="my-10 md:my-12">
          <a
            href={`${value.url}?dl=`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111] hover:bg-white dark:hover:bg-[#1a1a1a] hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-xl dark:hover:shadow-none transition-all duration-300 group no-underline"
          >
            <div className="flex items-center gap-4 md:gap-5">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white dark:bg-[#222] flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300 shadow-sm dark:shadow-none shrink-0">
                <Download size={18} />
              </div>
              <span className="text-[14px] md:text-[15px] font-medium text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                {value.buttonText || "Download file"}
              </span>
            </div>
            <span className="hidden sm:inline text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest shrink-0 ml-4">
              {extension}
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
    `*[_type == "post" && slug.current == $slug][0]{ 
      title, 
      description, 
      publishedAt,
      _updatedAt,
      author->{name},
      "imageUrl": mainImage.asset->url 
    }`,
    { slug: params.slug },
    { next: { revalidate: 0 } },
  );

  if (!post) return { title: `404 | ${siteConfig.name}` };

  const postUrl = `${siteConfig.baseUrl}/post/${params.slug}`;

  return {
    title: post.title,
    description: post.description || siteConfig.description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description || siteConfig.description,
      url: postUrl,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: [post.author?.name || siteConfig.publisher],
      images: [
        {
          url: post.imageUrl || siteConfig.defaultOgImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || siteConfig.description,
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
      keyTakeaways,
      "categoryId": category._ref,
      "categoryName": category->title,
      "categoryValue": category->value,
      "imageUrl": mainImage.asset->url,
      "fileUrl": downloadFile.asset->url,
      views,
      faq,
      author->{
        name,
        "slug": slug.current,
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
      description,
      publishedAt,
      "categoryName": category->title,
      "categoryValue": category->value,
      "imageUrl": mainImage.asset->url,
      views
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
          url: post.author?.slug
            ? `${siteConfig.baseUrl}/author/${post.author.slug}`
            : siteConfig.baseUrl,
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

      {siteConfig.showStickyBar && (
        <StickyActionBar
          title={post.title}
          slug={params.slug}
          baseUrl={siteConfig.baseUrl}
          siteName={siteConfig.name}
          shareOptions={siteConfig.stickyShareOptions}
        />
      )}

      <header className="absolute top-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/50 transition-colors duration-300">
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
              Back to posts
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 pt-32 pb-32 animate-fadeIn">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          <article className="flex-grow lg:max-w-[800px] w-full overflow-hidden">
            <Breadcrumbs
              categoryValue={post.categoryValue}
              categoryName={post.categoryName}
              title={post.title}
            />

            <header className="mb-12 md:mb-16">
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full text-gray-600 dark:text-gray-300 transition-colors">
                  {post.categoryName || "UNCATEGORIZED"}
                </span>

                {post.aiDisclosureText && (
                  <span className="text-[9px] md:text-[10px] font-medium px-2 py-0.5 border border-gray-200 dark:border-gray-700 rounded text-gray-400 dark:text-gray-500 uppercase tracking-tighter transition-colors">
                    {post.aiDisclosureText}
                  </span>
                )}

                <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest transition-colors w-full sm:w-auto mt-2 sm:mt-0">
                  <time dateTime={post.publishedAt}>
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
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                  <ViewCounter slug={params.slug} initialViews={post.views} />
                </div>
              </div>

              <h1 className="text-[36px] sm:text-[48px] md:text-[68px] font-medium tracking-tightest leading-[1.05] md:leading-[0.95] mb-6 md:mb-10 text-black dark:text-white transition-colors break-words">
                {post.title}
              </h1>

              {post.description && (
                <p className="text-[18px] sm:text-[22px] md:text-[26px] text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-8 md:mb-12 transition-colors">
                  {post.description}
                </p>
              )}

              <div className="flex items-center gap-4 md:gap-5 py-6 md:py-8 border-y border-gray-100 dark:border-gray-800 transition-colors">
                <Link
                  href={post.author?.slug ? `/author/${post.author.slug}` : "#"}
                  className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shrink-0 shadow-sm dark:shadow-none transition-colors group"
                >
                  {post.author?.avatarUrl ? (
                    <Image
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm font-bold text-gray-300 dark:text-gray-600">
                      A
                    </div>
                  )}
                </Link>
                <div>
                  <Link
                    href={
                      post.author?.slug ? `/author/${post.author.slug}` : "#"
                    }
                    className="text-[12px] md:text-[13px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-200 transition-colors hover:underline decoration-2 underline-offset-4"
                  >
                    {post.author?.name || siteConfig.publisher}
                  </Link>
                  <p className="text-[12px] md:text-[13px] text-gray-400 dark:text-gray-500 mt-0.5 md:mt-1 font-light italic transition-colors">
                    {post.author?.bio || "Editorial"}
                  </p>
                </div>
              </div>
            </header>

            {post.imageUrl && (
              <div className="mb-12 md:mb-20 relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl dark:shadow-[0_20px_50px_rgb(0,0,0,0.5)] border border-gray-100/50 dark:border-gray-800/50 transition-shadow cursor-zoom-in">
                <Zoom zoomMargin={20} classDialog="custom-zoom-overlay">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </Zoom>
              </div>
            )}

            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="mb-12 md:mb-16 p-6 md:p-10 rounded-2xl md:rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 transition-colors">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shrink-0 shadow-md">
                    <Sparkles size={16} className="md:w-[18px] md:h-[18px]" />
                  </div>
                  <h2
                    id="key-takeaways"
                    className="!mt-0 !mb-0 text-[18px] md:text-[20px] font-medium text-black dark:text-white tracking-tight"
                  >
                    Key Takeaways
                  </h2>
                </div>
                <ul
                  className="!mb-0 space-y-4 md:space-y-5 !pl-0"
                  style={{ listStyleType: "none" }}
                >
                  {post.keyTakeaways.map((takeaway, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 md:gap-5 !pl-0"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white mt-2 md:mt-2.5 shrink-0 opacity-50" />
                      <span className="text-[15px] md:text-[17px] text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                        {takeaway}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="block lg:hidden mb-12 p-6 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 transition-colors">
              <TableOfContents blocks={post.body} />
            </div>

            <div className="rich-text transition-colors w-full overflow-hidden">
              <PortableText value={post.body} components={ptComponents} />
            </div>

            {post.fileUrl && (
              <div className="mt-16 md:mt-20 pt-8 md:pt-10 border-t border-gray-100 dark:border-gray-800 transition-colors">
                <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-5 md:mb-6">
                  Additional Resources
                </h4>
                <a
                  href={`${post.fileUrl}?dl=`}
                  className="inline-flex items-center gap-3 md:gap-4 bg-black dark:bg-white text-white dark:text-black px-6 py-3 md:px-8 md:py-4 rounded-full text-[13px] md:text-[14px] font-medium hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-200 dark:shadow-none"
                >
                  <Download size={18} />
                  Download full report
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

            <div className="block lg:hidden mt-16">
              <NewsletterForm
                title={siteConfig.newsletterTitle}
                text={siteConfig.newsletterText}
                placeholder={siteConfig.newsletterPlaceholder}
                buttonText={siteConfig.newsletterButton}
              />
            </div>

            <FAQBlock faq={post.faq} />

            {relatedPosts.length > 0 && (
              <div className="mt-24 md:mt-32 pt-12 md:pt-16 border-t-2 border-black dark:border-white transition-colors">
                <h3 className="text-[28px] md:text-[32px] font-medium tracking-tightest mb-8 md:mb-10 dark:text-white">
                  Read Next
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp._id}
                      href={`/post/${rp.slug}`}
                      className="group block transition-transform duration-300 ease-out hover:-translate-y-1.5"
                    >
                      <div className="aspect-[16/10] bg-gray-50 dark:bg-[#111] rounded-2xl overflow-hidden mb-5 relative border border-gray-100 dark:border-gray-800/60 shadow-sm dark:shadow-none transition-shadow duration-300 group-hover:shadow-xl dark:group-hover:shadow-[0_10px_40px_rgb(0,0,0,0.4)]">
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
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            {rp.categoryName || "General"}
                          </span>
                          <span className="h-[1px] w-4 bg-gray-200 dark:bg-gray-700" />
                          <span className="text-[11px] text-gray-400 dark:text-gray-500 uppercase font-medium">
                            {new Date(rp.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="h-[1px] w-4 bg-gray-200 dark:bg-gray-700" />
                          <span className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest">
                            <Eye size={12} />
                            {rp.views || 0}
                          </span>
                        </div>
                        <h2 className="text-[22px] md:text-[24px] font-medium leading-tight group-hover:underline underline-offset-4 decoration-gray-300 dark:decoration-gray-600 text-black dark:text-white transition-colors line-clamp-2">
                          {rp.title}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed line-clamp-2 font-light">
                          {rp.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

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
      <footer className="border-t border-gray-100 dark:border-gray-800/50 py-12 md:py-16 px-6 mt-auto transition-colors">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <span className="text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 text-center md:text-left">
            {siteConfig.footerText}
          </span>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
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
                  <SocialIcon
                    name={social.iconName}
                    size={16}
                    className="md:w-[18px] md:h-[18px]"
                  />
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
