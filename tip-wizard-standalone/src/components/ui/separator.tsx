import React from 'react';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}

export const Separator: React.FC<SeparatorProps> = ({
  className = '',
  orientation = 'horizontal',
  style,
}) => {
  const baseStyles = 'bg-gray-200';
  const orientationStyles = {
    horizontal: 'h-px w-full',
    vertical: 'h-full w-px',
  };
  
  const combinedClassName = `${baseStyles} ${orientationStyles[orientation]} ${className}`;
  
  return <div className={combinedClassName} style={style} />;
};

export default Separator; 