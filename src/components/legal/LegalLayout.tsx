import type { ReactNode } from 'react';
import {
  SELLER_ADDRESS,
  SELLER_NAME,
  SELLER_PHONE,
  SELLER_PHONE_HREF,
  SELLER_VOEN,
  SUPPORT_EMAIL,
} from '../../data/legal';

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-heading text-xl font-bold text-brand-navy">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-brand-ink">{children}</div>
    </section>
  );
}

interface LegalPageProps {
  title: string;
  updatedAt?: string;
  intro?: ReactNode;
  children: ReactNode;
}

/** İstifadə şərtləri, geri qaytarma və digər hüquqi səhifələr üçün ortaq görünüş. */
export function LegalPage({ title, updatedAt, intro, children }: LegalPageProps) {
  return (
    <div className="page">
      <article className="max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-brand-navy">{title}</h1>
        {updatedAt && <p className="mt-2 text-sm text-brand-muted">Son yenilənmə: {updatedAt}</p>}
        {intro && <div className="mt-6 text-base leading-relaxed text-brand-ink">{intro}</div>}
        {children}
      </article>
    </div>
  );
}

/** Satıcının rekvizitləri — bank tələbi ilə hüquqi səhifələrdə və qəbzdə göstərilir. */
export function SellerDetails() {
  return (
    <dl className="grid gap-x-4 gap-y-1.5 rounded-xl bg-brand-chipBg p-4 text-sm sm:grid-cols-[140px_minmax(0,1fr)]">
      <dt className="font-semibold text-brand-slate">Satıcı</dt>
      <dd>{SELLER_NAME}</dd>
      <dt className="font-semibold text-brand-slate">VÖEN</dt>
      <dd>{SELLER_VOEN}</dd>
      <dt className="font-semibold text-brand-slate">Hüquqi ünvan</dt>
      <dd>{SELLER_ADDRESS}</dd>
      <dt className="font-semibold text-brand-slate">Telefon</dt>
      <dd>
        <a href={`tel:${SELLER_PHONE_HREF}`} className="text-brand-blue underline">
          {SELLER_PHONE}
        </a>
      </dd>
      <dt className="font-semibold text-brand-slate">E-poçt</dt>
      <dd>
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-blue underline">
          {SUPPORT_EMAIL}
        </a>
      </dd>
    </dl>
  );
}
