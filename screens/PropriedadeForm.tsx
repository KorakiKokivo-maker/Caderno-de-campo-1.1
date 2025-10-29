// screens/PropriedadeForm.tsx
import React, { useState } from 'react';
import { Usuario, Propriedade } from '../types';
import { addPropriedade, updatePropriedade } from '../database';
import FormModal from '../components/FormModal';
import { formatDate } from '../utils/calculations';

interface PropriedadeFormProps {
  currentUser: Usuario;
  initialData?: Propriedade;
  onClose: () => void;
  onSave: () => void;
}

const PropriedadeForm: React.FC<PropriedadeFormProps> = ({ currentUser, initialData, onClose, onSave }) => {
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
    setFormData(prev => ({...prev, [name]: isNumber ? (value ? parseFloat(value) : undefined) : value }));
  };

  const handleSubmit = () => {
    if(!formData.nome || !formData.localizacao) {
      alert("Preencha nome e localização.");
      return;
    }
    if(initialData?.id) {
      updatePropriedade(initialData.id, formData);
    } else {
      addPropriedade(formData);
    }
    onSave();
  };

  return (
    <FormModal title={initialData ? "Editar Propriedade" : "Nova Propriedade"} onClose={onClose} onSave={handleSubmit}>
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
    </FormModal>
  );
};

export default PropriedadeForm;
