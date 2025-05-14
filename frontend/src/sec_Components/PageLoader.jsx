import React from 'react';
import { useThemeStore } from '../Store/use.ThemeSelector';

const QuantumLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden" data-theme={theme}>
      {/* Holographic Ring */}
      <div className="relative w-40 h-40 mb-12">
        {/* Main 3D Ring */}
        <div className="absolute inset-0 rounded-full border-8 border-transparent 
          border-t-primary border-r-secondary animate-[spin_1.5s_linear_infinite]"
          style={{
            boxShadow: '0 0 25px rgba(0, 255, 136, 0.3)',
            filter: 'blur(1px)'
          }}
        ></div>

        {/* Secondary Ring (reverse spin) */}
        <div className="absolute inset-2 rounded-full border-6 border-transparent 
          border-b-accent border-l-secondary animate-[spinReverse_2s_linear_infinite]"
        ></div>

        {/* Glowing Center Dot */}
        <div className="absolute inset-8 rounded-full  
          animate-[pulse_2s_ease_infinite] shadow-glow"
        ></div>
      </div>



      {/* Status Text */}
      <p className="text-primary mt-[-30px] font-bold text-sm animate-[fadeInOut_2s_ease_infinite]">
        Loading Data
      </p>
    </div>
  );
};

export default QuantumLoader;