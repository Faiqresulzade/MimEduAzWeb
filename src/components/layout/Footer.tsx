import { Link } from 'react-router-dom';
import { useSectionLink } from '../../hooks/useSectionLink';

export function Footer() {
  const goToSection = useSectionLink();

  return (
    <footer className="mt-20 border-t border-brand-borderLight bg-brand-surface">
      <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="font-heading text-lg font-bold text-brand-navy">
            MIMEDU.AZ
          </Link>
          <p className="mt-3 max-w-xs text-sm text-brand-muted">
            Müəllimlər üçün təlim, resurs bankı və koda görə yoxlanılan sertifikat
            platforması.
          </p>
        </div>

        <nav aria-label="Platform">
          <h2 className="font-heading text-[13px] font-bold uppercase tracking-[.08em] text-brand-faint">
            Platform
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/telimler" className="text-brand-slate hover:text-brand-blue">
                Təlimlər
              </Link>
            </li>
            <li>
              <Link to="/resurslar" className="text-brand-slate hover:text-brand-blue">
                Resurs Bankı
              </Link>
            </li>
            <li>
              <Link to="/promptlar" className="text-brand-slate hover:text-brand-blue">
                Prompt Kitabxanası
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => goToSection('sertifikat')}
                className="text-brand-slate hover:text-brand-blue"
              >
                Sertifikat yoxlama
              </button>
            </li>
          </ul>
        </nav>

        <nav aria-label="Müəllif">
          <h2 className="font-heading text-[13px] font-bold uppercase tracking-[.08em] text-brand-faint">
            Müəllif
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                to="/giris?mode=register&type=teacher"
                className="text-brand-slate hover:text-brand-blue"
              >
                Müəllif hesabı aç
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => goToSection('muellif', '/haqqimizda')}
                className="text-brand-slate hover:text-brand-blue"
              >
                Komissiya şərtləri
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => goToSection('faq')}
                className="text-brand-slate hover:text-brand-blue"
              >
                Moderasiya qaydaları
              </button>
            </li>
          </ul>
        </nav>

        <nav aria-label="Məzmun">
          <h2 className="font-heading text-[13px] font-bold uppercase tracking-[.08em] text-brand-faint">
            Məzmun
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/haqqimizda" className="text-brand-slate hover:text-brand-blue">
                Haqqımızda
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => goToSection('blog')}
                className="text-brand-slate hover:text-brand-blue"
              >
                Blog
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => goToSection('faq')}
                className="text-brand-slate hover:text-brand-blue"
              >
                Tez-tez verilən suallar
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-brand-borderLight py-6">
        <p className="shell text-xs text-brand-faint">
          © {new Date().getFullYear()} MIMEDU.AZ — bütün hüquqlar qorunur.
        </p>
      </div>
    </footer>
  );
}
