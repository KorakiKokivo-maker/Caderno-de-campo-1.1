import React, { useState, useEffect, useRef } from 'react';
import { Usuario, Propriedade } from '../types';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from '../components/Icon';
import { getPropriedadesByUsuario, addPropriedade, updatePropriedade, deletePropriedade, updateUser } from '../services/database';

const PropriedadeForm: React.FC<{
    currentUser: Usuario;
    initialData?: Omit<Propriedade, 'id'>;
    onClose: () => void;
    onSave: () => void;
    propriedadeId?: number;
}> = ({ currentUser, initialData, onClose, onSave, propriedadeId }) => {
    const [formData, setFormData] = useState<Omit<Propriedade, 'id'>>({
        usuario_id: currentUser.id,
        nome: initialData?.nome || '',
        localizacao: initialData?.localizacao || '',
        latitude: initialData?.latitude,
        longitude: initialData?.longitude,
        valor_financiado: initialData?.valor_financiado,
        num_parcelas: initialData?.num_parcelas,
        parcelas_pagas: initialData?.parcelas_pagas,
        data_inicio_pagamento: initialData?.data_inicio_pagamento,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isNumber = ['latitude', 'longitude', 'valor_financiado', 'num_parcelas', 'parcelas_pagas'].includes(name);
        setFormData(prev => ({
            ...prev,
            [name]: isNumber ? (value ? parseFloat(value) : undefined) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.nome || !formData.localizacao) {
            alert("Por favor, preencha os campos de nome e localização.");
            return;
        }
        if(propriedadeId !== undefined) {
            updatePropriedade(propriedadeId, formData);
        } else {
            addPropriedade(formData);
        }
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{propriedadeId !== undefined ? 'Editar Propriedade' : 'Nova Propriedade'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="nome" placeholder="Nome da Propriedade" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    <input type="text" name="localizacao" placeholder="Localização (Cidade, UF)" value={formData.localizacao} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" step="any" name="latitude" placeholder="Latitude (Opcional)" value={formData.latitude || ''} onChange={handleChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                        <input type="number" step="any" name="longitude" placeholder="Longitude (Opcional)" value={formData.longitude || ''} onChange={handleChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    </div>

                    <details className="mt-4 p-3 border rounded-md dark:border-gray-600">
                        <summary className="font-semibold cursor-pointer">Financiamento da Terra (Opcional)</summary>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input type="number" step="0.01" name="valor_financiado" placeholder="Valor Financiado (R$)" value={formData.valor_financiado || ''} onChange={handleChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                             <input type="date" name="data_inicio_pagamento" placeholder="Início do Pagamento" value={formData.data_inicio_pagamento || ''} onChange={handleChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                             <input type="number" name="num_parcelas" placeholder="Nº de Parcelas" value={formData.num_parcelas || ''} onChange={handleChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                             <input type="number" name="parcelas_pagas" placeholder="Parcelas Pagas" value={formData.parcelas_pagas || ''} onChange={handleChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                        </div>
                    </details>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-epagri-red text-white rounded-md">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ConfiguracoesScreen: React.FC<{
  currentUser: Usuario;
  onNavigateBack: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onUpdateUser: (user: Usuario) => void;
}> = ({ currentUser, onNavigateBack, theme, setTheme, showToast, onUpdateUser }) => {
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPropriedade, setEditingPropriedade] = useState<Propriedade | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshPropriedades = () => {
    setPropriedades(getPropriedadesByUsuario(currentUser));
  }

  useEffect(() => {
    refreshPropriedades();
  }, [currentUser]);

  const handleSavePropriedade = () => {
    showToast(editingPropriedade ? "Propriedade atualizada com sucesso!" : "Propriedade adicionada com sucesso!", "success");
    setIsFormOpen(false);
    setEditingPropriedade(null);
    refreshPropriedades();
  }

  const handleEdit = (p: Propriedade) => {
    setEditingPropriedade(p);
    setIsFormOpen(true);
  }

  const handleDelete = (p: Propriedade) => {
    if(window.confirm(`Deseja realmente excluir a propriedade "${p.nome}"?`)) {
        deletePropriedade(p.id);
        showToast("Propriedade excluída com sucesso!", "success");
        refreshPropriedades();
    }
  }

  const handleProfilePicClick = () => {
      fileInputRef.current?.click();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              const updatedUser = updateUser(currentUser.id, { foto_url: base64String });
              if (updatedUser) {
                  onUpdateUser(updatedUser);
                  showToast("Foto de perfil atualizada!", "success");
              }
          };
          reader.readAsDataURL(file);
      }
  }

  return (
    <ScreenWrapper title="Configurações" onNavigateBack={onNavigateBack}>
      {isFormOpen && (
        <PropriedadeForm 
            currentUser={currentUser} 
            initialData={editingPropriedade || undefined} 
            onClose={() => { setIsFormOpen(false); setEditingPropriedade(null); }} 
            onSave={handleSavePropriedade}
            propriedadeId={editingPropriedade?.id}
        />
      )}

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6">Informações do Usuário</h2>
          <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                    src={currentUser.foto_url || '/icon.png'} 
                    alt="Foto do Perfil" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-epagri-red cursor-pointer"
                    onClick={handleProfilePicClick}
                />
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden" 
                />
              </div>
            <div className="space-y-2">
                <div><label className="block text-sm font-medium
