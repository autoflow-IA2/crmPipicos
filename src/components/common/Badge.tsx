import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  dot = false,
  icon,
  className = '',
  onClick,
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 font-medium transition-all duration-200 border';

  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800 border-primary-200 hover:bg-primary-200',
    success: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded';
  const cursorClass = onClick ? 'cursor-pointer active:scale-95 transform' : '';

  const dotColors = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    default: 'bg-gray-600',
  };

  return (
    <span
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${roundedClass}
        ${cursorClass}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {dot && (
        <span
          className={`w-2 h-2 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

// Componentes pré-configurados para casos comuns
export const StatusBadge: React.FC<{
  status: 'pendente' | 'confirmado' | 'em_preparacao' | 'entregue' | 'finalizado' | 'cancelado';
  showDot?: boolean;
}> = ({ status, showDot = true }) => {
  const statusConfig = {
    pendente: { variant: 'warning' as const, label: 'Pendente' },
    confirmado: { variant: 'success' as const, label: 'Confirmado' },
    em_preparacao: { variant: 'info' as const, label: 'Em Preparação' },
    entregue: { variant: 'primary' as const, label: 'Entregue' },
    finalizado: { variant: 'default' as const, label: 'Finalizado' },
    cancelado: { variant: 'danger' as const, label: 'Cancelado' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} dot={showDot}>
      {config.label}
    </Badge>
  );
};

export const CountBadge: React.FC<{ count: number; max?: number }> = ({ count, max = 99 }) => {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge variant="danger" size="sm" rounded>
      {displayCount}
    </Badge>
  );
};

export default Badge;
