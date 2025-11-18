import React, { useState } from 'react';
import { Button, Loading } from '../components/common';
import { useBrinquedos } from '../hooks';

const Estoque: React.FC = () => {
  const { data: brinquedos = [], isLoading, error } = useBrinquedos();
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');

  const brinquedosFiltrados = filtroCategoria
    ? brinquedos.filter((b) => b.categoria === filtroCategoria)
    : brinquedos;

  const categorias = [...new Set(brinquedos.map((b) => b.categoria).filter(Boolean))];

  const totalUnidades = brinquedosFiltrados.reduce(
    (acc, b) => acc + b.quantidade_estoque,
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" message="Carregando estoque..." />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Estoque de Brinquedos</h1>
        <Button variant="primary">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4"></path>
            </svg>
            Novo Brinquedo
          </span>
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-black">Total de Brinquedos</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {brinquedosFiltrados.length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-black">Unidades em Estoque</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{totalUnidades}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-black">Categorias</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {categorias.length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-yellow-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-black">
            Filtrar por categoria:
          </label>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {filtroCategoria && (
            <button
              onClick={() => setFiltroCategoria('')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Limpar filtro
            </button>
          )}
        </div>
      </div>

      {/* Lista de Brinquedos */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Erro ao carregar brinquedos. Por favor, tente novamente.
        </div>
      )}

      {brinquedos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12">
          <div className="text-center text-black">
            <svg className="w-24 h-24 mx-auto mb-4 text-purple-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h2 className="text-2xl font-bold mb-2">Nenhum brinquedo cadastrado</h2>
            <p className="text-gray-700 mb-4">
              Importe os brinquedos executando o arquivo SQL no Supabase
            </p>
            <p className="text-sm text-gray-600">
              Consulte o arquivo: <code className="bg-gray-100 px-2 py-1 rounded">supabase/import-brinquedos.sql</code>
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brinquedosFiltrados.map((brinquedo) => (
            <div
              key={brinquedo.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagem placeholder */}
              <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <svg className="w-24 h-24 text-white opacity-50" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-black flex-1">
                    {brinquedo.nome}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      brinquedo.status === 'disponivel'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {brinquedo.status}
                  </span>
                </div>

                {brinquedo.categoria && (
                  <p className="text-sm font-bold text-purple-600 mb-2">
                    {brinquedo.categoria}
                  </p>
                )}

                {brinquedo.descricao && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {brinquedo.descricao}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-xs font-bold text-black">Valor Locação</p>
                    <p className="text-xl font-bold text-black">
                      R$ {brinquedo.valor_locacao?.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-black">Estoque</p>
                    <p className="text-xl font-bold text-black">
                      {brinquedo.quantidade_estoque} un
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Estoque;
