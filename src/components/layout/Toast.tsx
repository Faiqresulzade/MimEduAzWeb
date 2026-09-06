import { useToast } from '../../hooks/useToast';

/** Ekranın altında, 2.2 saniyə görünən toast yığını. */
export function ToastViewport() {
  const { toasts } = useToast();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto max-w-md rounded-pill bg-brand-navy px-5 py-3 text-center text-sm font-medium text-white shadow-toast"
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
