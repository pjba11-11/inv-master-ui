import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip = ({
  children,
  content,
  placement = 'top',
  delay = 300,
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const showTooltip = () => {
    setTimeout(() => setIsOpen(true), delay);
  };

  const hideTooltip = () => {
    setIsOpen(false);
  };

  const positionStyles = {
    top: {
      top: '-4px',
      left: '50%',
      transform: 'translateX(-50%)',
      transformOrigin: 'bottom',
    },
    bottom: {
      bottom: '-4px',
      left: '50%',
      transform: 'translateX(-50%)',
      transformOrigin: 'top',
    },
    left: {
      left: '-4px',
      top: '50%',
      transform: 'translateY(-50%)',
      transformOrigin: 'right',
    },
    right: {
      right: '-4px',
      top: '50%',
      transform: 'translateY(-50%)',
      transformOrigin: 'left',
    },
  }[placement];

  return (
    <div
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      position="relative"
      display="inline-block"
    >
      {children}
      {isOpen && (
        <div
          className={`absolute z-50 px-3 py-1 text-xs font-medium text-surface-0 bg-primary-500 rounded-md shadow-md whitespace-nowrap`}
          style={positionStyles}
        >
          {content}
        </div>
      )}
    </div>
  );
};
