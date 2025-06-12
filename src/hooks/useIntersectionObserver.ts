import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = false
}: UseIntersectionObserverProps = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) {
      console.log('IntersectionObserver: אין target element');
      return;
    }

    // Skip if already triggered and triggerOnce is true
    if (triggerOnce && hasTriggered) {
      console.log('IntersectionObserver: כבר הופעל פעם אחת');
      return;
    }

    // בדיקה אם IntersectionObserver נתמך
    if (!window.IntersectionObserver) {
      console.log('IntersectionObserver לא נתמך בדפדפן זה');
      setIsIntersecting(true); // fallback - תמיד נראה
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        console.log('IntersectionObserver: שינוי נראות:', isVisible, 'Ratio:', entry.intersectionRatio);
        
        setIsIntersecting(isVisible);
        
        if (isVisible && triggerOnce) {
          setHasTriggered(true);
          console.log('IntersectionObserver: מסומן כהופעל');
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(target);
    console.log('IntersectionObserver: התחיל לצפות באלמנט');

    return () => {
      observer.unobserve(target);
      console.log('IntersectionObserver: הפסיק לצפות באלמנט');
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { targetRef, isIntersecting };
}; 