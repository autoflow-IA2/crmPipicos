import React, { useState } from 'react';
import { Button } from '../components/common';

const ApiDocs: React.FC = () => {
  const [apiKey, setApiKey] = useState('');

  const baseUrl = 'http://localhost:3001';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">📚 Documentação da API REST</h1>
        <p className="text-lg text-black font-bold">
          Integre o CRM de Agendamentos com n8n, Zapier, Make.com e outras ferramentas
        </p>
      </div>

      {/* Configuração */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-black mb-4">⚙️ Configuração</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Base URL:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={baseUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg font-mono text-sm"
              />
              <Button onClick={() => copyToClipboard(baseUrl)} variant="secondary">
                Copiar
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              API Key (configure no arquivo .env do backend):
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole sua API Key aqui para testar"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              A API Key deve ser enviada no header <code className="bg-gray-100 px-1 rounded">X-API-Key</code>
            </p>
          </div>
        </div>
      </div>

      {/* Autenticação */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-black mb-4">🔐 Autenticação</h2>
        <p className="text-black font-bold mb-4">
          Todas as requisições para <code className="bg-gray-100 px-2 py-1 rounded">/api/*</code> requerem autenticação via API Key.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm font-bold text-black mb-2">Header obrigatório:</p>
          <code className="text-sm text-purple-600">X-API-Key: sua-chave-api-aqui</code>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-6">
        {/* Health Check */}
        <EndpointCard
          method="GET"
          endpoint="/api/health"
          title="Health Check"
          description="Verifica se a API está funcionando"
          apiKey={apiKey}
          baseUrl={baseUrl}
          response={{
            success: true,
            data: {
              status: "OK",
              timestamp: "2025-11-19T10:30:00.000Z",
              uptime: 12345,
              environment: "development"
            }
          }}
        />

        {/* Listar Agendamentos */}
        <EndpointCard
          method="GET"
          endpoint="/api/agendamentos"
          title="Listar Agendamentos"
          description="Lista agendamentos com filtros opcionais"
          apiKey={apiKey}
          baseUrl={baseUrl}
          queryParams={[
            { name: 'data', description: 'Filtrar por data específica (YYYY-MM-DD)' },
            { name: 'dataInicio', description: 'Data inicial do período (YYYY-MM-DD)' },
            { name: 'dataFim', description: 'Data final do período (YYYY-MM-DD)' },
            { name: 'status', description: 'Filtrar por status' },
            { name: 'tipoServico', description: 'Filtrar por tipo de serviço' },
            { name: 'cliente', description: 'Buscar por nome do cliente' },
          ]}
          example="/api/agendamentos?dataInicio=2025-11-01&dataFim=2025-11-30&status=confirmado"
        />

        {/* Buscar por ID */}
        <EndpointCard
          method="GET"
          endpoint="/api/agendamentos/:id"
          title="Buscar Agendamento por ID"
          description="Retorna detalhes de um agendamento específico"
          apiKey={apiKey}
          baseUrl={baseUrl}
        />

        {/* Criar Agendamento */}
        <EndpointCard
          method="POST"
          endpoint="/api/agendamentos"
          title="Criar Agendamento"
          description="Cria um novo agendamento. Verifica automaticamente conflitos de horário."
          apiKey={apiKey}
          baseUrl={baseUrl}
          body={{
            cliente_nome: "Maria Santos",
            cliente_telefone: "11988888888",
            cliente_email: "maria@example.com",
            tipo_servico: "completo",
            data_evento: "2025-11-25",
            hora_inicio: "15:00",
            hora_fim: "19:00",
            tipo_evento: "Aniversário infantil",
            num_convidados: 50,
            valor_total: 800.00,
            valor_sinal: 200.00,
            forma_pagamento: "PIX",
          }}
        />

        {/* Atualizar Status */}
        <EndpointCard
          method="PATCH"
          endpoint="/api/agendamentos/:id/status"
          title="Atualizar Status"
          description="Atualiza apenas o status do agendamento"
          apiKey={apiKey}
          baseUrl={baseUrl}
          body={{
            status: "confirmado"
          }}
        />

        {/* Verificar Disponibilidade */}
        <EndpointCard
          method="POST"
          endpoint="/api/agendamentos/verificar-disponibilidade"
          title="Verificar Disponibilidade"
          description="Verifica se há conflitos de horário sem criar o agendamento"
          apiKey={apiKey}
          baseUrl={baseUrl}
          body={{
            dataEvento: "2025-11-25",
            horaInicio: "15:00",
            horaFim: "19:00"
          }}
        />

        {/* Deletar */}
        <EndpointCard
          method="DELETE"
          endpoint="/api/agendamentos/:id"
          title="Deletar Agendamento"
          description="Remove um agendamento"
          apiKey={apiKey}
          baseUrl={baseUrl}
        />
      </div>

      {/* Códigos de Erro */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold text-black mb-4">⚠️ Códigos de Erro</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Descrição</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm font-mono text-black">UNAUTHORIZED</td>
                <td className="px-6 py-4 text-sm text-black font-bold">API Key não fornecida</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-mono text-black">FORBIDDEN</td>
                <td className="px-6 py-4 text-sm text-black font-bold">API Key inválida</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-mono text-black">NOT_FOUND</td>
                <td className="px-6 py-4 text-sm text-black font-bold">Recurso não encontrado</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-mono text-black">VALIDATION_ERROR</td>
                <td className="px-6 py-4 text-sm text-black font-bold">Dados inválidos</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-mono text-black">DATABASE_ERROR</td>
                <td className="px-6 py-4 text-sm text-black font-bold">Erro no banco de dados</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Exemplos de Integração */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold text-black mb-4">🔗 Exemplos de Integração</h2>

        <div className="space-y-4">
          {/* n8n */}
          <div>
            <h3 className="text-lg font-bold text-black mb-2">n8n</h3>
            <ol className="list-decimal list-inside space-y-2 text-black font-bold">
              <li>Adicione um nó "HTTP Request"</li>
              <li>Configure o método (GET, POST, etc.)</li>
              <li>URL: <code className="bg-gray-100 px-1 rounded">{baseUrl}/api/agendamentos</code></li>
              <li>Headers: <code className="bg-gray-100 px-1 rounded">X-API-Key: sua-chave</code></li>
              <li>Execute e processe os dados</li>
            </ol>
          </div>

          {/* Zapier */}
          <div>
            <h3 className="text-lg font-bold text-black mb-2">Zapier</h3>
            <ol className="list-decimal list-inside space-y-2 text-black font-bold">
              <li>Use o módulo "Webhooks by Zapier"</li>
              <li>Escolha "GET" ou "POST"</li>
              <li>URL: <code className="bg-gray-100 px-1 rounded">{baseUrl}/api/agendamentos</code></li>
              <li>Headers: Adicione <code className="bg-gray-100 px-1 rounded">X-API-Key</code></li>
            </ol>
          </div>

          {/* Make.com */}
          <div>
            <h3 className="text-lg font-bold text-black mb-2">Make.com (Integromat)</h3>
            <ol className="list-decimal list-inside space-y-2 text-black font-bold">
              <li>Adicione módulo "HTTP"</li>
              <li>Selecione "Make a request"</li>
              <li>Configure URL e headers</li>
              <li>Parse a resposta JSON</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para cada endpoint
interface EndpointCardProps {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  endpoint: string;
  title: string;
  description: string;
  apiKey: string;
  baseUrl: string;
  queryParams?: { name: string; description: string }[];
  body?: any;
  response?: any;
  example?: string;
}

const EndpointCard: React.FC<EndpointCardProps> = ({
  method,
  endpoint,
  title,
  description,
  apiKey,
  baseUrl,
  queryParams,
  body,
  response,
  example,
}) => {
  const [showCurl, setShowCurl] = useState(false);

  const methodColors = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PATCH: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
  };

  const generateCurl = () => {
    const url = example ? `${baseUrl}${example}` : `${baseUrl}${endpoint}`;
    let curl = `curl -X ${method} "${url}"`;

    if (apiKey) {
      curl += ` \\\n  -H "X-API-Key: ${apiKey}"`;
    } else {
      curl += ` \\\n  -H "X-API-Key: sua-api-key-aqui"`;
    }

    if (body) {
      curl += ` \\\n  -H "Content-Type: application/json"`;
      curl += ` \\\n  -d '${JSON.stringify(body, null, 2)}'`;
    }

    return curl;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-md font-bold text-sm ${methodColors[method]}`}>
            {method}
          </span>
          <code className="text-lg font-mono text-purple-600">{endpoint}</code>
        </div>
      </div>

      <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
      <p className="text-black font-bold mb-4">{description}</p>

      {queryParams && queryParams.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-black mb-2">Query Parameters:</h4>
          <div className="space-y-1">
            {queryParams.map((param) => (
              <div key={param.name} className="flex gap-2 text-sm">
                <code className="bg-gray-100 px-2 py-1 rounded text-purple-600">{param.name}</code>
                <span className="text-black font-bold">- {param.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {example && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-black mb-2">Exemplo:</h4>
          <code className="block bg-gray-50 p-3 rounded text-sm text-purple-600 border border-gray-200">
            {baseUrl}{example}
          </code>
        </div>
      )}

      {body && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-black mb-2">Request Body (JSON):</h4>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto border border-gray-200">
            <code className="text-purple-600">{JSON.stringify(body, null, 2)}</code>
          </pre>
        </div>
      )}

      {response && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-black mb-2">Response (JSON):</h4>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto border border-gray-200">
            <code className="text-green-600">{JSON.stringify(response, null, 2)}</code>
          </pre>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => setShowCurl(!showCurl)}
          variant="secondary"
          size="sm"
        >
          {showCurl ? 'Esconder' : 'Mostrar'} cURL
        </Button>
        {showCurl && (
          <Button
            onClick={() => copyToClipboard(generateCurl())}
            variant="secondary"
            size="sm"
          >
            Copiar cURL
          </Button>
        )}
      </div>

      {showCurl && (
        <div className="mt-4">
          <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
            <code>{generateCurl()}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiDocs;
