import type { ReactNode } from 'react';

interface CardProps {
  hoverable?: boolean;
  className?: string;
  children: ReactNode;
}

export function Card({ hoverable = false, className = '', children }: CardProps) {
  return (
    <div className={`card ${hoverable ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
}
