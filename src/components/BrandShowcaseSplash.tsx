import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from './BrandLogo';

interface BrandShowcaseSplashProps {
  onComplete: () => void;
}

const BrandShowcaseSplash: React.FC<BrandShowcaseSplashProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // רשימת המותגים עם הלוגואים
  const brands = [
    { name: 'ZARA', logo: '/logos/ZaraL.png', color: '#000000' }, // מיקום 1 - למעלה באמצע
    { name: 'lefties', logo: '/logos/LFL.png', color: '#ff6b6b' },
    { name: 'Massimo Dutti', logo: '/logos/MDL.png', color: '#2c3e50' },
    { name: 'PULL&BEAR', logo: '/logos/PBL.png', color: '#34495e' },
    { name: 'OYSHO', logo: '/logos/OYL.png', color: '#e74c3c' },
    { name: 'STRADIVARIUS', logo: '/logos/STRL.png', color: '#8e44ad' },
    { name: 'BERSHKA', logo: '/logos/BSKL.png', color: '#000000' }, // מיקום 7 - משמאל
    { name: 'ZARA HOME', logo: '/logos/ZHL.png', color: '#34495e' },
  ];

  useEffect(() => {
    // הדפסת מידע על הלוגואים למסוף
    console.log('🚀 Brand Showcase - Loading brands:', brands.map(b => `${b.name}: ${b.logo}`));
    
    // הוספת CSS לאנימציות
    const style = document.createElement('style');
    style.textContent = `
      @keyframes brandFloat {
        0% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
        50% { transform: translateY(-20px) rotate(5deg); opacity: 1; }
        100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
      }
      
      @keyframes centerBrandPulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
      }
      
      @keyframes gradientRotate {
        0% { background: linear-gradient(45deg, #667eea, #764ba2); }
        25% { background: linear-gradient(45deg, #f093fb, #f5576c); }
        50% { background: linear-gradient(45deg, #4facfe, #00f2fe); }
        75% { background: linear-gradient(45deg, #43e97b, #38f9d7); }
        100% { background: linear-gradient(45deg, #667eea, #764ba2); }
      }
    `;
    document.head.appendChild(style);

    // טיימר להחלפת מותגים במרכז
    const brandTimer = setInterval(() => {
      setCurrentBrandIndex((prev) => (prev + 1) % brands.length);
    }, 1500);

    // טיימר לסיום הדף המקדים
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearInterval(brandTimer);
      document.head.removeChild(style);
    };
  }, [onComplete, brands.length]);

  const getRandomPosition = (index: number) => {
    const angle = (index * 45) + Math.random() * 30;
    const radius = 200 + Math.random() * 100;
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    return { x, y };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            animation: 'gradientRotate 6s ease infinite'
          }}
        >
          {/* חלקיקים זוהרים ברקע */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* 8 לוגואים במעגל מושלם מסביב לכותרת */}
          <div className="absolute inset-0">
            {brands.map((brand, index) => {
              const baseAngle = (index * 360) / brands.length - 90; // התחלה מלמעלה
              const radius = 280; // מרחק מושלם
              
              // מספור הלוגואים (לא נראה בדף):
              // 1 = ZARA (למעלה באמצע)
              // 2 = lefties (מימין למעלה)  
              // 3 = Massimo Dutti (מימין)
              // 4 = PULL&BEAR (מימין למטה)
              // 5 = OYSHO (למטה באמצע)
              // 6 = STRADIVARIUS (משמאל למטה)
              // 7 = BERSHKA (משמאל)
              // 8 = ZARA HOME (משמאל למעלה)
              
              return (
                <motion.div
                  key={`brand-${brand.name}`}
                  className="absolute w-24 h-24 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center p-2 border-2 border-white/60 shadow-2xl"
                  style={{
                    left: '48%',
                    top: '43%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 1, scale: 1, rotate: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: Math.cos(baseAngle * Math.PI / 180) * radius,
                    y: Math.sin(baseAngle * Math.PI / 180) * radius
                  }}
                  transition={{ 
                    duration: 1.33,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.1, opacity: 1, y: -5 }}
                >
                  <BrandLogo
                    brand={brand}
                    className="w-full h-full"
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      filter: 'brightness(1.3) contrast(1.2) saturate(1.1)'
                    }}
                    fallbackStyle={{ 
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* השמש - טקסט ראשי במרכז המוחלט */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              initial={{ y: 0, opacity: 1, scale: 1 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
              className="relative text-center"
            >
              {/* זוהר השמש */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)',
                  width: '300px',
                  height: '300px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.h1
                className="text-6xl font-bold text-white mb-4 relative z-10"
                style={{
                  background: 'linear-gradient(45deg, #ffffff, #fff8dc, #ffffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(255,255,255,0.8)'
                }}
                animate={{
                  scale: [1, 1.03, 1],
                  filter: [
                    "drop-shadow(0 0 30px rgba(255,255,255,0.6))",
                    "drop-shadow(0 0 60px rgba(255,255,255,1))",
                    "drop-shadow(0 0 30px rgba(255,255,255,0.6))",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                FASHION
              </motion.h1>

              <motion.div
                className="w-24 h-1 bg-white/70 mx-auto rounded-full mb-4"
                animate={{ 
                  width: ["96px", "120px", "96px"],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.h2
                className="text-3xl font-bold text-white mb-3"
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                אופנה ללא גבולות
              </motion.h2>
              
              <motion.p
                className="text-lg text-white/90 mb-6 font-light"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                המותגים המובילים בעולם במקום אחד
              </motion.p>

              {/* אינדיקטור עיצובי */}
              <motion.div
                className="flex justify-center space-x-1 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                {brands.map((_, index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 rounded-full bg-white/40"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </motion.div>


            </motion.div>
          </div>

          {/* מונה לאחור */}
          <motion.div
            className="absolute top-4 right-4 text-white/70 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            לחץ כדי לדלג
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandShowcaseSplash; 