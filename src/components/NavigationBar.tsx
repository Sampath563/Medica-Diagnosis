import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, HeartPulse } from 'lucide-react';

const NavigationBar: React.FC = () => {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    pathname === path
      ? 'text-blue-600 font-semibold flex items-center gap-2'
      : 'text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MEDICA</span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/" className={linkClass('/')}>
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Home
            </Link>
            <Link to="/diagnosis" className={linkClass('/diagnosis')}>
              <HeartPulse className="w-5 h-5" />
              Health Diagnosis
            </Link>
            <Link to="/treatment" className={linkClass('/treatment')}>
              <Activity className="w-5 h-5" />
              Treatment Planner
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
