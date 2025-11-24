import type {
  DisponibilidadeRequest,
  DisponibilidadeResponse,
  VerificarMultiplosRequest,
  DisponibilidadeMultiplosResponse,
  DisponibilidadePeriodoRequest,
  DisponibilidadePeriodoItem,
} from '../types/inventario.types';

// URL base da API do backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

/**
 * Serviço de inventário - chama a API backend para verificar disponibilidade
 */
export const inventarioService = {
  /**
   * Verifica disponibilidade de um único brinquedo
   */
  async verificarDisponibilidade(
    request: DisponibilidadeRequest
  ): Promise<DisponibilidadeResponse> {
    const response = await fetch(`${API_URL}/inventario/verificar-disponibilidade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao verificar disponibilidade');
    }

    return response.json();
  },

  /**
   * Verifica disponibilidade de múltiplos brinquedos de uma vez
   */
  async verificarDisponibilidadeMultiplos(
    request: VerificarMultiplosRequest
  ): Promise<DisponibilidadeMultiplosResponse> {
    const response = await fetch(`${API_URL}/inventario/verificar-multiplos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao verificar disponibilidade');
    }

    return response.json();
  },

  /**
   * Obtém disponibilidade de itens em um período (para calendário)
   */
  async obterDisponibilidadePeriodo(
    request: DisponibilidadePeriodoRequest
  ): Promise<DisponibilidadePeriodoItem[]> {
    const params = new URLSearchParams({
      data_inicio: request.data_inicio,
      data_fim: request.data_fim,
    });

    if (request.brinquedo_nome) {
      params.append('brinquedo_nome', request.brinquedo_nome);
    }

    const response = await fetch(`${API_URL}/inventario/disponibilidade-periodo?${params}`, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao obter disponibilidade do período');
    }

    return response.json();
  },

  /**
   * Finaliza eventos passados (libera inventário)
   */
  async finalizarEventosPassados(): Promise<{ finalizados: number; ids: string[] }> {
    const response = await fetch(`${API_URL}/inventario/finalizar-eventos-passados`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao finalizar eventos passados');
    }

    return response.json();
  },
};
