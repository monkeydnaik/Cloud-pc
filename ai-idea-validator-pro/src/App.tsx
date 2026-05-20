import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { IdeaForm } from './components/IdeaForm';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { IdeaDocument } from './services/aiService';
import { IdeaList } from './components/IdeaList';
import { ErrorBoundary } from './components/ErrorBoundary';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ShieldCheck, BarChart3, Globe, Sparkles, ArrowRight } from 'lucide-react';

function AppContent() {
  const { user, loading, login, error, clearError } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedIdea, setSelectedIdea] = useState<IdeaDocument | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-black/40 uppercase tracking-widest text-xs">Initializing AI Engine</p>
        </div>
      </div>
    );
  }

  const handleAnalysisComplete = (ideaId: string) => {
    setCurrentPage('dashboard');
  };

  const handleSelectIdea = (idea: IdeaDocument) => {
    setSelectedIdea(idea);
    setCurrentPage('analysis');
  };

  return (
    <Layout onNavigate={(page) => {
      setCurrentPage(page);
      setSelectedIdea(null);
    }}>
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-24"
          >
            {/* Hero Section */}
            <section className="text-center max-w-4xl mx-auto py-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-8 border border-emerald-100"
              >
                <Sparkles className="w-4 h-4" />
                V2.0 is now live with Market Trend Analysis
              </motion.div>
              <h1 className="text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                Stop Guessing. <br />
                Start <span className="text-emerald-500 italic underline decoration-emerald-200 underline-offset-8">Validating.</span>
              </h1>
              <p className="text-2xl text-black/60 mb-12 leading-relaxed">
                The most advanced AI platform for startup founders. Analyze market demand, scan competitors, and generate your startup roadmap in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => user ? setCurrentPage('new') : login()}
                  className="w-full sm:w-auto bg-black text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-black/80 transition-all shadow-2xl shadow-black/20 group"
                >
                  Get Started Free
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full sm:w-auto bg-white text-black border border-black/5 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-black/5 transition-all">
                  View Demo
                </button>
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm hover:shadow-xl transition-all group">
                <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform">
                  <BarChart3 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Market Scoring</h3>
                <p className="text-black/60 leading-relaxed font-medium">Deep analysis of market demand, funding potential, and success probability using real-time data.</p>
              </div>
              <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm hover:shadow-xl transition-all group">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform">
                  <Globe className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Competitor Scan</h3>
                <p className="text-black/60 leading-relaxed font-medium">Automatic identification of competitors with detailed SWOT analysis of their strengths and weaknesses.</p>
              </div>
              <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm hover:shadow-xl transition-all group">
                <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform">
                  <Rocket className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">MVP Roadmap</h3>
                <p className="text-black/60 leading-relaxed font-medium">A step-by-step execution plan from concept to launch, including essential MVP feature suggestions.</p>
              </div>
            </section>

            {/* Trust Banner */}
            <section className="bg-white rounded-[60px] p-16 border border-black/5 text-center overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                <div className="absolute top-10 left-10"><Rocket className="w-24 h-24 rotate-12" /></div>
                <div className="absolute bottom-10 right-10"><ShieldCheck className="w-32 h-32 -rotate-12" /></div>
              </div>
              <h2 className="text-4xl font-bold mb-6">Trusted by 5,000+ Founders</h2>
              <p className="text-xl text-black/40 mb-12 max-w-2xl mx-auto">Join the next generation of entrepreneurs building data-backed startups with AI Idea Validator Pro.</p>
              <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale">
                <span className="text-2xl font-black tracking-tighter italic">TECHCRUNCH</span>
                <span className="text-2xl font-black tracking-tighter">FORBES</span>
                <span className="text-2xl font-black tracking-tighter italic">WIRED</span>
                <span className="text-2xl font-black tracking-tighter">FASTCOMPANY</span>
              </div>
            </section>
          </motion.div>
        )}

        {currentPage === 'new' && (
          <motion.div 
            key="new"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <IdeaForm onAnalysisComplete={handleAnalysisComplete} />
          </motion.div>
        )}

        {currentPage === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Your Dashboard</h1>
                <p className="text-black/40 mt-2 font-medium">Manage and track your validated startup ideas.</p>
              </div>
              <button 
                onClick={() => setCurrentPage('new')}
                className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                New Analysis
              </button>
            </div>
            <IdeaList onSelectIdea={handleSelectIdea} />
          </motion.div>
        )}

        {currentPage === 'analysis' && selectedIdea && (
          <motion.div 
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className="mb-8 text-sm font-bold uppercase tracking-widest text-black/40 hover:text-emerald-500 transition-colors flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <AnalysisDashboard analysis={selectedIdea.analysis} title={selectedIdea.title} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl border border-red-100"
            >
              <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-red-500" />
              </div>
              
              {error.startsWith('UNAUTHORIZED_DOMAIN:') ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">Domain Not Authorized</h2>
                  <p className="text-black/60 mb-6 leading-relaxed">
                    Firebase is blocking authentication from this domain. You must whitelist it in your Firebase Console to enable login.
                  </p>
                  <div className="bg-black/5 p-4 rounded-xl mb-6 font-mono text-sm break-all">
                    {error.split(':')[1]}
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3 text-sm">
                      <div className="bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                      <p>Go to <b>Authentication &gt; Settings &gt; Authorized domains</b> in Firebase Console.</p>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <div className="bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                      <p>Click <b>Add domain</b> and paste the domain shown above.</p>
                    </div>
                  </div>
                </>
              ) : error.startsWith('NETWORK_ERROR:') ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">Network Blocked</h2>
                  <p className="text-black/60 mb-6 leading-relaxed">
                    {error.split(':')[1]}
                  </p>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-sm text-emerald-800 font-medium">
                      💡 <b>Quick Fix:</b> Try disabling your Ad-Blocker (like uBlock Origin or AdBlock) for this page, then refresh and try again.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
                  <p className="text-black/60 mb-6 leading-relaxed">{error}</p>
                </>
              )}
              
              <button 
                onClick={clearError}
                className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold hover:bg-black/80 transition-all"
              >
                Got it, I'll fix it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
