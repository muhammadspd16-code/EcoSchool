import React from 'react';

interface EcoSchoolLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'icon' | 'full' | 'horizontal' | 'badge';
  lightMode?: boolean;
}

export const EcoSchoolLogo: React.FC<EcoSchoolLogoProps> = ({
  className = '',
  size = 48,
  variant = 'icon',
  lightMode = false,
}) => {
  // SVG Graphic of the Shield, Leaves, and Point Coin
  const LogoGraphic = ({ width = 120, height = 120 }: { width?: number; height?: number }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        {/* Shield Gradient */}
        <linearGradient id="shieldBg" x1="50" y1="50" x2="150" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.85" />
        </linearGradient>

        {/* Shield Border Cyan */}
        <linearGradient id="shieldBorder" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Leaf Gradients */}
        <linearGradient id="leafCenter" x1="100" y1="30" x2="100" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>

        <linearGradient id="leafLeft" x1="65" y1="45" x2="95" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>

        <linearGradient id="leafRight" x1="135" y1="45" x2="105" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>

        {/* Coin Gradient */}
        <linearGradient id="coinBg" x1="70" y1="80" x2="130" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#dcfce7" />
          <stop offset="50%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>

        {/* Circular Outer Rim Gradient */}
        <linearGradient id="outerRim" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>

        {/* Recycle Arrow Cyan */}
        <linearGradient id="arrowCyan" x1="90" y1="90" x2="155" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Soft Drop Shadow Filter */}
        <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#047857" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Background Outer Shield / Emblem Base */}
      <path
        d="M100 24 C132 24, 158 36, 158 68 C158 116, 118 152, 100 162 C82 152, 42 116, 42 68 C42 36, 68 24, 100 24 Z"
        fill="url(#shieldBg)"
        stroke="url(#shieldBorder)"
        strokeWidth="6"
        strokeLinejoin="round"
        filter="url(#logoShadow)"
      />

      {/* Plant Leaves Sprouting */}
      {/* Stem */}
      <path
        d="M100 68 L100 100"
        stroke="#15803d"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Left Leaf */}
      <path
        d="M98 78 C70 76, 54 56, 62 42 C78 40, 96 58, 98 78 Z"
        fill="url(#leafLeft)"
        stroke="#15803d"
        strokeWidth="2.5"
      />
      <path d="M72 52 Q88 64 96 74" stroke="#166534" strokeWidth="1.5" fill="none" />

      {/* Right Leaf */}
      <path
        d="M102 78 C130 76, 146 56, 138 42 C122 40, 104 58, 102 78 Z"
        fill="url(#leafRight)"
        stroke="#15803d"
        strokeWidth="2.5"
      />
      <path d="M128 52 Q112 64 104 74" stroke="#166534" strokeWidth="1.5" fill="none" />

      {/* Center Top Leaf */}
      <path
        d="M100 28 C114 42, 116 68, 100 82 C84 68, 86 42, 100 28 Z"
        fill="url(#leafCenter)"
        stroke="#15803d"
        strokeWidth="2.5"
      />
      <path d="M100 36 L100 74" stroke="#14532d" strokeWidth="2" />

      {/* Point Coin Base */}
      <circle
        cx="100"
        cy="118"
        r="32"
        fill="url(#coinBg)"
        stroke="#15803d"
        strokeWidth="4"
      />

      {/* Inner Coin Rim */}
      <circle
        cx="100"
        cy="118"
        r="25"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
        strokeDasharray="4 2"
      />

      {/* Letter 'P' for Points */}
      <text
        x="100"
        y="128"
        fontSize="28"
        fontWeight="800"
        fontFamily="sans-serif"
        fill="#14532d"
        textAnchor="middle"
        dominantBaseline="central"
      >
        P
      </text>

      {/* Little leaf on bottom-left of coin */}
      <path
        d="M84 122 C78 126, 78 132, 85 132 C90 132, 92 126, 84 122 Z"
        fill="#15803d"
      />

      {/* Dynamic Arrow around the coin */}
      <path
        d="M128 130 C138 120, 140 102, 134 90"
        stroke="url(#arrowCyan)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrow head */}
      <polygon
        points="146,92 134,80 130,96"
        fill="#0284c7"
      />
    </svg>
  );

  // 1. Horizontal layout (Icon + Typography side-by-side)
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="relative shrink-0 flex items-center justify-center">
          <LogoGraphic width={Number(size) || 44} height={Number(size) || 44} />
        </div>
        <div className="flex flex-col justify-center leading-tight">
          <span className={`text-lg sm:text-xl font-black font-display tracking-tight ${
            lightMode ? 'text-emerald-950' : 'text-white'
          }`}>
            Eco<span className="text-emerald-400">School</span>
          </span>
          <span className={`text-[10px] font-bold tracking-wider uppercase ${
            lightMode ? 'text-emerald-700' : 'text-emerald-300/90'
          }`}>
            Portal Siswa & Dompet Poin
          </span>
        </div>
      </div>
    );
  }

  // 2. Full Round Emblem (Like the uploaded image with circular border & text inside)
  if (variant === 'full' || variant === 'badge') {
    const dim = Number(size) || 160;
    return (
      <div 
        className={`relative flex flex-col items-center justify-center p-3 rounded-full bg-gradient-to-b from-white via-emerald-50/40 to-teal-50/70 border-4 border-emerald-500/80 shadow-xl ${className}`}
        style={{ width: dim, height: dim }}
      >
        <div className="w-[68%] h-[68%] flex items-center justify-center">
          <LogoGraphic width={dim * 0.7} height={dim * 0.7} />
        </div>
        <div className="text-center mt-[-4px]">
          <div className="text-emerald-950 font-black text-xs sm:text-sm font-display tracking-tight leading-none">
            Eco<span className="text-emerald-600">School</span>
          </div>
          <div className="text-[8px] font-bold text-emerald-800 tracking-tight leading-none mt-0.5 whitespace-nowrap">
            Portal Siswa & Dompet Poin
          </div>
        </div>
      </div>
    );
  }

  // 3. Compact Icon only
  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <LogoGraphic width={Number(size) || 40} height={Number(size) || 40} />
    </div>
  );
};
