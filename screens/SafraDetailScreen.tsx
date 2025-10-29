import React, { useState, useEffect } from 'react';
import { Safra, Usuario, Propriedade } from '../types';
import { getSafraById, updateSafra, getPropriedadesByUsuario, inativateSafra } from '../database';
import ScreenWrapper from '../components/ScreenWrapper';
import { formatDate } from '../utils/calculations';
import Icon from '../components/Icon';

// The edit form, similar to SafraForm
const SafraEditForm: React.FC<{
    safra: Safra;
    currentUser: Usuario;
    onClose: () => void;
    onSave: (updatedSafra: Safra) => void;
}> = ({ safra, currentUser, onClose, onSave }) => {
    const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
    const [formData, setFormData] = useState({...safra, analise_solo: safra.analise_solo || {}});

    useEffect(() => {
        setPropriedades(getPropriedadesByUsuario(currentUser));
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: name === 'area_ha' || name === 'propriedade_id' ? parseFloat(value) : value }));
    }

    const handleAnaliseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            analise_solo: {
                ...(prev.analise_solo || {}),
                [name]: value ? parseFloat(value) : undefined,
            }
        }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updated = updateSafra(safra.id, formData);
        if (updated) {
            onSave(updated);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4 overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold mb-4">Editar Safra</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="nome" placeholder="Nome da Safra (ex: Soja Verão 23/24)" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    <select name="propriedade_id" value={formData.propriedade_id} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700">
                        {propriedades.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                    <input type="text" name="cultura" placeholder="Cultura" value={formData.cultura} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    <input type="text" name="variedade" placeholder="Variedade" value={formData.variedade} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    <input type="number" step="0.1" name="area_ha" placeholder="Área (ha)" value={formData.area_ha} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    <input type="date" name="data_inicio" value={formData.data_inicio} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    <div>
                        <label htmlFor="data_fim" className="text-sm text-gray-600 dark:text-gray-400">Data de Fim (opcional)</label>
                        <input type="date" id="data_fim" name="data_fim" value={formData.data_fim || ''} onChange={handleChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    </div>
                     <details className="mt-4 p-3 border rounded-md dark:border-gray-600" open={!!Object.values(safra.analise_solo || {}).some(v => v)}>
                        <summary className="font-semibold cursor-pointer">Análise de Solo (Opcional)</summary>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                            <input type="number" step="0.1" name="ph_solo" placeholder="pH do Solo" value={formData.analise_solo?.ph_solo || ''} onChange={handleAnaliseChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                            <input type="number" step="0.1" name="fosforo_ppm" placeholder="Fósforo (ppm)" value={formData.analise_solo?.fosforo_ppm || ''} onChange={handleAnaliseChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                            <input type="number" step="0.1" name="potassio_ppm" placeholder="Potássio (ppm)" value={formData.analise_solo?.potassio_ppm || ''} onChange={handleAnaliseChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                            <input type="number" step="0.1" name="calcio_cmolc" placeholder="Cálcio (cmolc/dm³)" value={formData.analise_solo?.calcio_cmolc || ''} onChange={handleAnaliseChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                            <input type="number" step="0.1" name="magnesio_cmolc" placeholder="Magnésio (cmolc/dm³)" value={formData.analise_solo?.magnesio_cmolc || ''} onChange={handleAnaliseChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                            <input type="number" step="0.1" name="aluminio_cmolc" placeholder="Alumínio (cmolc/dm³)" value={formData.analise_solo?.aluminio_cmolc || ''} onChange={handleAnaliseChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                            <input type="number" step="0.1" name="materia_organica_percent" placeholder="Matéria Orgânica (%)" value={formData.analise_solo?.materia_organica_percent || ''} onChange={handleAnaliseChange} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
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


const SafraDetailScreen: React.FC<{
  safraId: number;
  currentUser: Usuario;
  onNavigateBack: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}> = ({ safraId, currentUser, onNavigateBack, showToast }) => {
    const [safra, setSafra] = useState<Safra | null>(null);
    const [propriedade, setPropriedade] = useState<Propriedade | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showInactivateConfirm, setShowInactivateConfirm] = useState(false);

    useEffect(() => {
        const safraData = getSafraById(safraId);
        if (safraData) {
            setSafra(safraData);
            const propData = getPropriedadesByUsuario(currentUser).find(p => p.id === safraData.propriedade_id);
            if (propData) {
                setPropriedade(propData);
            }
        } else {
            showToast('Safra não encontrada.', 'error');
            onNavigateBack();
        }
    }, [safraId, onNavigateBack, showToast, currentUser]);

    const handleSave = (updatedSafra: Safra) => {
        setSafra(updatedSafra);
        setIsEditing(false);
        showToast("Safra atualizada com sucesso!", "success");
    }

    const handleInactivate = () => {
        if (safra) {
            inativateSafra(safra.id);
            setShowInactivateConfirm(false);
            showToast("Safra inativada! Lembre-se de fazer uma nova análise de solo.", "success");
            onNavigateBack();
        }
    };


    if (!safra) {
        return <ScreenWrapper title="Carregando..." onNavigateBack={onNavigateBack}><p>Carregando dados da safra...</p></ScreenWrapper>;
    }

    return (
        <ScreenWrapper title={`Detalhes da Safra`} onNavigateBack={onNavigateBack}>
            {isEditing && <SafraEditForm safra={safra} currentUser={currentUser} onClose={() => setIsEditing(false)} onSave={handleSave} />}
            {showInactivateConfirm && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm m-4">
                        <h2 className="text-xl font-bold mb-4">Inativar Safra</h2>
                        <p>Tem certeza de que deseja inativar a safra "{safra.nome}"? Os dados ainda poderão ser consultados no histórico.</p>
                        <div className="flex justify-end gap-4 pt-4 mt-4">
                            <button onClick={() => setShowInactivateConfirm(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancelar</button>
                            <button onClick={handleInactivate} className="px-4 py-2 bg-red-600 text-white rounded-md">Confirmar Inativação</button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4 dark:border-gray-700 gap-4">
                    <h2 className="text-2xl font-bold text-epagri-red">{safra.nome}</h2>
                    <div className="flex gap-2">
                         <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">
                            <Icon name="pencil-square" className="w-5 h-5" /> Editar
                        </button>
                        {safra.ativa && (
                             <button onClick={() => setShowInactivateConfirm(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700">
                                <Icon name="trash" className="w-5 h-5" /> Inativar
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                    <p><strong>Propriedade:</strong> {propriedade?.nome || 'N/A'}</p>
                    <p><strong>Cultura:</strong> {safra.cultura}</p>
                    <p><strong>Variedade:</strong> {safra.variedade}</p>
                    <p><strong>Área:</strong> {safra.area_ha} ha</p>
                    <p><strong>Data de Início:</strong> {formatDate(safra.data_inicio)}</p>
                    <p><strong>Data de Fim:</strong> {safra.data_fim ? formatDate(safra.data_fim) : 'Em andamento'}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-sm ${safra.ativa ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>{safra.ativa ? 'Ativa' : 'Inativa'}</span></p>
                </div>
            </div>
        </ScreenWrapper>
    );
}

export default SafraDetailScreen;
