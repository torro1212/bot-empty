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
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [canAutoPlay, setCanAutoPlay] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);
  
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: false
  });

  // בדיקת תמיכה ב-autoplay בעת טעינה
  useEffect(() => {
    testAutoplaySupport().then((supported) => {
      if (!supported) {
        setCanAutoPlay(false);
        setShowPlayButton(true);
      }
    });
  }, []);

  // בדיקה אם המשתמש אי פעם לחץ על המסמך
  useEffect(() => {
    const handleUserInteraction = () => {
      console.log('👤 משתמש אינטראקט עם הדף - מאפשר autoplay');
      setHasUserInteracted(true);
      setCanAutoPlay(true);
      globalAutoplayAllowed = true;
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const attemptAutoPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || hasAttemptedPlay || !canAutoPlay) return;

    setHasAttemptedPlay(true);
    console.log('🎬 מנסה לנגן וידאו באופן אוטומטי:', src);

    try {
      // רק אם הוידאו לא מתנגן כבר
      if (video.paused) {
        await video.play();
        console.log('✅ וידאו התחיל להתנגן אוטומטית:', src);
        setIsPlaying(true);
        setShowPlayButton(false);
        onPlay?.();
      }
    } catch (error: any) {
      console.log('❌ נכשל לנגן וידאו אוטומטית:', src, error.message);
      
      // אם זה NotAllowedError (autoplay policy), נציג כפתור play
      if (error.name === 'NotAllowedError') {
        console.log('🚫 Autoplay חסום על ידי הדפדפן עבור:', src);
        setCanAutoPlay(false);
        setShowPlayButton(true);
        globalAutoplayAllowed = false;
      } else if (retryCount < 3) {
        // נסה שוב אחרי זמן קצר (לא עבור NotAllowedError)
        console.log(`🔄 מנסה שוב (נסיון ${retryCount + 1}/3)...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setHasAttemptedPlay(false);
        }, 1000 + (retryCount * 500));
      } else {
        console.log('💔 נכשל לנגן אחרי 3 נסיונות - מציג כפתור ידני');
        setShowPlayButton(true);
      }
    }
  }, [src, hasAttemptedPlay, retryCount, canAutoPlay, onPlay]);

  // מאזיני אירועים לוידאו
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      console.log('🎬 וידאו התחיל להתנגן:', src);
      setIsPlaying(true);
      setShowPlayButton(false);
      onPlay?.();
    };

    const handlePause = () => {
      console.log('⏸️ וידאו הושהה:', src);
      setIsPlaying(false);
      onPause?.();
    };

    const handleLoadedData = () => {
      console.log('📹 וידאו נטען ומוכן לניגון:', src);
      // רק אם בview ועדיין לא ניסינו לנגן
      if (isIntersecting && !hasAttemptedPlay && canAutoPlay) {
        setTimeout(attemptAutoPlay, 200);
      }
    };

    const handleCanPlay = () => {
      console.log('🎥 וידאו יכול להתנגן:', src);
      if (isIntersecting && !hasAttemptedPlay && canAutoPlay) {
        setTimeout(attemptAutoPlay, 100);
      }
    };

    const handleError = (e: Event) => {
      console.error('❌ שגיאה בטעינת וידאו:', src, e);
      setShowPlayButton(true);
    };

    const handleWaiting = () => {
      console.log('⏳ וידאו מחכה לטעינה:', src);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
    };
  }, [isIntersecting, hasAttemptedPlay, attemptAutoPlay, src, canAutoPlay, onPlay, onPause]);

  // מעקב אחרי intersection
  useEffect(() => {
    if (isIntersecting && !hasAttemptedPlay && videoRef.current && canAutoPlay) {
      console.log('🔍 וידאו נכנס לתצוגה:', src, 'ReadyState:', videoRef.current.readyState);
      // נסה לנגן אם הוידאו מוכן
      if (videoRef.current.readyState >= 2) {
        attemptAutoPlay();
      }
    } else if (!isIntersecting && isPlaying && videoRef.current) {
      console.log('🔍 וידאו יצא מהתצוגה - מושהה:', src);
      videoRef.current.pause();
    }
  }, [isIntersecting, hasAttemptedPlay, isPlaying, attemptAutoPlay, src, canAutoPlay]);

  // איפוס כשהוידאו משתנה
  useEffect(() => {
    console.log('🔄 איפוס וידאו חדש:', src);
    setHasAttemptedPlay(false);
    setRetryCount(0);
    setIsPlaying(false);
    if (!hasUserInteracted && globalAutoplayAllowed === false) {
      setShowPlayButton(true);
    } else {
      setShowPlayButton(false);
    }
  }, [src, hasUserInteracted]);

  const handleManualPlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    console.log('👆 לחיצה ידנית לניגון וידאו:', src);
    
    try {
      await video.play();
      setHasUserInteracted(true);
      setCanAutoPlay(true);
      setShowPlayButton(false);
      setHasAttemptedPlay(true);
      globalAutoplayAllowed = true;
      console.log('✅ וידאו התחיל להתנגן באופן ידני:', src);
    } catch (error) {
      console.error('❌ נכשל לנגן וידאו ידנית:', error);
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
        muted={muted}
        loop={loop}
        style={style}
        className="w-full h-auto"
        preload="metadata"
        playsInline
        autoPlay={false}
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