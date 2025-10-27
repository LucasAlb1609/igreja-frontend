import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API_URL from '../services/api';

function PaginaDevocionais() {
  const [devocionais, setDevocionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Hook para ler a URL, incluindo o hash (ex: #devocional-2)
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/devocionais/`);
        if (!response.ok) throw new Error('Não foi possível buscar as devocionais.');
        const data = await response.json();
        setDevocionais(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Efeito para rolar a página para a âncora da URL quando os dados carregarem
  useEffect(() => {
    if (!loading && location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Rola suavemente até o elemento, com um deslocamento para o cabeçalho
        const headerOffset = 100; // Ajuste este valor se a altura do seu header mudar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  }, [loading, location.hash]); // Roda sempre que o loading terminar ou o hash mudar

  // Função para rolagem suave ao clicar nos links do índice
  const handleScrollTo = (e, devocionalId) => {
    e.preventDefault();
    const element = document.getElementById(`devocional-${devocionalId}`);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="text-center p-10 font-semibold italic">Carregando Devocionais...</div>;
  if (error) return <div className="text-center p-10 text-red-500 font-semibold italic">Erro: {error}</div>;

  return (
    <div className="container mx-auto py-12 px-4 font-sans not-italic">
      <h1 className="text-4xl font-bold text-center mb-10">Nossas Devocionais</h1>
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Coluna do Índice (Fixo na tela) */}
        <aside className="w-full md:w-1/4">
          <div className="sticky top-28 bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-4 border-b pb-2">Índice</h4>
            <ul className="space-y-2">
              {devocionais.map(dev => (
                <li key={dev.id}>
                  <a 
                    href={`#devocional-${dev.id}`}
                    onClick={(e) => handleScrollTo(e, dev.id)}
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {dev.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Coluna do Conteúdo Principal */}
        <main className="w-full md:w-3/4">
          {devocionais.length > 0 ? (
            <div className="space-y-12">
              {devocionais.map(dev => (
                <article key={dev.id} id={`devocional-${dev.id}`} className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{dev.titulo}</h2>
                  {dev.subtitulo && <h3 className="text-xl text-gray-500 italic mb-3">{dev.subtitulo}</h3>}
                  <p className="text-sm text-gray-500 italic mb-4">
                    Por: {dev.autor} - <time>{new Date(dev.data_publicacao).toLocaleDateString('pt-BR')}</time>
                  </p>
                  {dev.imagem && <img src={dev.imagem} alt={dev.titulo} className="w-full h-auto max-h-96 object-cover rounded-md shadow mb-6" />}
                  <div 
                    className="prose max-w-none" 
                    dangerouslySetInnerHTML={{ __html: dev.conteudo.replace(/\n/g, '<br />') }}
                  />
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Nenhuma devocional encontrada.</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default PaginaDevocionais;