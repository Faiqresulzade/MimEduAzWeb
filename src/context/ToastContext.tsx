import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface ToastMessage {
  id: number;
  text: string;
}

export interface ToastContextValue {
  toasts: ToastMessage[];
  toast: (text: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<ToastContextValue | null>(null);

/** Prototipdəki davranış: mesaj 2.2 saniyə görünür, sonra sönür. */
const TOAST_DURATION = 2200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((text: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, text }]);
    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, TOAST_DURATION);
  }, []);

  const value = useMemo(() => ({ toasts, toast }), [toasts, toast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
