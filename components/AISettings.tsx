
import React, { useState } from 'react';
import { 
  Save, 
  Bot, 
  Cake, 
  ToggleRight, 
  ToggleLeft,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { AISettings, Product } from '../types';

interface AISettingsProps {
  settings: AISettings;
  setSettings: React.Dispatch<React.SetStateAction<AISettings>>;
  products: Product[];
}

const AISettingsComponent: React.FC<AISettingsProps> = ({ settings, setSettings }) => {
  const [formData, setFormData] = useState<AISettings>(settings);

  return (
    <div className="max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white font-heading">Neural Config</h1>
          <p className="text-slate-500 text-sm">Otimize o comportamento da malha de atendimento</p>
        </div>
        <button 
          onClick={() => setSettings(formData)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)]"
        >
          <Save size={18} /> Sincronizar Cérebro
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="glass p-8 rounded-[40px] border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <Bot className="text-amber-500" size={20} /> Identity Core
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Codinome da Especialista</label>
                <input 
                  type="text" 
                  value={formData.ai_name}
                  onChange={e => setFormData({...formData, ai_name: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-900 border border-white/10 rounded-2xl outline-none focus:border-amber-500 text-white"
                />
              </div>
              <div className="flex items-center justify-between p-6 bg-amber-500/5 rounded-[32px] border border-amber-500/20">
                <div className="flex items-center gap-4">
                  <Activity className="text-amber-500" />
                  <div>
                    <p className="text-sm font-bold text-white">Status Operacional</p>
                    <p className="text-[10px] text-slate-500">Malu responde automaticamente</p>
                  </div>
                </div>
                <button onClick={() => setFormData({...formData, active: !formData.active})}>
                  {formData.active ? <ToggleRight size={32} className="text-amber-500" /> : <ToggleLeft size={32} className="text-slate-700" />}
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] border-rose-500/10 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <Cake className="text-rose-500" size={20} /> Growth Marketing
            </h3>
            <div className="flex items-center justify-between p-6 bg-rose-500/5 rounded-[32px] border border-rose-500/20">
              <div className="flex items-center gap-4">
                <Sparkles className="text-rose-500" />
                <div>
                  <p className="text-sm font-bold text-white">B-Day Automation</p>
                  <p className="text-[10px] text-slate-500">Cupom de 10% OFF automático</p>
                </div>
              </div>
              <button onClick={() => setFormData({...formData, birthday_automation_active: !formData.birthday_automation_active})}>
                {formData.birthday_automation_active ? <ToggleRight size={32} className="text-rose-500" /> : <ToggleLeft size={32} className="text-slate-700" />}
              </button>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
               <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Margem de Desconto IA</span>
                  <span className="text-xs font-bold text-white">{formData.max_discount_percent}%</span>
               </div>
               <input 
                type="range" min="0" max="20" 
                value={formData.max_discount_percent} 
                onChange={e => setFormData({...formData, max_discount_percent: parseInt(e.target.value)})}
                className="w-full accent-amber-500"
               />
            </div>
          </div>
        </div>

        <div className="glass p-10 rounded-[40px] border-white/5 flex flex-col">
          <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-6">
            <Zap className="text-blue-500" size={20} /> Comportamento & Prompt
          </h3>
          <textarea 
            rows={15}
            value={formData.ai_behavior_prompt}
            onChange={e => setFormData({...formData, ai_behavior_prompt: e.target.value})}
            className="w-full flex-1 px-6 py-4 bg-slate-900 border border-white/10 rounded-[32px] outline-none focus:border-blue-500 text-slate-300 text-sm leading-relaxed resize-none font-medium"
            placeholder="Instrua a IA sobre postura, cadência e processos..."
          />
          <div className="mt-6 flex items-start gap-4 p-5 bg-blue-500/5 rounded-[32px] border border-blue-500/20">
             <ShieldCheck className="text-blue-400 mt-1" size={20} />
             <p className="text-[10px] text-blue-300 leading-relaxed font-medium">
               A cadência de atendimento é automática. Caso o cliente não responda em 24h, a Malu enviará um sinal de acompanhamento entre 08:00 e 19:00.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettingsComponent;
