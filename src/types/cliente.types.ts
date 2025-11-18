export interface Cliente {
  id: string;
  created_at: string;
  updated_at: string;

  // Dados Pessoais
  nome: string;
  cpf_cnpj?: string;
  email?: string;
  telefone: string;
  telefone_alternativo?: string;
  data_nascimento?: string;

  // Endereço
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;

  // Observações
  observacoes?: string;

  // Metadados
  usuario_criacao?: string;
  usuario_atualizacao?: string;

  // Status
  ativo: boolean;
}

export interface CreateClienteDTO {
  // Dados Pessoais (obrigatórios)
  nome: string;
  telefone: string;

  // Dados Pessoais (opcionais)
  cpf_cnpj?: string;
  email?: string;
  telefone_alternativo?: string;
  data_nascimento?: string;

  // Endereço
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;

  // Observações
  observacoes?: string;

  // Status
  ativo?: boolean;
}

export interface UpdateClienteDTO extends Partial<CreateClienteDTO> {
  id: string;
}

export interface ClienteComAgendamentos extends Cliente {
  total_agendamentos?: number;
  ultimo_agendamento?: string;
  valor_total_gasto?: number;
}
