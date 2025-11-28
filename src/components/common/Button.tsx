import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline' | 'fun';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 transform hover:-translate-y-0.5';

  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-lg hover:shadow-pink-glow focus:ring-primary-500',
    secondary: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg hover:shadow-lg focus:ring-blue-400',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg hover:shadow-lg focus:ring-red-500',
    success: 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-lg hover:shadow-lg focus:ring-green-500',
    ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 focus:ring-gray-300 shadow-none',
    outline: 'bg-transparent border-2 border-primary-500 hover:bg-primary-50 active:bg-primary-100 text-primary-600 focus:ring-primary-500 shadow-none hover:shadow-md',
    fun: 'bg-gradient-party hover:opacity-90 text-white shadow-lg hover:shadow-multi-glow focus:ring-primary-500',
  };

  const sizeStyles = {
    xs: 'py-1 px-2 text-xs',
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
    xl: 'py-4 px-8 text-xl',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-label={props['aria-label'] || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Carregando...</span>
        </>
      ) : (
        <>
          {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
