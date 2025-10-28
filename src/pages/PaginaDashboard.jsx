import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API_URL from '../services/api';

function PaginaDashboard() {
  const { user, logoutUser, authTokens } = useAuth();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [pdfError, setPdfError] = useState(null); // Estado para erros de PDF

  // Efeito para buscar estatísticas (só para secretários)
  useEffect(() => {
    if (user?.papel === 'secretario') {
      const fetchStats = async () => {
        try {
          const response = await fetch(`${API_URL}/api/admin/dashboard-stats/`, {
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
          });
          if (!response.ok) throw new Error('Falha ao buscar estatísticas.');
          const data = await response.json();
          setStats(data);
        } catch (error) {
          console.error("Erro ao buscar estatísticas:", error);
        } finally {
          setLoadingStats(false);
        }
      };
      fetchStats();
    } else {
      setLoadingStats(false);
    }
  }, [user, authTokens]);

  // Função para gerar o certificado de batismo
  const handleGerarBatismo = async () => {
    setPdfError(null); // Limpa erros antigos
    try {
      const response = await fetch(`${API_URL}/api/documentos/gerar-certificado-batismo/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      });
      
      if (!response.ok) {
        // Se a resposta não for OK, tenta ler o erro como JSON
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao gerar o certificado.');
      }
      
      // Se a resposta for OK, o corpo é o PDF
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank'); // Abre o PDF em uma nova aba
      
    } catch (err) {
      setPdfError(err.message); // Exibe o erro para o usuário
    }
  };

  // --- Componentes de Card (Secretário) ---
  const CardEstatisticas = () => (
    <div className="bg-white rounded-lg shadow-md h-full">
      <div className="bg-blue-100 text-blue-800 font-bold p-4 rounded-t-lg">Estatísticas</div>
      <div className="p-6">
        {loadingStats ? <p>Carregando...</p> : stats && (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div><h3 className="text-2xl font-bold text-blue-600">{stats.total_usuarios}</h3><small className="text-gray-500">Total de Usuários</small></div>
            <div><h3 className="text-2xl font-bold text-yellow-500">{stats.usuarios_pendentes}</h3><small className="text-gray-500">Pendentes</small></div>
            <div className="mt-3"><h3 className="text-2xl font-bold text-green-600">{stats.total_membros}</h3><small className="text-gray-500">Membros</small></div>
            <div className="mt-3"><h3 className="text-2xl font-bold text-teal-600">{stats.total_congregados}</h3><small className="text-gray-500">Congregados</small></div>
          </div>
        )}
      </div>
    </div>
  );
  
  const CardGestaoUsuarios = () => (
     <div className="bg-white rounded-lg shadow-md h-full">
      <div className="bg-yellow-100 text-yellow-800 font-bold p-4 rounded-t-lg">Gestão de Usuários e Documentos</div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">Gerencie cadastros, aprovações e gere documentos oficiais.</p>
        <div className="space-y-4">
          <Link to="/admin/usuarios-pendentes" className="block w-full text-center bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors">
            Usuários Pendentes {stats && stats.usuarios_pendentes > 0 && <span className="ml-2 bg-red-500 text-xs font-bold rounded-full px-2 py-1">{stats.usuarios_pendentes}</span>}
          </Link>
          <Link to="/admin/todos-usuarios" className="block w-full text-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
            Todos os Usuários
          </Link>
          
          {/* --- ALTERAÇÃO AQUI --- */}
          {/* Adiciona o link para a nova página de gerar carta convite */}
          <Link to="/admin/gerar-carta-convite" className="block w-full text-center bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 transition-colors">
            Gerar Carta Convite
          </Link>
          
          {user?.is_superuser && (
            <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 transition-colors mt-4">
              Painel Admin (Django)
            </a>
          )}
        </div>
      </div>
    </div>
  );
  // --- Fim dos Cards de Secretário ---

  // --- Card de Documentos para Membros ---
  const CardDocumentosMembro = () => (
    <div className="bg-white rounded-lg shadow-md h-full">
      <div className="bg-green-100 text-green-800 font-bold p-4 rounded-t-lg">Documentos</div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">Gere seus documentos oficiais da igreja.</p>
        <button 
          onClick={handleGerarBatismo}
          className="block w-full text-center bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Gerar 2ª Via do Certificado de Batismo
        </button>
        {/* Exibe uma mensagem de erro se a geração do PDF falhar */}
        {pdfError && <p className="text-red-500 text-sm mt-4">{pdfError}</p>}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-8 font-sans not-italic bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold">Bem-vindo, {user?.nome_completo || user?.username}!</h2>
        <p className="text-gray-600">Você está logado como <strong>{user?.papel}</strong>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Renderização Condicional por Papel */}
        {user?.papel === 'secretario' && (
          <>
            <CardGestaoUsuarios />
            <CardEstatisticas />
          </>
        )}
        
        {user?.papel === 'membro' && (
          <CardDocumentosMembro />
        )}

        <div className="bg-white rounded-lg shadow-md h-full">
          <div className="bg-gray-100 text-gray-800 font-bold p-4 rounded-t-lg">Meu Perfil</div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">Visualize e edite suas informações pessoais.</p>
            <Link to="/perfil" className="block w-full text-center bg-gray-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
              Ver Perfil
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 text-center mt-8">
            <button onClick={logoutUser} className="bg-red-500 text-white font-bold py-2 px-6 rounded-md hover:bg-red-600 transition-colors">
              Sair (Logout)
            </button>
        </div>
      </div>
    </div>
  );
}


export default PaginaDashboard;
