import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API_URL from '../services/api';

// --- MODAL DE DETALHES DO USUÁRIO (COM AS CORREÇÕES) ---
function UserDetailModal({ user, onClose }) {
  if (!user) return null;

  const renderData = (data) => data || <span className="text-gray-400 italic">Não informado</span>;
  const renderDate = (date) => date ? new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : renderData(null);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Detalhes do Cadastro</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {/* Adicionando a foto e o nome principal para melhor identificação */}
          <div className="flex items-center gap-4 border-b pb-4 mb-4">
            <img 
              src={user.foto_perfil || '/fotos/default-user.png'}
              alt={user.nome_completo}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h4 className="text-2xl font-semibold text-blue-600">{renderData(user.nome_completo)}</h4>
              <p className="text-gray-500">{renderData(user.email)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
            <div>
              <h4 className="font-semibold text-blue-600 border-b pb-1 mb-2">Informações Pessoais</h4>
              <dl className="space-y-1">
                <div className="grid grid-cols-2"><dt className="font-medium text-gray-500">Data de Nasc.:</dt><dd>{renderDate(user.data_nascimento)}</dd></div>
                <div className="grid grid-cols-2"><dt className="font-medium text-gray-500">CPF:</dt><dd>{renderData(user.cpf)}</dd></div>
                <div className="grid grid-cols-2"><dt className="font-medium text-gray-500">Telefone:</dt><dd>{renderData(user.telefone)}</dd></div>
              </dl>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 border-b pb-1 mb-2">Informações Eclesiásticas</h4>
              <dl className="space-y-1">
                <div className="grid grid-cols-2"><dt className="font-medium text-gray-500">Data de Conversão:</dt><dd>{renderDate(user.data_conversao)}</dd></div>
                <div className="grid grid-cols-2"><dt className="font-medium text-gray-500">Batizado:</dt><dd>{user.batizado_aguas ? 'Sim' : 'Não'}</dd></div>
                {user.batizado_aguas && (
                  <>
                    <div className="grid grid-cols-2"><dt className="font-medium text-gray-500">Data Batismo:</dt><dd>{renderDate(user.data_batismo)}</dd></div>
                    {/* --- ALTERAÇÃO AQUI --- */}
                    <div className="grid grid-cols-2"><dt className="font-medium text-gray-500">Local de Batismo:</dt><dd>{renderData(user.local_batismo_display)}</dd></div>
                    {user.local_batismo === 'outra' && (
                       <div className="grid grid-cols-2"><dt className="font-medium text-gray-500">Igreja (Batismo):</dt><dd>{renderData(user.outra_igreja_batismo)}</dd></div>
                    )}
                    {/* --- ALTERAÇÃO AQUI --- */}
                    <div className="grid grid-cols-2"><dt className="font-medium text-gray-500">Recebido por Aclamação:</dt><dd>{user.recebido_por_aclamacao ? 'Sim' : 'Não'}</dd></div>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 text-right border-t">
          <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// O resto do arquivo PaginaUsuariosPendentes.jsx continua exatamente o mesmo
function PaginaUsuariosPendentes() {
  const { authTokens, user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      if (user?.papel !== 'secretario') {
        setError('Acesso negado.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/admin/pending-users/`, {
          headers: { 'Authorization': `Bearer ${authTokens.access}` }
        });
        if (!response.ok) throw new Error('Falha ao buscar usuários pendentes.');
        const data = await response.json();
        setPendingUsers(data.map(u => ({ ...u, selectedRole: 'congregado' })));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingUsers();
  }, [authTokens, user]);
  
  const handleViewDetails = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/`, {
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      });
      if (!response.ok) throw new Error('Não foi possível carregar os detalhes do usuário.');
      const data = await response.json();
      setViewingUser(data);
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setPendingUsers(prevUsers => 
      prevUsers.map(u => u.id === userId ? { ...u, selectedRole: newRole } : u)
    );
  };

  const handleApprove = async (userId, role) => {
    if (!window.confirm(`Tem certeza que deseja aprovar este usuário como ${role}?`)) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/approve/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`
        },
        body: JSON.stringify({ papel: role })
      });
      if (!response.ok) throw new Error('Falha ao aprovar usuário.');
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Tem certeza que deseja rejeitar e excluir este cadastro?')) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/reject/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      });
      if (!response.ok) throw new Error('Falha ao rejeitar usuário.');
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center p-10">Carregando...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Erro: {error}</div>;

  return (
    <>
      <div className="container mx-auto p-4 sm:p-8 font-sans not-italic">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Usuários Pendentes</h1>
          <span className="bg-yellow-400 text-yellow-800 font-bold px-3 py-1 rounded-full">
            {pendingUsers.length} pendente(s)
          </span>
        </div>

        {pendingUsers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingUsers.map(u => (
              <div key={u.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-5 border-b flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-lg text-gray-800">{u.nome_completo}</h5>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    <small className="text-xs text-gray-400">Cadastrado em: {new Date(u.data_cadastro).toLocaleString('pt-BR')}</small>
                  </div>
                  <button onClick={() => handleViewDetails(u.id)} className="text-sm bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded-md hover:bg-blue-200">
                    Ver Detalhes
                  </button>
                </div>
                <div className="p-5 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-grow w-full sm:w-auto">
                      <label className="text-xs font-semibold">Definir Papel:</label>
                      <select value={u.selectedRole} onChange={(e) => handleRoleChange(u.id, e.target.value)} className="w-full p-2 border rounded-md mt-1">
                        <option value="congregado">Congregado</option>
                        <option value="membro">Membro</option>
                        <option value="secretario">Secretário</option>
                      </select>
                    </div>
                    <div className="flex-shrink-0 flex gap-2 w-full sm:w-auto pt-4 sm:pt-0">
                      <button onClick={() => handleApprove(u.id, u.selectedRole)} className="w-full sm:w-auto bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600">Aprovar</button>
                      <button onClick={() => handleReject(u.id)} className="w-full sm:w-auto bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600">Rejeitar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">Nenhum usuário pendente!</h3>
            <p className="text-gray-500 mt-2">Todos os cadastros foram processados.</p>
            <Link to="/dashboard" className="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600">
              Voltar ao Dashboard
            </Link>
          </div>
        )}
      </div>

      {viewingUser && <UserDetailModal user={viewingUser} onClose={() => setViewingUser(null)} />}
    </>
  );
}


export default PaginaUsuariosPendentes;
