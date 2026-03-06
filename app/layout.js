import "./globals.css";
import { getSiteSettings } from "./config/site";
import { Providers } from "./providers"; // ДОБАВЛЕНО: Импорт провайдера

export const revalidate = 3600;

export async function generateMetadata() {
  const siteConfig = await getSiteSettings();
  return {
    title: siteConfig.name,
    description: siteConfig.description,
  };
}

export default function RootLayout({ children }) {
  return (
    // ИСПРАВЛЕНО: suppressHydrationWarning обязателен для next-themes
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      {/* ИСПРАВЛЕНО: Стили выделения текста для темной темы */}
      <body className="bg-white text-[#111] dark:bg-[#0a0a0a] dark:text-gray-100 antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
