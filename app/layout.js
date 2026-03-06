import "./globals.css";
import { getSiteSettings } from "./config/site";
import { Providers } from "./providers";
import { VisualEditing } from "next-sanity"; // ДОБАВЛЕНО: Инструмент связи с админкой

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-white text-[#111] dark:bg-[#0a0a0a] dark:text-gray-100 antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <Providers>
          {children}
          {/* Невидимый компонент, который отвечает на запросы из админки Sanity */}
          <VisualEditing />
        </Providers>
      </body>
    </html>
  );
}
