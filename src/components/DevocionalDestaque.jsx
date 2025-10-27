import React from 'react';
import { Link } from 'react-router-dom';

function DevocionalDestaque({ devocional }) {
  if (!devocional) {
    // Cor de fundo --secondary-color: #10acec 
    return (
      <section className="bg-[#10acec] text-white py-16">
        <p className="text-center">Nenhuma devocional publicada ainda.</p>
      </section>
    );
  }

  // Função para replicar o 'truncatewords_html' do Django
  const truncateText = (text, wordLimit) => {
    // Remove tags HTML para contagem de palavras
    const plainText = text.replace(/<[^>]*>/g, '');
    const words = plainText.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    // Corta o texto plano e adiciona reticências
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <section className="bg-[#10acec] text-white py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-4xl font-bold italic mb-10">DEVOCIONAL DA SEMANA</h1>
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Coluna da Imagem */}
          <div className="w-full md:w-1/3">
            {devocional.imagem && (
               <img src={devocional.imagem} className="w-full h-auto rounded-lg shadow-2xl" alt={devocional.titulo} />
            )}
          </div>
          {/* Coluna do Texto */}
          <div className="w-full md:w-2/3 text-center md:text-left">
            <h2 className="text-3xl font-semibold italic">{devocional.titulo}</h2>
            {devocional.subtitulo && (
              <h3 className="text-xl opacity-80 italic mt-1">{devocional.subtitulo}</h3>
            )}
            <p className="mt-2 opacity-90 italic">Por: {devocional.autor}</p>
            <hr className="my-4 border-white/40" />
            <div 
              className="text-left leading-relaxed opacity-95"
              dangerouslySetInnerHTML={{ __html: truncateText(devocional.conteudo.replace(/\n/g, '<br />'), 50) }} 
            />
            <div className="text-center mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to={`/devocionais#devocional-${devocional.id}`} className="bg-white text-sky-600 font-bold py-3 px-6 rounded-md hover:bg-gray-200 transition-colors duration-300">
                Ler Completo
              </Link>
              <Link to="/devocionais" className="bg-black/20 text-white font-bold py-3 px-6 rounded-md hover:bg-black/30 transition-colors duration-300">
                Devocionais Anteriores
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DevocionalDestaque;