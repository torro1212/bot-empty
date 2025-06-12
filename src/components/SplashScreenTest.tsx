import React from 'react';

const SplashScreenTest: React.FC = () => {
  const logos = [
    { name: 'BERSHKA', logo: '/logos/BSKL.png' },
    { name: 'lefties', logo: '/logos/LFL.png' },
    { name: 'Massimo Dutti', logo: '/logos/MDL.png' },
    { name: 'PULL&BEAR', logo: '/logos/PBL.png' },
    { name: 'OYSHO', logo: '/logos/OYL.png' },
    { name: 'STRADIVARIUS', logo: '/logos/STRL.png' },
    { name: 'ZARA', logo: '/logos/ZaraL.png' },
    { name: 'ZARA HOME', logo: '/logos/ZHL.png' },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">בדיקת טעינת לוגואים</h1>
      
      <div className="grid grid-cols-4 gap-6">
        {logos.map((brand, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-lg text-center">
            <div className="h-24 w-24 mx-auto mb-4 border border-gray-200 rounded-lg flex items-center justify-center">
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-full max-w-full object-contain"
                onLoad={() => console.log(`✅ ${brand.name} loaded successfully`)}
                onError={(e) => {
                  console.error(`❌ Failed to load: ${brand.name} from ${brand.logo}`);
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMSAyMUw0MyA0M00yMSA0M0w0MyAyMSIgc3Ryb2tlPSIjOUI5QkExIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
                }}
              />
            </div>
            <h3 className="font-semibold text-sm">{brand.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{brand.logo}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>הוראות:</strong><br/>
          1. פתח את Developer Tools (F12)<br/>
          2. עבור לכרטיסיית Console<br/>
          3. בדוק אילו לוגואים נטענו בהצלחה (✅) ואילו נכשלו (❌)<br/>
          4. אם יש שגיאות, בדוק את נתיבי הקבצים
        </p>
      </div>
    </div>
  );
};

export default SplashScreenTest; 