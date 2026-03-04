export const runtime = "edge";
import { createClient } from "next-sanity";
import Link from "next/link";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

export default async function Page() {
  const posts = await client.fetch(
    `*[_type == "post"]{ _id, title, "slug": slug.current, description, publishedAt, category } | order(publishedAt desc)`,
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* OpenAI Style Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-[20px] font-bold tracking-tight">
              AI TALK PRO
            </Link>
            <nav className="hidden md:flex gap-6 text-[14px] font-medium text-gray-600">
              <span className="hover:text-black cursor-pointer">
                Исследования
              </span>
              <span className="hover:text-black cursor-pointer">Продукты</span>
              <span className="hover:text-black cursor-pointer">
                Безопасность
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/studio"
              className="text-[14px] font-medium border border-black px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-all"
            >
              Админка
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mt-[100px] flex-grow max-w-[1200px] mx-auto px-6 w-full">
        <div className="py-12 border-b border-gray-100 mb-12">
          <h1 className="text-[48px] md:text-[72px] font-medium tracking-tighter leading-[0.9] mb-6">
            Будущее <br />
            интеллекта.
          </h1>
          <p className="text-[18px] text-gray-500 max-w-[500px]">
            Последние новости, исследования и обновления нашей платформы.
          </p>
        </div>

        {/* Сетка постов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post.slug}`}
              className="group cursor-pointer"
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-50 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                  {post.category || "Research"}
                </span>
                <h2 className="text-[24px] font-medium leading-tight group-hover:underline underline-offset-4">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-[14px] line-clamp-2">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="py-20 px-6 border-t border-gray-100 mt-20 text-[14px] text-gray-400 max-w-[1200px] mx-auto w-full">
        <div className="flex justify-between">
          <span>© 2026 AI Talk Pro</span>
          <div className="flex gap-6">
            <span>Twitter</span>
            <span>YouTube</span>
            <span>GitHub</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
