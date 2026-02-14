
import React, { useState } from 'react';
import { Users, UserPlus, Search, Edit, Trash2, Mail, MapPin, Calendar, Smartphone, Instagram } from 'lucide-react';
import { Lead } from '../types';

interface CustomerListProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

const CustomerList: React.FC<CustomerListProps> = ({ leads, setLeads }) => {
  const [filter, setFilter] = useState('');

  const filtered = leads.filter(l => 
    l.name.toLowerCase().includes(filter.toLowerCase()) || 
    l.phone?.includes(filter) || 
    l.email?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Base de Clientes</h1>
          <p className="text-slate-500 text-sm">Gerenciamento completo dos dados cadastrais dos seus leads e clientes.</p>
        </div>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-100">
          <UserPlus size={18} /> Novo Cadastro
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 w-96 shadow-sm">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome, e-mail ou telefone..." 
              className="bg-transparent border-none outline-none text-sm w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filtered.length} Clientes</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identificação</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contatos</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nascimento</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Localização</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interesse</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        {customer.source === 'whatsapp' ? <Smartphone size={18} /> : <Instagram size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{customer.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Origem: {customer.source}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    {customer.phone && <p className="text-xs text-slate-600 flex items-center gap-2"><Smartphone size={12}/> {customer.phone}</p>}
                    {customer.email && <p className="text-xs text-slate-600 flex items-center gap-2"><Mail size={12}/> {customer.email}</p>}
                    {!customer.phone && !customer.email && <span className="text-[10px] text-rose-400 font-bold uppercase">Sem contato</span>}
                  </td>
                  <td className="px-6 py-4">
                    {customer.birthday ? (
                      <p className="text-xs text-slate-700 flex items-center gap-2">
                        <Calendar size={12} className="text-amber-500"/> {new Date(customer.birthday).toLocaleDateString('pt-br')}
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-300 font-medium">Não informado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    {customer.address ? (
                      <p className="text-xs text-slate-600 truncate flex items-center gap-2"><MapPin size={12}/> {customer.address}</p>
                    ) : (
                      <span className="text-[10px] text-slate-300">Endereço pendente</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 uppercase tracking-tight">
                      {customer.interest_product || 'Geral'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={16}/></button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-20 text-center space-y-3">
              <Users size={48} className="mx-auto text-slate-200" />
              <p className="text-slate-400 font-medium">Nenhum cliente encontrado com este filtro.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
