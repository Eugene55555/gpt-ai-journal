export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-[#FEFEFE] text-[#111] antialiased">{children}</body>
    </html>
  );
}
