export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Имитация шапки (чтобы она не прыгала) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="w-32 h-6 bg-gray-100 rounded-md animate-pulse"></div>
          <div className="w-24 h-8 bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      </header>

      <main className="flex-grow max-w-[1400px] mx-auto px-6 pt-32 pb-20 w-full">
        {/* Скелетон заголовка */}
        <div className="mb-16 border-b border-gray-100 pb-12">
          <div className="h-20 md:h-24 bg-gray-100 rounded-2xl w-3/4 mb-8 animate-pulse"></div>
          <div className="h-6 bg-gray-100 rounded-lg w-1/2 animate-pulse"></div>
        </div>

        {/* Скелетон сетки статей (рисуем 6 пустых карточек) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              {/* Обложка */}
              <div className="aspect-[16/10] bg-gray-100 rounded-2xl mb-6"></div>
              {/* Контент */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-3 bg-gray-100 rounded w-16"></div>
                  <div className="h-3 bg-gray-100 rounded w-16"></div>
                </div>
                <div className="h-8 bg-gray-100 rounded-lg w-4/5"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}