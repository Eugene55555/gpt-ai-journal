export default function LoadingPost() {
  return (
    <div className="bg-white min-h-screen">
      {/* Имитация мини-шапки */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="w-32 h-6 bg-gray-100 rounded-md animate-pulse"></div>
          <div className="w-24 h-4 bg-gray-100 rounded-md animate-pulse"></div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 pt-40 pb-32">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Левая часть: Скелетон статьи */}
          <div className="flex-grow lg:max-w-[800px] w-full animate-pulse">
            <header className="mb-16">
              <div className="h-6 bg-gray-100 rounded-full w-24 mb-8"></div>
              <div className="h-16 md:h-20 bg-gray-100 rounded-2xl w-full mb-6"></div>
              <div className="h-16 md:h-20 bg-gray-100 rounded-2xl w-3/4 mb-10"></div>
              
              <div className="h-6 bg-gray-100 rounded-lg w-full mb-4"></div>
              <div className="h-6 bg-gray-100 rounded-lg w-5/6 mb-12"></div>
              
              {/* Скелетон блока автора */}
              <div className="flex items-center gap-5 py-8 border-y border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-100 shrink-0"></div>
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-gray-100 rounded w-40"></div>
                  <div className="h-3 bg-gray-100 rounded w-32"></div>
                </div>
              </div>
            </header>

            {/* Скелетон главной картинки */}
            <div className="mb-20 aspect-video rounded-3xl bg-gray-100"></div>

            {/* Скелетон абзацев текста */}
            <div className="space-y-6">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-11/12"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-4/5"></div>
            </div>
          </div>

          {/* Правая часть: Скелетон сайдбара */}
          <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32 border-l border-gray-50 pl-10 animate-pulse">
            <div className="space-y-6 mb-12">
              <div className="h-4 bg-gray-100 rounded w-24 mb-8"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded w-4/5"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
            </div>
            {/* Скелетон виджета */}
            <div className="h-48 rounded-3xl bg-gray-100"></div>
          </aside>
          
        </div>
      </main>
    </div>
  );
}