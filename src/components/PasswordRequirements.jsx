
import { Check } from 'lucide-react';

const rules = [
  { id: 'length', label: '8+ characters', test: (p) => p.length >= 8 },
  { id: 'symbol', label: '1 symbol', test: (p) => /[^A-Za-z0-9]/.test(p) },
  { id: 'number', label: '1 number', test: (p) => /\d/.test(p) },
];

const PasswordRequirements = ({ password }) => (
  <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-text">
    {rules.map(({ id, label, test }) => {
      const met = test(password);
      return (
        <li key={id} className={`flex items-center gap-1.5 ${met ? 'text-main' : ''}`}>
          <Check size={14} className={met ? 'text-main' : 'text-gray-light'} />
          {label}
        </li>
      );
    })}
  </ul>
);

export default PasswordRequirements;
