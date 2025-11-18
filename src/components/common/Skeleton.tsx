import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'title' | 'avatar' | 'rectangular' | 'circular';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full rounded';
      case 'title':
        return 'h-6 w-3/4 rounded';
      case 'avatar':
        return 'w-12 h-12 rounded-full';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded';
      default:
        return 'rounded';
    }
  };

  const skeletonClasses = `
    bg-gray-200 animate-shimmer
    ${getVariantClasses()}
    ${className}
  `;

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={skeletonClasses} style={style} />
        ))}
      </div>
    );
  }

  return <div className={skeletonClasses} style={style} />;
};

// Componentes compostos para casos comuns
export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
    <Skeleton variant="title" />
    <Skeleton variant="text" count={3} />
    <div className="flex gap-2 mt-4">
      <Skeleton width="80px" height="32px" />
      <Skeleton width="80px" height="32px" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <Skeleton variant="title" width="200px" className="mb-6" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton variant="avatar" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="60%" />
            </div>
            <Skeleton width="100px" height="36px" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-start gap-4">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-3">
            <Skeleton variant="title" width="60%" />
            <Skeleton variant="text" count={2} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    {/* Cards de estatísticas */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="title" width="40%" className="mt-2" />
        </div>
      ))}
    </div>

    {/* Conteúdo principal */}
    <SkeletonCard />
  </div>
);

export default Skeleton;
