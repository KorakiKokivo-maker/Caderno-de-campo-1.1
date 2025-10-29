// screens/CustosScreen.tsx
import React, { useState, useEffect } from 'react';
import { Usuario, Custo } from '../types';
import { getCustosByUsuario, addCusto, updateCusto, deleteCusto } from '../database';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from '../components/Icon';

interface CustosScreenProps {
  currentUser: Usuario;
  onNavigateBack: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const CustosScreen: React.FC<CustosScreenProps> = ({ currentUser, onNavigateBack, showToast }) => {
  const [custos, setCustos] = useState<Custo[]>([]);
  const [editingCusto, setEditingCusto] = useState<Custo | null>(null);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState(0);

  const refreshCustos = () => setCustos(getCustosByUsuario(currentUser));

  useEffect(refreshCustos, [currentUser]);

  const handleSave = () => {
    if (editingCusto) {
      updateCusto({ ...editingCusto, nome, valor });
      showToast('Custo atualizado com sucesso!', 'success');
    } else {
      addCusto({ usuario_id: currentUser.id, nome, valor });
      showToast('Custo adicionado com sucesso!', 'success');
    }
    setEditingCusto(null);
    setNome('');
    setValor(0);
    refreshCustos();
  };

  const handleEdit = (custo: Custo) => {
    setEditingCusto(custo);
    setNome(custo.nome);
    setValor(custo.valor);
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir este custo?')) {
      deleteCusto(id);
      showToast('Custo excluído com sucesso!', 'success');
      refreshCustos();
    }
  };

  return (
    <ScreenWrapper title="Custos" onNavigateBack={onNavigateBack}>
      <div className="mb-6 flex justify-end gap-4">
        <button
          onClick={() => setEditingCusto({} as Custo)}
          className="flex items-center gap-2 bg-epagri-red text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700"
        >
          <Icon name="plus" className="w-5 h-5"/> Adicionar Custo
        </button>
      </div>

      {(editingCusto !== null) && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{editingCusto?.id ? 'Editar Custo' : 'Novo Custo'}</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome do Custo (ex: Diesel)"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="block w-full rounded-md dark:bg-gray-700 px-4 py-2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Valor (R$)"
              value={valor}
              onChange={e => setValor(parseFloat(e.target.value))}
              className="block w-full rounded-md dark:bg-gray-700 px-4 py-2"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingCusto(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-epagri-red text-white rounded-md"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-600">
              <th className="py-2">Nome</th>
              <th className="text-right">Valor (R$)</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {custos.length > 0 ? custos.map(c => (
              <tr key={c.id} className="border-b dark:border-gray-700">
                <td className="py-2">{c.nome}</td>
                <td className="text-right">{c.valor.toFixed(2)}</td>
                <td className="text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="text-center py-4">Nenhum custo registrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ScreenWrapper>
  );
};

export default CustosScreen;
