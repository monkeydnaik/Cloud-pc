import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Lightbulb, LayoutDashboard, PlusCircle } from 'lucide-react';

export function Layout({ children, onNavigate }: { children: React.ReactNode, onNavigate: (page: string) => void }) {
  const { user, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans">
      <nav className="sticky top-0 z-50 bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between shadow-sm">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="bg-emerald-500 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Lightbulb className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">IdeaValidator<span className="text-emerald-500">Pro</span></span>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <button 
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 text-sm font-medium hover:text-emerald-600 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button 
                onClick={() => onNavigate('new')}
                className="flex items-center gap-2 text-sm font-medium hover:text-emerald-600 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                New Idea
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-black/5">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-black/5"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={logout}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={login}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-black/80 transition-all shadow-md shadow-black/10"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>

      <footer className="border-t border-black/5 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Lightbulb className="w-5 h-5" />
            <span className="font-bold">IdeaValidatorPro</span>
          </div>
          <p className="text-sm text-black/40">© 2026 AI Idea Validator Pro. Built with Google Gemini.</p>
          <div className="flex gap-6 text-sm font-medium text-black/60">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
