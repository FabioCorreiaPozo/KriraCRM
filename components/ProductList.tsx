
import React, { useState } from 'react';
import { Package, Plus, Search, Edit, Trash2, X, Image as ImageIcon, Check, Loader2, UploadCloud } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductList: React.FC<ProductListProps> = ({ products, setProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    active: true,
    images: []
  });
  const [filter, setFilter] = useState('');

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        active: true,
        images: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } as Product : p));
    } else {
      const newProduct: Product = {
        id: `p-${Date.now()}`,
        company_id: 'c1',
        ...formData,
      } as Product;
      setProducts(prev => [...prev, newProduct]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente remover este produto do catálogo?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleImageUpload = (index: number) => {
    // Simulating file upload - in a real app, use a file input and FileReader
    const fakeImageUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=400`;
    const newImages = [...(formData.images || [])];
    newImages[index] = fakeImageUrl;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white font-heading">Catálogo de Produtos</h1>
          <p className="text-slate-500 text-sm font-medium">Estes itens são utilizados pela Malu para converter leads.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105"
        >
          <Plus size={20} /> Novo Lançamento
        </button>
      </div>

      <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-slate-950/20 flex justify-between items-center">
          <div className="relative flex items-center gap-4 bg-slate-900/50 px-6 py-2 rounded-2xl border border-white/5 w-96 group">
            <Search size={18} className="text-slate-500 group-focus-within:text-amber-500" />
            <input 
              type="text" 
              placeholder="Filtrar por nome ou categoria..." 
              className="bg-transparent border-none outline-none text-sm w-full text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{filteredProducts.length} itens encontrados</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Produto</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Categoria</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Preço Sugerido</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Disponibilidade</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center relative">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={24} className="text-slate-600" />
                        )}
                        <div className="absolute top-1 right-1 bg-amber-500 text-[8px] font-bold text-slate-950 px-1 rounded">
                           {product.images?.length || 0}/6
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-white tracking-wide text-sm">{product.name}</p>
                        <p className="text-[10px] text-slate-500 max-w-[200px] truncate uppercase font-bold tracking-tighter">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-amber-500">
                    R$ {product.price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${product.active ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-slate-700 shadow-transparent'}`}></div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${product.active ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {product.active ? 'Deploy Ativo' : 'Em Pausa'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => openModal(product)}
                        className="p-3 bg-slate-800 text-blue-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all border border-white/5"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-3 bg-slate-800 text-rose-400 hover:text-white hover:bg-rose-600 rounded-xl transition-all border border-white/5"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-24 text-center space-y-4">
               <Package size={64} className="mx-auto text-slate-900" />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Nenhum móvel registrado no terminal.</p>
            </div>
          )}
        </div>
      </div>

      {/* Futuristic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={closeModal}></div>
          <div className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[48px] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  <Package className="text-amber-500" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-heading">{editingProduct ? 'Ajustar Configuração de Produto' : 'Deploy de Novo Produto'}</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Terminal MóveisIA v4.0</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-3 bg-slate-900 rounded-2xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-white/5">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Nome do Produto</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-900 border border-white/10 px-6 py-4 rounded-3xl outline-none focus:border-amber-500 text-white font-medium transition-all"
                      placeholder="Ex: Sofá Chesterfield Blue"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Categoria / Linha</label>
                    <input 
                      required
                      type="text" 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-900 border border-white/10 px-6 py-4 rounded-3xl outline-none focus:border-amber-500 text-white font-medium transition-all"
                      placeholder="Ex: Sala de Estar"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Preço Sugerido (R$)</label>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="w-full bg-slate-900 border border-white/10 px-6 py-4 rounded-3xl outline-none focus:border-amber-500 text-white font-medium transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Disponibilidade</label>
                      <div className="flex items-center gap-4 h-[56px] bg-slate-900 border border-white/10 px-6 rounded-3xl">
                        <span className="text-xs font-bold text-slate-400 uppercase flex-1">{formData.active ? 'Ativo' : 'Pausado'}</span>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, active: !formData.active})}
                          className={`w-12 h-6 rounded-full transition-all relative ${formData.active ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.active ? 'right-1' : 'left-1'}`}></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Descrição Técnica (IA Info)</label>
                    <textarea 
                      required
                      rows={8}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-slate-900 border border-white/10 px-6 py-4 rounded-[32px] outline-none focus:border-amber-500 text-white font-medium transition-all resize-none text-sm leading-relaxed"
                      placeholder="Detalhes que a IA usará para vender..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Galeria do Produto (Máx 6 fotos)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="group relative aspect-square rounded-[24px] bg-slate-900 border-2 border-dashed border-white/10 flex flex-col items-center justify-center transition-all hover:border-amber-500/50 hover:bg-amber-500/5 overflow-hidden">
                      {formData.images?.[i] ? (
                        <>
                          <img src={formData.images[i]} alt={`img-${i}`} className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => removeImage(i)}
                            className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => handleImageUpload(i)}
                          className="flex flex-col items-center gap-2 text-slate-600 hover:text-amber-500 transition-all p-4 w-full h-full"
                        >
                          <UploadCloud size={24} />
                          <span className="text-[8px] font-bold uppercase">Signal {i+1}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10 flex justify-end gap-6 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-10 py-4 bg-slate-900 text-slate-400 rounded-3xl font-bold uppercase text-[10px] tracking-widest hover:text-white transition-all border border-white/5"
                >
                  Abortar Missão
                </button>
                <button 
                  type="submit"
                  className="px-12 py-4 bg-amber-500 text-slate-950 rounded-3xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center gap-2"
                >
                  <Check size={18} /> {editingProduct ? 'Atualizar Dados' : 'Efetuar Deploy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
