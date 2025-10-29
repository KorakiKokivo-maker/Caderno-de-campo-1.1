import React, { useState, useEffect } from 'react';
import { Safra, Usuario, Propriedade, AnaliseSolo } from '../types';
import { getSafrasByUsuario, addSafra, getPropriedadesByUsuario, inativateSafra, reactivateSafra } from '../database';
import ScreenWrapper from '../components/ScreenWrapper';
import { formatDate } from '../utils/calculations';
import Icon from '../components/Icon';

const SafraForm: React.FC<{
    currentUser: Usuario;
    onClose: () => void;
    onSave: () => void;
}> = ({ currentUser, onClose, onSave }) => {
    const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
    const [formData, setFormData] = useState<Omit<Safra, 'id' | 'ativa'>>({
        usuario_id: currentUser.id,
        propriedade_id: 0,
        nome: '',
        cultura: '',
        variedade: '',
        area_ha: 0,
        data_inicio: new Date().toISOString().split('T')[0],
        analise_solo: {}
    });
    const [noProperties, setNoProperties] = useState(false);

    useEffect(() => {
        const userProps = getPropriedadesByUsuario(currentUser);
        setPropriedades(userProps);
        if (userProps.length > 0) {
            setFormData(prev => ({ ...prev, propriedade_id: userProps[0].id }));
        } else {
            setNoProperties(true);
        }
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
                ...prev.analise_solo,
                [name]: value ? parseFloat(value) : undefined,
            }
        }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (noProperties || formData.propriedade_id === 0) {
            alert("É necessário cadastrar e selecionar uma propriedade primeiro.");
            return;
        }
        addSafra(formData);
        onSave();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Nova Safra</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     {noProperties ? (
                        <p className="text-red-500 text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-md">
                            Nenhuma propriedade encontrada. Por favor, cadastre uma na tela de 'Configurações' antes de criar uma safra.
                        </p>
                    ) : (
                        <select name="propriedade_id" value={formData.propriedade_id} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700">
                            <option value={0} disabled>Selecione uma propriedade</option>
                            {propriedades.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                    )}
                    <input type="text" name="nome" placeholder="Nome da Safra (ex: Soja Verão 23/24)" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    <input type="text" name="cultura" placeholder="Cultura" value={formData.cultura} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    <input type="text" name="variedade" placeholder="Variedade" value={formData.variedade} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    <input type="number" step="0.1" name="area_ha" placeholder="Área (ha)" value={formData.area_ha || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    <input type="date" name="data_inicio" value={formData.data_inicio} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
                    
                    <details className="mt-4 p-3 border rounded-md dark:border-gray-600">
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
                        <button type="submit" disabled={noProperties} className="px-4 py-2 bg-epagri-red text-white rounded-md disabled:bg-gray-400">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const SafrasScreen: React.FC<{
  currentUser: Usuario;
  onNavigateBack: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onViewDetails: (safraId: number) => void;
}> = ({ currentUser, onNavigateBack, showToast, onViewDetails }) => {
    const [safras, setSafras] = useState<Safra[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [showInactive, setShowInactive] = useState(false);

    const refreshSafras = () => {
        setSafras(getSafrasByUsuario(currentUser));
    };

    useEffect(refreshSafras, [currentUser]);
    
    const handleSave = () => {
        showToast("Safra adicionada com sucesso!", "success");
        setIsFormOpen(false);
        refreshSafras();
    };

    const handleInactivate = (id: number) => {
        inativateSafra(id);
        showToast("Safra inativada! Lembre-se de fazer uma nova análise de solo.", "success");
        refreshSafras();
    }

    const handleReactivate = (id: number) => {
        reactivateSafra(id);
        showToast("Safra restaurada com sucesso!", "success");
        refreshSafras();
    }
    
    const filteredSafras = safras.filter(s => showInactive ? !s.ativa : s.ativa);

    return (
        <ScreenWrapper title="Minhas Safras" onNavigateBack={onNavigateBack}>
            {isFormOpen && <SafraForm currentUser={currentUser} onClose={() => setIsFormOpen(false)} onSave={handleSave} />}
            
            <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="showInactive" checked={showInactive} onChange={() => setShowInactive(!showInactive)} className="h-4 w-4 rounded" />
                    <label htmlFor="showInactive">Mostrar safras inativas</label>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-epagri-red text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700">
                    <Icon name="plus" className="w-5 h-5"/> Nova Safra
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSafras.length > 0 ? filteredSafras.map(safra => (
                    <div key={safra.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-epagri-red truncate">{safra.nome}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{safra.cultura} - {safra.variedade}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{safra.area_ha} ha</p>
                            <p className="text-sm mt-2">Início: {formatDate(safra.data_inicio)}</p>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            {safra.ativa ? (
                                <button onClick={() => handleInactivate(safra.id)} className="text-sm text-red-500 hover:underline">Inativar</button>
                            ) : (
                                <button onClick={() => handleReactivate(safra.id)} className="text-sm text-green-500 hover:underline">Restaurar</button>
                            )}
                            <button onClick={() => onViewDetails(safra.id)} className="text-sm font-semibold text-epagri-red hover:underline">Ver Detalhes</button>
                        </div>
                    </div>
                )) : (
                    <p className="col-span-full text-center text-gray-500">Nenhuma safra encontrada.</p>
                )}
            </div>
        </ScreenWrapper>
    );
};

export default SafrasScreen;
