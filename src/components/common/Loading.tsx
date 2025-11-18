import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  fullScreen?: boolean;
  overlay?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  message,
  variant = 'spinner',
  fullScreen = false,
  overlay = false,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <svg
            className={`animate-spin ${sizeClasses[size]} text-primary-600`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Carregando"
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
        );

      case 'dots':
        return (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        );

      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-pulse`}></div>
        );

      case 'bars':
        return (
          <div className="flex items-end gap-1.5 h-10">
            <div className="w-2 bg-primary-600 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0ms' }}></div>
            <div className="w-2 bg-primary-600 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '150ms' }}></div>
            <div className="w-2 bg-primary-600 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '300ms' }}></div>
            <div className="w-2 bg-primary-600 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '450ms' }}></div>
            <div className="w-2 bg-primary-600 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '600ms' }}></div>
          </div>
        );

      default:
        return null;
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      {renderLoader()}
      {message && (
        <p className="text-gray-600 font-medium text-center animate-fadeIn">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-scaleIn">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

// Componente de Loading para conteúdo inline
export const InlineLoading: React.FC<{ text?: string }> = ({ text = 'Carregando...' }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <svg
      className="animate-spin w-4 h-4 text-primary-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
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
    <span className="text-sm">{text}</span>
  </div>
);

export default Loading;
