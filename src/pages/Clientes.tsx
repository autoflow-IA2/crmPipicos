import React from 'react';
import { Button } from '../components/common';

const Clientes: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        <Button variant="primary">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4"></path>
            </svg>
            Novo Cliente
          </span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-12">
        <div className="text-center text-gray-500">
          <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <h2 className="text-2xl font-semibold mb-2">Gestão de Clientes</h2>
          <p className="text-gray-600">
            O módulo de clientes será implementado na próxima fase
          </p>
          <p className="text-sm mt-2 text-gray-500">
            Você poderá gerenciar todos os dados dos seus clientes aqui
          </p>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
