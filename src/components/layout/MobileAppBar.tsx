import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { resolveRouteMeta } from '../../lib/routeMeta';
import { Icon } from '../ui/Icon';

/**
 * Mobil tətbiqin native-stack header-i: geri düyməsi, qalın başlıq, sağda səbət.
 * Yalnız `lg`-dən kiçik ekranlarda görünür.
 */
export function MobileAppBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const { meta, params } = resolveRouteMeta(pathname);

  const showBack = !meta.tab && !meta.noBack;

  function goBack() {
    // React Router tarixçə indeksini `history.state.idx`-də saxlayır.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(meta.back?.(params) ?? '/', { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-surface pt-[env(safe-area-inset-top)] lg:hidden">
      <div className="flex h-14 items-center gap-1 px-2">
        {showBack ? (
          <button
            type="button"
            onClick={goBack}
            aria-label="Geri"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-navy transition active:bg-brand-hoverBg"
          >
            <Icon name="arrow-left" />
          </button>
        ) : (
          <span className="w-2" />
        )}

        <h1 className="min-w-0 flex-1 truncate font-heading text-lg font-bold text-brand-navy">
          {meta.title}
        </h1>

        {pathname !== '/sebet' && (
          <Link
            to="/sebet"
            aria-label={count > 0 ? `Səbət, ${count} məhsul` : 'Səbət'}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-navy transition active:bg-brand-hoverBg"
          >
            <Icon name="cart-outline" />
            {count > 0 && (
              <span className="absolute right-0.5 top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-paid-text px-1 text-[11px] font-bold leading-none text-white">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
