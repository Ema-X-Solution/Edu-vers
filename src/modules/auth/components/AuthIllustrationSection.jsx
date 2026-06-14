import React from 'react';
import { GraduationCap } from 'lucide-react';
import { APP_NAME } from '@/shared/constants';

/**
 * AuthIllustrationSection — the left half of the floating auth card.
 * Colored in soft lavender-blue (#EFF2FC) matching the Figma screenshot exactly,
 * with a high-fidelity SVG illustration of floating graduation caps.
 */
const AuthIllustrationSection = ({ image, title, description }) => (
  <div
    className="hidden lg:flex lg:w-[42%] flex-col justify-between"
    style={{
      background: '#EFF2FC',
      padding: '48px',
      borderRight: '1px solid rgba(226, 232, 240, 0.4)'
    }}
  >
    {/* Brand logo matching screenshot */}
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(25,60,230,0.06)] border border-[#E2E8F0]/80">
        <GraduationCap className="text-[#0D9488]" size={18} />
      </div>
      <span className="text-xl font-extrabold text-[#0F172A] tracking-tight">{APP_NAME}</span>
    </div>

    {/* Illustration & Text */}
    <div className="flex flex-col items-center text-center gap-8 flex-1 justify-center">
      {image ? (
        <div
          className="w-full max-w-[280px] overflow-hidden"
          style={{
            borderRadius: '24px',
            border: '4px solid #ffffff',
            boxShadow: '0px 20px 40px -10px rgba(0, 0, 0, 0.08)',
          }}
        >
          <img
            src={image}
            alt="Auth illustration"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        /* High-fidelity SVG recreation of the Figma floating graduation caps illustration */
        <div className="w-full max-w-[280px] aspect-square relative flex items-center justify-center">
          <svg viewBox="0 0 280 280" fill="none" className="w-full h-full drop-shadow-[0_16px_32px_rgba(13,148,136,0.12)]">
            {/* Background circular backdrop */}
            <circle cx="140" cy="140" r="95" fill="#E6F4F1" />
            <circle cx="140" cy="140" r="80" fill="url(#circle-grad)" opacity="0.6" />

            {/* Clouds */}
            <path d="M70 170 C60 170 50 160 55 145 C60 135 75 135 80 145 C85 135 100 135 105 145 C110 155 100 170 90 170 Z" fill="#FFFFFF" opacity="0.9" />
            <path d="M210 120 C200 120 190 110 195 95 C200 85 215 85 220 95 C225 85 240 85 245 95 C250 105 240 120 230 120 Z" fill="#FFFFFF" opacity="0.9" />

            {/* Floating Paper Sheets */}
            <rect x="75" y="90" width="22" height="28" rx="2" transform="rotate(-15 75 90)" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <line x1="82" y1="98" x2="92" y2="95" stroke="#CBD5E1" strokeWidth="1.5" transform="rotate(-15 75 90)" />
            <line x1="80" y1="104" x2="90" y2="101" stroke="#CBD5E1" strokeWidth="1.5" transform="rotate(-15 75 90)" />

            <rect x="180" y="160" width="24" height="30" rx="2" transform="rotate(20 180 160)" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

            {/* Graduation Cap 1 (Top Left) */}
            <g transform="translate(60, 100) rotate(-10)">
              {/* Cap base / skull cap */}
              <path d="M12 28 C12 36 48 36 48 28 L48 36 C48 42 12 42 12 36 Z" fill="#0A0F1D" />
              <path d="M12 28 C12 36 48 36 48 28 L48 36 C48 42 12 42 12 36 Z" fill="#0D9488" opacity="0.25" stroke="#0D9488" strokeWidth="1.5" />
              {/* Cap rhombus top */}
              <polygon points="30,8 56,22 30,36 4,22" fill="#1E293B" stroke="#0D9488" strokeWidth="2" strokeLinejoin="round" />
              {/* Tassel cord and tassel */}
              <path d="M30 22 C34 26 40 32 44 38" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="44" cy="38" r="3" fill="#14B8A6" />
            </g>

            {/* Graduation Cap 2 (Top Right) */}
            <g transform="translate(150, 95) rotate(15)">
              <path d="M12 28 C12 36 48 36 48 28 L48 36 C48 42 12 42 12 36 Z" fill="#0A0F1D" />
              <path d="M12 28 C12 36 48 36 48 28 L48 36 C48 42 12 42 12 36 Z" fill="#0D9488" opacity="0.25" stroke="#0D9488" strokeWidth="1.5" />
              <polygon points="30,8 56,22 30,36 4,22" fill="#1E293B" stroke="#0D9488" strokeWidth="2" strokeLinejoin="round" />
              <path d="M30 22 C26 26 20 32 16 38" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="38" r="3" fill="#14B8A6" />
            </g>

            {/* Graduation Cap 3 (Center Large) */}
            <g transform="translate(90, 130) scale(1.2)">
              <path d="M12 28 C12 36 48 36 48 28 L48 36 C48 42 12 42 12 36 Z" fill="#0A0F1D" />
              <path d="M12 28 C12 36 48 36 48 28 L48 36 C48 42 12 42 12 36 Z" fill="#0D9488" opacity="0.3" stroke="#0D9488" strokeWidth="1.5" />
              <polygon points="30,8 56,22 30,36 4,22" fill="#0F172A" stroke="#0D9488" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M30 22 C36 26 44 32 48 40" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
              <path d="M48 40 L50 48" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
              <circle cx="50" cy="48" r="3.5" fill="#14B8A6" />
            </g>

            {/* Definitions for gorgeous gradient blur */}
            <defs>
              <radialGradient id="circle-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#E6F4F1" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Text */}
      <div className="max-w-[280px]">
        <h2 className="text-xl font-extrabold text-[#0F172A] mb-2 leading-snug">{title}</h2>
        <p className="text-[#64748B] text-xs leading-relaxed font-medium">{description}</p>
      </div>
    </div>

    {/* Footer spacer */}
    <div />
  </div>
);

export default AuthIllustrationSection;
