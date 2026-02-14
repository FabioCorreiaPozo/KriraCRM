
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lead, KanbanStage, User, UserRole } from '../types';
import { 
  MoreVertical, 
  MessageCircle, 
  Instagram, 
  User as UserIcon, 
  Clock,
  Plus,
  UserCheck,
  Zap,
  MessageSquareShare
} from 'lucide-react';

interface KanbanBoardProps {
  leads: Lead[];
  stages: KanbanStage[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  currentUser: User;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, stages, setLeads, currentUser }) => {
  const navigate = useNavigate();
  
  const filteredLeads = leads.filter(l => 
    currentUser.role === UserRole.ADMIN || 
    !l.assigned_to || 
    l.assigned_to === currentUser.id
  );

  const onDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, stageId: string) => {
    const leadId = e.dataTransfer.getData('leadId');
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage_id: stageId } : l));
  };

  const openQuickChat = (leadId: string) => {
    navigate(`/chat?leadId=${leadId}`);
  };

  return (
    <div className="flex flex-col gap-10 h-[calc(100vh-12rem)] animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white font-heading tracking-tight">Pipeline Control</h1>
          <p className="text-slate-500 text-sm font-medium">Orquestração de fluxo comercial inteligente</p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105">
          <Plus size={20} /> Deploy Manual Lead
        </button>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-8 h-full scrollbar-hide snap-x">
        {stages.sort((a, b) => a.order_position - b.order_position).map(stage => (
          <div 
            key={stage.id}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, stage.id)}
            className="flex-shrink-0 w-80 flex flex-col glass p-6 h-full rounded-[40px] border-white/5 snap-start shadow-xl"
          >
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#fbbf24]"></div>
                <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">{stage.name}</h3>
                <span className="bg-white/5 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-500 border border-white/5">
                  {filteredLeads.filter(l => l.stage_id === stage.id).length}
                </span>
              </div>
              <button className="text-slate-600 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-1 scrollbar-hide">
              {filteredLeads
                .filter(l => l.stage_id === stage.id)
                .map(lead => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, lead.id)}
                    className={`bg-slate-900/60 p-6 rounded-[32px] border transition-all duration-300 cursor-grab active:cursor-grabbing group hover:scale-[1.02] relative ${
                      lead.assigned_to === currentUser.id 
                        ? 'border-amber-500/40 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.3)] bg-amber-500/[0.03]' 
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    {/* Floating Quick Action Button */}
                    <button 
                      onClick={() => openQuickChat(lead.id)}
                      className="absolute top-4 right-4 p-2.5 bg-amber-500 text-slate-950 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg shadow-amber-500/20 z-10"
                      title="Abrir Conversa Imediata"
                    >
                      <MessageSquareShare size={16} />
                    </button>

                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center border shadow-sm ${
                          lead.source === 'whatsapp' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        }`}>
                          {lead.source === 'whatsapp' ? <MessageCircle size={14} /> : <Instagram size={14} />}
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em]">{lead.source}</span>
                      </div>
                      
                      {lead.assigned_to && (
                        <div className="flex items-center gap-1.5 text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20 mr-8 group-hover:mr-12 transition-all">
                          <Zap size={10} className="fill-current" />
                          <span className="text-[8px] font-bold uppercase tracking-widest">Active</span>
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-white text-sm mb-1 tracking-wide font-heading">{lead.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">{lead.interest_product || 'General inquiry'}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock size={12} />
                        <span className="text-[9px] font-bold uppercase">1h signal</span>
                      </div>
                      <div className="flex -space-x-3">
                         {lead.assigned_to ? (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-950 font-bold shadow-lg">
                              {lead.assigned_to === 'u2' ? 'J' : 'M'}
                            </div>
                         ) : (
                            <div className="w-8 h-8 rounded-xl bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-600 font-bold" title="Aguardando Operador">
                              ?
                            </div>
                         )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
