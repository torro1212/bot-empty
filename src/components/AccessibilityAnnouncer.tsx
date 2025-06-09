import React, { useEffect, useState } from 'react';

interface AccessibilityAnnouncerProps {
  message?: string;
  priority?: 'polite' | 'assertive';
}

const AccessibilityAnnouncer: React.FC<AccessibilityAnnouncerProps> = ({ 
  message = '', 
  priority = 'polite' 
}) => {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    if (message && message.trim()) {
      setAnnouncements(prev => [...prev, message]);
      
      // Clear the message after a short delay to avoid accumulation
      const timer = setTimeout(() => {
        setAnnouncements(prev => prev.slice(1));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {/* Screen reader announcements */}
      <div 
        aria-live={priority}
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>
      
      {/* Polite announcements region */}
      <div 
        aria-live="polite" 
        aria-atomic="false"
        className="sr-only"
        id="polite-announcements"
      />
      
      {/* Assertive announcements region */}
      <div 
        aria-live="assertive" 
        aria-atomic="true"
        className="sr-only"
        id="assertive-announcements"
      />
    </>
  );
};

export default AccessibilityAnnouncer; 