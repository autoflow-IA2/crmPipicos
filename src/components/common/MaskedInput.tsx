import React, { ChangeEvent } from 'react';

export type MaskType = 'cpf' | 'cnpj' | 'cpf-cnpj' | 'phone' | 'cep' | 'currency' | 'date' | 'none';

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  maskType?: MaskType;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  label,
  error,
  helperText,
  maskType = 'none',
  className = '',
  id,
  value,
  onChange,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  // Importa as máscaras dinamicamente
  const applyMask = (value: string, type: MaskType): string => {
    const cleaned = value.replace(/\D/g, '');

    switch (type) {
      case 'cpf': {
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
        if (!match) return value;
        return !match[2]
          ? match[1]
          : `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}${match[4] ? `-${match[4]}` : ''}`;
      }

      case 'cnpj': {
        const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/);
        if (!match) return value;
        return !match[2]
          ? match[1]
          : `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}${match[4] ? `/${match[4]}` : ''}${match[5] ? `-${match[5]}` : ''}`;
      }

      case 'cpf-cnpj': {
        if (cleaned.length <= 11) {
          const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
          if (!match) return value;
          return !match[2]
            ? match[1]
            : `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}${match[4] ? `-${match[4]}` : ''}`;
        } else {
          const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/);
          if (!match) return value;
          return !match[2]
            ? match[1]
            : `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}${match[4] ? `/${match[4]}` : ''}${match[5] ? `-${match[5]}` : ''}`;
        }
      }

      case 'phone': {
        if (cleaned.length <= 10) {
          const match = cleaned.match(/^(\d{0,2})(\d{0,4})(\d{0,4})$/);
          if (!match) return value;
          return !match[2]
            ? match[1]
            : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
        } else {
          const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
          if (!match) return value;
          return !match[2]
            ? match[1]
            : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
        }
      }

      case 'cep': {
        const match = cleaned.match(/^(\d{0,5})(\d{0,3})$/);
        if (!match) return value;
        return !match[2] ? match[1] : `${match[1]}-${match[2]}`;
      }

      case 'date': {
        const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
        if (!match) return value;
        return !match[2]
          ? match[1]
          : `${match[1]}/${match[2]}${match[3] ? `/${match[3]}` : ''}`;
      }

      case 'currency': {
        const number = parseFloat(cleaned) / 100;
        if (isNaN(number)) return '';
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(number);
      }

      default:
        return value;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const maskedValue = applyMask(rawValue, maskType);

    if (onChange) {
      onChange(maskedValue, e);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-bold text-black mb-1"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}
        `}
        value={value}
        onChange={handleChange}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default MaskedInput;
