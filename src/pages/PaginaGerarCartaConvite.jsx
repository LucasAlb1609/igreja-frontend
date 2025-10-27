import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../services/api';

// Componente auxiliar para inputs
function FormInput({ name, label, isRequired = false, type = 'text', value, onChange, placeholder = '' }) {
  return (
    <div>
      <label htmlFor={name} className={`block font-bold text-sm mb-1 ${isRequired && 'after:content-["_*"] after:text-red-500'}`}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={isRequired}
        className="w-full p-2 border rounded bg-white"
      />
    </div>
  );
}

// Componente auxiliar para Textarea
function FormTextarea({ name, label, isRequired = false, value, onChange, rows = 3 }) {
   return (
    <div>
      <label htmlFor={name} className={`block font-bold text-sm mb-1 ${isRequired && 'after:content-["_*"] after:text-red-500'}`}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        required={isRequired}
        className="w-full p-2 border rounded bg-white"
      />
    </div>
  );
}

function PaginaGerarCartaConvite() {
  const { authTokens, user } = useAuth();
  const [formData, setFormData] = useState({
    nome_do_evento: '', // Campo genérico para o nome do evento
    data_inicio: '',
    data_fim: '',
    horario: '19h00min', // Valor padrão
    tema: '',
    versiculo_base: '',
    referencia_biblica: '',
    preletores: '', // Usaremos textarea, separando por linha
    tipo_destinatario: 'igreja', // Valor padrão
    nome_congregacao: '',
    nome_diretor: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verifica se o usuário é secretário
  if (user?.papel !== 'secretario') {
    return <div className="text-center p-10 text-red-500 font-semibold italic">Acesso negado. Apenas secretários podem gerar documentos.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepara os dados para enviar, tratando a lista de preletores
    const dataToSend = {
      ...formData,
      // Garante que preletores sejam enviados como string separada por vírgula para a API
      preletores: formData.preletores.split('\n').filter(p => p.trim()).join(','), 
    };

    try {
      const response = await fetch(`${API_URL}/documentos/gerar-carta-convite/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao gerar o PDF.');
      }

      // Se a resposta for OK, o corpo é o PDF
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      // Abre o PDF em uma nova aba
      window.open(fileURL, '_blank');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 py-12 font-sans not-italic">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-teal-600 text-white p-4">
            <h3 className="text-2xl font-semibold">Gerar Carta Convite</h3>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-gray-600 mb-6">Preencha os dados abaixo para gerar a carta convite em formato PDF.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <FormInput name="nome_do_evento" label="Nome Completo do Evento" isRequired value={formData.nome_do_evento} onChange={handleChange} placeholder="Ex: Conferência de Aniversário dos 80 Anos"/>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput name="data_inicio" label="Data de Início" isRequired type="date" value={formData.data_inicio} onChange={handleChange} />
                <FormInput name="data_fim" label="Data de Fim" isRequired type="date" value={formData.data_fim} onChange={handleChange} />
                <FormInput name="horario" label="Horário" isRequired value={formData.horario} onChange={handleChange} placeholder="Ex: 19h00min"/>
              </div>

              <FormInput name="tema" label="Tema do Evento" isRequired value={formData.tema} onChange={handleChange} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormInput name="versiculo_base" label="Versículo Base (Texto)" isRequired value={formData.versiculo_base} onChange={handleChange} />
                 <FormInput name="referencia_biblica" label="Referência Bíblica" isRequired value={formData.referencia_biblica} onChange={handleChange} placeholder="Ex: Filipenses 4:4"/>
              </div>

              <FormTextarea name="preletores" label="Preletores (um por linha)" isRequired value={formData.preletores} onChange={handleChange} rows={4}/>

              <div>
                <label className="block font-bold text-sm mb-1 after:content-['_*'] after:text-red-500">Tipo de Destinatário</label>
                <select name="tipo_destinatario" value={formData.tipo_destinatario} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                  <option value="igreja">Outra Igreja</option>
                  <option value="congregacao">Congregação da 2IBCA</option>
                </select>
              </div>

              {/* Campos Condicionais para Congregação */}
              {formData.tipo_destinatario === 'congregacao' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border rounded bg-gray-50">
                  <FormInput name="nome_congregacao" label="Nome da Congregação" isRequired value={formData.nome_congregacao} onChange={handleChange} />
                  <FormInput name="nome_diretor" label="Nome do Diretor(a) (Opcional)" value={formData.nome_diretor} onChange={handleChange} />
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                  <strong className="font-bold">Erro!</strong>
                  <span className="block sm:inline ml-2">{error}</span>
                </div>
              )}

              <div className="flex justify-between items-center mt-8">
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Voltar ao Dashboard</Link>
                <button type="submit" disabled={loading} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400">
                  {loading ? 'Gerando PDF...' : 'Gerar PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaGerarCartaConvite;