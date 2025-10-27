import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../services/api';

// Componente auxiliar para inputs
function FormInput({ name, label, isRequired = false, type = 'text', value, onChange, disabled = false }) {
  return (
    <div>
      <label htmlFor={name} className={`block font-bold text-sm ${isRequired && 'after:content-["_*"] after:text-red-500'}`}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-2 border rounded mt-1 bg-white disabled:bg-gray-200"
      />
    </div>
  );
}

function PaginaEditarUsuario() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { authTokens, user } = useAuth();
  
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para buscar os dados do usuário a ser editado
  useEffect(() => {
    const fetchUserToEdit = async () => {
      if (user?.papel !== 'secretario') {
        setError("Acesso negado.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/admin/users/${userId}/`, {
          headers: { 'Authorization': `Bearer ${authTokens.access}` }
        });
        if (!response.ok) throw new Error('Falha ao carregar dados do usuário.');
        const data = await response.json();
        setFormData({
          ...data,
          tem_alergia_medicacao: data.tem_alergia_medicacao ? 'True' : 'False',
          data_conversao_nao_lembro: !data.data_conversao,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserToEdit();
  }, [authTokens, user, userId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSend = new FormData();
    const editableFields = [
      'nome_completo', 'email', 'foto_perfil', 'data_nascimento', 'nome_pai', 
      'nome_mae', 'cpf', 'rg', 'naturalidade', 'estado_civil', 'nome_conjuge', 
      'data_casamento', 'telefone', 'endereco', 'bairro', 'cidade', 'cep',
      'profissao', 'nivel_escolar', 'data_conversao', 'batizado_aguas', 
      'data_batismo', 'local_batismo', 'outra_igreja_batismo', 
      'recebido_por_aclamacao', 'membro_congregacao', 'qual_congregacao', 
      'frequenta_escola_biblica', 'qual_classe_escola_biblica',
      'deseja_exercer_funcao', 'qual_funcao_deseja',
      'tem_alergia_medicacao', 'alergias_texto',
      'papel', 'ativo'
    ];

    for (const key of editableFields) {
      if (key === 'foto_perfil' && formData[key] && typeof formData[key] !== 'object') {
        continue;
      }
      let value = formData[key];
      if (typeof value === 'boolean') {
        value = value ? 'true' : 'false';
      }
      if (value !== null && value !== undefined) {
        dataToSend.append(key, value);
      }
    }

    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${authTokens.access}` },
        body: dataToSend,
      });
      if (!response.ok) {
        const errorData = await response.json();
        // A MUDANÇA ESTÁ AQUI: Tratamento de erro mais robusto
        let errorMessage = 'Ocorreu um erro.';
        if (typeof errorData === 'object' && errorData !== null) {
          errorMessage = Object.entries(errorData)
            .map(([field, errors]) => {
              // Garante que 'errors' seja um array antes de usar 'join'
              const errorString = Array.isArray(errors) ? errors.join(', ') : errors;
              return `${field.replace("_", " ")}: ${errorString}`;
            })
            .join('; ');
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        throw new Error(errorMessage);
      }
      alert('Usuário atualizado com sucesso!');
      navigate('/admin/todos-usuarios');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !formData) return <div className="text-center p-10 font-semibold italic">Carregando formulário...</div>;
  if (error) return <div className="text-center p-10 text-red-500 font-semibold italic">Erro: {error}</div>;

  return (
    <div className="bg-gray-100 py-12 font-sans not-italic">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-yellow-500 text-white p-4">
              <h3 className="text-2xl font-semibold">Editar Usuário: {formData.nome_completo}</h3>
            </div>
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} noValidate encType="multipart/form-data" className="space-y-8">
                
                <section className="p-6 bg-gray-50 rounded-lg border">
                  <h4 className="text-lg font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 mb-6">Dados de Acesso e Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="username" label="Nome de Usuário (não pode ser alterado)" value={formData.username} onChange={() => {}} disabled />
                    <FormInput name="email" label="E-mail" isRequired type="email" value={formData.email} onChange={handleChange} />
                    <div>
                      <label className="block font-bold text-sm after:content-['_*'] after:text-red-500">Papel do Usuário</label>
                      <select name="papel" value={formData.papel} onChange={handleChange} className="w-full p-2 border rounded mt-1">
                        <option value="congregado">Congregado</option>
                        <option value="membro">Membro</option>
                        <option value="secretario">Secretário</option>
                      </select>
                    </div>
                     <div>
                      <label className="block font-bold text-sm">Status da Conta</label>
                      <select name="ativo" value={formData.ativo} onChange={handleChange} className="w-full p-2 border rounded mt-1">
                        <option value={true}>Ativo</option>
                        <option value={false}>Inativo</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="p-6 bg-gray-50 rounded-lg border">
                  <h4 className="text-lg font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 mb-6">Dados Pessoais</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="nome_completo" label="Nome Completo" isRequired value={formData.nome_completo} onChange={handleChange} />
                    <FormInput name="data_nascimento" label="Data de Nascimento" isRequired type="date" value={formData.data_nascimento} onChange={handleChange} />
                    <div>
                      <label className="block font-bold text-sm">Foto para Perfil</label>
                      {formData.foto_perfil && typeof formData.foto_perfil === 'string' && (
                        <img src={formData.foto_perfil} alt="Foto atual" className="h-20 w-20 rounded-full object-cover my-2" />
                      )}
                      <input type="file" name="foto_perfil" onChange={handleChange} className="w-full p-2 border rounded mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <FormInput name="nome_pai" label="Nome do Pai" value={formData.nome_pai} onChange={handleChange} />
                    <FormInput name="nome_mae" label="Nome da Mãe" isRequired value={formData.nome_mae} onChange={handleChange} />
                    <FormInput name="cpf" label="CPF" isRequired value={formData.cpf} onChange={handleChange} />
                    <FormInput name="rg" label="RG" value={formData.rg} onChange={handleChange} />
                    <FormInput name="naturalidade" label="Natural da cidade de" value={formData.naturalidade} onChange={handleChange} />
                  </div>
                </section>

                <section className="p-6 bg-gray-50 rounded-lg border">
                  <h4 className="text-lg font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 mb-6">Família e Saúde</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-sm">Estado Civil</label>
                      <select name="estado_civil" value={formData.estado_civil} onChange={handleChange} className="w-full p-2 border rounded mt-1">
                          <option value="">Selecione...</option>
                          <option value="solteiro">Solteiro(a)</option>
                          <option value="casado">Casado(a)</option>
                          <option value="divorciado">Divorciado(a)</option>
                          <option value="viuvo">Viúvo(a)</option>
                      </select>
                    </div>
                  </div>
                  {formData.estado_civil === 'casado' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border rounded bg-white">
                      <FormInput name="nome_conjuge" label="Nome do Cônjuge" isRequired value={formData.nome_conjuge} onChange={handleChange} />
                      <FormInput name="data_casamento" label="Data de Casamento" isRequired type="date" value={formData.data_casamento} onChange={handleChange} />
                    </div>
                  )}
                  <hr className="my-6" />
                  <div className="mt-4">
                    <p className="font-bold text-sm">Alergia a medicação?</p>
                    <div className="flex gap-4 mt-1">
                      <label><input type="radio" name="tem_alergia_medicacao" value="True" checked={formData.tem_alergia_medicacao === 'True' || formData.tem_alergia_medicacao === true} onChange={handleChange} /> Sim</label>
                      <label><input type="radio" name="tem_alergia_medicacao" value="False" checked={formData.tem_alergia_medicacao === 'False' || formData.tem_alergia_medicacao === false} onChange={handleChange} /> Não</label>
                    </div>
                  </div>
                  {(formData.tem_alergia_medicacao === 'True' || formData.tem_alergia_medicacao === true) && (
                     <div className="mt-4">
                        <label className="block font-bold text-sm">Quais alergias?</label>
                        <textarea name="alergias_texto" value={formData.alergias_texto} onChange={handleChange} className="w-full p-2 border rounded mt-1" rows="3"></textarea>
                     </div>
                  )}
                </section>

                <section className="p-6 bg-gray-50 rounded-lg border">
                   <h4 className="text-lg font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 mb-6">Contato, Endereço e Profissão</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput name="telefone" label="Telefone" type="tel" value={formData.telefone} onChange={handleChange} />
                      <FormInput name="cep" label="CEP" value={formData.cep} onChange={handleChange} />
                      <FormInput name="endereco" label="Endereço (Rua, Nº)" value={formData.endereco} onChange={handleChange} />
                      <FormInput name="bairro" label="Bairro" value={formData.bairro} onChange={handleChange} />
                      <FormInput name="cidade" label="Cidade" value={formData.cidade} onChange={handleChange} />
                      <FormInput name="profissao" label="Profissão" value={formData.profissao} onChange={handleChange} />
                      <div>
                          <label className="block font-bold text-sm">Nível Escolar</label>
                          <select name="nivel_escolar" value={formData.nivel_escolar} onChange={handleChange} className="w-full p-2 border rounded mt-1">
                              <option value="">Selecione...</option>
                              <option value="fundamental_incompleto">Ensino Fundamental Incompleto</option>
                              <option value="fundamental_completo">Ensino Fundamental Completo</option>
                              <option value="medio_incompleto">Ensino Médio Incompleto</option>
                              <option value="medio_completo">Ensino Médio Completo</option>
                              <option value="superior_incompleto">Ensino Superior Incompleto</option>
                              <option value="superior_completo">Ensino Superior Completo</option>
                              <option value="pos_graduacao">Pós-graduação</option>
                              <option value="nao_informar">Não desejo informar</option>
                          </select>
                      </div>
                   </div>
                </section>

                <section className="p-6 bg-gray-50 rounded-lg border">
                  <h4 className="text-lg font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 mb-6">Informações Eclesiásticas</h4>
                  <div className="flex items-center gap-4">
                    <FormInput name="data_conversao" label="Data de Conversão" type="date" value={formData.data_conversao} onChange={handleChange} disabled={formData.data_conversao_nao_lembro} />
                    <div className="mt-6">
                      <input type="checkbox" name="data_conversao_nao_lembro" checked={formData.data_conversao_nao_lembro} onChange={handleChange} id="naoLembro" />
                      <label htmlFor="naoLembro" className="ml-2">Não lembro a data</label>
                    </div>
                  </div>
                   <div className="mt-4 space-y-4">
                      <div>
                         <input type="checkbox" name="batizado_aguas" checked={formData.batizado_aguas} onChange={handleChange} id="batizado" />
                         <label htmlFor="batizado" className="ml-2 font-bold">É batizado nas águas?</label>
                      </div>
                       {formData.batizado_aguas && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 border rounded bg-white">
                           <FormInput name="data_batismo" label="Data do Batismo" type="date" value={formData.data_batismo} onChange={handleChange} />
                           <div>
                              <label className="block font-bold text-sm">Onde foi o batismo?</label>
                              <select name="local_batismo" value={formData.local_batismo} onChange={handleChange} className="w-full p-2 border rounded mt-1">
                                <option value="">Selecione...</option>
                                <option value="2ibca">Na 2ª IBCA</option>
                                <option value="outra">Em Outra Igreja</option>
                              </select>
                           </div>
                           {formData.local_batismo === 'outra' && (
                             <div className="md:col-span-2">
                               <FormInput name="outra_igreja_batismo" label="Qual igreja?" value={formData.outra_igreja_batismo} onChange={handleChange} />
                                <div className="mt-2">
                                   <input type="checkbox" name="recebido_por_aclamacao" checked={formData.recebido_por_aclamacao} onChange={handleChange} id="aclamacao" />
                                   <label htmlFor="aclamacao" className="ml-2">Recebido por Aclamação na 2ª IBCA?</label>
                                </div>
                             </div>
                           )}
                         </div>
                       )}
                      <div>
                         <input type="checkbox" name="membro_congregacao" checked={formData.membro_congregacao} onChange={handleChange} id="congregacao" />
                         <label htmlFor="congregacao" className="ml-2 font-bold">É membro de alguma congregação?</label>
                      </div>
                      {formData.membro_congregacao && <FormInput name="qual_congregacao" label="Qual congregação?" value={formData.qual_congregacao} onChange={handleChange} />}
                      
                      <div>
                         <input type="checkbox" name="frequenta_escola_biblica" checked={formData.frequenta_escola_biblica} onChange={handleChange} id="ebd" />
                         <label htmlFor="ebd" className="ml-2 font-bold">Frequenta alguma classe da Escola Bíblica?</label>
                      </div>
                      {formData.frequenta_escola_biblica && <FormInput name="qual_classe_escola_biblica" label="Qual classe?" value={formData.qual_classe_escola_biblica} onChange={handleChange} />}

                      <div>
                         <input type="checkbox" name="deseja_exercer_funcao" checked={formData.deseja_exercer_funcao} onChange={handleChange} id="funcao" />
                         <label htmlFor="funcao" className="ml-2 font-bold">Deseja exercer alguma função na 2ª IBCA?</label>
                      </div>
                      {formData.deseja_exercer_funcao && (
                         <div>
                            <label className="block font-bold text-sm">Qual função ou ministério?</label>
                            <textarea name="qual_funcao_deseja" value={formData.qual_funcao_deseja} onChange={handleChange} className="w-full p-2 border rounded mt-1" rows="3"></textarea>
                         </div>
                      )}
                   </div>
                </section>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                    <strong className="font-bold">Erro!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                  </div>
                )}

                <div className="flex justify-between items-center mt-8">
                  <Link to="/admin/todos-usuarios" className="text-gray-600 hover:text-blue-600">Cancelar</Link>
                  <button type="submit" disabled={loading} className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400">
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaEditarUsuario;