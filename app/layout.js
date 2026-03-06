import "./globals.css";
import { getSiteSettings } from "./config/site";

// ИСПРАВЛЕНО: Кэш на 1 час (3600 секунд)
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
    // ИСПРАВЛЕНО: lang="en" для американского рынка
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-[#111] antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
