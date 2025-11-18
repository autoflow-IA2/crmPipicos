/**
 * Utilitários de Máscaras
 * Funções para aplicar máscaras em inputs
 */

/**
 * Aplica máscara de CPF (000.000.000-00)
 */
export const maskCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);

  if (!match) return value;

  return !match[2]
    ? match[1]
    : `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}${match[4] ? `-${match[4]}` : ''}`;
};

/**
 * Aplica máscara de CNPJ (00.000.000/0000-00)
 */
export const maskCNPJ = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/);

  if (!match) return value;

  return !match[2]
    ? match[1]
    : `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}${match[4] ? `/${match[4]}` : ''}${match[5] ? `-${match[5]}` : ''}`;
};

/**
 * Aplica máscara de CPF ou CNPJ automaticamente
 */
export const maskCPFOrCNPJ = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length <= 11) {
    return maskCPF(value);
  } else {
    return maskCNPJ(value);
  }
};

/**
 * Aplica máscara de telefone (00) 00000-0000 ou (00) 0000-0000
 */
export const maskPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);

  if (!match) return value;

  if (cleaned.length <= 10) {
    // Telefone fixo: (00) 0000-0000
    const fixedMatch = cleaned.match(/^(\d{0,2})(\d{0,4})(\d{0,4})$/);
    if (!fixedMatch) return value;
    return !fixedMatch[2]
      ? fixedMatch[1]
      : `(${fixedMatch[1]}) ${fixedMatch[2]}${fixedMatch[3] ? `-${fixedMatch[3]}` : ''}`;
  } else {
    // Celular: (00) 00000-0000
    return !match[2]
      ? match[1]
      : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
  }
};

/**
 * Aplica máscara de CEP (00000-000)
 */
export const maskCEP = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,5})(\d{0,3})$/);

  if (!match) return value;

  return !match[2] ? match[1] : `${match[1]}-${match[2]}`;
};

/**
 * Aplica máscara de valor monetário (R$ 0.000,00)
 */
export const maskCurrency = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const number = parseFloat(cleaned) / 100;

  if (isNaN(number)) return '';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number);
};

/**
 * Remove máscara (apenas números)
 */
export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Formata data para exibição (DD/MM/YYYY)
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Aplica máscara de data (DD/MM/YYYY)
 */
export const maskDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);

  if (!match) return value;

  return !match[2]
    ? match[1]
    : `${match[1]}/${match[2]}${match[3] ? `/${match[3]}` : ''}`;
};
