export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-blue text-white border border-brand-blue hover:bg-brand-blueDark hover:border-brand-blueDark',
  secondary:
    'bg-white text-brand-slate border border-brand-border hover:bg-brand-hoverBg hover:border-[#c9d8ef]',
  ghost: 'bg-transparent text-brand-blue border border-transparent hover:bg-brand-hoverBg',
  danger: 'bg-white text-danger-text border border-[#f0d3c0] hover:bg-danger-bg',
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[36px] px-3.5 py-1.5 text-[13px]',
  md: 'min-h-[44px] px-5 py-2.5 text-sm',
};

/** Button və button görünüşlü <a> elementləri eyni stili paylaşsın deyə. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  fullWidth = false,
  className = '',
) {
  return `inline-flex items-center justify-center gap-2 rounded-pill font-heading font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55 ${
    buttonVariantClasses[variant]
  } ${buttonSizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`;
}
