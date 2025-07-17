import React, { useState } from 'react';
import { Activity, HeartPulse, Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


function Home() {
    const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const res = await axios.post("https://medica-backend-3.onrender.com/api/feedback", {
        email,
        message,
      });

      if (res.data.success) {
        setStatus("✅ Feedback submitted!");
        setEmail("");
        setMessage("");
      } else {
        setStatus("❌ " + res.data.message);
      }
    } catch (error) {
      setStatus("❌ Failed to submit. Try again later.");
      console.error(error);
    }
  };

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
    <div className="min-h-screen flex flex-col">
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
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/login');
                }}
                className="text-white hover:text-red-400 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
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
              <button
                onClick={() => {
                  localStorage.clear();
                  handleNavigate('/login');
                }}
                className="flex items-center gap-3 text-red-600 py-3 px-4 rounded-lg hover:bg-red-100 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
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
      

      {/* Footer Section */}
      <footer className="bg-transparent text-white px-6 py-12 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Leader Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-blue-200 border-b border-blue-700 pb-2">Main</h2>
              <div className="space-y-3">
                <p className="font-medium text-lg">Sampath Kumar B</p>
                <a 
                  href="tel:+918217741448" 
                  className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors group"
                >
                  <span className="group-hover:scale-110 transition-transform">📞</span>
                  +91 8217741448
                </a>
                <a 
                  href="mailto:bsampath563@gmail.com" 
                  className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors group"
                >
                  <span className="group-hover:scale-110 transition-transform">📧</span>
                  bsampath563@gmail.com
                </a>
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-blue-200 border-b border-blue-700 pb-2">Team Members</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                  <span className="text-yellow-400">💡</span>
                  <span>Pruthvi Raj N M</span>
                </li>
                <li className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                  <span className="text-yellow-400">💡</span>
                  <span>Varun B M</span>
                </li>
                <li className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                  <span className="text-yellow-400">💡</span>
                  <span>Vivek Chandra</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-blue-200 border-b border-blue-700 pb-2">Quick Links</h2>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => handleNavigate('/home')} 
                    className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors group w-full text-left"
                  >
                    <span className="group-hover:scale-110 transition-transform">🏠</span>
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('/diagnosis')} 
                    className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors group w-full text-left"
                  >
                    <span className="group-hover:scale-110 transition-transform">🩺</span>
                    Health Diagnosis
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('/treatment')} 
                    className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors group w-full text-left"
                  >
                    <span className="group-hover:scale-110 transition-transform">💊</span>
                    Treatment Planner
                  </button>
                </li>
              </ul>
            </div>

            {/* Feedback Form */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-blue-200 border-b border-blue-700 pb-2">Send us Feedback</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const payload = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                  };

                  try {
                    const res = await fetch("https://medica-backend-3.onrender.com/api/feedback", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert("Thank you for your feedback!");
                      form.reset();
                    } else {
                      alert("Error: " + data.error);
                    }
                  } catch (err) {
                    alert("Failed to submit feedback");
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  className="w-full p-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your Email"
                  className="w-full p-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="message"
                  required
                  rows={3}
                  placeholder="Your Feedback"
                  className="w-full p-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors font-medium"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-blue-200">
                  &copy; {new Date().getFullYear()} MEDICA - Multimodal Engine for Diagnosis, Intervention, Care and Assistance
                </p>
                <p className="text-xs text-blue-300 mt-1">
                  All rights reserved. Empowering healthcare through innovation.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-blue-300">Made with</span>
                <span className="text-red-400 animate-pulse">❤️</span>
                <span className="text-sm text-blue-300">for better healthcare</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
