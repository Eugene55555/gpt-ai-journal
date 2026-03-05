import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 animate-fadeIn">
      <div className="text-center max-w-[500px]">
        <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 block">
          Ошибка 404
        </span>
        <h1 className="text-[64px] font-medium tracking-tightest leading-[0.9] mb-8">
          Страница <br /> не найдена.
        </h1>
        <p className="text-[18px] text-gray-500 font-light leading-relaxed mb-12">
          Возможно, статья была удалена, перенесена, или вы опечатались в адресе. 
          Давайте вернемся на главную и попробуем найти нужный материал.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-full text-[14px] font-medium hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-200"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}