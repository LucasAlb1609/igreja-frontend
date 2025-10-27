import React from 'react';

function SecaoLive({ configuracao }) {
  if (!configuracao || !configuracao.link_youtube) {
    return null;
  }

  // Cor de fundo retirada da sua variável --bg-alt: #eee7d7 
  return (
    <section className="bg-[#eee7d7] py-16 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold italic text-gray-800 mb-4">{configuracao.titulo_video}</h2>
        <div className="max-w-3xl mx-auto">
          <a href={configuracao.link_youtube} target="_blank" rel="noopener noreferrer" className="inline-block group">
            <img 
              src={configuracao.imagem_url} 
              alt="Assista a live" 
              className="rounded-lg shadow-xl mb-6 transition-transform duration-300 group-hover:scale-105"
            />
            <button className="bg-red-600 text-white font-bold py-3 px-8 text-lg rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300">
              Assistir no YouTube
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default SecaoLive;