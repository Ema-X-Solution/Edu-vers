
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthBackLink = ({ to = '/login', children = 'Back to Login' }) => (
  <Link
    to={to}
    className="inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-text hover:text-main transition-colors mt-6"
  >
    <ArrowLeft size={16} />
    {children}
  </Link>
);

export default AuthBackLink;
