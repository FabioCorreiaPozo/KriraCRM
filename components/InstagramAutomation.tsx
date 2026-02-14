
import React, { useState } from 'react';
import { InstagramPost } from '../types';
import { 
  Instagram, 
  Bot, 
  MessageSquare, 
  ToggleRight, 
  ToggleLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Clock,
  Layout
} from 'lucide-react';

interface InstagramAutomationProps {
  posts: InstagramPost[];
  setPosts: React.Dispatch<React.SetStateAction<InstagramPost[]>>;
}

const InstagramAutomation: React.FC<InstagramAutomationProps> = ({ posts, setPosts }) => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(posts[0]?.id || null);

  const selectedPost = posts.find(p => p.id === selectedPostId);

  const updatePost = (updates: Partial<InstagramPost>) => {
    if (!selectedPostId) return;
    setPosts(prev => prev.map(p => p.id === selectedPostId ? { ...p, ...updates } : p));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
            <Instagram size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Automação de Conteúdo</h1>
            <p className="text-sm text-slate-500">Configure como a IA Malu deve responder a comentários em posts e stories específicos.</p>
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl flex items-center gap-3">
          <Zap size={18} className="text-rose-600" />
          <div className="text-xs font-bold text-rose-800 uppercase tracking-tight">Status: Chatbot Ativo</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Selection Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-18rem)]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Publicações Recentes</span>
              <Layout size={14} className="text-slate-300" />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {posts.map(post => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`w-full p-4 flex items-center gap-4 transition-all hover:bg-slate-50 ${
                    selectedPostId === post.id ? 'bg-rose-50 border-r-4 border-r-rose-600' : ''
                  }`}
                >
                  <img 
                    src={post.thumbnail_url} 
                    alt="thumb" 
                    className="w-14 h-14 rounded-xl object-cover shadow-sm border border-slate-200"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                        post.type === 'post' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {post.type}
                      </span>
                      <span className="text-[8px] text-slate-400 uppercase font-bold">Hoje</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium truncate">{post.caption}</p>
                    {post.auto_reply_active && (
                      <span className="text-[8px] font-bold text-emerald-600 flex items-center gap-1 mt-1 uppercase">
                         <Sparkles size={8} /> Automação ON
                      </span>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPost ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-6">
                  <img 
                    src={selectedPost.thumbnail_url} 
                    alt="preview" 
                    className="w-32 h-32 rounded-2xl object-cover shadow-lg border border-slate-200"
                  />
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-800 text-lg">Detalhes da Publicação</h3>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-md italic">"{selectedPost.caption}"</p>
                    <div className="flex items-center gap-2 pt-2">
                      <Clock size={14} className="text-slate-300" />
                      <span className="text-xs text-slate-400">Postado em {new Date(selectedPost.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Resposta Automática</p>
                      <p className="text-xs font-bold text-slate-700 text-right">{selectedPost.auto_reply_active ? 'HABILITADA' : 'DESATIVADA'}</p>
                    </div>
                    <button 
                      onClick={() => updatePost({ auto_reply_active: !selectedPost.auto_reply_active })}
                      className={`${selectedPost.auto_reply_active ? 'text-rose-600' : 'text-slate-300'}`}
                    >
                      {selectedPost.auto_reply_active ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Bot size={14} className="text-rose-600" /> Instrução Específica da IA Malu
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2 px-1">Dê orientações exclusivas sobre este móvel ou conteúdo. A IA usará isso ao responder comentários.</p>
                  <textarea 
                    rows={6}
                    value={selectedPost.custom_instruction || ''}
                    onChange={e => updatePost({ custom_instruction: e.target.value })}
                    placeholder="Ex: Este sofá é o modelo Chesterfield em veludo. Comente sobre o acabamento artesanal e convide o cliente para o direct para enviarmos a tabela de tecidos..."
                    className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-3xl text-sm outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-rose-50 rounded-3xl border border-rose-100 space-y-3">
                    <div className="flex items-center gap-2 text-rose-800">
                      <MessageSquare size={18} />
                      <h4 className="text-sm font-bold">Comportamento do Chatbot</h4>
                    </div>
                    <ul className="space-y-2">
                      <li className="text-[10px] text-rose-700 flex items-start gap-2">
                        <div className="mt-1.5 w-1 h-1 bg-rose-400 rounded-full" />
                        <span>Responde o comentário na postagem mencionando o autor.</span>
                      </li>
                      <li className="text-[10px] text-rose-700 flex items-start gap-2">
                        <div className="mt-1.5 w-1 h-1 bg-rose-400 rounded-full" />
                        <span>Inicia uma conversa privada (Direct) automaticamente.</span>
                      </li>
                      <li className="text-[10px] text-rose-700 flex items-start gap-2">
                        <div className="mt-1.5 w-1 h-1 bg-rose-400 rounded-full" />
                        <span>Contextualiza o assunto baseado na imagem do post.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 space-y-3">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Sparkles size={18} />
                      <h4 className="text-sm font-bold">Exemplo de Resposta</h4>
                    </div>
                    <div className="bg-white/60 p-3 rounded-xl border border-blue-100 italic">
                      <p className="text-[10px] text-blue-700">
                        "Oi @cliente! Esse sofá Chesterfield é maravilhoso mesmo ✨ Te mandei uma mensagem no Direct com as opções de veludo disponíveis, dá uma olhadinha!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center space-y-4">
              <Instagram size={48} className="mx-auto text-slate-100" />
              <p className="text-slate-400 text-sm">Selecione uma publicação ao lado para configurar a automação.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramAutomation;
