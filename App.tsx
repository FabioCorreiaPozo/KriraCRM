
import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Columns, 
  MessageSquare, 
  Package, 
  Users,
  Bot,
  Link as LinkIcon,
  Home,
  Search,
  SearchX,
  Cpu,
  Zap,
  Bell,
  Layers,
  Instagram as InstagramIcon,
  CalendarDays,
  BrainCircuit,
  Calendar
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import ChatWindow from './components/ChatWindow';
import AISettingsComponent from './components/AISettings';
import ProductList from './components/ProductList';
import Connections from './components/Connections';
import FunnelSettings from './components/FunnelSettings';
import InstagramAutomation from './components/InstagramAutomation';
import CustomerList from './components/CustomerList';
import NeuralInsights from './components/NeuralInsights';
import InstagramScheduler from './components/InstagramScheduler';

import { Lead, KanbanStage, Product, AISettings, Channel, Company, User, UserRole, InstagramPost, ScheduledPost } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>({ 
    id: 'u1', company_id: 'c1', name: 'Ricardo Admin', email: 'admin@moveisia.com', role: UserRole.ADMIN 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [stages, setStages] = useState<KanbanStage[]>([
    { id: 's1', company_id: 'c1', name: 'Novo Lead', order_position: 1 },
    { id: 's2', company_id: 'c1', name: 'Qualificado', order_position: 2 },
    { id: 's3', company_id: 'c1', name: 'Proposta', order_position: 3 },
    { id: 's5', company_id: 'c1', name: 'Fechado', order_position: 5 },
  ]);

  const [aiSettings, setAiSettings] = useState<AISettings>({
    id: 'ai1',
    company_id: 'c1',
    ai_name: 'Malu',
    ai_tone: 'acolhedora e especialista em decoração',
    ai_behavior_prompt: 'Especialista em móveis planejados de alto padrão.',
    max_discount_percent: 5,
    active: true,
    birthday_automation_active: true
  });

  const [products, setProducts] = useState<Product[]>([
    { id: 'p1', company_id: 'c1', name: 'Sofá Minimalista', description: 'Tecido linho premium, design escandinavo, ideal para salas compactas.', price: 2499.0, category: 'Sala', active: true, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'] },
    { id: 'p2', company_id: 'c1', name: 'Mesa de Jantar', description: 'Carvalho maciço com acabamento em verniz fosco. Comporta 6 pessoas.', price: 1890.0, category: 'Cozinha', active: true, images: ['https://images.unsplash.com/photo-1530018607912-eff2df114f11?w=600'] },
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    { id: 'l1', company_id: 'c1', name: 'Ricardo Oliveira', phone: '+5511988887777', source: Channel.WHATSAPP, stage_id: 's1', last_message_at: new Date().toISOString(), is_human_takeover: false, birthday: '1990-10-15' },
    { id: 'l2', company_id: 'c1', name: 'Fernanda Lima', instagram_id: 'fer_interiores', source: Channel.INSTAGRAM, stage_id: 's3', last_message_at: new Date().toISOString(), is_human_takeover: false },
  ]);

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return {
      leads: leads.filter(l => l.name.toLowerCase().includes(q) || l.phone?.includes(q)),
      products: products.filter(p => p.name.toLowerCase().includes(q)),
    };
  }, [searchQuery, leads, products]);

  const Sidebar = () => {
    const loc = useLocation();
    const nav = [
      { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { path: '/kanban', icon: <Columns size={20} />, label: 'Pipeline' },
      { path: '/chat', icon: <MessageSquare size={20} />, label: 'Conversas' },
      { path: '/insights', icon: <BrainCircuit size={20} />, label: 'Neural Insights' },
      { path: '/scheduler', icon: <Calendar size={20} />, label: 'Instagram Ads' },
      { path: '/customers', icon: <Users size={20} />, label: 'Clientes' },
      { path: '/products', icon: <Package size={20} />, label: 'Catálogo' },
      { path: '/ai-settings', icon: <Bot size={20} />, label: 'IA Config' },
    ];

    return (
      <aside className="w-64 bg-slate-950/90 backdrop-blur-2xl h-screen fixed left-0 top-0 border-r border-white/5 flex flex-col z-50">
        <div className="p-8 flex items-center gap-4">
          <div className="bg-amber-500 p-2.5 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.5)]">
            <Cpu className="text-slate-950" size={24} />
          </div>
          <span className="font-bold text-xl text-white font-heading tracking-tight">MóveisIA</span>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-2">
          {nav.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                loc.pathname === item.path ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {item.icon} <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    );
  };

  return (
    <HashRouter>
      <div className="flex bg-[#020617] min-h-screen text-slate-300">
        <Sidebar />
        <main className="flex-1 ml-64 p-10 relative">
          <header className="flex items-center justify-between mb-12">
            <div className="relative w-96 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-600 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Pesquisar leads, produtos..." 
                className="w-full bg-slate-900/50 border border-white/5 pl-12 pr-4 py-3 rounded-2xl text-sm outline-none focus:border-amber-500/50 transition-all text-white"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
              />
              {showSearchResults && searchResults && (
                <div className="absolute top-full left-0 right-0 mt-3 glass-bright rounded-[32px] shadow-2xl z-[100] border border-white/10 max-h-[400px] overflow-y-auto animate-in slide-in-from-top-2 duration-300">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest px-2">Busca Neural</span>
                    <button onClick={() => setShowSearchResults(false)}><SearchX size={14} /></button>
                  </div>
                  <div className="p-4 space-y-4">
                    {searchResults.leads.length > 0 && (
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-2 px-2">Leads</p>
                        {searchResults.leads.map(l => (
                          <Link key={l.id} to="/chat" onClick={() => setShowSearchResults(false)} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5">
                            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-400">{l.name.charAt(0)}</div>
                            <span className="text-sm font-medium text-white">{l.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.products.length > 0 && (
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-2 px-2">Produtos</p>
                        {searchResults.products.map(p => (
                          <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Package size={14} /></div>
                            <span className="text-sm font-medium text-white">{p.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-amber-500/10 px-5 py-2 rounded-full border border-amber-500/20">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_#fbbf24]"></div>
                <span className="text-xs font-bold text-white uppercase tracking-widest">Admin Online</span>
              </div>
              <button className="p-3 bg-slate-900 rounded-2xl border border-white/5 text-slate-500 hover:text-white transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              </button>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Dashboard leads={leads} stages={stages} users={[]} aiSettings={aiSettings} />} />
            <Route path="/kanban" element={<KanbanBoard leads={leads} stages={stages} setLeads={setLeads} currentUser={currentUser} />} />
            <Route path="/chat" element={<ChatWindow leads={leads} setLeads={setLeads} aiSettings={aiSettings} products={products} stages={stages} currentUser={currentUser} />} />
            <Route path="/insights" element={<NeuralInsights leads={leads} products={products} />} />
            <Route path="/scheduler" element={<InstagramScheduler products={products} scheduledPosts={scheduledPosts} setScheduledPosts={setScheduledPosts} />} />
            <Route path="/customers" element={<CustomerList leads={leads} setLeads={setLeads} />} />
            <Route path="/products" element={<ProductList products={products} setProducts={setProducts} />} />
            <Route path="/funnel-settings" element={<FunnelSettings stages={stages} setStages={setStages} />} />
            <Route path="/ai-settings" element={<AISettingsComponent settings={aiSettings} setSettings={setAiSettings} products={products} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
