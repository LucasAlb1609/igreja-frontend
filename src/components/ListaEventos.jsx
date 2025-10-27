import React, { useState, useEffect } from 'react';
import API_URL from '../services/api';

function ListaEventos() {
  const [eventos, setEventos] = useState([]); // Inicia como um array vazio
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para armazenar erros

  useEffect(() => {
    // Função assíncrona para buscar os dados
    const fetchEventos = async () => {
      try {
        const response = await fetch(`${API_URL}/eventos/`);
        if (!response.ok) {
          throw new Error('A resposta da rede não foi boa');
        }
        const data = await response.json();
        setEventos(data); // Armazena os dados no estado
      } catch (err) {
        setError(err.message); // Armazena a mensagem de erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchEventos();
  }, []); // O array vazio [] faz com que o useEffect rode apenas uma vez, quando o componente é montado

  if (loading) {
    return <div className="text-center p-8">Carregando eventos...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Erro ao buscar dados: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Próximos Eventos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map(evento => (
          <div key={evento.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-2">{evento.titulo}</h2>
            <p className="text-gray-600 mb-1">
              {new Date(evento.data_evento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-gray-500 mb-4">{evento.local}</p>
            <p className="text-gray-700">{evento.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaEventos;