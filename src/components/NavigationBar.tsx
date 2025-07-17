import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';

const NavigationBar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isHomePage = pathname === '/home';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and MEDICA Text */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MEDICA</span>
          </div>

          {/* Navigation Links or Back Button */}
          {isHomePage ? (
            <div className="flex items-center gap-8">
              <Link to="/home" className="text-blue-600 font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-white bg-blue-600 rounded p-1" />
                Home
              </Link>
              <Link to="/diagnosis" className="text-gray-700 hover:text-blue-600 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Health Diagnosis
              </Link>
              <Link to="/treatment" className="text-gray-700 hover:text-blue-600 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Treatment Planner
              </Link>
            </div>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
