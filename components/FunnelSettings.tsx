
import React, { useState } from 'react';
import { KanbanStage } from '../types';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  Layers,
  ArrowDown,
  ArrowUp
} from 'lucide-react';

interface FunnelSettingsProps {
  stages: KanbanStage[];
  setStages: React.Dispatch<React.SetStateAction<KanbanStage[]>>;
}

const FunnelSettings: React.FC<FunnelSettingsProps> = ({ stages, setStages }) => {
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const addStage = () => {
    const newStage: KanbanStage = {
      id: `s${Date.now()}`,
      company_id: 'c1',
      name: 'Nova Etapa',
      order_position: stages.length + 1
    };
    setStages([...stages, newStage]);
  };

  const deleteStage = (id: string) => {
    setStages(stages.filter(s => s.id !== id));
  };

  const startEdit = (stage: KanbanStage) => {
    setEditingStageId(stage.id);
    setEditName(stage.name);
  };

  const saveEdit = () => {
    if (!editingStageId) return;
    setStages(stages.map(s => s.id === editingStageId ? { ...s, name: editName } : s));
    setEditingStageId(null);
  };

  const move = (index: number, direction: 'up' | 'down') => {
    const newStages = [...stages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStages.length) return;
    
    [newStages[index], newStages[targetIndex]] = [newStages[targetIndex], newStages[index]];
    
    // Reset order positions
    const reordered = newStages.map((s, idx) => ({ ...s, order_position: idx + 1 }));
    setStages(reordered);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Pipeline de Vendas</h1>
            <p className="text-sm text-slate-500">Personalize o funil de vendas conforme o seu processo comercial.</p>
          </div>
        </div>
        <button 
          onClick={addStage}
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-200"
        >
          <Plus size={20} /> Adicionar Etapa
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estrutura do Funil</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">{stages.length} Etapas Totais</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {stages.sort((a,b) => a.order_position - b.order_position).map((stage, index) => (
            <div key={stage.id} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors group">
              <div className="flex flex-col gap-1">
                <button onClick={() => move(index, 'up')} className="text-slate-300 hover:text-amber-600 disabled:opacity-30" disabled={index === 0}>
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => move(index, 'down')} className="text-slate-300 hover:text-amber-600 disabled:opacity-30" disabled={index === stages.length - 1}>
                  <ArrowDown size={14} />
                </button>
              </div>

              <div className="flex-1 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                  {stage.order_position}
                </div>
                
                {editingStageId === stage.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)}
                      className="flex-1 bg-white border border-amber-300 px-3 py-1.5 rounded-lg text-sm outline-none ring-2 ring-amber-100"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingStageId(null)} className="p-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <p className="font-bold text-slate-700">{stage.name}</p>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(stage)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteStage(stage.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
        <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm">
          <GripVertical size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900 mb-1">Dica de Gestão</h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            As etapas aqui configuradas refletem diretamente no quadro Kanban. A IA Malu utilizará os nomes das etapas para decidir onde mover cada cliente baseado na conversa. Tente nomes claros como "Proposta Enviada" ou "Aguardando Medidas".
          </p>
        </div>
      </div>
    </div>
  );
};

export default FunnelSettings;
