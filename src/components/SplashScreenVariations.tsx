import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandShowcaseSplash from './BrandShowcaseSplash';

interface SplashScreenVariationsProps {
  onComplete: () => void;
  logoUrl?: string;
  variant?: 'gradient' | 'particles' | 'minimalist' | 'rotating' | 'brands';
}

// וריאציה 1: רקע גרדיאנט עם אנימציות
const GradientVariation: React.FC<{ onComplete: () => void; logoUrl?: string; isVisible: boolean; setIsVisible: (value: boolean) => void }> = ({ onComplete, logoUrl, isVisible, setIsVisible }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{
      background: 'linear-gradient(45deg, #667eea, #764ba2, #667eea, #764ba2)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 4s ease infinite'
    }}
  >
    <div className="text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-8"
      >
        {logoUrl ? (
          <motion.img
            src={logoUrl}
            alt="Logo"
            className="w-40 h-40 mx-auto rounded-full shadow-2xl"
            animate={{ boxShadow: ["0 0 20px rgba(255,255,255,0.5)", "0 0 40px rgba(255,255,255,0.8)", "0 0 20px rgba(255,255,255,0.5)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ) : (
          <div className="w-40 h-40 mx-auto rounded-full bg-white flex items-center justify-center text-6xl shadow-2xl">
            🌟
          </div>
        )}
      </motion.div>
      
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-5xl font-bold text-white mb-6"
      >
        ברוכים הבאים
      </motion.h1>
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }}
        className="mt-8 px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
      >
        כנס לאתר ←
      </motion.button>
    </div>
  </motion.div>
);

// וריאציה 2: חלקיקים מרחפים
const ParticlesVariation: React.FC<{ onComplete: () => void; logoUrl?: string; isVisible: boolean; setIsVisible: (value: boolean) => void }> = ({ onComplete, logoUrl, isVisible, setIsVisible }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
  >
    {/* חלקיקים מרחפים */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>

    <div className="relative z-10 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="mb-8"
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="w-32 h-32 mx-auto rounded-full shadow-xl" />
        ) : (
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center text-4xl text-white shadow-xl">
            ⚡
          </div>
        )}
      </motion.div>
      
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="text-4xl font-bold text-white mb-8"
      >
        הכנו משהו מיוחד בשבילכם
      </motion.h1>
      
      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }}
        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        בואו נתחיל! →
      </motion.button>
    </div>
  </motion.div>
);

// וריאציה 3: מינימליסטי
const MinimalistVariation: React.FC<{ onComplete: () => void; logoUrl?: string; isVisible: boolean; setIsVisible: (value: boolean) => void }> = ({ onComplete, logoUrl, isVisible, setIsVisible }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-white"
  >
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mb-12"
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="w-24 h-24 mx-auto" />
        ) : (
          <div className="w-24 h-24 mx-auto bg-black rounded-full flex items-center justify-center text-white text-2xl">
            ●
          </div>
        )}
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-3xl font-light text-gray-800 mb-8"
      >
        ברוכים הבאים
      </motion.h1>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ delay: 1, duration: 1.5 }}
        className="h-0.5 bg-gray-800 mx-auto mb-8"
      />
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }}
        className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300 border-b border-gray-300 hover:border-gray-800 pb-1"
      >
        המשך
      </motion.button>
    </div>
  </motion.div>
);

// וריאציה 4: עיגולים מסתובבים
const RotatingVariation: React.FC<{ onComplete: () => void; logoUrl?: string; isVisible: boolean; setIsVisible: (value: boolean) => void }> = ({ onComplete, logoUrl, isVisible, setIsVisible }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500"
  >
    {/* עיגולים מסתובבים ברקע */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border-2 border-white/20"
        style={{
          width: `${(i + 1) * 100}px`,
          height: `${(i + 1) * 100}px`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 10 - i,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ))}

    <div className="relative z-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 1.5, times: [0, 0.7, 1] }}
        className="mb-8"
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="w-36 h-36 mx-auto rounded-full shadow-2xl border-4 border-white" />
        ) : (
          <div className="w-36 h-36 mx-auto rounded-full bg-white flex items-center justify-center text-5xl shadow-2xl">
            🎯
          </div>
        )}
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, rotateX: 90 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-4xl font-bold text-white mb-6"
      >
        חוויה חדשה מחכה לכם
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex justify-center space-x-2 mb-8"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-white rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>
      
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }}
        className="px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        בואו נתחיל! 🚀
      </motion.button>
    </div>
  </motion.div>
);

const SplashScreenVariations: React.FC<SplashScreenVariationsProps> = ({ 
  onComplete, 
  logoUrl, 
  variant = 'gradient' 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // הוספת CSS עבור האנימציות
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 4000);

    return () => {
      clearTimeout(timer);
      document.head.removeChild(style);
    };
  }, [onComplete]);

  const variants = {
    gradient: GradientVariation,
    particles: ParticlesVariation,
    minimalist: MinimalistVariation,
    rotating: RotatingVariation,
    brands: () => <BrandShowcaseSplash onComplete={onComplete} />,
  };

  const SelectedVariation = variants[variant];

  return (
    <AnimatePresence>
      {isVisible && (
        <SelectedVariation 
          onComplete={onComplete}
          logoUrl={logoUrl}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      )}
    </AnimatePresence>
  );
};

export default SplashScreenVariations; 