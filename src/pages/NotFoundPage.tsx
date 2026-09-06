import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="shell flex flex-col items-center py-24 text-center">
      <p className="font-heading text-5xl font-bold text-brand-blue">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-brand-navy">
        Səhifə tapılmadı
      </h1>
      <p className="mt-2 max-w-md text-sm text-brand-muted">
        Axtardığınız ünvan mövcud deyil və ya köçürülüb.
      </p>
      <Link to="/" className="mt-6">
        <Button>Ana səhifəyə qayıt</Button>
      </Link>
    </div>
  );
}
