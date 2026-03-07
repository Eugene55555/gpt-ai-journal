import "./globals.css";
import { getSiteSettings } from "./config/site";
import { Providers } from "./providers";
import { VisualEditing } from "next-sanity";

export const revalidate = 3600;

export async function generateMetadata() {
  const siteConfig = await getSiteSettings();

  return {
    metadataBase: new URL(siteConfig.baseUrl), // ИСПРАВЛЕНО: Базовый URL для всех мета-тегов
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    openGraph: {
      title: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.baseUrl,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-white text-[#111] dark:bg-[#0a0a0a] dark:text-gray-100 antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <Providers>
          {children}
          <VisualEditing />
        </Providers>
      </body>
    </html>
  );
}
