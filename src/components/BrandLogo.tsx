import { useState } from 'react';

interface BrandLogoProps {
  brand: {
    name: string;
    logo: string;
    color: string;
  };
  className?: string;
  style?: React.CSSProperties;
  fallbackStyle?: React.CSSProperties;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  brand, 
  className = "", 
  style = {},
  fallbackStyle = {}
}) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div 
        className={`flex items-center justify-center font-bold ${className}`}
        style={{
          ...style,
          ...fallbackStyle,
          backgroundColor: '#FFFFFF',
          color: brand.color || '#333',
          textAlign: 'center',
          fontSize: '1.4rem',
          fontWeight: '900',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
        }}
      >
        {brand.name}
      </div>
    );
  }

  return (
    <div className={`bg-white flex items-center justify-center ${className}`} style={{
      borderRadius: '6px',
      padding: '2px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      ...style
    }}>
      <img
        src={brand.logo}
        alt={brand.name}
        className="object-contain max-w-full max-h-full"
        style={{
          width: '95%',
          height: '95%',
        }}
        onError={(e) => {
          console.error(`❌ Failed to load logo: ${brand.name} from ${brand.logo}`);
          setImageError(true);
        }}
        onLoad={() => console.log(`✅ Logo loaded: ${brand.name} from ${brand.logo}`)}
      />
    </div>
  );
};

export default BrandLogo;