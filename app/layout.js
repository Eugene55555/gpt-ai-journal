import "./globals.css";
import { getSiteSettings } from "./config/site";

// ДОБАВЛЕНО: Жесткий сброс кэша для всей оболочки сайта
export const revalidate = 0;

export async function generateMetadata() {
  const siteConfig = await getSiteSettings();
  
  return {
    title: siteConfig.name,
    description: siteConfig.description,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className="bg-white text-[#111] antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}