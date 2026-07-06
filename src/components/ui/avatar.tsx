import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackText?: string;
}

export const Avatar = ({
  src,
  alt = '',
  size = 'md',
  className = '',
  fallbackText,
}: AvatarProps) => {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-surface-1 ${sizeMap[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="object-cover h-full w-full"
        />
      ) : (
        <>
          <div className="flex items-center justify-center w-full h-full bg-primary-200 text-primary-500 font-medium text-sm">
            {fallbackText ? fallbackText.toUpperCase().slice(0, 2) : ''}
          </div>
        </>
      )}
    </div>
  );
};
