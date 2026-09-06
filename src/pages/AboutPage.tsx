import { Link } from 'react-router-dom';
import { aboutSteps } from '../data/static';
import { Button } from '../components/ui/Button';

export default function AboutPage() {
  return (
    <div className="shell py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-brand-navy">Haqqımızda</h1>
        <p className="mt-3 text-base leading-relaxed text-brand-ink">
          MIMEDU.AZ müəllimin öyrəndiyini materiala, materialı isə gəlirə çevirdiyi
          qapalı dövrədir. Beş addımın hamısı bir platformada baş verir.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold text-brand-navy">
          5 addım, bir dövrə
        </h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aboutSteps.map((step) => (
            <li key={step.number} className="card flex flex-col">
              <span className="font-heading text-2xl font-bold text-brand-blue">
                {step.number}
              </span>
              <h3 className="mt-3 font-heading text-lg font-semibold text-brand-navy">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="muellif" className="card mt-12 scroll-mt-24">
        <h2 className="font-heading text-xl font-bold text-brand-navy">
          Komissiya şərtləri
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-ink">
          Ödənişli materialın satışından əldə olunan məbləğin <strong>80%-i müəllifə</strong>{' '}
          gedir, <strong>20%-i platforma komissiyasıdır</strong>. Aylıq abunə haqqı və
          yükləmə haqqı yoxdur — yalnız real satışdan komissiya tutulur.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-free-bg p-4">
            <p className="font-heading text-2xl font-bold text-free-text">80%</p>
            <p className="mt-1 text-[13px] text-free-text">Müəllifin payı</p>
          </div>
          <div className="rounded-xl bg-online-bg p-4">
            <p className="font-heading text-2xl font-bold text-online-text">20%</p>
            <p className="mt-1 text-[13px] text-online-text">Platforma komissiyası</p>
          </div>
          <div className="rounded-xl bg-brand-chipBg p-4">
            <p className="font-heading text-2xl font-bold text-brand-navy">0 ₼</p>
            <p className="mt-1 text-[13px] text-brand-muted">Aylıq abunə</p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-brand-muted">
          Yüklənən hər material moderasiya növbəsinə düşür. Fənn üzrə moderator 48 saat
          içində təsdiqləyir və ya səbəbini yazaraq geri qaytarır.
        </p>

        <Link to="/giris?mode=register" className="mt-6 inline-block">
          <Button>Müəllif hesabı aç</Button>
        </Link>
      </section>
    </div>
  );
}
