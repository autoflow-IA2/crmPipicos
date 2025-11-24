import React, { useState } from 'react';
import { Button } from '../components/common';

const ApiDocs: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');

  const baseUrl = 'http://localhost:3001';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  // Função para gerar API Key segura
  const generateApiKey = () => {
    // Gera uma string aleatória segura usando crypto API
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const key = btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    setGeneratedKey(key);
    setApiKey(key);
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
              Gerar Nova API Key:
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button onClick={generateApiKey} variant="primary">
                  🔑 Gerar API Key Segura
                </Button>
                <Button
                  onClick={() => copyToClipboard(generatedKey || apiKey)}
                  variant="secondary"
                  disabled={!generatedKey && !apiKey}
                >
                  Copiar
                </Button>
              </div>

              {generatedKey && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-green-800 mb-2">✅ API Key gerada com sucesso!</h4>
                      <div className="bg-white rounded border border-green-300 p-3 mb-2">
                        <code className="text-sm text-purple-600 break-all font-mono">
                          {generatedKey}
                        </code>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-green-700">
                          📋 Próximos passos:
                        </p>
                        <ol className="list-decimal list-inside text-sm text-green-700 space-y-1 ml-2">
                          <li>Copie a chave usando o botão "Copiar" acima</li>
                          <li>Abra o arquivo <code className="bg-white px-1 rounded">backend/.env</code></li>
                          <li>Cole a chave na linha: <code className="bg-white px-1 rounded">API_KEY=sua-chave-aqui</code></li>
                          <li>Reinicie o servidor backend</li>
                          <li>Use esta chave nos testes abaixo</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-600">
                💡 Gere uma chave segura de 256 bits para proteger sua API
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-bold text-black mb-2">
              Ou cole sua API Key existente (para testar):
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole sua API Key aqui para testar os exemplos"
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

        {/* Seção de Inventário */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 my-8 border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-black mb-2">📦 Inventário e Disponibilidade</h2>
          <p className="text-black font-bold">
            Endpoints para gerenciar disponibilidade de brinquedos em tempo real, verificar conflitos e liberar estoque automaticamente.
          </p>
        </div>

        {/* Verificar Disponibilidade de Um Item */}
        <EndpointCard
          method="POST"
          endpoint="/api/inventario/verificar-disponibilidade"
          title="Verificar Disponibilidade de um Brinquedo"
          description="Verifica disponibilidade de um brinquedo pelo NOME (case-insensitive). Considera reservas existentes e retorna quantidade disponível e conflitos. Se houver múltiplos brinquedos com nomes similares, retorna erro."
          apiKey={apiKey}
          baseUrl={baseUrl}
          body={{
            brinquedo_nome: "TOTÓ MADEIRA",
            data_evento: "2025-12-25",
            hora_inicio: "14:00",
            hora_fim: "18:00",
            quantidade_desejada: 1,
            excludeAgendamentoId: "uuid-opcional-para-edicao"
          }}
          response={{
            nome: "TOTÓ MADEIRA",
            quantidade_total: 2,
            quantidade_reservada: 1,
            quantidade_disponivel: 1,
            disponivel: true,
            conflitos: [
              {
                agendamento_id: "uuid-agendamento",
                cliente_nome: "João Silva",
                quantidade_reservada: 1,
                data_evento: "2025-12-25",
                hora_inicio: "15:00",
                hora_fim: "17:00",
                status: "confirmado"
              }
            ]
          }}
        />

        {/* Verificar Múltiplos Itens */}
        <EndpointCard
          method="POST"
          endpoint="/api/inventario/verificar-multiplos"
          title="Verificar Disponibilidade de Múltiplos Brinquedos"
          description="Verifica disponibilidade de vários brinquedos de uma só vez usando NOMES (case-insensitive). Útil para validar um agendamento completo antes de criar."
          apiKey={apiKey}
          baseUrl={baseUrl}
          body={{
            items: [
              { brinquedo_nome: "TOTÓ MADEIRA", quantidade_desejada: 1 },
              { brinquedo_nome: "PULA-PULA GRANDE", quantidade_desejada: 2 }
            ],
            data_evento: "2025-12-25",
            hora_inicio: "14:00",
            hora_fim: "18:00",
            excludeAgendamentoId: "uuid-opcional"
          }}
          response={{
            todos_disponiveis: true,
            items: [
              {
                nome: "TOTÓ MADEIRA",
                quantidade_total: 3,
                quantidade_reservada: 0,
                quantidade_disponivel: 3,
                disponivel: true,
                conflitos: []
              },
              {
                nome: "PULA-PULA GRANDE",
                quantidade_total: 2,
                quantidade_reservada: 0,
                quantidade_disponivel: 2,
                disponivel: true,
                conflitos: []
              }
            ]
          }}
        />

        {/* Disponibilidade por Período */}
        <EndpointCard
          method="GET"
          endpoint="/api/inventario/disponibilidade-periodo"
          title="Consultar Disponibilidade por Período"
          description="Retorna disponibilidade de todos os brinquedos em um período específico. Pode filtrar por NOME do brinquedo (case-insensitive). Ideal para visualização em calendário e dashboards."
          apiKey={apiKey}
          baseUrl={baseUrl}
          queryParams={[
            { name: 'data_inicio', description: 'Data inicial do período (YYYY-MM-DD) - obrigatório' },
            { name: 'data_fim', description: 'Data final do período (YYYY-MM-DD) - obrigatório' },
            { name: 'brinquedo_nome', description: 'Filtrar por nome do brinquedo (case-insensitive) - opcional' }
          ]}
          example="/api/inventario/disponibilidade-periodo?data_inicio=2025-12-01&data_fim=2025-12-31&brinquedo_nome=TOTÓ MADEIRA"
          response={[
            {
              data: "2025-12-25",
              nome: "TOTÓ MADEIRA",
              quantidade_total: 2,
              quantidade_reservada: 1,
              quantidade_disponivel: 1,
              agendamentos: [
                {
                  agendamento_id: "uuid-agendamento",
                  cliente_nome: "Maria Santos",
                  quantidade: 1,
                  hora_inicio: "14:00",
                  hora_fim: "18:00",
                  status: "confirmado"
                }
              ]
            }
          ]}
        />

        {/* Finalizar Eventos Passados */}
        <EndpointCard
          method="POST"
          endpoint="/api/inventario/finalizar-eventos-passados"
          title="Finalizar Eventos Passados (Auto-Devolução)"
          description="Finaliza automaticamente eventos que já passaram há mais de 1 dia, liberando o inventário. Execute via cron job ou manualmente."
          apiKey={apiKey}
          baseUrl={baseUrl}
          response={{
            message: "Eventos passados finalizados com sucesso",
            finalizados: 3,
            ids: [
              "uuid-agendamento-1",
              "uuid-agendamento-2",
              "uuid-agendamento-3"
            ]
          }}
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

      {/* Gerenciamento de Inventário */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold text-black mb-4">📦 Como Funciona o Inventário</h2>

        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h3 className="text-lg font-bold text-black mb-2">✅ Reserva Automática</h3>
            <p className="text-black font-bold">
              Quando você cria um agendamento, os brinquedos são automaticamente "reservados"
              enquanto o status estiver como: <code className="bg-white px-2 py-1 rounded">pendente</code>,
              <code className="bg-white px-2 py-1 rounded mx-1">confirmado</code>,
              <code className="bg-white px-2 py-1 rounded mx-1">em_preparacao</code> ou
              <code className="bg-white px-2 py-1 rounded">entregue</code>.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <h3 className="text-lg font-bold text-black mb-2">🔄 Devolução Automática</h3>
            <p className="text-black font-bold mb-2">
              Não é necessário "devolver" manualmente! O sistema calcula disponibilidade em tempo real.
            </p>
            <ul className="list-disc list-inside text-black font-bold space-y-1">
              <li>Eventos com status <code className="bg-white px-1 rounded">finalizado</code> ou <code className="bg-white px-1 rounded">cancelado</code> liberam o inventário automaticamente</li>
              <li>Use o endpoint <code className="bg-white px-1 rounded">/finalizar-eventos-passados</code> para finalizar eventos antigos</li>
              <li>Configure um cron job para executar esse endpoint diariamente</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h3 className="text-lg font-bold text-black mb-2">⏰ Automatização com Cron Job</h3>
            <p className="text-black font-bold mb-2">Exemplo de configuração:</p>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              <p># n8n: Crie um Schedule Trigger (diariamente às 2h)</p>
              <p># → HTTP Request: POST {baseUrl}/api/inventario/finalizar-eventos-passados</p>
              <p className="mt-2"># Linux/Mac crontab:</p>
              <p>0 2 * * * curl -X POST {baseUrl}/api/inventario/finalizar-eventos-passados -H "X-API-Key: sua-chave"</p>
            </div>
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
