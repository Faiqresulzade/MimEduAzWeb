import { initials } from '../../lib/format';

interface AvatarProps {
  name: string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-xl',
};

export function Avatar({ name, size = 'md' }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-online-bg font-heading font-bold text-brand-blueDark ${sizeClasses[size]}`}
    >
      {initials(name)}
    </span>
  );
}
