export const runtime = "edge";

import { createClient } from "next-sanity";

// Мы используем специальный токен для записи (создадим его на шаге 5)
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return new Response(
        JSON.stringify({
          error: "Server configuration error. Missing Write Token.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Проверяем, нет ли уже такого email в базе
    const existingSubscriber = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email },
    );

    if (existingSubscriber) {
      return new Response(
        JSON.stringify({ error: "You are already subscribed!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Записываем новый email в Sanity
    await client.create({
      _type: "subscriber",
      email: email,
      subscribedAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Subscription Error:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while subscribing. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
