import React, { useState } from 'react';
import { mockDatabase } from '../database';
import Icon from '../components/Icon';

const ConfiguracoesScreen: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(mockDatabase.usuario);
  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState(currentUser.nome);
  const [email, setEmail] = useState(currentUser.email);
  const [cpf, setCpf] = useState(currentUser.cpf);
  const [fotoUrl, setFotoUrl] = useState(currentUser.foto_url);

  // propriedades do usuário
  const [propriedades, setPropriedades] = useState(mockDatabase.propriedades);
  const [editandoPropriedade, setEditandoPropriedade] = useState<number | null>(null);
  const [novaPropriedade, setNovaPropriedade] = useState({ nome: '', localizacao: '' });

  const handleSaveUser = () => {
    setCurrentUser({ ...currentUser, nome, email, cpf, foto_url: fotoUrl });
    setEditing(false);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setFotoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddPropriedade = () => {
    if (!novaPropriedade.nome.trim()) return;
    const nova = {
      id: propriedades.length + 1,
      nome: novaPropriedade.nome,
      localizacao: novaPropriedade.localizacao,
    };
    setPropriedades([...propriedades, nova]);
    setNovaPropriedade({ nome: '', localizacao: '' });
  };

  const handleEditPropriedade = (id: number) => {
    setEditandoPropriedade(id);
  };

  const handleSavePropriedade = (id: number, nome: string, localizacao: string) => {
    const atualizadas = propriedades.map(p =>
      p.id === id ? { ...p, nome, localizacao } : p
    );
    setPropriedades(atualizadas);
    setEditandoPropriedade(null);
  };

  const handleDeletePropriedade = (id: number) => {
    const filtradas = propriedades.filter(p => p.id !== id);
    setPropriedades(filtradas);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Configurações</h1>

      {/* Foto de Perfil */}
      <div className="flex items-center space-x-4">
        <label htmlFor="profile-pic">
          <img
            src={fotoUrl || require('../assets/icone.png')}
            alt="Foto do perfil"
            className="w-24 h-24 rounded-full object-cover border-4 border-epagri-red cursor-pointer"
          />
        </label>
        <input id="profile-pic" type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
        <div>
          {editing ? (
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="border rounded p-2"
              placeholder="Nome do usuário"
            />
          ) : (
            <h2 className="text-xl font-semibold">{currentUser.nome}</h2>
          )}
          <p className="text-gray-500">{currentUser.email}</p>
        </div>
      </div>

      {/* Edição de dados do usuário */}
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={e => setCpf(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <button onClick={handleSaveUser} className="bg-green-600 text-white px-4 py-2 rounded">
            Salvar alterações
          </button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Editar perfil
        </button>
      )}

      {/* Lista de propriedades */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Propriedades</h2>
        <ul className="space-y-3">
          {propriedades.map(prop => (
            <li key={prop.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center">
              {editandoPropriedade === prop.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    defaultValue={prop.nome}
                    onChange={e => (prop.nome = e.target.value)}
                    className="border rounded p-1 w-full"
                  />
                  <input
                    type="text"
                    defaultValue={prop.localizacao}
                    onChange={e => (prop.localizacao = e.target.value)}
                    className="border rounded p-1 w-full"
                  />
                  <button
                    onClick={() => handleSavePropriedade(prop.id, prop.nome, prop.localizacao)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-semibold">{prop.nome}</p>
                    <p className="text-gray-500 text-sm">{prop.localizacao}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={() => handleEditPropriedade(prop.id)}>
                      <Icon name="pencil" className="w-5 h-5 text-blue-500" />
                    </button>
                    <button onClick={() => handleDeletePropriedade(prop.id)}>
                      <Icon name="trash" className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Adicionar nova propriedade */}
        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-semibold">Adicionar nova propriedade</h3>
          <input
            type="text"
            placeholder="Nome"
            value={novaPropriedade.nome}
            onChange={e => setNovaPropriedade({ ...novaPropriedade, nome: e.target.value })}
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="Localização"
            value={novaPropriedade.localizacao}
            onChange={e => setNovaPropriedade({ ...novaPropriedade, localizacao: e.target.value })}
            className="border rounded p-2 w-full"
          />
          <button onClick={handleAddPropriedade} className="bg-green-600 text-white px-4 py-2 rounded">
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesScreen;
