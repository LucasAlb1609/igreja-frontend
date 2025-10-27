import React, { useState, useEffect } from 'react';
import API_URL from '../services/api';
import Slider from 'react-slick';
import useOnScreen from '../hooks/useOnScreen';
import { NextArrow, PrevArrow } from '../components/CarouselControls';

function DepartamentoModal({ depto, onClose }) {
  if (!depto) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="w-full md:w-3/5">
          <img src={depto.imagem} alt={depto.nome} className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-2/5 p-8 flex flex-col overflow-y-auto">
          <h3 className="text-3xl font-bold mb-4">{depto.nome}</h3>
          <p className="text-gray-600 leading-relaxed flex-grow">{depto.descricao}</p>
          <button onClick={onClose} className="mt-6 self-end bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}


function DepartamentoCard({ depto, onClick }) {
  return (
    <div className="w-[300px] h-[420px] flex-shrink-0 bg-white border-8 border-white rounded-2xl shadow-lg flex flex-col overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" onClick={onClick}>
      <div className="h-[70%] overflow-hidden">
        <img src={depto.imagem} alt={depto.nome} className="w-full h-full object-cover" />
      </div>
      <div className="h-[30%] p-5 flex flex-col justify-center">
        <h4 className="font-bold text-xl text-gray-800">{depto.nome}</h4>
        <p className="text-sm text-gray-500">{depto.categoria_display}</p>
      </div>
    </div>
  );
}


function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepto, setSelectedDepto] = useState(null);
  const [sectionRef, isSectionVisible] = useOnScreen({ threshold: 0.1 });

  const baseCarouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/departamentos/`);
        if (!response.ok) throw new Error('Não foi possível buscar os dados dos departamentos.');
        const data = await response.json();
        setDepartamentos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const carouselSettings = {
    ...baseCarouselSettings,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: isSectionVisible,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  if (loading) return <div className="flex justify-center items-center h-screen font-semibold italic">Carregando Departamentos...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500 font-semibold italic">Erro: {error}</div>;

  // Extrai as categorias para renderização
  const categorias = Object.entries(departamentos);

  return (
    <div className="font-sans not-italic bg-[#f5eedf]">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 pt-16 pb-8 px-4 text-left">Departamentos</h1>
      </div>

      {categorias.map(([key, categoria], index) => {
        // Alterna a cor de fundo com base na categoria
        const bgColor = key === 'MUSICA' ? 'bg-[#f5eedf]' : 'bg-[#0caaed]';
        const textColor = key === 'MUSICA' ? 'text-gray-800' : 'text-white';

        return (
          <section key={key} ref={sectionRef} className={`${bgColor} ${textColor} py-12`}>
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-semibold mb-8 text-left">{categoria.nome_display}</h2>
              {categoria.lista.length > 0 ? (
                <Slider {...carouselSettings}>
                  {categoria.lista.map(depto => (
                    <div key={depto.id} className="px-3">
                      <DepartamentoCard depto={depto} onClick={() => setSelectedDepto(depto)} />
                    </div>
                  ))}
                </Slider>
              ) : (
                <p>Nenhum departamento encontrado nesta categoria.</p>
              )}
            </div>
          </section>
        );
      })}

      {selectedDepto && <DepartamentoModal depto={selectedDepto} onClose={() => setSelectedDepto(null)} />}
    </div>
  );
}

export default DepartamentosPage;