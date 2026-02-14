
import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCcw,
  QrCode,
  User,
  Lock,
  Loader2,
  Check,
  Plus,
  Trash2,
  ChevronRight,
  Circle
} from 'lucide-react';

interface InstaAccount {
  id: string;
  username: string;
  avatar?: string;
  active: boolean;
}

const Connections: React.FC = () => {
  const [whatsappState, setWhatsappState] = useState<'idle' | 'generating' | 'scanning' | 'connected'>('idle');
  
  // Instagram States
  const [instagramAccounts, setInstagramAccounts] = useState<InstaAccount[]>([
    { id: '1', username: 'moveis_design_oficial', active: true }
  ]);
  const [isAddingInsta, setIsAddingInsta] = useState(false);
  const [instagramLoading, setInstagramLoading] = useState(false);
  const [instaUser, setInstaUser] = useState('');
  const [instaPass, setInstaPass] = useState('');

  const handleConnectWhatsapp = () => {
    setWhatsappState('generating');
    setTimeout(() => {
      setWhatsappState('scanning');
    }, 2000);
  };

  const handleSimulateScan = () => {
    setWhatsappState('connected');
  };

  const handleConnectInstagram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instaUser || !instaPass) return;
    setInstagramLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAccount: InstaAccount = {
        id: Date.now().toString(),
        username: instaUser,
        active: instagramAccounts.length === 0 // Active if it's the first one
      };
      setInstagramAccounts(prev => [...prev, newAccount]);
      setInstagramLoading(false);
      setIsAddingInsta(false);
      setInstaUser('');
      setInstaPass('');
    }, 2500);
  };

  const toggleInstaActive = (id: string) => {
    setInstagramAccounts(prev => prev.map(acc => ({
      ...acc,
      active: acc.id === id
    })));
  };

  const removeInstaAccount = (id: string) => {
    setInstagramAccounts(prev => {
      const filtered = prev.filter(acc => acc.id !== id);
      // If we removed the active one, activate the first remaining one
      if (filtered.length > 0 && prev.find(acc => acc.id === id)?.active) {
        filtered[0].active = true;
      }
      return filtered;
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Conexões MóveisIA</h1>
        <p className="text-slate-500">Vincule suas redes sociais para iniciar o atendimento automatizado.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* WhatsApp Connection (QR Code) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
          
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
            <Smartphone size={32} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800">WhatsApp Business</h3>
            <p className="text-sm text-slate-500">Conecte via QR Code para sincronizar mensagens</p>
          </div>

          <div className="w-full flex flex-col items-center justify-center min-h-[320px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6">
            {whatsappState === 'idle' && (
              <div className="space-y-4">
                <QrCode size={64} className="mx-auto text-slate-300" />
                <button 
                  onClick={handleConnectWhatsapp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100"
                >
                  Gerar QR Code de Conexão
                </button>
              </div>
            )}

            {whatsappState === 'generating' && (
              <div className="space-y-3">
                <Loader2 size={48} className="mx-auto text-emerald-500 animate-spin" />
                <p className="text-sm font-medium text-slate-600">Gerando sessão segura...</p>
              </div>
            )}

            {whatsappState === 'scanning' && (
              <div className="space-y-6 w-full">
                <div className="relative mx-auto w-48 h-48 bg-white p-2 rounded-xl shadow-inner border border-slate-200">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MóveisIA-Connect-Token-Simulated" 
                    alt="QR Code" 
                    className="w-full h-full opacity-90 cursor-pointer"
                    onClick={handleSimulateScan}
                    title="Clique para simular o escaneamento"
                  />
                  <div className="absolute inset-0 border-2 border-emerald-500 rounded-xl pointer-events-none animate-pulse"></div>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>1. Abra o WhatsApp no seu celular</p>
                  <p>2. Toque em <b>Aparelhos Conectados</b></p>
                  <p>3. Aponte a câmera para esta tela</p>
                </div>
              </div>
            )}

            {whatsappState === 'connected' && (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                  <Check size={40} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Aparelho Conectado!</h4>
                  <p className="text-xs text-slate-500">iPhone 15 Pro • São Paulo, BR</p>
                </div>
                <button 
                  onClick={() => setWhatsappState('idle')}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider"
                >
                  Desconectar Aparelho
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instagram Connection (Multiple Accounts) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-rose-500"></div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-4">
              <Instagram size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Instagram Direct</h3>
            <p className="text-sm text-slate-500">Gerencie múltiplas contas para automação</p>
          </div>

          <div className="flex-1 flex flex-col min-h-[320px]">
            {isAddingInsta ? (
              <form onSubmit={handleConnectInstagram} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-slate-800">Nova Conta Instagram</h4>
                  <button type="button" onClick={() => setIsAddingInsta(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancelar</button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                    <User size={12} /> Usuário Instagram
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">@</span>
                    <input 
                      type="text" 
                      placeholder="seu_perfil"
                      value={instaUser}
                      onChange={(e) => setInstaUser(e.target.value)}
                      className="w-full bg-white border border-slate-200 pl-8 pr-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Lock size={12} /> Senha da Conta
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={instaPass}
                    onChange={(e) => setInstaPass(e.target.value)}
                    className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={instagramLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-rose-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-rose-200 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {instagramLoading ? (
                    <><Loader2 size={18} className="animate-spin" /> Autenticando...</>
                  ) : (
                    'Confirmar Login'
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                {instagramAccounts.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contas Conectadas ({instagramAccounts.length})</span>
                    </div>
                    {instagramAccounts.map(acc => (
                      <div 
                        key={acc.id}
                        className={`group p-4 rounded-2xl border transition-all flex items-center justify-between ${
                          acc.active ? 'bg-rose-50 border-rose-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            acc.active ? 'bg-white border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                          }`}>
                            <User size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">@{acc.username}</p>
                            <div className="flex items-center gap-1.5">
                              {acc.active ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase tracking-tight">
                                  <Circle size={6} fill="currentColor" /> Ativa no CRM
                                </span>
                              ) : (
                                <button 
                                  onClick={() => toggleInstaActive(acc.id)}
                                  className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-tight flex items-center gap-1"
                                >
                                  Selecionar para Monitorar
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => removeInstaAccount(acc.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                            title="Remover conta"
                          >
                            <Trash2 size={16} />
                          </button>
                          {!acc.active && (
                            <button 
                              onClick={() => toggleInstaActive(acc.id)}
                              className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                              title="Tornar ativa"
                            >
                              <ChevronRight size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => setIsAddingInsta(true)}
                      className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all font-medium text-sm"
                    >
                      <Plus size={18} /> Adicionar Outra Conta
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center space-y-4">
                    <Instagram size={48} className="mx-auto text-slate-200" />
                    <p className="text-sm text-slate-500">Nenhuma conta conectada no momento.</p>
                    <button 
                      onClick={() => setIsAddingInsta(true)}
                      className="bg-gradient-to-r from-purple-600 to-rose-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-200"
                    >
                      Começar Integração
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Status Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <ShieldCheck className="text-amber-600" size={24} />
          <h3 className="text-xl font-bold text-slate-800">Status da Segurança Operacional</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <StatusItem 
            label="Criptografia" 
            status="Ativa (AES-256)" 
            icon={<Lock size={16} className="text-emerald-500" />} 
          />
          <StatusItem 
            label="Logs de Auditoria" 
            status="Registrando" 
            icon={<RefreshCcw size={16} className="text-blue-500" />} 
          />
          <StatusItem 
            label="Verificação Meta" 
            status="Validado" 
            icon={<CheckCircle size={16} className="text-emerald-500" />} 
          />
        </div>

        <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
          <AlertCircle size={20} className="text-amber-600 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <b>Dica Profissional:</b> A MóveisIA permite monitorar múltiplas contas do Instagram simultaneamente, mas apenas uma conta ativa por vez é exibida no painel principal de métricas rápidas. Todas as mensagens de todas as contas conectadas são processadas pela IA.
          </p>
        </div>
      </div>
    </div>
  );
};

const StatusItem: React.FC<{ label: string; status: string; icon: React.ReactNode }> = ({ label, status, icon }) => (
  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
    <div className="p-2 bg-white rounded-lg shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
      <p className="text-sm font-bold text-slate-700">{status}</p>
    </div>
  </div>
);

export default Connections;
