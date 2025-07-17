import React, { useState } from 'react';
import { Activity, HeartPulse, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigate = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-transparent z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div
              onClick={() => handleNavigate('/home')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
</div>
<span className="text-lg sm:text-xl font-bold text-white">MEDICA</span>

            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => handleNavigate('/home')}
                className="text-white font-medium flex items-center gap-2 hover:text-blue-200 transition-colors"
              >
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                Home
              </button>
              <button
                onClick={() => handleNavigate('/diagnosis')}
                className="text-white hover:text-blue-200 transition-colors flex items-center gap-2"
              >
                <HeartPulse className="w-5 h-5" />
                Health Diagnosis
              </button>
              <button
                onClick={() => handleNavigate('/treatment')}
                className="text-white hover:text-blue-200 transition-colors flex items-center gap-2"
              >
                <Activity className="w-5 h-5" />
                Treatment Planner
              </button>
            </div>

            {/* Mobile Menu Button */}
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
          <div
            className={`md:hidden absolute top-full left-0 right-0 bg-blue-50/95 backdrop-blur-md border-t border-blue-200 shadow-lg transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0 visible'
                : 'opacity-0 -translate-y-4 invisible'
            }`}
          >
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => handleNavigate('/home')}

                className="flex items-center gap-3 text-blue-800 font-medium py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors w-full"
              >
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                Home
              </button>
              <button
                onClick={() => handleNavigate('/diagnosis')}
                className="flex items-center gap-3 text-blue-800 py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors w-full"
              >
                <HeartPulse className="w-5 h-5 text-green-600" />
                Health Diagnosis
              </button>
              <button
                onClick={() => handleNavigate('/treatment')}
                className="flex items-center gap-3 text-blue-800 py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors w-full"
              >
                <Activity className="w-5 h-5 text-blue-600" />
                Treatment Planner
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-blue-700/50 z-10" />
        <div
          className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3259629/pexels-photo-3259629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center"
        />
        <div className="container mx-auto px-4 sm:px-6 relative z-20">
          <div className="max-w-4xl text-center mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 px-2">
              MEDICA – Multimodal Engine for Diagnosis, Intervention, Care and Assistance
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 px-2">
              MEDICA provides state-of-the-art tools for healthcare professionals and patients,
              simplifying diagnosis and treatment planning through our innovative platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <button
                onClick={() => handleNavigate('/diagnosis')}
                className="bg-green-500 hover:bg-green-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transition transform hover:scale-105 flex items-center gap-3"
              >
                <HeartPulse className="w-5 h-5" />
                Health Diagnosis
              </button>
              <button
                onClick={() => handleNavigate('/treatment')}
                className="bg-white text-blue-700 hover:bg-gray-50 text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transition transform hover:scale-105 flex items-center gap-3"
              >
                <Activity className="w-5 h-5" />
                Treatment Planner
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
