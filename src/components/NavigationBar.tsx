import React, { useState } from 'react';
import { Activity, HeartPulse, Menu, X } from 'lucide-react';

const NavigationBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    console.log(`Navigating to ${href}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-transparent z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">MEDICA</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="/" 
              onClick={handleHomeClick}
              className="text-white font-medium flex items-center gap-2 hover:text-blue-200 transition-colors"
            >
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Home
            </a>
            <a 
              href="/diagnosis" 
              onClick={() => handleNavClick('/diagnosis')}
              className="text-white hover:text-blue-200 transition-colors flex items-center gap-2"
            >
              <HeartPulse className="w-5 h-5" />
              Health Diagnosis
            </a>
            <a 
              href="/treatment" 
              onClick={() => handleNavClick('/treatment')}
              className="text-white hover:text-blue-200 transition-colors flex items-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Treatment Planner
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-blue-50/95 backdrop-blur-md border-t border-blue-200 shadow-lg transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-4 invisible'
        }`}>
          <div className="px-4 py-4 space-y-3">
            <a 
              href="/" 
              onClick={handleHomeClick}
              className="flex items-center gap-3 text-blue-800 font-medium py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Home
            </a>
            <a 
              href="/diagnosis" 
              onClick={() => handleNavClick('/diagnosis')}
              className="flex items-center gap-3 text-blue-800 py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <HeartPulse className="w-5 h-5 text-green-600" />
              Health Diagnosis
            </a>
            <a 
              href="/treatment" 
              onClick={() => handleNavClick('/treatment')}
              className="flex items-center gap-3 text-blue-800 py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Activity className="w-5 h-5 text-blue-600" />
              Treatment Planner
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
