export const runtime = "edge";

import { createClient } from "next-sanity";
import { getSiteSettings } from "../config/site";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
});

export async function GET() {
  const siteConfig = await getSiteSettings();
  const baseUrl = siteConfig.baseUrl;

  const posts = await client.fetch(
    `*[_type == "post"] | order(publishedAt desc) [0...20]{
      title,
      "slug": slug.current,
      description,
      publishedAt
    }`,
  );

  let rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${siteConfig.name}</title>
<link>${baseUrl}</link>
<description>${siteConfig.description}</description>
<atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
`;

  posts.forEach((post) => {
    const postUrl = `${baseUrl}/post/${post.slug}`;
    rssFeed += `
<item>
  <title>${post.title}</title>
  <link>${postUrl}</link>
  <guid>${postUrl}</guid>
  <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
  <description><![CDATA[${post.description}]]></description>
</item>
`;
  });

  rssFeed += `</channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
