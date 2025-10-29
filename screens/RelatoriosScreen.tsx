import React, { useState, useEffect, useMemo } from 'react';
import { Safra, Usuario, RelatorioData } from '../types';
import { 
    getSafrasByUsuario, 
    getPropriedadeById, 
    getOperacoesBySafra, 
    getCustosVariaveisBySafra, 
    getColheitasBySafra,
    getProdutos,
    getCustosFixosByUsuario,
    getMaquinariosByUsuario,
    getBenfeitoriasByUsuario,
    // FIX: Added 'getPropriedadesByUsuario' to fetch properties for cost calculation.
    getPropriedadesByUsuario
} from '../database';
import { 
    calculateTotalReceita, 
    calculateTotalCustosVariaveis,
    calculateTotalCustosFixos,
    calculateLucroBruto, 
    calculateROI, 
    calculateRentabilidadePorHa 
} from '../utils/calculations';
import { generatePdf } from '../utils/pdfGenerator';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from '../components/Icon';

const RelatoriosScreen: React.FC<{
  currentUser: Usuario;
  onNavigateBack: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}> = ({ currentUser, onNavigateBack, showToast }) => {
    const [safras, setSafras] = useState<Safra[]>([]);
    const [selectedSafraIds, setSelectedSafraIds] = useState<number[]>([]);

    useEffect(() => {
        setSafras(getSafrasByUsuario(currentUser));
    }, [currentUser]);

    const handleSelectSafra = (safraId: number) => {
        setSelectedSafraIds(prev => 
            prev.includes(safraId) 
            ? prev.filter(id => id !== safraId)
            : [...prev, safraId]
        );
    };

    const reportsData = useMemo<RelatorioData[]>(() => {
        if (selectedSafraIds.length === 0) return [];
        
        return selectedSafraIds.map(safraId => {
            const safra = safras.find(s => s.id === safraId);
            if(!safra) return null;

            const propriedade = getPropriedadeById(safra.propriedade_id);
            if(!propriedade) return null;

            const allProdutos = getProdutos();
            const operacoesRaw = getOperacoesBySafra(safra.id);
            const operacoes = operacoesRaw.map(op => ({
                ...op,
                nome_produto: op.nome_produto || (op.produto_id ? allProdutos.find(p => p.id === op.produto_id)?.nome : undefined),
            }));
            const custosVariaveis = getCustosVariaveisBySafra(safra.id);
            const colheitas = getColheitasBySafra(safra.id);

            const totalReceita = calculateTotalReceita(colheitas);
            const totalCustosVariaveis = calculateTotalCustosVariaveis(operacoes, custosVariaveis);
            
            const custosFixosManuais = getCustosFixosByUsuario(currentUser.id);
            const maquinarios = getMaquinariosByUsuario(currentUser);
            const benfeitorias = getBenfeitoriasByUsuario(currentUser);
            // FIX: Fetched properties to pass as the required fourth argument to 'calculateTotalCustosFixos'.
            const propriedades = getPropriedadesByUsuario(currentUser);
            const totalCustosFixosAnual = calculateTotalCustosFixos(custosFixosManuais, maquinarios, benfeitorias, propriedades);

            const startDate = new Date(safra.data_inicio);
            const endDate = safra.data_fim ? new Date(safra.data_fim) : new Date();
            const durationDays = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
            const totalCustosFixos = (totalCustosFixosAnual / 365) * durationDays;

            const totalCustos = totalCustosVariaveis + totalCustosFixos;
            const lucroBruto = calculateLucroBruto(totalReceita, totalCustos);

            return {
                ...safra,
                propriedade,
                operacoes,
                custosVariaveis: custosVariaveis,
                colheitas,
                resultados: {
                    totalReceita,
                    totalCustos,
                    totalCustosFixos,
                    totalCustosVariaveis,
                    lucroBruto,
                    roi: calculateROI(lucroBruto, totalCustos),
                    rentabilidadePorHa: calculateRentabilidadePorHa(totalReceita, safra.area_ha),
                }
            }
        }).filter((item): item is RelatorioData => item !== null);
        
    }, [selectedSafraIds, safras, currentUser]);
    
    const handleGenerateReport = () => {
        if (reportsData.length > 0) {
            try {
                generatePdf(reportsData);
                showToast("Relatório PDF gerado com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao gerar PDF:", error);
                showToast("Erro ao gerar PDF. Verifique os dados.", "error");
            }
        } else {
            showToast("Selecione pelo menos uma safra para gerar o relatório.", "error");
        }
    };

    return (
        <ScreenWrapper title="Relatórios" onNavigateBack={onNavigateBack}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Gerar Relatório de Safra</h2>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Selecione uma ou mais safras</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2 border dark:border-gray-600 rounded-md">
                        {safras.map(s => (
                            <div key={s.id} className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id={`safra-${s.id}`} 
                                    checked={selectedSafraIds.includes(s.id)}
                                    onChange={() => handleSelectSafra(s.id)}
                                    className="h-4 w-4 rounded"
                                />
                                <label htmlFor={`safra-${s.id}`} className="ml-2 text-gray-800 dark:text-gray-200">{s.nome}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleGenerateReport}
                    disabled={reportsData.length === 0}
                    className="w-full flex items-center justify-center gap-2 bg-epagri-red text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition text-lg disabled:bg-gray-400"
                >
                    <Icon name="document-arrow-down" className="w-6 h-6"/>
                    Gerar Relatório PDF ({selectedSafraIds.length})
                </button>
            </div>
        </ScreenWrapper>
    );
};

export default RelatoriosScreen;
