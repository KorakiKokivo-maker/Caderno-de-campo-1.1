import { Colheita, CustoVariavel, OperacaoCampo, Maquinario, Benfeitoria, CustoFixo, Propriedade } from '../types';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('pt-BR', { timeZone: 'UTC' });
};

export const calculateTotalReceita = (colheitas: Colheita[]): number => {
  return colheitas.reduce((acc, colheita) => acc + colheita.quantidade * colheita.preco_unitario, 0);
};

export const calculateDepreciacaoAnualMaquinario = (maquinario: Maquinario): number => {
    const valorResidual = maquinario.valor_inicial * (maquinario.valor_residual_percentual / 100);
    if (maquinario.vida_util_anos <= 0) return 0;
    return (maquinario.valor_inicial - valorResidual) / maquinario.vida_util_anos;
}

export const calculateCustoAnualFinanciamento = (items: (Benfeitoria | Maquinario | Propriedade)[]): number => {
    return items.reduce((acc, item) => {
        if (!item.num_parcelas || item.num_parcelas <= 0 || !item.valor_financiado) return acc;
        const valorParcela = item.valor_financiado / item.num_parcelas;
        // Considera o custo anual (12 parcelas) se houver parcelas restantes
        const parcelasRestantes = item.num_parcelas - (item.parcelas_pagas || 0);
        const parcelasNoAno = Math.min(12, parcelasRestantes);
        return acc + (valorParcela * parcelasNoAno);
    }, 0);
};

// FIX: Added missing 'calculateCustoAnualBenfeitorias' function to resolve import error in CustosScreen.
export const calculateCustoAnualBenfeitorias = (benfeitorias: Benfeitoria[]): number => {
    return calculateCustoAnualFinanciamento(benfeitorias.map(b => ({...b, valor_financiado: b.valor_total})));
}


export const calculateTotalCustosFixos = (
    custosFixosManuais: CustoFixo[],
    maquinarios: Maquinario[],
    benfeitorias: Benfeitoria[],
    propriedades: Propriedade[],
): number => {
    const totalDepreciacao = maquinarios.reduce((acc, maq) => acc + calculateDepreciacaoAnualMaquinario(maq), 0);
    const totalBenfeitorias = calculateCustoAnualFinanciamento(benfeitorias.map(b => ({...b, valor_financiado: b.valor_total})));
    const totalFinanciamentoMaquinario = calculateCustoAnualFinanciamento(maquinarios);
    const totalFinanciamentoPropriedade = calculateCustoAnualFinanciamento(propriedades);
    const totalManual = custosFixosManuais.reduce((acc, c) => acc + c.valor, 0);
    
    return totalDepreciacao + totalBenfeitorias + totalFinanciamentoMaquinario + totalFinanciamentoPropriedade + totalManual;
}


export const calculateTotalCustosVariaveis = (operacoes: OperacaoCampo[], custosVariaveis: CustoVariavel[]): number => {
  const custoOperacoes = operacoes.reduce((acc, op) => acc + op.custo, 0);
  const custoVariaveis = custosVariaveis.reduce((acc, custo) => acc + custo.valor, 0);
  return custoOperacoes + custoVariaveis;
};

export const calculateLucroBruto = (receita: number, custos: number): number => {
  return receita - custos;
};

export const calculateROI = (lucro: number, custos: number): number => {
  if (custos === 0) return 0;
  return (lucro / custos) * 100;
};

export const calculateRentabilidadePorHa = (receita: number, area: number): number => {
  if (area === 0) return 0;
  return receita / area;
};

export const aggregateCustosPorCategoria = (operacoes: OperacaoCampo[], custosVariaveis: CustoVariavel[]) => {
    const custosAgregados: { [key: string]: number } = {};

    operacoes.forEach(op => {
        const categoria = op.tipo;
        if (!custosAgregados[categoria]) {
            custosAgregados[categoria] = 0;
        }
        custosAgregados[categoria] += op.custo;
    });

    custosVariaveis.forEach(custo => {
        const categoria = custo.tipo;
        if (!custosAgregados[categoria]) {
            custosAgregados[categoria] = 0;
        }
        custosAgregados[categoria] += custo.valor;
    });

    return Object.entries(custosAgregados).map(([name, value]) => ({ name, value }));
};