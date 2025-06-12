import { useRef, useEffect, useState, useCallback } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Play } from 'lucide-react';

// בדיקה גלובלית אם autoplay מאופשר
let globalAutoplayAllowed: boolean | null = null;

const testAutoplaySupport = async (): Promise<boolean> => {
  if (globalAutoplayAllowed !== null) {
    return globalAutoplayAllowed;
  }

  try {
    const video = document.createElement('video');
    video.muted = true;
    video.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA...';
    await video.play();
    video.remove();
    globalAutoplayAllowed = true;
    console.log('✅ Autoplay נתמך בדפדפן זה');
    return true;
  } catch {
    globalAutoplayAllowed = false;
    console.log('❌ Autoplay לא נתמך בדפדפן זה');
    return false;
  }
};

interface AutoPlayVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}

export const AutoPlayVideo = ({
  src,
  className = '',
  style,
  controls = true,
  muted = true,
  loop = false,
  onPlay,
  onPause,
}: AutoPlayVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.01, // סף נמוך מאוד
    rootMargin: '300px', // מרחק גדול מאוד
    triggerOnce: false
  });

  // פונקציה אגרסיבית לניגון
  const forcePlay = useCallback(async (reason = '') => {
    const video = videoRef.current;
    if (!video) return false;

    try {
      // הגדרות אגרסיביות לautoplay
      video.muted = true;
      video.volume = 0;
      video.defaultMuted = true;
      
      console.log(`🚀 מנסה לנגן וידאו ${reason}:`, src);
      
      await video.play();
      console.log('✅ וידאו מתנגן!', src);
      setIsPlaying(true);
      setShowPlayButton(false);
      onPlay?.();
      return true;
    } catch (error: any) {
      console.log('❌ נכשל לנגן:', error.message);
      setShowPlayButton(true);
      return false;
    }
  }, [src, onPlay]);

  // מיד כשהרכיב נטען - נסה לנגן
  useEffect(() => {
    setIsMounted(true);
    
    // נסה לנגן מיד כשהרכיב נטען
    const immediatePlayAttempt = async () => {
      if (!hasAttemptedPlay) {
        setHasAttemptedPlay(true);
        console.log('🎯 נסיון ניגון מיידי כשהרכיב נטען');
        await forcePlay('מיד כשנטען');
      }
    };

    const timer = setTimeout(immediatePlayAttempt, 100);
    return () => clearTimeout(timer);
  }, [forcePlay, hasAttemptedPlay]);

  // טיפול באירועי וידאו
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      console.log('🔄 וידאו מתחיל לטעון:', src);
    };

    const handleLoadedMetadata = async () => {
      console.log('📹 מטא-דאטה נטענה:', src);
      if (isMounted && !isPlaying) {
        await forcePlay('metadata נטענה');
      }
    };

    const handleCanPlay = async () => {
      console.log('🎥 וידאו מוכן לניגון:', src);
      if (isMounted && !isPlaying) {
        await forcePlay('canplay אירוע');
      }
    };

    const handleCanPlayThrough = async () => {
      console.log('🎬 וידאו מוכן לניגון מלא:', src);
      if (isMounted && !isPlaying) {
        await forcePlay('canplaythrough אירוע');
      }
    };

    const handlePlay = () => {
      console.log('✨ וידאו מתנגן:', src);
      setIsPlaying(true);
      setShowPlayButton(false);
      onPlay?.();
    };

    const handlePause = () => {
      console.log('⏸️ וידאו מושהה:', src);
      setIsPlaying(false);
      onPause?.();
    };

    const handleError = () => {
      console.error('❌ שגיאה בוידאו:', src);
      setShowPlayButton(true);
    };

    // הוסף event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // אם הוידאו כבר מוכן, נסה לנגן מיד
    if (video.readyState >= 1 && isMounted && !isPlaying) {
      console.log('🎯 וידאו כבר מוכן - מנגן מיד');
      forcePlay('וידאו כבר מוכן');
    }

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [src, isMounted, isPlaying, forcePlay, onPlay, onPause]);

  // מעקב אחרי intersection - רק להשהיה כשיוצא מהמסך
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isIntersecting && !isPlaying && isMounted) {
      console.log('🔍 וידאו נכנס לתצוגה - מנסה לנגן:', src);
      forcePlay('נכנס לתצוגה');
    } else if (!isIntersecting && isPlaying) {
      console.log('🔍 וידאו יצא מהתצוגה - מושהה:', src);
      video.pause();
    }
  }, [isIntersecting, isPlaying, isMounted, forcePlay, src]);

  // איפוס כשהוידאו משתנה
  useEffect(() => {
    console.log('🔄 וידאו חדש נטען:', src);
    setHasAttemptedPlay(false);
    setIsPlaying(false);
    setShowPlayButton(false);
  }, [src]);

  const handleManualPlay = async () => {
    console.log('👆 לחיצה ידנית:', src);
    const success = await forcePlay('לחיצה ידנית');
    if (success) {
      setHasAttemptedPlay(true);
    }
  };

  return (
    <div 
      ref={targetRef as React.RefObject<HTMLDivElement>}
      className={`video-container relative ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        controls={controls}
        muted={true}
        loop={loop}
        style={style}
        className="w-full h-auto"
        preload="auto"
        playsInline
        autoPlay={true}
        webkit-playsinline="true"
        onLoadStart={() => console.log('🔄 וידאו מתחיל לטעון (HTML):', src)}
      />
      {showPlayButton && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 cursor-pointer z-10"
          onClick={handleManualPlay}
        >
          <div className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all animate-pulse">
            <Play className="h-8 w-8 text-blue-600" fill="currentColor" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white text-sm text-center bg-black bg-opacity-40 rounded p-2">
            לחץ כדי לנגן וידאו 🎬
          </div>
        </div>
      )}
    </div>
  );
}; 