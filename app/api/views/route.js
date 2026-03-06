export const runtime = "edge";

import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(req) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return new Response(JSON.stringify({ error: "Missing slug." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return new Response(JSON.stringify({ error: "Missing Write Token." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ищем документ статьи по слагу, чтобы получить его внутренний _id
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{_id, views}`,
      { slug },
    );

    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Обновляем счетчик (+1). Если поля views еще не было, ставим 0 и прибавляем 1
    const updatedPost = await client
      .patch(post._id)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();

    return new Response(JSON.stringify({ views: updatedPost.views }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("View Tracking Error:", error);
    return new Response(JSON.stringify({ error: "Failed to update views." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
