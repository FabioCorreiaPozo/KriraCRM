
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Send, 
  User as UserIcon, 
  Bot, 
  Smartphone, 
  CheckCheck,
  Pause,
  MessageSquare,
  Lock,
  HandMetal,
  Wand2,
  Loader2,
  PhoneCall,
  Zap,
  Sparkles
} from 'lucide-react';
import { Lead, Message, Sender, AISettings, Product, KanbanStage, Channel, User, UserRole } from '../types';
import { GeminiService } from '../services/geminiService';

interface ChatWindowProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  aiSettings: AISettings;
  products: Product[];
  stages: KanbanStage[];
  currentUser: User;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ leads, setLeads, aiSettings, products, stages, currentUser }) => {
  const [searchParams] = useSearchParams();
  const leadIdFromUrl = searchParams.get('leadId');

  const filteredLeads = leads.filter(l => 
    currentUser.role === UserRole.ADMIN || !l.assigned_to || l.assigned_to === currentUser.id
  );

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leadIdFromUrl || filteredLeads[0]?.id || null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', lead_id: 'l1', sender: Sender.CLIENT, content: 'Olá, gostaria de saber o valor do sofá.', timestamp: new Date().toISOString(), channel: Channel.WHATSAPP },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const gemini = new GeminiService();
  const selectedLead = leads.find(l => l.id === selectedLeadId);

  // Sync selection if URL param changes
  useEffect(() => {
    if (leadIdFromUrl && leadIdFromUrl !== selectedLeadId) {
      setSelectedLeadId(leadIdFromUrl);
    }
  }, [leadIdFromUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedLeadId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedLeadId || !selectedLead) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      lead_id: selectedLeadId,
      sender: Sender.USER, 
      content: inputText,
      timestamp: new Date().toISOString(),
      channel: selectedLead.source,
      sender_user_id: currentUser.id
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    if (!selectedLead.assigned_to) {
      setLeads(prev => prev.map(l => l.id === selectedLeadId ? { ...l, is_human_takeover: true, assigned_to: currentUser.id } : l));
    }
  };

  const simulateNewWhatsAppLead = async () => {
    const phone = `+55119${Math.floor(10000000 + Math.random() * 90000000)}`;
    const msg = "Olá, vi o anúncio e amei a Mesa de Jantar de Carvalho! Qual o preço?";
    
    setIsTyping(true);
    const { stage_id, interest } = await gemini.classifyIntent(msg, stages);
    
    const newLead: Lead = {
      id: `l-wa-${Date.now()}`,
      company_id: 'c1',
      name: `WhatsApp Lead (${phone.slice(-4)})`,
      phone: phone,
      source: Channel.WHATSAPP,
      stage_id: stage_id || 's1',
      last_message_at: new Date().toISOString(),
      is_human_takeover: false,
      interest_product: interest || 'Interesse Detectado'
    };

    setLeads(prev => [newLead, ...prev]);
    setSelectedLeadId(newLead.id);
    setMessages(prev => [...prev, {
      id: `m-wa-${Date.now()}`,
      lead_id: newLead.id,
      sender: Sender.CLIENT,
      content: msg,
      timestamp: new Date().toISOString(),
      channel: Channel.WHATSAPP
    }]);

    if (aiSettings.active) {
      const aiResponse = await gemini.generateResponse(aiSettings, products, [], msg, newLead);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          lead_id: newLead.id,
          sender: Sender.AI,
          content: aiResponse,
          timestamp: new Date().toISOString(),
          channel: Channel.WHATSAPP
        }]);
        setIsTyping(false);
      }, 1500);
    } else {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-14rem)] glass rounded-[40px] border-white/5 shadow-2xl overflow-hidden animate-in zoom-in duration-500">
      <div className="w-80 border-r border-white/5 flex flex-col bg-slate-950/20">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest">Ativos</h3>
          <button onClick={simulateNewWhatsAppLead} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 transition-all border border-emerald-500/20 shadow-lg" title="Simular Entrada WhatsApp">
            <PhoneCall size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredLeads.map(lead => (
            <button
              key={lead.id}
              onClick={() => setSelectedLeadId(lead.id)}
              className={`w-full p-5 rounded-[32px] transition-all flex items-center gap-4 text-left border ${
                selectedLeadId === lead.id ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.2)]' : 'border-transparent hover:bg-white/5'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10">
                <UserIcon size={20} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm truncate tracking-wide">{lead.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                   <span className="text-[9px] text-slate-500 font-bold uppercase truncate">{lead.interest_product || 'General Inquiry'}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-950/30 relative">
        {selectedLead ? (
          <>
            <div className="h-20 bg-white/5 border-b border-white/5 px-8 flex items-center justify-between z-10 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-amber-500 font-bold shadow-lg">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm tracking-wide">{selectedLead.name}</h3>
                  <div className="flex items-center gap-2">
                    <Smartphone size={10} className="text-slate-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{selectedLead.source}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {selectedLead.assigned_to === currentUser.id ? (
                  <button className="flex items-center gap-2 px-5 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                    <Pause size={14} /> Encerrar Humano
                  </button>
                ) : (
                  <button onClick={() => setLeads(prev => prev.map(l => l.id === selectedLeadId ? { ...l, assigned_to: currentUser.id } : l))} className="bg-amber-500 text-slate-950 px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20">
                    <HandMetal size={14} /> Assumir Signal
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-6">
              {messages.filter(m => m.lead_id === selectedLeadId).map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === Sender.CLIENT ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[60%] rounded-[32px] p-6 shadow-2xl border transition-all ${
                    msg.sender === Sender.CLIENT ? 'bg-slate-900 border-white/5 text-slate-300' : 
                    msg.sender === Sender.AI ? 'bg-amber-500/20 border-amber-500/30 text-amber-100' : 
                    'bg-slate-200 text-slate-950 font-medium'
                  }`}>
                    <div className="flex items-center gap-2 mb-2 opacity-50">
                       <span className="text-[8px] font-bold uppercase tracking-[0.2em]">
                         {msg.sender === Sender.CLIENT ? 'Ext. Signal' : msg.sender === Sender.AI ? 'Neural Core' : 'Operator'}
                       </span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-slate-900/50 px-6 py-4 rounded-3xl border border-white/5 flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-8 bg-white/5 border-t border-white/5">
              <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
                <div className="relative">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Injetar comando de resposta..."
                    className="w-full bg-slate-950/50 border border-white/10 pl-8 pr-20 py-4 rounded-[32px] text-sm focus:border-amber-500 transition-all text-white placeholder:text-slate-700"
                  />
                  {inputText.trim() && (
                    <button type="button" onClick={async () => setInputText(await gemini.correctAndSuggestText(inputText, [], aiSettings))} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 p-2 hover:bg-amber-500/10 rounded-full transition-all">
                      <Wand2 size={18} />
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center px-4">
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={12} className="text-amber-500" /> IA Core Analisando Fluxo
                  </span>
                  <button type="submit" disabled={!inputText.trim()} className="bg-amber-500 hover:bg-amber-400 text-slate-950 p-4 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all disabled:opacity-30">
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-700 space-y-4">
            <Zap size={48} className="opacity-10" />
            <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-30">Selecione um Terminal</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
