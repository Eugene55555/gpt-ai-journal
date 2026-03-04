export const runtime = "edge";
import { createClient } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

export default async function PostPage({ params }) {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ title, body, publishedAt, category }`,
    { slug: params.slug },
  );
  if (!post) return <div className="p-20 text-center">Пост не найден</div>;

  return (
    <article className="max-w-[700px] mx-auto px-6 py-[120px]">
      <Link
        href="/"
        className="text-gray-400 hover:text-black mb-12 inline-block text-[14px]"
      >
        ← Ко всем публикациям
      </Link>
      <div className="mb-12">
        <span className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-4 block">
          {post.category}
        </span>
        <h1 className="text-[40px] md:text-[56px] font-medium tracking-tight leading-tight mb-8">
          {post.title}
        </h1>
        <div className="text-gray-400 text-[14px]">
          {new Date(post.publishedAt).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
      <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-medium prose-p:text-gray-800 prose-p:leading-relaxed">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}
