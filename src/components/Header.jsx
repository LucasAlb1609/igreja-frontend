import React, { useState, useEffect } from 'react';
// 1. Importe o 'useLocation' do React Router
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  // ... (a estrutura do menuItems continua a mesma, sem alterações)
  {
    title: 'Nossa Igreja',
    submenu: [
      { title: 'História', path: '/historia' },
      { title: 'Liderança', path: '/lideranca' },
      { title: 'Departamentos', path: '/departamentos' },
      { title: 'Congregações', path: '/congregacoes' },
    ],
  },
  {
    title: 'Agenda',
    submenu: [
      { title: 'Agenda Semanal', path: '/agenda' },
      { title: 'EBD', path: '/ebd' },
      { title: 'Aulas de Música', path: '/aulas-musica' },
    ],
  },
  {
    title: 'Podcast',
    submenu: [
      { title: 'YouTube', path: 'https://youtube.com/playlist?list=PLkrOlM1LjMj9zNXqcBwkjMMZLU9fdSmOO', external: true, icon: '/fotos/ícones/youtube.png' },
      { title: 'Spotify', path: 'https://open.spotify.com/show/your-show-id', external: true, icon: '/fotos/ícones/spotify.png' },
    ],
  },
  {
    title: 'Contato',
    submenu: [
      { title: 'Instagram', path: 'https://www.instagram.com/_2ibca/', external: true, icon: '/fotos/ícones/instagram.png' },
      { title: 'WhatsApp', path: 'https://wa.me/message/YHZLZY6LT73HO1', external: true, icon: '/fotos/ícones/whatsapp.png' },
    ],
  },
];

function Header() {
  const logoUrl = '/fotos/logo.png';
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // 2. Pegue a localização atual (URL)
  const location = useLocation();

  const handleMobileDropdownToggle = (title) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  // 3. Efeito para fechar o menu mobile sempre que a rota mudar
  useEffect(() => {
    closeMobileMenu();
  }, [location]); // A mágica acontece aqui: "escute" as mudanças na location

  return (
    <header className="bg-blue-600 text-white p-2 flex items-center justify-between sticky top-0 z-50 shadow-md font-sans not-italic">
      {/* Logo com o onClick para fechar o menu instantaneamente */}
      <div className="flex items-end flex-shrink-0">
        <Link to="/" onClick={closeMobileMenu}>
          <img src={logoUrl} alt="Logo 2IBCA" className="h-16 w-auto transition-transform duration-300 hover:scale-110" />
        </Link>
        <Link to="/" onClick={closeMobileMenu} className="no-underline text-white ml-2 hidden lg:block">
          <h5 className="text-sm font-bold leading-tight" style={{ fontFamily: "'Arial Rounded MT Bold', Arial, sans-serif" }}>
            SEGUNDA IGREJA<br />BATISTA EM CASA AMARELA
          </h5>
        </Link>
      </div>

      {/* Navegação */}
      <nav>
        {/* Menu Desktop (sem alterações) */}
        <ul className="hidden md:flex space-x-2">
          {menuItems.map((item, index) => {
            const isLastItem = index === menuItems.length - 1;
            return (
              <li key={item.title} className="group relative">
                <button className="font-semibold px-4 py-2 rounded-md hover:bg-blue-500 transition-colors flex items-center">
                  {item.title}
                  {item.submenu && (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  )}
                </button>
                {item.submenu && (
                  <div className={`absolute top-full ${isLastItem ? 'right-0' : 'left-0'} bg-white text-black shadow-lg rounded-md pt-2 w-56 invisible opacity-0 group-hover:visible group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-in-out z-50`}>
                    <div className="py-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <div key={subItem.title} className="px-1">
                          {subIndex > 0 && <div className="h-px bg-gray-200 mx-3"></div>}
                          {subItem.external ? (
                            <a href={subItem.path} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-500 hover:text-white rounded-md transition-colors">
                              {subItem.icon && <img src={subItem.icon} alt={subItem.title} className="w-5 h-5 mr-3" />} {subItem.title}
                            </a>
                          ) : (
                            <Link to={subItem.path} className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-500 hover:text-white rounded-md transition-colors">
                              {subItem.icon && <img src={subItem.icon} alt={subItem.title} className="w-5 h-5 mr-3" />} {subItem.title}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {/* Botão Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Menu Mobile (o onClick nos links finais não é mais a única forma de fechar) */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white text-blue-600 shadow-xl md:hidden z-40">
           <ul className="divide-y divide-gray-200">
            {menuItems.map((item) => (
              <li key={item.title}>
                <button onClick={() => handleMobileDropdownToggle(item.title)} className="font-bold px-4 py-3 flex justify-between items-center w-full text-left">
                  <span>{item.title}</span>
                  {item.submenu && (
                    <svg className={`w-5 h-5 transition-transform duration-300 ${openDropdown === item.title ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  )}
                </button>
                {item.submenu && openDropdown === item.title && (
                  <div className="bg-gray-50">
                    {item.submenu.map((subItem) => (
                       subItem.external ? (
                        <a key={subItem.title} href={subItem.path} target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="flex items-center pl-8 pr-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-100">
                           {subItem.icon && <img src={subItem.icon} alt={subItem.title} className="w-4 h-4 mr-3" />} {subItem.title}
                        </a>
                       ) : (
                        <Link key={subItem.title} to={subItem.path} className="flex items-center pl-8 pr-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-100">
                           {subItem.icon && <img src={subItem.icon} alt={subItem.title} className="w-4 h-4 mr-3" />} {subItem.title}
                        </Link>
                       )
                    ))}
                  </div>
                )}
              </li>
            ))}
           </ul>
        </div>
      )}
    </header>
  );
}

export default Header;