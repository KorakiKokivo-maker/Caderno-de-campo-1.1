import { Usuario, Propriedade, Colheita, Benfeitoria, Safra } from '../types';

// === Dados em memória ===
let usuarios: Usuario[] = [];
let propriedades: Propriedade[] = [];
let colheitas: Colheita[] = [];
let benfeitorias: Benfeitoria[] = [];
let safras: Safra[] = [];

// === Usuários ===
export const addUsuario = (usuario: Usuario) => {
    if (usuarios.some(u => u.nome_de_usuario === usuario.nome_de_usuario || (u.email && u.email === usuario.email) || (u.cpf && u.cpf === usuario.cpf))) {
        return { error: 'Usuário já cadastrado' };
    }
    usuario.id = usuarios.length + 1;
    usuarios.push(usuario);
    return usuario;
};

export const getUsuarios = () => [...usuarios];

export const updateUsuario = (id: number, updates: Partial<Usuario>) => {
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return null;
    usuarios[index] = { ...usuarios[index], ...updates };
    return usuarios[index];
};

// === Propriedades ===
export const addPropriedade = (prop: Omit<Propriedade, 'id'>) => {
    const newProp = { ...prop, id: propriedades.length + 1 };
    propriedades.push(newProp);
    return newProp;
};

export const getPropriedadesByUsuario = (usuario: Usuario) => {
    return propriedades.filter(p => p.usuario_id === usuario.id);
};

export const updatePropriedade = (id: number, updates: Partial<Propriedade>) => {
    const index = propriedades.findIndex(p => p.id === id);
    if (index === -1) return null;
    propriedades[index] = { ...propriedades[index], ...updates };
    return propriedades[index];
};

export const deletePropriedade = (id: number) => {
    propriedades = propriedades.filter(p => p.id !== id);
};

// === Colheitas ===
export const addColheita = (c: Omit<Colheita, 'id'>) => {
    const newC = { ...c, id: colheitas.length + 1 };
    colheitas.push(newC);
    return newC;
};

export const getColheitasBySafra = (safraId: number) => {
    return colheitas.filter(c => c.safra_id === safraId);
};

export const updateColheita = (id: number, updates: Partial<Colheita>) => {
    const index = colheitas.findIndex(c => c.id === id);
    if (index === -1) return null;
    colheitas[index] = { ...colheitas[index], ...updates };
    return colheitas[index];
};

export const deleteColheita = (id: number) => {
    colheitas = colheitas.filter(c => c.id !== id);
};

// === Benfeitorias ===
export const addBenfeitoria = (b: Omit<Benfeitoria, 'id'>) => {
    const newB = { ...b, id: benfeitorias.length + 1 };
    benfeitorias.push(newB);
    return newB;
};

export const getBenfeitoriasByUsuario = (usuario: Usuario) => {
    return benfeitorias.filter(b => b.usuario_id === usuario.id);
};

export const updateBenfeitoria = (id: number, updates: Partial<Benfeitoria>) => {
    const index = benfeitorias.findIndex(b => b.id === id);
    if (index === -1) return null;
    benfeitorias[index] = { ...benfeitorias[index], ...updates };
    return benfeitorias[index];
};

export const deleteBenfeitoria = (id: number) => {
    benfeitorias = benfeitorias.filter(b => b.id !== id);
};

// === Safras ===
export const addSafra = (s: Omit<Safra, 'id'>) => {
    const newS = { ...s, id: safras.length + 1 };
    safras.push(newS);
    return newS;
};

export const getSafrasByUsuario = (usuario: Usuar
