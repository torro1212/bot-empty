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
          backgroundColor: brand.color || '#333',
          color: 'white',
          textAlign: 'center',
          fontSize: '0.8rem'
        }}
      >
        {brand.name}
      </div>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={brand.name}
      className={`object-contain ${className}`}
      style={style}
      onError={(e) => {
        console.error(`❌ Failed to load logo: ${brand.name} from ${brand.logo}`);
        setImageError(true);
      }}
      onLoad={() => console.log(`✅ Logo loaded: ${brand.name} from ${brand.logo}`)}
    />
  );
};

export default BrandLogo;