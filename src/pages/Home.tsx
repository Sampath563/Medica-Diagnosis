import React, { useState } from 'react';
import { Activity, HeartPulse, ArrowRight, Plus, Menu, X } from 'lucide-react';

function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
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
              <a href="/" className="text-white font-medium flex items-center gap-2 hover:text-blue-200 transition-colors">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                Home
              </a>
              <a href="/diagnosis" className="text-white hover:text-blue-200 transition-colors flex items-center gap-2">
                <HeartPulse className="w-5 h-5" />
                Health Diagnosis
              </a>
              <a href="/treatment" className="text-white hover:text-blue-200 transition-colors flex items-center gap-2">
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
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-blue-900/95 backdrop-blur-md border-t border-white/10">
              <div className="px-4 py-4 space-y-3">
                <a 
                  href="/" 
                  className="flex items-center gap-3 text-white font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  Home
                </a>
                <a 
                  href="/diagnosis" 
                  className="flex items-center gap-3 text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HeartPulse className="w-5 h-5" />
                  Health Diagnosis
                </a>
                <a 
                  href="/treatment" 
                  className="flex items-center gap-3 text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Activity className="w-5 h-5" />
                  Treatment Planner
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Exact match to your image */}
      <section className="relative h-screen flex items-center">
        {/* Blue overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-blue-700/50 z-10"></div>

        {/* Background Image - Exact same as your image */}
        <div 
          className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3259629/pexels-photo-3259629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center"
        ></div>

        {/* Content Container */}
        <div className="container mx-auto px-4 sm:px-6 relative z-20">
          <div className="max-w-4xl text-center mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              MEDICA – Multimodal Engine for Diagnosis, Intervention, Care and Assistance
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-2 max-w-3xl mx-auto">
              MEDICA provides state-of-the-art tools for healthcare professionals and patients,
              simplifying diagnosis and treatment planning through our innovative platform.
            </p>

            {/* Action Buttons - Updated with icons instead of arrows */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <a href="/diagnosis" className="w-full sm:w-auto">
                <button className="group bg-green-500 hover:bg-green-600 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3 w-full sm:min-w-[200px]">
                  <HeartPulse className="w-5 h-5" />
                  Health Diagnosis
                </button>
              </a>
              
              <a href="/treatment" className="w-full sm:w-auto">
                <button className="group bg-white text-blue-700 hover:bg-gray-50 text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3 w-full sm:min-w-[200px]">
                  <Activity className="w-5 h-5" />
                  Treatment Planner
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ✅ This is the required export
export default Home;