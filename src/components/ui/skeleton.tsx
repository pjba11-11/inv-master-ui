import React from 'react';

interface SkeletonProps {
  height?: number | string;
  width?: number | string;
  variant?: 'text' | 'rectangle' | 'circle';
  className?: string;
  animation?: 'pulse' | 'wave';
}

export const Skeleton = ({
  height = 16,
  width = '100%',
  variant = 'rectangle',
  className = '',
  animation = 'pulse',
}: SkeletonProps) => {
  const sizeStyle: React.CSSProperties = {};

  if (typeof height === 'number') {
    sizeStyle.height = `${height}px`;
  } else if (typeof height === 'string') {
    sizeStyle.height = height;
  }

  if (typeof width === 'number') {
    sizeStyle.width = `${width}px`;
  } else if (typeof width === 'string') {
    sizeStyle.width = width;
  }

  const baseClasses = `
    animate-pulse bg-neutral-200/50 rounded 
  `;

  const variantClasses = {
    text: 'h-4 w-full mb-1.5 last:mb-0',
    rectangle: '',
    circle: 'h-full w-full rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Could implement actual wave animation later
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={sizeStyle}
    >
      {variant === 'text' && (
        <>
          <div className="h-4 w-full mb-1.5"></div>
          <div className="h-4 w-full mb-1.5"></div>
          <div className="h-4 w-full-2/3"></div>
        </>
      )}
    </div>
  );
};
