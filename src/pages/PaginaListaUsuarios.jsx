import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../services/api';

function PaginaListaUsuarios() {
  const { authTokens, user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para os filtros e busca
  const [filtros, setFiltros] = useState({ search: '', papel: '', aprovado: '' });

  // Função para buscar os usuários, agora com filtros
  const fetchUsuarios = useCallback(async () => {
    if (user?.papel !== 'secretario') {
      setError('Acesso negado.');
      setLoading(false);
      return;
    }
    
    // Constrói a query string a partir dos filtros
    const params = new URLSearchParams();
    if (filtros.search) params.append('search', filtros.search);
    if (filtros.papel) params.append('papel', filtros.papel);
    if (filtros.aprovado) params.append('aprovado', filtros.aprovado);

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/users/?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      });
      if (response.status === 401) {
        logoutUser(); // Desloga se o token for inválido
        return;
      }
      if (!response.ok) throw new Error('Falha ao buscar a lista de usuários.');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [authTokens, user, filtros, logoutUser]);

  // Busca os dados na montagem inicial e sempre que os filtros mudarem
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleExcluir = async (usuarioId, usuarioNome) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${usuarioNome}? Esta ação não pode ser desfeita.`)) return;

    try {
      const response = await fetch(`${API_URL}/admin/users/${usuarioId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      });
      if (!response.ok && response.status !== 204) throw new Error('Falha ao excluir usuário.');
      
      // Atualiza a lista removendo o usuário excluído
      fetchUsuarios();
      alert('Usuário excluído com sucesso.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="text-center p-10 text-red-500 font-semibold italic">Erro: {error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-8 font-sans not-italic">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Gestão de Usuários</h1>
        <div>
          <Link to="/admin/criar-usuario" className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors mr-2">
            Criar Novo Usuário
          </Link>
          <Link to="/dashboard" className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
            Voltar
          </Link>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="search"
            placeholder="Buscar por nome, email ou CPF..."
            value={filtros.search}
            onChange={handleFiltroChange}
            className="p-2 border rounded-md"
          />
          <select name="papel" value={filtros.papel} onChange={handleFiltroChange} className="p-2 border rounded-md">
            <option value="">Todos os Papéis</option>
            <option value="membro">Membro</option>
            <option value="congregado">Congregado</option>
            <option value="secretario">Secretário</option>
          </select>
          <select name="aprovado" value={filtros.aprovado} onChange={handleFiltroChange} className="p-2 border rounded-md">
            <option value="">Todos os Status</option>
            <option value="true">Aprovado</option>
            <option value="false">Pendente</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-10 font-semibold italic">Carregando usuários...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3">Nome Completo</th>
                <th className="px-6 py-3">Papel</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Data de Cadastro</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
                    <img src={usuario.foto_perfil_url || '/fotos/default-user.png'} alt="" className="w-8 h-8 rounded-full object-cover mr-3" />
                    {usuario.nome_completo}
                  </td>
                  <td className="px-6 py-4">{usuario.papel_display}</td>
                  <td className="px-6 py-4">
                    {usuario.aprovado ? <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Aprovado</span> : <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Pendente</span>}
                    {usuario.ativo ? <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">Ativo</span> : <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">Inativo</span>}
                  </td>
                  <td className="px-6 py-4">{new Date(usuario.data_cadastro).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <Link to={`/admin/ver-usuario/${usuario.id}`} className="font-medium text-blue-600 hover:underline">Ver</Link>
                      <Link to={`/admin/editar-usuario/${usuario.id}`} className="font-medium text-yellow-600 hover:underline">Editar</Link>
                      {user.id !== usuario.id && !usuario.is_superuser && (
                        <button onClick={() => handleExcluir(usuario.id, usuario.nome_completo)} className="font-medium text-red-600 hover:underline">Excluir</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaginaListaUsuarios;