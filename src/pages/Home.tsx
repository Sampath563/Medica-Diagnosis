import React from 'react';
import { Activity, HeartPulse, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-transparent z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-white">MEDICA</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="/" className="text-white font-medium flex items-center gap-2">
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
          </div>
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
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl text-center mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              MEDICA – Multimodal Engine for Diagnosis, Intervention, Care and Assistance
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              MEDICA provides state-of-the-art tools for healthcare professionals and patients,
              simplifying diagnosis and treatment planning through our innovative platform.
            </p>

            {/* Action Buttons - Updated with icons instead of arrows */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/diagnosis">
                <button className="group bg-green-500 hover:bg-green-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-3 min-w-[200px]">
                  <HeartPulse className="w-5 h-5" />
                  Health Diagnosis
                </button>
              </a>
              
              <a href="/treatment">
                <button className="group bg-white text-blue-700 hover:bg-gray-50 text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-3 min-w-[200px]">
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