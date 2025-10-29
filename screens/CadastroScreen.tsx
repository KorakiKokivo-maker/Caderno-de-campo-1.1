import React, { useState } from 'react';
import { Usuario, PerfilUsuario } from '../types';
import { addUser, getUsers } from '../database';
import Icon from '../components/Icon';

interface CadastroScreenProps {
  onNavigateToLogin: () => void;
  onRegister: (message: string, type?: 'success' | 'error') => void;
}

const CadastroScreen: React.FC<CadastroScreenProps> = ({ onNavigateToLogin, onRegister }) => {
  const [nome, setNome] = useState('');
  const [nome_de_usuario, setNomeDeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState<PerfilUsuario>('Produtor');
  const [identificadorTipo, setIdentificadorTipo] = useState<'cpf' | 'email' | 'cpf_email'>('cpf_email');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação campos obrigatórios
    if (!nome || !nome_de_usuario || !senha) {
      setError('Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }

    if((identificadorTipo === 'cpf' || identificadorTipo === 'cpf_email') && !cpf) {
      setError('CPF é obrigatório para o tipo selecionado.');
      return;
    }

    if((identificadorTipo === 'email' || identificadorTipo === 'cpf_email') && !email) {
      setError('Email é obrigatório para o tipo selecionado.');
      return;
    }

    // Checar duplicidade
    const users = getUsers();
    const duplicate = users.find(u => 
      u.nome_de_usuario === nome_de_usuario || 
      (cpf && u.cpf === cpf) || 
      (email && u.email === email)
    );

    if(duplicate) {
      setError('Já existe um usuário com este CPF, Email ou Nome de Usuário.');
      return;
    }

    const result = addUser({ nome, nome_de_usuario, senha, perfil, cpf: cpf || undefined, email: email || undefined });

    if ('error' in result) {
      setError(result.error);
    } else {
      onRegister('Usuário cadastrado com sucesso! Faça o login.', 'success');
      onNavigateToLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-epagri-dark">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Criar Nova Conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
            <input 
              type="text" 
              placeholder="Nome Completo" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              required 
              className="appearance-none rounded-md relative block w-full px-4 py-3 border dark:bg-gray-700" 
            />
            <input 
              type="text" 
              placeholder="Nome de Usuário" 
              value={nome_de_usuario} 
              onChange={e => setNomeDeUsuario(e.target.value)} 
              required 
              className="appearance-none rounded-md relative block w-full px-4 py-3 border dark:bg-gray-700" 
            />
            <input 
              type="password" 
              placeholder="Senha" 
              value={senha} 
              onChange={e => setSenha(e.target.value)} 
              required 
              className="appearance-none rounded-md relative block w-full px-4 py-3 border dark:bg-gray-700" 
            />

            {/* Novo campo para tipo de identificador */}
            <label className="block text-gray-700 dark:text-gray-300 font-medium">Identificador único</label>
            <select value={identificadorTipo} onChange={e => setIdentificadorTipo(e.target.value as any)} className="rounded-md w-full px-4 py-3 border dark:bg-gray-700">
              <option value="cpf">CPF</option>
              <option value="email">Email</option>
              <option value="cpf_email">CPF e Email</option>
            </select>

            {(identificadorTipo === 'cpf' || identificadorTipo === 'cpf_email') && (
              <input 
                type="text" 
                placeholder="CPF" 
                value={cpf} 
                onChange={e => setCpf(e.target.value)} 
                className="appearance-none rounded-md relative block w-full px-4 py-3 border dark:bg-gray-700" 
              />
            )}

            {(identificadorTipo === 'email' || identificadorTipo === 'cpf_email') && (
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="appearance-none rounded-md relative block w-full px-4 py-3 border dark:bg-gray-700" 
              />
            )}

            <select value={perfil} onChange={e => setPerfil(e.target.value as PerfilUsuario)} className="appearance-none rounded-md relative block w-full px-4 py-3 border dark:bg-gray-700">
              <option value="Produtor">Produtor</option>
              <option value="Técnico">Técnico</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-epagri-red hover:bg-red-700"
            >
              Cadastrar
            </button>
          </div>

          <div className="text-sm text-center">
            <button type="button" onClick={onNavigateToLogin} className="font-medium text-epagri-red hover:text-red-700">
              Já tem uma conta? Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroScreen;
