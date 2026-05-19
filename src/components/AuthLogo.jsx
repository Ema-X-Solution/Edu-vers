import { Link } from 'react-router-dom';
import eduverseMark from '../assets/icons/eduverse-mark.svg';

const iconShadowClass =
  'shadow-[0px_4px_6px_-4px_#193CE64D,0px_10px_15px_-3px_#193CE64D]';

const AuthLogo = ({ className = '', showIconShadow = true }) => (
  <Link to="/login" className={`inline-flex items-center gap-2 ${className}`}>
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
        showIconShadow ? iconShadowClass : ''
      }`}
    >
      <img src={eduverseMark} alt="" width={33} height={27} className="shrink-0" />
    </span>
    <span className="eduverse-logo-text">EduVerse</span>
  </Link>
);

export default AuthLogo;
