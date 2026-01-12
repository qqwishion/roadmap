interface VideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
}

export function VideoPlayer({ url, title, className = "" }: VideoPlayerProps) {
  // Определяем тип платформы и конвертируем URL в embed формат
  const getEmbedUrl = (url: string): string | null => {
    try {
      // YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('youtu.be') 
          ? url.split('youtu.be/')[1]?.split('?')[0]
          : new URL(url).searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      
      // VK Video
      if (url.includes('vk.com/video')) {
        const match = url.match(/video(-?\d+_\d+)/);
        if (match) {
          return `https://vk.com/video_ext.php?oid=${match[1].split('_')[0]}&id=${match[1].split('_')[1]}&hash=`;
        }
      }
      
      // Rutube
      if (url.includes('rutube.ru')) {
        const videoId = url.split('/video/')[1]?.split('/')[0];
        return videoId ? `https://rutube.ru/play/embed/${videoId}` : null;
      }
      
      // Vimeo
      if (url.includes('vimeo.com')) {
        const videoId = url.split('vimeo.com/')[1]?.split('/')[0];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
      }
      
      // Если уже embed URL
      if (url.includes('embed') || url.includes('player')) {
        return url;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return null;
    }
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className={`rounded-lg border-2 border-[#6D6E71] bg-[#031429]/50 p-8 text-center ${className}`}>
        <p className="text-[#92A8B4]">Некорректный URL видео</p>
        <p className="text-xs text-[#6D6E71] mt-2">
          Поддерживаются: YouTube, VK Video, Rutube, Vimeo
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`} style={{ paddingBottom: '56.25%' }}>
      <div className="absolute top-0 left-0 w-full h-full rounded-lg border-2 border-[#598EBC] shadow-[0_0_20px_rgba(89,142,188,0.4)] overflow-hidden">
        <iframe
          src={embedUrl}
          title={title || "Video Player"}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
