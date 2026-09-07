import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

/** Təlim 100% tamamlananda backend sertifikatı özü yaradır (dəyişiklik sənədi §2.3). */
export function CertificateModal({
  code,
  trainingName,
  onClose,
}: {
  code: string;
  trainingName: string;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 px-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="font-heading text-4xl">🎓</p>
        <h2
          id="certificate-modal-title"
          className="mt-3 font-heading text-xl font-bold text-brand-navy"
        >
          Təbrik edirik!
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-ink">
          «{trainingName}» təlimini tamamladınız. Sertifikatınız hazırdır.
        </p>

        <p className="mt-4 rounded-xl bg-free-bg px-4 py-3 font-heading text-lg font-bold tracking-wide text-free-text">
          {code}
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link to="/panel/sertifikatlarim">
            <Button fullWidth>Sertifikatlarıma bax</Button>
          </Link>
          <Button variant="secondary" onClick={onClose}>
            Bağla
          </Button>
        </div>
      </div>
    </div>
  );
}
