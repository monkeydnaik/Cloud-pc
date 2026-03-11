import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { analyzeIdea } from '../services/aiService';
import { db } from '../firebase-init';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';

export function IdeaForm({ onAnalysisComplete }: { onAnalysisComplete: (ideaId: string) => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !description) return;

    setLoading(true);
    try {
      const analysis = await analyzeIdea(title, description);
      
      try {
        const docRef = await addDoc(collection(db, 'ideas'), {
          userId: user.uid,
          title,
          description,
          analysis,
          createdAt: serverTimestamp(),
        });
        onAnalysisComplete(docRef.id);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'ideas');
      }
    } catch (error) {
      console.error('Error analyzing idea:', error);
      alert('Failed to analyze idea. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Validate Your <span className="text-emerald-500 italic">Next Big Thing</span></h1>
        <p className="text-xl text-black/60">Describe your startup idea and let our AI provide deep market insights, competitor analysis, and a roadmap to success.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-black/5">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black/40 mb-2">Startup Name / Working Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Uber for Pet Grooming"
              className="w-full px-6 py-4 rounded-2xl bg-[#f8f9fa] border-none focus:ring-2 focus:ring-emerald-500 transition-all text-lg font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black/40 mb-2">Describe the Idea</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What problem are you solving? Who is it for? How does it work?"
              rows={6}
              className="w-full px-6 py-4 rounded-2xl bg-[#f8f9fa] border-none focus:ring-2 focus:ring-emerald-500 transition-all text-lg font-medium resize-none"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing Your Vision...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Validate Idea
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
        <div className="flex flex-col items-center text-center p-6">
          <div className="text-3xl font-bold text-emerald-500 mb-1">100+</div>
          <div className="text-xs font-bold uppercase tracking-widest">Market Data Points</div>
        </div>
        <div className="flex flex-col items-center text-center p-6 border-x border-black/5">
          <div className="text-3xl font-bold text-emerald-500 mb-1">Real-time</div>
          <div className="text-xs font-bold uppercase tracking-widest">Competitor Scan</div>
        </div>
        <div className="flex flex-col items-center text-center p-6">
          <div className="text-3xl font-bold text-emerald-500 mb-1">AI-Powered</div>
          <div className="text-xs font-bold uppercase tracking-widest">Pitch Deck Outline</div>
        </div>
      </div>
    </motion.div>
  );
}
