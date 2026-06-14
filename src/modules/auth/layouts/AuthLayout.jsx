import React from 'react';
import AuthIllustrationSection from '../components/AuthIllustrationSection';
import AuthCard from '../components/AuthCard';

/**
 * AuthLayout — the split-screen shell used by every auth page.
 *
 * Left  → AuthIllustrationSection (hidden on mobile)
 * Right → AuthCard  (form content via children)
 *
 * This module-level layout is separate from src/app/layouts/AuthLayout
 * because it carries auth-specific design tokens (the #193CE61A background,
 * border + shadow on image card, etc.).
 */
const AuthLayout = ({ image, title, description, children }) => (
  <div
    className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8 animate-fade-in"
    style={{
      background: 'radial-gradient(circle at 10% 10%, #E6F9FB 0%, transparent 60%), radial-gradient(circle at 90% 10%, #E0F2FE 0%, transparent 60%), radial-gradient(circle at 90% 90%, #EEF2FF 0%, transparent 60%), radial-gradient(circle at 10% 90%, #E0F7FA 0%, transparent 60%), linear-gradient(135deg, #F0FDFA 0%, #EEF2FF 100%)',
    }}
  >
    <div className="w-full max-w-[1040px] min-h-[660px] bg-white rounded-[24px] overflow-hidden flex flex-col lg:flex-row shadow-[0_24px_70px_-12px_rgba(21,179,146,0.15)] border border-white/90">
      <AuthIllustrationSection
        image={image}
        title={title}
        description={description}
      />
      <AuthCard>
        {children}
      </AuthCard>
    </div>
  </div>
);

export default AuthLayout;
