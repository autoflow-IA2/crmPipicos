/**
 * Serviço de integração com ViaCEP API
 * Para busca automática de endereço por CEP
 */

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AddressData {
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
}

/**
 * Busca endereço pelo CEP
 * @param cep - CEP com ou sem formatação
 * @returns Dados do endereço ou null se não encontrado
 */
export const fetchAddressByCEP = async (cep: string): Promise<AddressData | null> => {
  try {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');

    // Valida formato do CEP
    if (cleanCEP.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    // Faz a requisição para a API ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);

    if (!response.ok) {
      throw new Error('Erro ao consultar CEP');
    }

    const data: ViaCEPResponse = await response.json();

    // Verifica se houve erro na consulta
    if (data.erro) {
      return null;
    }

    // Retorna os dados formatados
    return {
      cep: data.cep,
      endereco: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};

/**
 * Hook personalizado para buscar CEP
 */
export const useCEPLookup = () => {
  const lookup = async (cep: string): Promise<AddressData | null> => {
    return await fetchAddressByCEP(cep);
  };

  return { lookup };
};
