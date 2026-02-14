
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Instagram, 
  Package, 
  Check, 
  X, 
  Loader2, 
  Sparkles, 
  Trash2, 
  CalendarDays,
  ChevronRight,
  Zap,
  Layout,
  ImageIcon,
  // Fix: Added Bot import from lucide-react
  Bot
} from 'lucide-react';
import { Product, ScheduledPost } from '../types';
import { GeminiService } from '../services/geminiService';

interface InstagramSchedulerProps {
  products: Product[];
  scheduledPosts: ScheduledPost[];
  setScheduledPosts: React.Dispatch<React.SetStateAction<ScheduledPost[]>>;
}

const InstagramScheduler: React.FC<InstagramSchedulerProps> = ({ products, scheduledPosts, setScheduledPosts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    date: '',
    time: '',
    caption: ''
  });

  const gemini = new GeminiService();
  const activeProducts = products.filter(p => p.active);

  const handleProductChange = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    setLoading(true);
    const caption = await gemini.generateInstagramCaption(product);
    setFormData(prev => ({ ...prev, product_id: productId, caption }));
    setLoading(false);
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id || !formData.date || !formData.time) return;

    const newPost: ScheduledPost = {
      id: `sp-${Date.now()}`,
      product_id: formData.product_id,
      scheduled_at: `${formData.date}T${formData.time}`,
      caption: formData.caption,
      status: 'pending'
    };

    setScheduledPosts(prev => [...prev, newPost].sort((a, b) => 
      new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
    ));
    setIsModalOpen(false);
    setFormData({ product_id: '', date: '', time: '', caption: '' });
  };

  const removePost = (id: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white font-heading">Instagram Scheduler</h1>
          <p className="text-slate-500 text-sm font-medium">Orquestre publicações automáticas do seu catálogo ativo.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-500 hover:bg-rose-400 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:scale-105"
        >
          <Plus size={20} /> Agendar Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-[40px] border-white/5 space-y-8 min-h-[500px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
              <CalendarDays className="text-rose-500" size={24} /> Próximas Publicações
            </h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{scheduledPosts.length} agendamentos ativos</span>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[600px] scrollbar-hide">
            {scheduledPosts.length > 0 ? (
              scheduledPosts.map(post => {
                const product = products.find(p => p.id === post.product_id);
                const dateObj = new Date(post.scheduled_at);
                return (
                  <div key={post.id} className="bg-slate-900/50 p-6 rounded-[32px] border border-white/5 flex items-center gap-6 group hover:border-rose-500/30 transition-all">
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                      {product?.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-full h-full p-6 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 uppercase tracking-widest">Post Agendado</span>
                        <h4 className="font-bold text-white text-sm truncate">{product?.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 italic leading-relaxed">"{post.caption}"</p>
                      <div className="flex items-center gap-4 pt-2">
                         <div className="flex items-center gap-1.5 text-slate-400">
                            <Calendar size={12} />
                            <span className="text-[10px] font-bold uppercase">{dateObj.toLocaleDateString('pt-br')}</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock size={12} />
                            <span className="text-[10px] font-bold uppercase">{dateObj.toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removePost(post.id)}
                      className="p-3 bg-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-white/5 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-24 text-center space-y-4">
                 <div className="w-20 h-20 bg-slate-900 rounded-[32px] border border-white/5 flex items-center justify-center mx-auto text-slate-700">
                    <Calendar size={40} />
                 </div>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Fila de automação vazia.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
           <div className="glass p-8 rounded-[40px] border-amber-500/10 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-3 tracking-tight">
                 <Zap className="text-amber-500" size={22} /> Motor de Engajamento
              </h3>
              <div className="p-6 bg-amber-500/5 rounded-[32px] border border-amber-500/20 space-y-4">
                 <div className="flex items-start gap-4">
                    <Sparkles className="text-amber-500 shrink-0" size={20} />
                    <p className="text-xs text-amber-100/70 leading-relaxed font-medium">
                      O agendador seleciona automaticamente produtos com estoque ativo. A Malu criará legendas otimizadas para converter seguidores em leads no direct.
                    </p>
                 </div>
                 <div className="h-px bg-amber-500/10"></div>
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span>Performance Estimada</span>
                    <span className="text-amber-500">+25% Reach</span>
                 </div>
              </div>
           </div>

           <div className="glass p-8 rounded-[40px] border-rose-500/10 bg-rose-500/[0.03] space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-3 tracking-tight">
                 <Layout className="text-rose-400" size={22} /> Status da Rede
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                    <div className="flex items-center gap-3">
                       <Instagram size={16} className="text-rose-500" />
                       <span className="text-xs font-bold text-white">Instagram API</span>
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                    <div className="flex items-center gap-3">
                       <Bot size={16} className="text-amber-500" />
                       <span className="text-xs font-bold text-white">Gemini Social Core</span>
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Scheduler Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[48px] border-white/10 shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                  <Calendar className="text-rose-500" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-heading">Programar Nova Campanha</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Configuração de Broadcast Neural</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-900 rounded-2xl text-slate-500 hover:text-rose-500 transition-all border border-white/5">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Selecionar Produto Ativo</label>
                  <select 
                    required
                    value={formData.product_id}
                    onChange={e => handleProductChange(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 px-6 py-4 rounded-3xl outline-none focus:border-rose-500 text-white font-medium transition-all appearance-none"
                  >
                    <option value="">Selecione um móvel...</option>
                    {activeProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - R$ {p.price.toLocaleString('pt-br')}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Data do Signal</label>
                    <input 
                      required
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-slate-900 border border-white/10 px-6 py-4 rounded-3xl outline-none focus:border-rose-500 text-white font-medium transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Hora do Signal</label>
                    <input 
                      required
                      type="time"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="w-full bg-slate-900 border border-white/10 px-6 py-4 rounded-3xl outline-none focus:border-rose-500 text-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                    Legenda Gerada por IA
                    {loading && <Loader2 className="animate-spin text-rose-500" size={14} />}
                  </label>
                  <textarea 
                    rows={6}
                    value={formData.caption}
                    onChange={e => setFormData({...formData, caption: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 px-6 py-4 rounded-[32px] outline-none focus:border-rose-500 text-white text-sm leading-relaxed transition-all resize-none font-medium"
                    placeholder="Selecione um produto para que a Malu crie a legenda perfeita..."
                  />
                  {!loading && formData.product_id && (
                    <button 
                      type="button" 
                      onClick={() => handleProductChange(formData.product_id)}
                      className="absolute bottom-4 right-4 text-rose-500 p-2 hover:bg-rose-500/10 rounded-full transition-all"
                      title="Regerar com IA"
                    >
                      <Sparkles size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 bg-slate-900 text-slate-400 rounded-3xl font-bold uppercase text-[10px] tracking-widest hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={!formData.product_id || loading}
                  className="px-10 py-4 bg-rose-500 text-white rounded-3xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(244,63,94,0.3)] flex items-center gap-2 disabled:opacity-30"
                >
                  <Check size={18} /> Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramScheduler;
