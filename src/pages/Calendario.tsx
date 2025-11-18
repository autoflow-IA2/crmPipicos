import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';
import { useCalendario, CalendarEvent, CORES_TIPO_SERVICO } from '../hooks';
import { Loading } from '../components/common';
import { TipoServico } from '../types/agendamento.types';

// Configuração do localizador com date-fns em português
const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
});

// Mensagens em português
const messages = {
  allDay: 'Dia inteiro',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há eventos neste período.',
  showMore: (total: number) => `+ ${total} mais`,
};

const Calendario: React.FC = () => {
  const navigate = useNavigate();
  const { events, isLoading, getEventColor } = useCalendario();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  // Navegar para os detalhes ao clicar no evento
  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      navigate(`/agendamentos/${event.id}`);
    },
    [navigate]
  );

  // Estilos personalizados para os eventos
  const eventStyleGetter = useCallback(
    (event: CalendarEvent) => {
      const backgroundColor = getEventColor(event);

      return {
        style: {
          backgroundColor,
          borderRadius: '5px',
          opacity: 0.9,
          color: 'white',
          border: '0px',
          display: 'block',
          fontWeight: '500',
          fontSize: '0.875rem',
        },
      };
    },
    [getEventColor]
  );

  // Componente customizado para exibir o evento
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="flex items-center gap-1 px-1">
      <span className="truncate">{event.title}</span>
    </div>
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Calendário de Agendamentos</h1>
          <p className="text-gray-600 mt-1">
            Visualize todos os seus agendamentos em um calendário interativo
          </p>
        </div>
      </div>

      {/* Legenda de Cores */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legenda - Tipos de Serviço</h3>
        <div className="flex flex-wrap gap-4">
          {(Object.entries(CORES_TIPO_SERVICO) as [TipoServico, string][]).map(([tipo, cor]) => (
            <div key={tipo} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: cor }}
              />
              <span className="text-sm text-gray-600 capitalize">
                {tipo === 'brinquedos' && 'Brinquedos'}
                {tipo === 'recreacao' && 'Recreação'}
                {tipo === 'decoracao' && 'Decoração'}
                {tipo === 'completo' && 'Completo'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Total de Eventos</div>
          <div className="text-2xl font-bold text-primary-600">{events.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Brinquedos</div>
          <div className="text-2xl font-bold text-blue-600">
            {events.filter(e => e.tipoServico === 'brinquedos').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Recreação</div>
          <div className="text-2xl font-bold text-green-600">
            {events.filter(e => e.tipoServico === 'recreacao').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Decoração</div>
          <div className="text-2xl font-bold text-amber-600">
            {events.filter(e => e.tipoServico === 'decoracao').length}
          </div>
        </div>
      </div>

      {/* Calendário */}
      <div className="bg-white rounded-lg shadow-md p-6 flex-1" style={{ minHeight: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture="pt-BR"
          messages={messages}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent,
          }}
          popup
          selectable
          tooltipAccessor={(event: CalendarEvent) => {
            const horario = `${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}`;
            return `${event.title}\n${horario}\nTipo: ${event.tipoServico}`;
          }}
        />
      </div>

      {/* Dicas de Uso */}
      <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Dica:</strong> Clique em um evento para ver os detalhes completos do agendamento.
              Use os botões "Mês", "Semana" e "Dia" para alternar entre as visualizações.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendario;
