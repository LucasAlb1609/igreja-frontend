import React, { useState, useEffect } from 'react';
import API_URL from '../services/api';

import Carrossel from '../components/Carrossel';
import SecaoLive from '../components/SecaoLive';
import DevocionalDestaque from '../components/DevocionalDestaque';

function HomePage() {
  const [configuracao, setConfiguracao] = useState(null);
  const [devocional, setDevocional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configResponse, devocionalResponse] = await Promise.all([
          fetch(`${API_URL}/api/configuracao/`),
          fetch(`${API_URL}/api/devocionais/recente/`)
        ]);

        if (!configResponse.ok || !devocionalResponse.ok) {
          throw new Error('Não foi possível buscar os dados da página inicial.');
        }

        const configData = await configResponse.json();
        const devocionalData = await devocionalResponse.json();

        setConfiguracao(configData);
        setDevocional(devocionalData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen font-semibold italic">Carregando...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 font-semibold italic">Erro: {error}</div>;
  }

  return (
    <div>
      <Carrossel />
      <SecaoLive configuracao={configuracao} />
      <DevocionalDestaque devocional={devocional} />
    </div>
  );
}


export default HomePage;
