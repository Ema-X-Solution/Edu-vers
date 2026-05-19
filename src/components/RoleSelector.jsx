
import { GraduationCap, Stethoscope, Users } from 'lucide-react';

const roles = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope },
  { id: 'ta', label: 'Teacher Assistant', icon: Users },
];

const RoleSelector = ({ value, onChange }) => (
  <div className="flex flex-col gap-2">
    <span className="text-sm font-medium text-dark-blue">Select your role</span>
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {roles.map(({ id, label, icon: Icon }) => {
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`
              flex flex-col items-center gap-2 rounded-xl border px-2 py-3 sm:py-3.5 transition-colors bg-white
              ${selected ? 'border-main' : 'border-[#E2E8F0] hover:border-main/30'}
            `}
          >
            <Icon size={22} className={selected ? 'text-main' : 'text-gray-light'} />
            <span
              className={`text-[10px] sm:text-xs font-medium leading-tight text-center ${
                selected ? 'text-main' : 'text-gray-text'
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default RoleSelector;
