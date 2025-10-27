import React from 'react';
import Slider from 'react-slick';
import useOnScreen from '../hooks/useOnScreen';
import { NextArrow, PrevArrow } from '../components/CarouselControls';

// --- DADOS FIXOS ---
const pastores = [
  { nome: 'Pastor Severino Belo', periodo: '1943 - aprox. 3 meses', desc: 'Pastor Fundador', foto: '/fotos/logo.jpg' },
  { nome: 'Pastor Manoel Machado', periodo: '1944 a 1953', desc: 'Adm. Construção do 1º Templo', foto: '/fotos/logo.jpg' },
  { nome: 'Pastor Albérico de Souza', periodo: '1954 a 1957', desc: 'Amava as crianças e as flores', foto: '/fotos/logo.jpg' },
  { nome: 'Pastor Severino Cardoso', periodo: '1958 a 1962', desc: 'Adm. Construção da Casa Pastoral', foto: '/fotos/logo.jpg' },
  { nome: 'Pastor Rosivaldo de Araújo', periodo: '1963 a 1971', desc: 'Período de Avivamento Espiritual', foto: '/fotos/logo.jpg' },
  { nome: 'Pastor Leandro Dias', periodo: '1971 - 11 meses', desc: 'Pastor', foto: '/fotos/logo.jpg' },
  { nome: 'Pastor Pedro Andrade', periodo: 'Interino (1971) e Efetivo (1975)', desc: 'Expansão do Evangelho', foto: '/fotos/logo.jpg' },
  { nome: 'Pastor Carlos Pezzotti', periodo: '1972 a 1974', desc: 'Pastor', foto: '/fotos/logo.jpg' },
  { nome: 'Pastor João Gomes', periodo: 'Auxiliar em 1999 e presidente desde 2008', desc: 'Evangelismo e Discipulado', foto: '/fotos/joao.jpg' },
  { nome: 'Pastor Elcias R. Martins', periodo: 'De 2008 a 2017', desc: 'Vice-presidente', foto: '/fotos/logo.jpg' },
  { nome: 'Pastor Romildo S. de Melo', periodo: 'Desde 2018', desc: 'Vice-presidente', foto: '/fotos/romildo.jpg' },
];

const memorial = [
    { nome: 'Pr. Pedro Pereira de Andrade', foto: '/fotos/logo.jpg' },
    { nome: 'Pr. Solon Oliveira Araújo', foto: '/fotos/logo.jpg' },
    { nome: 'Jorge Freitas', foto: '/fotos/logo.jpg' },
    { nome: 'Jaqueline Nogueira', foto: '/fotos/logo.jpg' },
    { nome: 'Ana Paula Vilanova da Silva', foto: '/fotos/logo.jpg' },
    { nome: 'Severina Farias', foto: '/fotos/logo.jpg' },
    { nome: 'Josefa Alves', foto: '/fotos/logo.jpg' },
];

const pilaresMissao = [
    { nome: 'Adoração', icone: '/fotos/ícones/adoracao.png' },
    { nome: 'Edificação', icone: '/fotos/ícones/biblia.png' },
    { nome: 'Comunhão', icone: '/fotos/ícones/comunhao.png' },
    { nome: 'Proclamação', icone: '/fotos/ícones/proclamar.png' },
    { nome: 'Serviço Social Cristão', icone: '/fotos/ícones/social.png' },
]

function HistoriaPage() {
  const [pastoresRef, isPastoresVisible] = useOnScreen({ threshold: 0.1 });
  const [memorialRef, isMemorialVisible] = useOnScreen({ threshold: 0.1 });

  const baseCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const settingsPastores = {
    ...baseCarouselSettings,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: isPastoresVisible,
    arrows: true,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const settingsMemorial = {
      ...baseCarouselSettings,
      slidesToShow: 4,
      arrows: false,
      autoplay: isMemorialVisible,
      responsive: [
          { breakpoint: 992, settings: { slidesToShow: 3 } },
          { breakpoint: 768, settings: { slidesToShow: 2 } },
          { breakpoint: 576, settings: { slidesToShow: 1 } },
      ]
  };
  
  return (
    <div className="font-sans not-italic">
      {/* Seção Principal */}
      <section className="py-20 bg-[#f6efdf]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full md:w-1/2 px-4">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <img src="/fotos/Fachada.jpg" alt="Fachada da Igreja" className="rounded-lg w-full" />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4 mt-8 md:mt-0">
              <h1 className="text-5xl font-semibold italic mb-2">Nossa História</h1>
              <h2 className="text-xl mb-4 italic"><strong>Uma jornada de fé e dedicação desde 1943.</strong></h2>
              <h3 className="text-2xl font-medium italic">Segunda Igreja Batista em Casa Amarela</h3>
              <p className="mt-2 text-gray-700 leading-relaxed">Nossa igreja tem uma rica história de fé, dedicação e serviço à comunidade. Ao longo de décadas, temos sido abençoados com crescimento e transformação, sempre mantendo nosso compromisso com a proclamação do Evangelho.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Fundação */}
      <section className="py-20 bg-[#0caaed] text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full md:w-1/2 px-4 md:order-2">
               <div className="bg-white rounded-xl p-4 shadow-lg">
                <img src="/fotos/membros_fundadores.jpeg" alt="Membros fundadores" className="rounded-lg w-full" />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4 md:order-1 mt-8 md:mt-0">
              <h2 className="text-4xl font-semibold italic mb-4">Fundação</h2>
              <div className="bg-white/20 border border-white/30 rounded-lg shadow-sm p-6 text-lg">
                <p className="mb-0 text-white">Fundada em <strong>10 de setembro de 1943</strong> - Organizada pela Igreja Batista de Escada com 43 membros fundadores.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seção Perfil da Igreja */}
      <section className="py-20 bg-[#f6efdf]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full md:w-1/2 px-4">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                  <img src="/fotos/joao-2.jpg" alt="Perfil da Igreja" className="rounded-lg w-full" />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4 mt-8 md:mt-0">
              <h2 className="text-4xl font-semibold italic mb-4">Perfil da Igreja</h2>
              <p className="text-gray-700 leading-relaxed">A Segunda Igreja Batista em Casa Amarela dedica-se à proclamação do Evangelho e ao avanço do Reino de Deus, buscando se enquadrar no modelo de estratégia dada por Jesus Cristo em Atos 1:8: <em className="italic">"Mas recebereis poder ao descer sobre vós o Espírito Santo e ser-me-eis testemunhas, tanto em Jerusalém, como em toda a Judéia, Samaria e até os confins da terra."</em> É para este alvo que direcionamos todas as atividades que fazem parte da missão da igreja aqui na terra.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Missão */}
      <section className="py-20 bg-[#0caaed] text-white">
        <div className="container mx-auto px-4">
          <div className="text-left mb-10">
              <h2 className="text-4xl font-semibold italic">Missão</h2>
              <p className="lead text-lg">Missão baseada em cinco pilares fundamentais:</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {pilaresMissao.map(pilar => (
                  <div key={pilar.nome} className="text-center transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer">
                      <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col justify-center items-center">
                          <img src={pilar.icone} alt={pilar.nome} className="h-20 w-20 mx-auto mb-4" />
                          <h5 className="font-semibold">{pilar.nome}</h5>
                      </div>
                  </div>
              ))}
          </div>
        </div>
      </section>

      {/* --- ALTERAÇÃO AQUI: ANEXANDO A REF --- */}
      <section ref={pastoresRef} className="py-20 bg-[#f6efdf]">
        <div className="container mx-auto px-4">
            <div className="text-right mb-10">
                <h2 className="text-4xl font-semibold italic">Pastorado</h2>
                <p className="lead text-gray-600">Conheça os pastores que lideraram nossa igreja ao longo dos anos:</p>
            </div>
            <Slider {...settingsPastores}>
                {pastores.map((pastor) => (
                    <div key={pastor.nome} className="px-4">
                        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 text-center h-full flex flex-col">
                            <img src={pastor.foto} alt={pastor.nome} className="w-40 h-40 object-cover mx-auto border-4 border-orange-300 rounded-md" />
                            <h5 className="font-bold text-xl mt-4">{pastor.nome}</h5>
                            <p className="text-gray-500 text-sm">{pastor.desc}</p>
                            <p className="text-gray-700 mt-auto pt-4 font-semibold">{pastor.periodo}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
      </section>
      
      {/* --- ALTERAÇÃO AQUI: ANEXANDO A REF --- */}
      <section ref={memorialRef} className="py-20 bg-[#0caaed] text-white">
        <div className="container mx-auto px-4">
            <div className="text-left mb-10 max-w-3xl">
                <h2 className="text-4xl font-semibold italic">Memorial de 13 de setembro de 2008</h2>
                <p className="lead text-lg">Durante uma viagem missionária a Bom Jardim do Araripe, um acidente de ônibus causou a perda de sete vidas preciosas, incluindo o Pastor Pedro Pereira de Andrade e o Pastor Solon de Araujo Oliveira. Foi um momento de grande dor para a igreja e toda a comunidade.</p>
            </div>
            <Slider {...settingsMemorial}>
                {memorial.map((pessoa) => (
                    <div key={pessoa.nome} className="px-4">
                        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 text-center h-full flex flex-col items-center">
                            <img src={pessoa.foto} alt={pessoa.nome} className="w-36 h-36 object-cover mx-auto border-4 border-gray-400 rounded-full mb-4" />
                            <h5 className="font-semibold text-lg mt-auto">{pessoa.nome}</h5>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
      </section>
    </div>
  );
}

export default HistoriaPage;