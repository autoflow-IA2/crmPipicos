import React from 'react';

const Calendario: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Calendário</h1>

      <div className="bg-white rounded-lg shadow-md p-12">
        <div className="text-center text-gray-500">
          <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h2 className="text-2xl font-semibold mb-2">Calendário de Agendamentos</h2>
          <p className="text-gray-600">
            O calendário visual será implementado na próxima fase
          </p>
          <p className="text-sm mt-2 text-gray-500">
            Utilizaremos a biblioteca react-big-calendar para visualização interativa
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calendario;
