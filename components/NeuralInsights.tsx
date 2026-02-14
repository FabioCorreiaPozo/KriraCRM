
import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  TrendingUp, 
  ShoppingBag, 
  Factory, 
  Target, 
  AlertTriangle, 
  Loader2, 
  Sparkles, 
  ChevronRight,
  Lightbulb,
  Phone,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import { Lead, Product } from '../types';
import { GeminiService } from '../services/geminiService';

interface NeuralInsightsProps {
  leads: Lead[];
  products: Product[];
}

interface InsightData {
  mostRequested: { product: string; growth: string; reason: string }[];
  marketGaps: { item: string; demand: string; priority: 'Alta' | 'Média' }[];
  suppliers: { name: string; niche: string; contact: string; strength: string }[];
  strategicAdvice: string;
}

const NeuralInsights: React.FC<NeuralInsightsProps> = ({ leads, products }) => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<InsightData | null>(null);
  
  // Simulation of AI analyzing the context
  useEffect(() => {
    const timer = setTimeout(() => {
      setInsights({
        mostRequested: [
          { product: 'Mesa de Jantar Carvalho', growth: '+42%', reason: 'Busca por design orgânico e natural' },
          { product: 'Sofá Minimalista', growth: '+15%', reason: 'Campanha de Instagram atraiu público jovem' }
        ],
        marketGaps: [
          { item: 'Escrivaninhas Estilo Industrial', demand: '24 solicitações/mês', priority: 'Alta' },
          { item: 'Móveis para Varanda Gourmet', demand: '15 solicitações/mês', priority: 'Média' }
        ],
        suppliers: [
          { name: 'Indústria WoodTech', niche: 'Móveis Industriais', contact: '+55 (47) 99888-7711', strength: 'Preço competitivo e entrega em 15 dias' },
          { name: 'Fábrica de Estofados Lux', niche: 'Sofás Premium', contact: '+55 (54) 3322-1100', strength: 'Personalização total de tecidos' }
        ],
        strategicAdvice: "Focar em anúncios de Instagram para o nicho 'Home Office Industrial', onde detectamos 42% de perda de leads por falta de catálogo específico. Sugerimos fechar parceria com a WoodTech para cobrir esse gap rapidamente."
      });
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [leads, products]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 animate-pulse" size={32} />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-white font-heading tracking-tight">Analisando malha de conversas...</p>
          <p className="text-slate-500 text-sm">O Gemini está minerando dados estratégicos para seu negócio.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white font-heading">Neural Insights</h1>
          <p className="text-slate-500 text-sm">Relatório gerado via IA sobre gaps e oportunidades de mercado.</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
          <Sparkles size={20} className="text-amber-500" />
          <span className="text-sm font-bold text-white uppercase tracking-widest">IA Analítica v4.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Most Requested Section */}
        <div className="lg:col-span-2 glass p-8 rounded-[40px] border-white/5 space-y-8">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="text-emerald-500" size={24} /> Top Performance e Procura
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights?.mostRequested.map((item, i) => (
              <div key={i} className="bg-slate-900/50 p-6 rounded-[32px] border border-white/5 space-y-4 hover:border-amber-500/30 transition-all group">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <ShoppingBag className="text-emerald-400" size={20} />
                  </div>
                  <span className="text-xl font-bold text-emerald-400 font-heading">{item.growth}</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">{item.product}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/5"></div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <AlertTriangle className="text-rose-500" size={24} /> Gaps de Estoque (Demanda Não Atendida)
            </h3>
            <div className="space-y-4">
              {insights?.marketGaps.map((gap, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-[32px] bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-rose-500 border border-white/5">
                      <Target size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{gap.item}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{gap.demand}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    gap.priority === 'Alta' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    Prioridade {gap.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suppliers and Strategy Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-[40px] border-amber-500/10 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <Factory className="text-amber-500" size={22} /> Novos Fornecedores (Sugeridos)
            </h3>
            <div className="space-y-4">
              {insights?.suppliers.map((sup, i) => (
                <div key={i} className="p-5 rounded-3xl bg-slate-900 border border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white text-sm">{sup.name}</p>
                      <p className="text-[10px] text-amber-500 uppercase font-bold tracking-widest">{sup.niche}</p>
                    </div>
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                      <Phone size={14} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[10px] text-slate-500 italic">
                    {sup.strength}
                  </div>
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest transition-all">
                    Ver Catálogo da Fábrica
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] border-blue-500/10 shadow-2xl space-y-6 bg-blue-500/[0.03]">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <Lightbulb className="text-blue-400" size={22} /> Estratégia Recomendada
            </h3>
            <div className="relative p-6 bg-blue-500/10 rounded-[32px] border border-blue-500/20 overflow-hidden">
               <Zap className="absolute -top-4 -right-4 text-blue-500/20" size={80} />
               <p className="text-sm text-blue-100 leading-relaxed font-medium relative z-10">
                 {insights?.strategicAdvice}
               </p>
            </div>
            <button className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-slate-950 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
              Executar Deploy de Nicho <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralInsights;
