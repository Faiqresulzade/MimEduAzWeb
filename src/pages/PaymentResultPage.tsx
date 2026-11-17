import { useEffect, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ordersApi } from '../api';
import { useCart } from '../hooks/useCart';
import { apiErrorMessage } from '../hooks/useApiError';
import { Button } from '../components/ui/Button';
import { ErrorNote } from '../components/ui/ErrorNote';
import { Spinner } from '../components/ui/Spinner';
import { SUPPORT_EMAIL } from '../data/legal';
import { formatDateTime, formatPrice } from '../lib/format';
import type { Order } from '../types';

/** Bank callback-i çatana və ya tamamlama bitənə qədər statusu yoxlayırıq. */
const POLL_INTERVAL_MS = 3000;
const POLL_LIMIT = 20;

/**
 * /odenis/ugurlu və /odenis/ugursuz. Hər iki ünvan eyni işləyir: status URL-dən yox,
 * backend-dən oxunur — bankın imzalı təsdiqi olmadan "uğurlu" göstərilmir.
 */
export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const code = params.get('order');
  const { refresh } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;

    ordersApi
      .get(code)
      .then((data) => {
        if (cancelled) return;
        setOrder(data);
        // Ödənildisə backend səbəti boşaldıb - sayğac yenilənsin.
        if (data.status === 'Paid') void refresh();
      })
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Sifariş tapılmadı.')));

    return () => {
      cancelled = true;
    };
  }, [code, attempts, refresh]);

  // Pending: callback/tamamlama hələ bitməyib - bir müddət yenidən soruşuruq.
  useEffect(() => {
    if (order?.status !== 'Pending' || attempts >= POLL_LIMIT) return;
    const timer = setTimeout(() => setAttempts((n) => n + 1), POLL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [order, attempts]);

  if (!code) {
    return (
      <Result title="Ödəniş tamamlanmadı" tone="error">
        <p>Bank sifarişi tanıya bilmədi. Səbətinizdən yenidən cəhd edin.</p>
        <Actions />
      </Result>
    );
  }

  if (error) {
    return (
      <Result title="Sifariş tapılmadı" tone="error">
        <ErrorNote message={error} />
        <Actions />
      </Result>
    );
  }

  if (!order) return <Spinner label="Ödəniş yoxlanılır…" />;

  if (order.status === 'Paid') {
    return (
      <Result title="Ödəniş təsdiqləndi" tone="success">
        <p>
          Sifariş <strong>{order.code}</strong> ödənildi. Qəbz e-poçtunuza göndərildi, alınan
          məhsullar hesabınızda açıqdır.
        </p>
        <Receipt order={order} />
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/panel/aldiqlarim">
            <Button>Aldıqlarım</Button>
          </Link>
          <Link to="/panel/telimlerim">
            <Button variant="secondary">Təlimlərim</Button>
          </Link>
          <Link to="/sifarisler">
            <Button variant="ghost">Sifarişlərim</Button>
          </Link>
        </div>
      </Result>
    );
  }

  if (order.status === 'Pending') {
    return attempts < POLL_LIMIT ? (
      <Spinner label="Ödəniş yoxlanılır… Səhifəni bağlamayın." />
    ) : (
      <Result title="Ödəniş yoxlanılır" tone="pending">
        <p>
          Bankdan cavab hələ gəlməyib. Kartdan pul çıxılıbsa, sifariş bir neçə dəqiqə ərzində
          avtomatik təsdiqlənəcək — vəziyyəti{' '}
          <Link to="/sifarisler" className="text-brand-blue underline">
            Sifarişlərim
          </Link>{' '}
          bölməsində izləyin. Pul çıxılıbsa təkrar ödəməyin.
        </p>
        <Actions />
      </Result>
    );
  }

  return (
    <Result title="Ödəniş alınmadı" tone="error">
      <p>
        Sifariş <strong>{order.code}</strong> ödənilmədi
        {order.status === 'Cancelled' ? ' (vaxt bitdi)' : ''}. Kartdan pul çıxılmayıb. Kart
        məlumatlarını və balansı yoxlayıb yenidən cəhd edin — məhsullar səbətinizdə qalır.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link to="/sebet">
          <Button>Yenidən cəhd et</Button>
        </Link>
      </div>
      <Actions />
    </Result>
  );
}

function Result({
  title,
  tone,
  children,
}: {
  title: string;
  tone: 'success' | 'error' | 'pending';
  children: ReactNode;
}) {
  const accent =
    tone === 'success' ? 'text-live-text' : tone === 'error' ? 'text-danger-text' : 'text-paid-text';
  return (
    <div className="page flex justify-center lg:py-16">
      <div className="card w-full max-w-lg">
        <h1 className={`font-heading text-2xl font-bold ${accent}`}>{title}</h1>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-brand-ink">{children}</div>
      </div>
    </div>
  );
}

function Actions() {
  return (
    <p className="mt-4 text-[13px] text-brand-muted">
      Sual yaranarsa: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-blue underline">{SUPPORT_EMAIL}</a>{' '}
      ·{' '}
      <Link to="/elaqe" className="text-brand-blue underline">
        Əlaqə
      </Link>
    </p>
  );
}

function Receipt({ order }: { order: Order }) {
  return (
    <dl className="mt-4 grid grid-cols-[120px_minmax(0,1fr)] gap-y-1.5 rounded-xl bg-brand-chipBg p-4 text-[13px]">
      <dt className="text-brand-muted">Məbləğ</dt>
      <dd className="font-semibold">{formatPrice(order.totalAmount)}</dd>
      {order.paidAt && (
        <>
          <dt className="text-brand-muted">Tarix</dt>
          <dd>{formatDateTime(order.paidAt)}</dd>
        </>
      )}
      {order.cardMask && (
        <>
          <dt className="text-brand-muted">Kart</dt>
          <dd>{order.cardMask}</dd>
        </>
      )}
      {order.rrn && (
        <>
          <dt className="text-brand-muted">RRN</dt>
          <dd>{order.rrn}</dd>
        </>
      )}
      {order.approvalCode && (
        <>
          <dt className="text-brand-muted">Təsdiq kodu</dt>
          <dd>{order.approvalCode}</dd>
        </>
      )}
    </dl>
  );
}
