
import React, { useMemo } from 'react';
import { 
  Users as UsersIcon, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Award,
  BarChart2,
  Instagram,
  Cake,
  Gift,
  Zap,
  Activity,
  Box
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  Legend
} from 'recharts';
import { Lead, KanbanStage, DashboardStats, User, AISettings } from '../types';

interface DashboardProps {
  leads: Lead[];
  stages: KanbanStage[];
  users: User[];
  aiSettings: AISettings;
}

const Dashboard: React.FC<DashboardProps> = ({ leads, stages, users, aiSettings }) => {
  const stats: DashboardStats = {
    totalLeads: leads.length,
    conversionRate: 15.2,
    aiResponseRate: 92,
    avgResponseTime: "32s",
    leadsPerStage: leads.reduce((acc, lead) => {
      acc[lead.stage_id] = (acc[lead.stage_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    attendantStats: users.map(u => ({
      name: u.name,
      totalServices: leads.filter(l => l.assigned_to === u.id).length,
      totalClosings: leads.filter(l => l.assigned_to === u.id && l.stage_id === 's5').length
    }))
  };

  const todayBirthdays = useMemo(() => {
    const today = new Date();
    const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return leads.filter(l => l.birthday && l.birthday.includes(mmdd));
  }, [leads]);

  const stageChartData = stages.sort((a,b) => a.order_position - b.order_position).map(s => ({
    name: s.name,
    value: stats.leadsPerStage[s.id] || 0
  }));

  const COLORS = ['#fbbf24', '#34d399', '#f87171', '#818cf8', '#e879f9', '#22d3ee'];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white font-heading tracking-tight">Overview Central</h1>
          <p className="text-slate-500 text-sm font-medium">Relatórios analíticos da rede MóveisIA</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900/50 border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-3">
              <Activity size={18} className="text-amber-500" />
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Tempo de Resposta</p>
                <p className="text-sm font-bold text-white">~32 seg</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Leads Totais" value={stats.totalLeads.toString()} icon={<UsersIcon />} color="blue" trend="+8%" />
        <StatCard title="Fechamentos" value={leads.filter(l => l.stage_id === 's5').length.toString()} icon={<Award />} color="amber" trend="+12%" />
        <StatCard title="Chatbot Ativo" value="48" icon={<Instagram />} color="rose" trend="+15" />
        <StatCard title="Conversão" value={`${stats.conversionRate}%`} icon={<TrendingUp />} color="emerald" trend="+1.5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-[40px] border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <BarChart3 className="text-blue-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Distribuição do Funil</h3>
            </div>
            <div className="flex gap-2">
               <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase">Real-time Data</span>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.03)'}} 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }} 
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={45}>
                  {stageChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-[40px] border-rose-500/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                <Cake className="text-rose-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Aniversariantes</h3>
            </div>
            {todayBirthdays.length > 0 ? (
              <div className="space-y-4">
                {todayBirthdays.map(lead => (
                  <div key={lead.id} className="flex items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-rose-500 border border-slate-700">
                        <Gift size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{lead.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{lead.phone || 'WhatsApp'}</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-rose-400 uppercase bg-rose-400/10 px-3 py-1.5 rounded-full border border-rose-400/20 hover:bg-rose-400 hover:text-white transition-all">
                      Enviar 10%
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center flex flex-col items-center gap-4">
                 <Box size={40} className="text-slate-800" />
                 <p className="text-slate-500 text-sm font-medium">Ninguém celebrando hoje.</p>
              </div>
            )}
          </div>

          <div className="glass p-8 rounded-[40px] border-white/5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-3 tracking-widest uppercase">
              <Activity size={16} className="text-emerald-500" /> Conversão
            </h3>
            <div className="space-y-5">
              <ChannelStat label="WhatsApp" value={64} color="#10b981" />
              <ChannelStat label="Instagram" value={36} color="#ec4899" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChannelStat: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-bold tracking-widest">
      <span className="text-slate-400 uppercase">{label}</span>
      <span style={{ color }}>{value}%</span>
    </div>
    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
      <div className="h-full rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }}></div>
    </div>
  </div>
);

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; trend: string }> = ({ title, value, icon, color, trend }) => {
  const colors: any = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
  };

  return (
    <div className="glass p-8 rounded-[40px] border-white/5 shadow-xl hover:translate-y-[-5px] transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl border transition-all duration-500 group-hover:scale-110 ${colors[color]}`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
          <ArrowUpRight size={12} /> {trend}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight font-heading group-hover:text-amber-400 transition-colors">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
