import React, { useEffect, useState } from 'react';
import { db } from '../firebase-init';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';
import { motion } from 'motion/react';
import { ChevronRight, Calendar, TrendingUp, Zap } from 'lucide-react';
import { IdeaDocument } from '../services/aiService';

export function IdeaList({ onSelectIdea }: { onSelectIdea: (idea: IdeaDocument) => void }) {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<IdeaDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'ideas'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ideasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IdeaDocument[];
      setIdeas(ideasData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'ideas');
    });

    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-black/5 rounded-full" />
          <div className="h-4 w-32 bg-black/5 rounded" />
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-[40px] border border-black/5">
        <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No ideas validated yet</h3>
        <p className="text-black/40 max-w-md mx-auto mb-8">Start by describing your startup vision and let AI analyze its potential.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {ideas.map((idea, i) => (
        <motion.div
          key={idea.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelectIdea(idea)}
          className="group bg-white p-8 rounded-3xl border border-black/5 shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-6 h-6 text-emerald-500" />
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
            <Calendar className="w-3 h-3" />
            {idea.createdAt?.toDate().toLocaleDateString()}
          </div>

          <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-600 transition-colors">{idea.title}</h3>
          <p className="text-black/60 line-clamp-2 mb-6 font-medium leading-relaxed">{idea.description}</p>

          <div className="flex items-center gap-6 pt-6 border-t border-black/5">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Demand</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">{idea.analysis.marketDemandScore}%</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Success</span>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="font-bold">{idea.analysis.successProbability}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
