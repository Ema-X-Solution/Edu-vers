import React from 'react';
import Button from '@/shared/ui/Button';

/**
 * PasswordStrengthBar — visual indicator for password strength.
 * Shows under password fields when the user is typing a new password.
 *
 * @param {string} password
 */
export const PasswordStrengthBar = ({ password = '' }) => {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'One uppercase letter',  pass: /[A-Z]/.test(password) },
    { label: 'One number',            pass: /\d/.test(password) },
  ];

  const score = checks.filter((c) => c.pass).length;

  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-percentage-up'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div className="mt-3">
      {/* Strength bars */}
      <div className="flex gap-1.5 mb-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium mb-2 ${colors[score]?.replace('bg-', 'text-')}`}>
        {labels[score]}
      </p>
      {/* Rule checklist */}
      <ul className="space-y-1">
        {checks.map(({ label, pass }) => (
          <li key={label} className="flex items-center gap-2 text-xs">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${pass ? 'bg-percentage-up' : 'bg-gray-300'}`}>
              {pass ? '✓' : ''}
            </span>
            <span className={pass ? 'text-gray-text' : 'text-gray-400'}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * FormActions — primary submit button + optional secondary link beneath it.
 */
const FormActions = ({ submitLabel = 'Submit', isLoading, secondarySlot }) => (
  <div className="flex flex-col gap-4">
    <Button type="submit" fullWidth loading={isLoading} size="md" className="mt-2 shadow-sm">
      {submitLabel}
    </Button>
    {secondarySlot && (
      <div className="text-center text-sm text-gray-text">
        {secondarySlot}
      </div>
    )}
  </div>
);

export default FormActions;
