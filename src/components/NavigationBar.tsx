import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, HeartPulse, Menu, X } from 'lucide-react';

const NavigationBar: React.FC = () => {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClass = (path: string) =>
    pathname === path
      ? 'text-blue-600 font-semibold flex items-center gap-2'
      : 'text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MEDICA</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/home" className={linkClass('/home')}>
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

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 pb-4 space-y-4">
            <Link to="/home" className={linkClass('/home')} onClick={() => setIsMobileMenuOpen(false)}>
              <Activity className="w-5 h-5" /> Home
            </Link>
            <Link to="/diagnosis" className={linkClass('/diagnosis')} onClick={() => setIsMobileMenuOpen(false)}>
              <HeartPulse className="w-5 h-5" /> Health Diagnosis
            </Link>
            <Link to="/treatment" className={linkClass('/treatment')} onClick={() => setIsMobileMenuOpen(false)}>
              <Activity className="w-5 h-5" /> Treatment Planner
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
