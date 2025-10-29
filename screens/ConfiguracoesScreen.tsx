// screens/ConfiguracoesScreen.tsx
import React, { useState, useEffect } from 'react';
import { Usuario, Propriedade } from '../types';
import { getPropriedadesByUsuario, deletePropriedade } from '../services/database';
import ScreenWrapper from '../components/ScreenWrapper';
import PropriedadeForm from './PropriedadeForm';

interface ConfiguracoesScreenProps {
  currentUser: Usuario;
  onNavigateBack: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const ConfiguracoesScreen: React.FC<ConfiguracoesScreenProps> = ({ currentUser, onNavigateBack, showToast }) => {
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [editingPropriedade, setEditingPropriedade] = useState<Propriedade | null>(null);

  const refreshPropriedades = () => setPropriedades(getPropriedadesByUsuario(currentUser));

  useEffect(refreshPropriedades, [currentUser]);

  const handleDelete = (id: number) => {
    if (confirm("Deseja realmente excluir esta propriedade?")) {
      deletePropriedade(id);
      refreshPropriedades();
      showToast("Propriedade excluída com sucesso!", "success");
    }
  };

  return (
    <ScreenWrapper title="Configurações" onNavigateBack={onNavigateBack}>
      {editingPropriedade && (
        <PropriedadeForm
          currentUser={currentUser}
          initialData={editingPropriedade}
          onClose={() => setEditingPropriedade(null)}
          onSave={() => { setEditingPropriedade(null); refreshPropriedades(); showToast("Propriedade salva!", "success"); }}
        />
      )}

      <div className="mb-6 flex justify-end">
        <button onClick={() => setEditingPropriedade({} as Propriedade)} className="flex items-center gap-2 bg-epagri-red text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700">
          Adicionar Propriedade
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-600">
              <th className="py-2">Nome</th>
              <th>Localização</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {propriedades.length > 0 ? propriedades.map(p => (
              <tr key={p.id} className="border-b dark:border-gray-700">
                <td className="py-2">{p.nome}</td>
                <td>{p.localizacao}</td>
                <td className="text-center flex justify-center gap-2">
                  <button onClick={() => setEditingPropriedade(p)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Editar</button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Excluir</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={3} className="text-center py-4">Nenhuma propriedade cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </ScreenWrapper>
  );
};

export default ConfiguracoesScreen;
