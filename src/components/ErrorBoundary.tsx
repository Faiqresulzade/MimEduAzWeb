import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Render zamanı gözlənilməz xəta baş verərsə bütün ekranı ağ saxlamaq
 * əvəzinə istifadəçiyə bərpa yolu göstərir. Bu, məlumat çəkmə xətalarını
 * tutmur (onlar hər səhifədə öz Spinner/ErrorNote-u ilə idarə olunur) —
 * yalnız gözlənilməz render xətalarının son sığınacağıdır.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Gözlənilməz render xətası:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-bg px-6 text-center">
          <p className="font-heading text-4xl font-bold text-brand-blue">MIMEDU.AZ</p>
          <h1 className="font-heading text-xl font-bold text-brand-navy">
            Nəsə səhv getdi
          </h1>
          <p className="max-w-sm text-sm text-brand-muted">
            Səhifəni yeniləyib yenidən cəhd edin. Problem davam edərsə bir az sonra
            qayıdın.
          </p>
          <Button onClick={() => window.location.assign('/')}>Ana səhifəyə qayıt</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
