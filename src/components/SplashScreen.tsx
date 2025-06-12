import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  logoUrl?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, logoUrl }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // הוספת CSS לדף
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
      setTimeout(onComplete, 500); // זמן להשלים את האנימציה
    }, 3000); // הדף המקדים יוצג למשך 3 שניות

    return () => {
      clearTimeout(timer);
      document.head.removeChild(style);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 4s ease infinite'
          }}
        >
          {/* רקע עם אפקט כוכבים */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* קונטיינר הלוגו */}
          <div className="relative z-10 text-center">
            {/* אנימציית הלוגו */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1.5
              }}
              className="mb-8"
            >
              {logoUrl ? (
                <motion.img
                  src={logoUrl}
                  alt="Logo"
                  className="w-32 h-32 mx-auto rounded-full shadow-2xl border-4 border-white/20"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 40px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              ) : (
                <motion.div
                  className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white text-4xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #2563eb)',
                    boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.5)',
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(79, 70, 229, 0.5)",
                      "0 0 40px rgba(79, 70, 229, 0.8)",
                      "0 0 20px rgba(79, 70, 229, 0.5)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  🚀
                </motion.div>
              )}
            </motion.div>

            {/* טקסט מתחת ללוגו */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.h1
                className="text-4xl font-bold text-white mb-4"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 10px rgba(255,255,255,0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                ברוכים הבאים
              </motion.h1>
              
              {/* אנימציית טעינה */}
              <motion.div
                className="flex justify-center space-x-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-white rounded-full"
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>

              <motion.p
                className="text-white/80 text-lg mb-8"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                טוען את החוויה שלכם...
              </motion.p>

              {/* כפתור דילוג */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onComplete, 500);
                }}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                דלג ←
              </motion.button>
            </motion.div>
          </div>


        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen; 