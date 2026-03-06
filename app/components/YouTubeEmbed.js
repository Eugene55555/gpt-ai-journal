export default function YouTubeEmbed({ url }) {
  if (!url) return null;

  // Умная регулярка, которая понимает любые форматы ссылок (youtu.be, youtube.com/watch?v= и т.д.)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;

  if (!videoId) {
    return (
      <div className="p-4 bg-red-50 text-red-400 rounded-xl text-sm border border-red-100 my-8">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div className="my-12 relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 bg-gray-900 group">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full border-0 transition-opacity duration-300"
        title="YouTube video player"
      />
    </div>
  );
}
