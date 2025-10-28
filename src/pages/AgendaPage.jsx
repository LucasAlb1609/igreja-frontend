import React, { useState , useEffect } from 'react';
import API_URL from '../services/api';

function AgendaPage() {
  const [agendaData, setAgendaData] = useState({ dias_semana: [], eventos_especiais: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para controlar qual card de dia está aberto (guardamos o 'nome' do dia, que é o ID numérico)
  const [diaAberto, setDiaAberto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/genda/`);
        if (!response.ok) {
          throw new Error('Não foi possível buscar os dados da agenda.');
        }
        const data = await response.json();
        setAgendaData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleDia = (nomeDia) => {
    // Se o dia clicado já está aberto, fecha. Se não, abre o novo.
    setDiaAberto(diaAberto === nomeDia ? null : nomeDia);
  };

  if (loading) return <div className="flex justify-center items-center h-screen font-semibold italic">Carregando Agenda...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500 font-semibold italic">Erro: {error}</div>;

  return (
    // Cor de fundo da página retirada do seu agenda.css (--cor-fundo-pagina)
    <div className="font-sans not-italic bg-[#f2f0e4] py-16">
      <div className="container mx-auto px-4">
        
        {/* Grade principal (dias da semana) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Cabeçalho da Agenda */}
          <div className="flex flex-col justify-center p-5">
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 leading-tight mb-4">
              Agenda <strong className="font-bold">Semanal</strong>
            </h1>
            <p className="text-gray-600 mb-2">Confira nossa programação semanal e participe dos eventos e celebrações da nossa comunidade.</p>
            <p className="text-sm text-gray-500">Clique em um dia para ver os eventos.</p>
          </div>

          {/* Mapeando os dias da semana */}
          {agendaData.dias_semana.map((dia) => (
            <div key={dia.nome} className="transition-transform duration-300 hover:-translate-y-1">
              {/* Card Clicável */}
              <div 
                className="bg-white rounded-xl shadow-md cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
                onClick={() => handleToggleDia(dia.nome)}
              >
                <div className="bg-blue-500 text-white text-center p-3">
                  <h3 className="text-xl font-semibold">{dia.nome_display}</h3>
                </div>
                <div className="p-6 flex flex-col items-center text-center gap-2">
                  <img src={`/fotos/ícones/agenda/${dia.icone}.png`} alt={`Ícone de ${dia.nome_display}`} className="w-12 h-12 mb-2" />
                  <p className="text-gray-500 text-sm">{dia.resumo}</p>
                </div>
              </div>

              {/* Conteúdo Expansível (Eventos do Dia) */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${diaAberto === dia.nome ? 'max-h-96 mt-2' : 'max-h-0'}`}
              >
                <div className="bg-white rounded-xl shadow-md p-4">
                  {dia.eventos.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {dia.eventos.map(evento => (
                        <li key={evento.id} className="py-3 flex justify-between items-center">
                          <div>
                            <h5 className="font-semibold text-gray-800">{evento.titulo}</h5>
                            {evento.descricao && <p className="text-sm text-gray-600">{evento.descricao}</p>}
                          </div>
                          <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full ml-4">
                            {evento.horario}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-gray-500 py-4">Nenhum evento programado para este dia.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seção de Eventos Especiais */}
        {agendaData.eventos_especiais.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Eventos Especiais</h2>
            <div className="space-y-4">
              {agendaData.eventos_especiais.map(evento => (
                <div key={evento.id} className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div>
                    <h3 className="font-bold text-lg text-blue-800">{evento.titulo}</h3>
                    <p className="text-blue-700 mt-1">{evento.descricao}</p>
                  </div>
                  <div className="text-blue-800 font-bold text-lg mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                    {evento.periodo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default AgendaPage;

