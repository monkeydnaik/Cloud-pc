import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Lightbulb, 
  Map, 
  Target, 
  Shield, 
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from 'recharts';
import { IdeaAnalysis } from '../services/aiService';

export function AnalysisDashboard({ analysis, title }: { analysis: IdeaAnalysis, title: string }) {
  const radarData = [
    { subject: 'Market Demand', A: analysis.marketDemandScore, fullMark: 100 },
    { subject: 'Success Prob.', A: analysis.successProbability, fullMark: 100 },
    { subject: 'Funding Pot.', A: analysis.fundingPotential, fullMark: 100 },
    { subject: 'Innovation', A: 85, fullMark: 100 },
    { subject: 'Scalability', A: 90, fullMark: 100 },
  ];

  const swotData = [
    { name: 'Strengths', count: analysis.swot.strengths.length, fill: '#10b981' },
    { name: 'Weaknesses', count: analysis.swot.weaknesses.length, fill: '#ef4444' },
    { name: 'Opportunities', count: analysis.swot.opportunities.length, fill: '#3b82f6' },
    { name: 'Threats', count: analysis.swot.threats.length, fill: '#f59e0b' },
  ];

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-black/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs mb-2">
            <Zap className="w-4 h-4" />
            Analysis Complete
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <p className="text-black/40 mt-2 font-medium">AI-Generated Strategic Validation Report</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm text-center min-w-[120px]">
            <div className="text-3xl font-bold text-emerald-500">{analysis.marketDemandScore}%</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Market Demand</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm text-center min-w-[120px]">
            <div className="text-3xl font-bold text-blue-500">{analysis.successProbability}%</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Success Prob.</div>
          </div>
        </div>
      </div>

      {/* Visual Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            Strategic Radar
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Idea Score"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            SWOT Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={swotData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Core Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-black/40">
            <Users className="w-4 h-4" />
            Target Audience
          </div>
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm min-h-[120px]">
            <p className="text-lg leading-relaxed font-medium">{analysis.targetAudience}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-black/40">
            <DollarSign className="w-4 h-4" />
            Monetization
          </div>
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm min-h-[120px] flex flex-wrap gap-2">
            {analysis.monetization.map((m, i) => (
              <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold border border-emerald-100">{m}</span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-black/40">
            <Shield className="w-4 h-4" />
            Business Model
          </div>
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm min-h-[120px]">
            <p className="text-lg leading-relaxed font-medium">{analysis.businessModel}</p>
          </div>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-emerald-500" />
          Competitor Landscape
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysis.competitors.map((c, i) => (
            <div key={i} className="bg-[#f8f9fa] p-6 rounded-2xl border border-black/5 hover:border-emerald-500/30 transition-colors">
              <h4 className="text-xl font-bold mb-4">{c.name}</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block font-bold text-[10px] uppercase tracking-widest text-black/40 mb-1">Pricing</span>
                  <p className="font-medium">{c.pricing}</p>
                </div>
                <div>
                  <span className="block font-bold text-[10px] uppercase tracking-widest text-black/40 mb-1">Strengths</span>
                  <p className="text-emerald-600 font-medium">{c.strengths}</p>
                </div>
                <div>
                  <span className="block font-bold text-[10px] uppercase tracking-widest text-black/40 mb-1">Weaknesses</span>
                  <p className="text-red-500 font-medium">{c.weaknesses}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap & MVP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Map className="w-6 h-6 text-blue-500" />
            Startup Roadmap
          </h3>
          <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-black/5">
            {analysis.roadmap.map((step, i) => (
              <div key={i} className="flex gap-6 relative">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-500 z-10 shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">{step.step}</h4>
                  <p className="text-black/60 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black text-white p-8 rounded-3xl shadow-xl shadow-black/20">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Zap className="w-6 h-6 text-emerald-400" />
            MVP Features
          </h3>
          <ul className="space-y-4">
            {analysis.mvpFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-medium text-white/80">{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-12 pt-8 border-t border-white/10">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Suggested Names</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.suggestedNames.map((name, i) => (
                <span key={i} className="bg-white/10 px-3 py-1 rounded-lg text-sm font-bold border border-white/5">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SWOT & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Potential Risks
          </h3>
          <div className="space-y-4">
            {analysis.risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <p className="font-medium text-amber-900">{risk}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-emerald-500" />
            Improvement Suggestions
          </h3>
          <div className="space-y-4">
            {analysis.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <Sparkles className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p className="font-medium text-emerald-900">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pitch Deck Outline */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-12 rounded-[40px] shadow-2xl shadow-emerald-500/20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 flex items-center gap-4">
            <Sparkles className="w-8 h-8" />
            AI Pitch Deck Generator
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-2">The Problem</h4>
                <p className="text-xl font-medium leading-relaxed">{analysis.pitchDeck.problem}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-2">The Solution</h4>
                <p className="text-xl font-medium leading-relaxed">{analysis.pitchDeck.solution}</p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-2">Market Size</h4>
                <p className="text-xl font-medium leading-relaxed">{analysis.pitchDeck.marketSize}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-2">Competition</h4>
                <p className="text-xl font-medium leading-relaxed">{analysis.pitchDeck.competition}</p>
              </div>
            </div>
          </div>
          <button className="mt-12 bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-all group">
            Export Full Pitch Deck
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
