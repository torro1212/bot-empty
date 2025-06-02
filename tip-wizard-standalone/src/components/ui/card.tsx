import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ className = '', children, style }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} style={style}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children, style }) => {
  return (
    <div className={`p-4 border-b ${className}`} style={style}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const CardTitle: React.FC<CardTitleProps> = ({ className = '', children, style }) => {
  return (
    <h3 className={`text-lg font-semibold ${className}`} style={style}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ className = '', children, style }) => {
  return (
    <p className={`text-sm text-gray-500 mt-1 ${className}`} style={style}>
      {children}
    </p>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const CardContent: React.FC<CardContentProps> = ({ className = '', children, style }) => {
  return (
    <div className={`p-4 ${className}`} style={style}>
      {children}
    </div>
  );
};

export default {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
}; 