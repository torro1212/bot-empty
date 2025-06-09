import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <a 
      href="#main-content" 
      className="skip-link"
      aria-label="דלג לתוכן הראשי"
    >
      דלג לתוכן הראשי
    </a>
  );
};

export default SkipLink; 