import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API_URL from '../services/api';

function PaginaPerfil() {
  const { authTokens } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Garante que só buscamos os dados se tivermos um token
      if (!authTokens) {
        setLoading(false);
        setError("Usuário не autenticado.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/users/me/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
          }
        });
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do perfil.');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authTokens]);

  if (loading) return <div className="text-center p-10 font-semibold italic">Carregando Perfil...</div>;
  if (error) return <div className="text-center p-10 text-red-500 font-semibold italic">Erro: {error}</div>;
  if (!profile) return null; // Não renderiza nada se não houver perfil

  // Funções auxiliares para exibir dados ou um placeholder amigável
  const renderData = (data) => data || <span className="text-gray-400 italic">Não informado</span>;
  const renderDate = (date) => date ? new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : renderData(null);

  return (
    <div className="bg-gray-100 p-4 sm:p-8 font-sans not-italic">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h3 className="text-2xl font-semibold">Meu Perfil</h3>
          <Link to="/perfil/editar" className="bg-yellow-400 text-black font-bold text-sm py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors">
            Editar Perfil
          </Link>
        </div>
        <div className="p-6">
          {/* Seção Superior: Foto e Nome */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-6">
            <div className="w-40 h-40 flex-shrink-0">
              <img 
                src={profile.foto_perfil || '/fotos/default-user.png'} 
                alt={`Foto de ${profile.nome_completo}`} 
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
            <div className="text-center md:text-left pt-4">
              <h4 className="text-3xl font-bold text-blue-600">{renderData(profile.nome_completo)}</h4>
              <p className="text-gray-500">Username: {renderData(profile.username)}</p>
              <p className="text-gray-700 mt-2">Email: {renderData(profile.email)}</p>
            </div>
          </div>

          {/* Seções de Detalhes em Colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Coluna 1: Pessoal, Família, Saúde */}
            <div className="space-y-6">
              <section>
                <h5 className="font-bold text-lg border-b-2 border-blue-200 pb-2 mb-3">Informações Pessoais</h5>
                <dl className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">CPF:</dt><dd>{renderData(profile.cpf)}</dd></div>
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">RG:</dt><dd>{renderData(profile.rg)}</dd></div>
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Data de Nascimento:</dt><dd>{renderDate(profile.data_nascimento)}</dd></div>
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Naturalidade:</dt><dd>{renderData(profile.naturalidade)}</dd></div>
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Nome da Mãe:</dt><dd>{renderData(profile.nome_mae)}</dd></div>
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Nome do Pai:</dt><dd>{renderData(profile.nome_pai)}</dd></div>
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Telefone:</dt><dd>{renderData(profile.telefone)}</dd></div>
                </dl>
              </section>

              <section>
                <h5 className="font-bold text-lg border-b-2 border-blue-200 pb-2 mb-3">Família</h5>
                <dl className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Estado Civil:</dt><dd>{renderData(profile.estado_civil_display)}</dd></div>
                  {profile.estado_civil === 'casado' && (
                    <>
                      <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Cônjuge:</dt><dd>{renderData(profile.nome_conjuge)}</dd></div>
                      <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Data Casamento:</dt><dd>{renderDate(profile.data_casamento)}</dd></div>
                    </>
                  )}
                </dl>
                {profile.filhos.length > 0 && (
                  <div className="mt-4">
                    <h6 className="font-semibold text-sm">Filhos:</h6>
                    <ul className="list-disc list-inside text-sm mt-1 pl-2 space-y-1">
                      {profile.filhos.map(filho => <li key={filho.id}>{filho.nome_completo} ({renderDate(filho.data_nascimento)})</li>)}
                    </ul>
                  </div>
                )}
              </section>
              
               <section>
                  <h5 className="font-bold text-lg border-b-2 border-blue-200 pb-2 mb-3">Saúde</h5>
                  <dl className="text-sm space-y-2">
                     <div className="grid grid-cols-2 gap-2">
                        <dt className="font-semibold">Alergia a medicação:</dt>
                        <dd>{profile.tem_alergia_medicacao ? <span className="font-bold text-red-600">Sim</span> : 'Não'}</dd>
                     </div>
                     {profile.tem_alergia_medicacao && (
                        <div className="col-span-2 text-xs italic text-gray-600 pl-4">"{profile.alergias_texto}"</div>
                     )}
                  </dl>
               </section>
            </div>

            {/* Coluna 2: Endereço, Profissão, Eclesiástico, Sistema */}
            <div className="space-y-6">
              <section>
                <h5 className="font-bold text-lg border-b-2 border-blue-200 pb-2 mb-3">Endereço</h5>
                <address className="not-italic text-sm">
                  {renderData(profile.endereco)}<br />
                  {renderData(profile.bairro)}<br />
                  {renderData(profile.cidade)} - {renderData(profile.cep)}
                </address>
              </section>

              <section>
                <h5 className="font-bold text-lg border-b-2 border-blue-200 pb-2 mb-3">Profissão e Educação</h5>
                <dl className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Profissão:</dt><dd>{renderData(profile.profissao)}</dd></div>
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Nível Escolar:</dt><dd>{renderData(profile.nivel_escolar_display)}</dd></div>
                </dl>
              </section>

              <section>
                <h5 className="font-bold text-lg border-b-2 border-blue-200 pb-2 mb-3">Status no Sistema</h5>
                <dl className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Papel:</dt><dd><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block font-medium">{renderData(profile.papel_display)}</span></dd></div>
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Status:</dt><dd>{profile.aprovado ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block font-medium">Aprovado</span> : <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full inline-block font-medium">Pendente</span>}</dd></div>
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Aprovado por:</dt><dd>{renderData(profile.aprovado_por)}</dd></div>
                  <div className="grid grid-cols-2 gap-2"><dt className="font-semibold">Data de Cadastro:</dt><dd>{renderDate(profile.data_cadastro)}</dd></div>
                </dl>
              </section>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/dashboard" className="text-blue-600 hover:underline font-semibold">Voltar ao Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


export default PaginaPerfil;
