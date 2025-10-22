// FIX: Replaced the entire file with proper type definitions to resolve circular dependencies and module errors.

export type PerfilUsuario = 'Produtor' | 'Técnico';

export interface Usuario {
  id: number;
  nome: string;
  nome_de_usuario: string;
  senha?: string;
  perfil: PerfilUsuario;
  foto_url?: string;
}

export interface Propriedade {
    id: number;
    usuario_id: number;
    nome: string;
    localizacao: string;
    latitude?: number;
    longitude?: number;
    valor_financiado?: number;
    num_parcelas?: number;
    parcelas_pagas?: number;
    data_inicio_pagamento?: string;
}

export interface AnaliseSolo {
    ph_solo?: number;
    fosforo_ppm?: number;
    potassio_ppm?: number;
    calcio_cmolc?: number;
    magnesio_cmolc?: number;
    aluminio_cmolc?: number;
    materia_organica_percent?: number;
}

export interface Safra {
  id: number;
  usuario_id: number;
  propriedade_id: number;
  nome: string;
  cultura: string;
  variedade: string;
  area_ha: number;
  data_inicio: string;
  data_fim?: string;
  ativa: boolean;
  analise_solo?: AnaliseSolo;
}

export type TipoOperacao = 'Plantio' | 'Defensivo' | 'Adubação e Correção' | 'Irrigação' | 'Preparo do Solo' | 'Tratamento Adicional' | 'Tratos Culturais' | 'Outra';

export interface CondicoesClimaticas {
    temperatura?: number;
    umidade?: number;
    vento?: 'Leve' | 'Médio' | 'Forte';
    clima?: 'Ensolarado' | 'Nublado' | 'Chuvoso' | 'Outro';
}

export interface OperacaoCampo {
    id: number;
    safra_id: number;
    data: string;
    tipo: TipoOperacao;
    custo: number;
    produto_id?: number;
    nome_produto?: string;
    dose?: number;
    volume_calda?: number;
    ph_agua?: number;
    carencia_dias?: number;
    forma_aplicacao?: string;
    metodo_irrigacao?: string;
    tempo_irrigacao?: number;
    observacoes?: string;
    condicoes_climaticas?: CondicoesClimaticas;
}

export type TipoCustoVariavel = 'Mão de Obra' | 'Transporte' | 'Armazenamento' | 'Diesel' | 'Manutenção' | 'Outro';

export interface CustoVariavel {
    id: number;
    safra_id: number;
    data: string;
    tipo: TipoCustoVariavel;
    descricao: string;
    valor: number;
}

export type TipoCustoFixo = 'Seguro' | 'Juros' | 'Impostos' | 'Outro';

export interface CustoFixo {
    id: number;
    usuario_id: number;
    data: string;
    descricao: string;
    categoria: TipoCustoFixo;
    valor: number;
}

export interface Colheita {
    id: number;
    safra_id: number;
    data: string;
    quantidade: number;
    unidade: 'kg' | 't' | 'saca';
    preco_unitario: number;
    responsavel: string;
}

export interface Maquinario {
    id: number;
    usuario_id: number;
    nome: string;
    tipo: string;
    valor_inicial: number;
    vida_util_anos: number;
    vida_util_horas: number;
    valor_residual_percentual: number;
    segurado: boolean;
    valor_financiado?: number;
    num_parcelas?: number;
    parcelas_pagas?: number;
}

export interface Benfeitoria {
    id: number;
    usuario_id: number;
    nome: string;
    descricao?: string;
    valor_total: number;
    data_inicio_pagamento: string;
    num_parcelas: number;
    parcelas_pagas: number;
    valor_financiado?: number; // Added for compatibility with calculation functions
}

export interface Produto {
    id: number;
    nome: string;
    unidade: 'kg' | 'L' | 'saca';
    preco_unitario: number;
}

export interface ResultadosSafra {
    totalReceita: number;
    totalCustos: number;
    totalCustosVariaveis: number;
    totalCustosFixos: number;
    lucroBruto: number;
    roi: number;
    rentabilidadePorHa: number;
}

export interface RelatorioData extends Safra {
    propriedade: Propriedade;
    operacoes: OperacaoCampo[];
    custosVariaveis: CustoVariavel[];
    colheitas: Colheita[];
    resultados: ResultadosSafra;
}
