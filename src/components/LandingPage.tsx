import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import AuthModal from './AuthModal';
import { 
  Play, 
  Upload, 
  TrendingUp, 
  Mic, 
  FileText, 
  Target,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  Heart,
  Mail,
  Twitter,
  Instagram,
  Zap,
  Brain,
  Calendar
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSupabase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Waveform SVG component
  const WaveformSVG = ({ className = "", animate = false }) => (
    <svg 
      className={`${className} ${animate ? 'animate-pulse' : ''}`} 
      viewBox="0 0 200 40" 
      fill="none"
    >
      {[...Array(40)].map((_, i) => (
        <rect
          key={i}
          x={i * 5}
          y={20 - Math.random() * 15}
          width="3"
          height={Math.random() * 30 + 5}
          fill="currentColor"
          className="opacity-60"
          style={{
            animationDelay: animate ? `${i * 0.1}s` : '0s'
          }}
        />
      ))}
    </svg>
  );

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleSignIn = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthMode('signin');
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                KickStartX
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors">Reviews</a>
              {user ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Dashboard
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleSignIn}
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-indigo-100">
            <div className="px-4 py-6 space-y-4">
              <a href="#how-it-works" className="block text-gray-600 hover:text-indigo-600">How It Works</a>
              <a href="#testimonials" className="block text-gray-600 hover:text-indigo-600">Reviews</a>
              {user ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-full"
                >
                  Dashboard
                </button>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={handleSignIn}
                    className="w-full border border-indigo-300 text-indigo-600 py-3 rounded-full"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-full"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className={`transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Study Intent into
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                Daily Momentum
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Beat procrastination with AI-powered micro challenges, intent-driven reminders, and daily study momentum
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Start Building Momentum</span>
              </button>
              <button className="border-2 border-indigo-300 text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-50 transition-all duration-200">
                Watch Demo
              </button>
            </div>

            {/* Waveform Visualization */}
            <div className="flex justify-center items-center space-x-4 text-indigo-400">
              <WaveformSVG className="w-32 h-8" animate={true} />
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
              <WaveformSVG className="w-32 h-8" animate={true} />
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className={`transform transition-all duration-1000 delay-200 ${isVisible.problem ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                The Procrastination Trap is Real
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                You're not alone. Most students struggle with the same cycle of good intentions and delayed action.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Intent vs. Action Gap</h3>
                <p className="text-gray-600 text-center">
                  "I'll study after lunch" becomes "I'll start tomorrow" and the cycle continues endlessly.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Overwhelming Content</h3>
                <p className="text-gray-600 text-center">
                  Thick PDFs and long videos feel impossible to tackle, leading to analysis paralysis.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Lost Motivation</h3>
                <p className="text-gray-600 text-center">
                  Without daily momentum, even the strongest study goals fade into forgotten intentions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section id="solution" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible.solution ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why KickStartX Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We turn your study intentions into daily momentum through AI-powered micro challenges and personalized motivation.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Intent-Driven Recording</h3>
                <p className="text-gray-600 mb-4">
                  Record why your study goal matters to you. Your personal motivation becomes the foundation for AI-generated reminders.
                </p>
                <div className="flex items-center text-indigo-600 font-medium">
                  <span>Personal & Powerful</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Content Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Upload PDFs or links. AI breaks content into daily topics and creates warm-up challenges to ease you into studying.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Smart Breakdown</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Momentum Builder</h3>
                <p className="text-gray-600 mb-4">
                  Start each session with micro challenges and curiosity sparks. Build confidence before diving into the main content.
                </p>
                <div className="flex items-center text-green-600 font-medium">
                  <span>Consistent Progress</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className={`transform transition-all duration-1000 delay-400 ${isVisible['how-it-works'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform procrastination into momentum in just 4 simple steps.
              </p>
            </div>

            <div className="relative">
              {/* Connection Lines */}
              <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 transform -translate-y-1/2"></div>
              
              <div className="grid lg:grid-cols-4 gap-8 relative">
                <div className="text-center group">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      1
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                      <Mic className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🎤 Record Your Intent</h3>
                  <p className="text-gray-600 text-sm">
                    Tell us why this study goal matters to you. Your personal motivation drives everything.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      2
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Upload Content</h3>
                  <p className="text-gray-600 text-sm">
                    Add PDFs, videos, or links. AI analyzes and creates a personalized daily study plan.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      3
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 Daily Challenges</h3>
                  <p className="text-gray-600 text-sm">
                    Start each session with warm-up questions and curiosity sparks to build momentum.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      4
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Stay Motivated</h3>
                  <p className="text-gray-600 text-sm">
                    Receive AI-generated reminders based on your intent and track your progress visually.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Students Are Building Real Momentum
              </h2>
              <p className="text-xl text-gray-600">
                See how KickStartX is helping students overcome procrastination and achieve their goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I never finished studying OS concepts before — now I'm finally making progress with daily micro challenges!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Arjun, 21</p>
                    <p className="text-gray-500 text-sm">GATE Aspirant</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "The AI reminders using my own recorded intent are so much more powerful than generic notifications."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                    P
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Priya, 20</p>
                    <p className="text-gray-500 text-sm">CS Student</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Breaking down my placement prep PDFs into daily topics made everything feel manageable. No more overwhelm!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                    R
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Rahul, 22</p>
                    <p className="text-gray-500 text-sm">Final Year Student</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`transform transition-all duration-1000 delay-600 ${isVisible.cta ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to transform procrastination into momentum?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join students who are finally achieving their study goals with AI-powered daily momentum.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGetStarted}
                className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Start Building Momentum</span>
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-200">
                Watch Demo
              </button>
            </div>

            <p className="text-indigo-200 mt-6 text-sm">
              Free to start • AI-powered • Built for students
            </p>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <WaveformSVG className="absolute top-10 left-10 w-32 h-8 text-white opacity-10" />
          <WaveformSVG className="absolute bottom-10 right-10 w-32 h-8 text-white opacity-10" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">KickStartX</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Transforming study intentions into daily momentum through AI-powered micro challenges and personalized motivation.
              </p>
              <p className="text-gray-400 flex items-center">
                <Heart className="w-4 h-4 text-red-400 mr-2" />
                Built with love by students, for students
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 KickStartX. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default LandingPage;