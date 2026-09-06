import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-blue text-white border border-brand-blue hover:bg-brand-blueDark hover:border-brand-blueDark',
  secondary:
    'bg-white text-brand-slate border border-brand-border hover:bg-brand-hoverBg hover:border-[#c9d8ef]',
  ghost: 'bg-transparent text-brand-blue border border-transparent hover:bg-brand-hoverBg',
  danger: 'bg-white text-danger-text border border-[#f0d3c0] hover:bg-danger-bg',
};

const sizeClasses: Record<Size, string> = {
  sm: 'min-h-[36px] px-3.5 py-1.5 text-[13px]',
  md: 'min-h-[44px] px-5 py-2.5 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-pill font-heading font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55 ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
