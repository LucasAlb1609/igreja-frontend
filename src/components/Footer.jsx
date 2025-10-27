import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Footer() {
  const { user } = useAuth();
  const versiculo = `² Levai as cargas uns dos outros, e assim cumprireis a lei de Cristo.
    ³ Porque, se alguém cuida ser alguma coisa, não sendo nada, engana-se a si mesmo.
    ⁴ Mas prove cada um a sua própria obra, e terá glória só em si mesmo, e não noutro.
    ⁵ Porque cada qual levará a sua própria carga.`;

  return (
    <>
      {/* O footer principal */}
      <footer className="bg-white text-gray-700 pt-12 pb-8 px-4 font-sans not-italic relative">
        <div className="container mx-auto">
          {/* Container das colunas com layout flexível e responsivo */}
          <div className="flex flex-wrap justify-between text-center md:text-left">

            {/* Coluna da Esquerda: Versículo e Redes Sociais */}
            <div className="w-full lg:w-[40%] mb-8 lg:mb-0">
              <h3 className="text-lg font-bold mb-2">Gálatas 6. 2-10</h3>
              <p className="text-base text-gray-600 leading-relaxed font-normal italic whitespace-pre-line">
                {versiculo}
              </p>
              <div className="flex justify-center md:justify-start space-x-4 mt-4">
                <a href="https://www.instagram.com/_2ibca/" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
                  <img src="/fotos/ícones/instagram-preta.png" alt="Instagram" className="h-6 w-6" />
                </a>
                <a href="https://www.youtube.com/@2IBCARECIFE" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
                  <img src="/fotos/ícones/youtube-preta.png" alt="YouTube" className="h-6 w-6" />
                </a>
                <a href="https://wa.me/message/YHZLZY6LT73HO1" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
                  <img src="/fotos/ícones/whatsapp-preta.png" alt="WhatsApp" className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Coluna de Contato */}
            <div className="w-full sm:w-1/2 md:w-auto mb-8 md:mb-0">
              <h4 className="font-bold text-base mb-3">Contato</h4>
              {/* --- ALTERAÇÃO AQUI: de 'text-sm' para 'text-base' --- */}
              <ul className="space-y-3 text-base">
                <li className="flex items-center justify-center md:justify-start">
                  <img src="/fotos/ícones/whatsapp-preta.png" alt="WhatsApp" className="h-5 w-5 mr-2" />
                  <span>(81) 90000-0000</span>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <img src="/fotos/ícones/telefone.png" alt="Telefone" className="h-5 w-5 mr-2" />
                  <span>(81) 90000-0000</span>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <img src="/fotos/ícones/email.png" alt="Email" className="h-5 w-5 mr-2" />
                  <span>contato@segundaigreja.org.br</span>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                   <a href="https://www.google.com/maps/search/?api=1&query=Rua+Santa+Izabel,+425+-+Recife,+PE" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                      <img src="/fotos/ícones/localizacao.png" alt="Localização" className="h-5 w-5 mr-2" />
                      <span>Rua Santa Izabel, 425 - Casa Amarela</span>
                   </a>
                </li>
              </ul>
            </div>
            
            {/* Coluna de Outros Links */}
            <div className="w-full sm:w-1/2 md:w-auto">
              <h4 className="font-bold text-base mb-3">Acesso</h4>
              <ul className="space-y-2 text-base">
                {user ? (
                  // Se o usuário estiver logado, mostra o link para o Dashboard
                  <li><Link to="/dashboard" className="hover:text-blue-600 transition-colors">Menu do Usuário</Link></li>
                ) : (
                  // Se não, mostra o link de Login
                  <li><Link to="/login" className="hover:text-blue-600 transition-colors">Login / Acesso Membros</Link></li>
                )}
              </ul>
            </div>
          </div>

          {/* Componente do Spotify */}
          <div className="text-center mt-10">
            <iframe
              title="Player do Spotify"
              src="https://open.spotify.com/embed/playlist/4s4pYRb5VFlQ2LqYtX5xhY? utm_source=generator&theme=0"
              width="80%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="mx-auto rounded-lg shadow-md"
            ></iframe>
          </div>
        </div>
      </footer>

      {/* Botão Flutuante do WhatsApp */}
      <a 
        href="https://wa.me/message/YHZLZY6LT73HO1" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 w-14 h-14 bg-[#25d366] rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 z-30"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <img src="/fotos/ícones/whatsapp.png" alt="WhatsApp" className="w-8 h-8" />
      </a>
    </>
  );
}

export default Footer;