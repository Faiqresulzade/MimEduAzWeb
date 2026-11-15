import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { apiErrorMessage } from '../hooks/useApiError';
import { Button } from '../components/ui/Button';
import { ErrorNote } from '../components/ui/ErrorNote';
import { CONTACT_EMAIL } from '../data/legal';

/**
 * Hesabın silinməsi — Google Play "Account deletion" tələbi üçün ictimai URL.
 * Daxil olmuş istifadəçi hesabı buradan silə bilər; qonaqa addımlar göstərilir.
 */
export default function DeleteAccountPage() {
  const { user, isAdmin, deleteAccount } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteAccount();
      toast('Hesabınız silindi.');
      navigate('/', { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, 'Hesabı silmək alınmadı. Yenidən cəhd edin.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="page">
      <article className="max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-brand-navy">Hesabın silinməsi</h1>
        <p className="mt-4 text-base leading-relaxed text-brand-ink">
          MIMEDU.AZ (sayt və <code>az.mimedu.app</code> Android tətbiqi) hesabınızı istənilən vaxt
          özünüz silə bilərsiniz.
        </p>

        <section className="mt-8">
          <h2 className="font-heading text-xl font-bold text-brand-navy">Necə silmək olar</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-brand-ink">
            <li>
              <strong>Mobil tətbiqdə:</strong> Profil → aşağıda <strong>Hesabı sil</strong> →
              iki dəfə təsdiq edin.
            </li>
            <li>
              <strong>Saytda:</strong> hesabınıza{' '}
              <Link to="/giris" className="text-brand-blue underline">
                daxil olun
              </Link>{' '}
              və bu səhifədəki <strong>Hesabı həmişəlik sil</strong> düyməsini istifadə edin.
            </li>
            <li>
              <strong>E-poçtla:</strong> hesaba daxil ola bilmirsinizsə, qeydiyyatdan keçdiyiniz
              e-poçtdan{' '}
              <a href={`mailto:${CONTACT_EMAIL}?subject=Hesabın silinməsi`} className="text-brand-blue underline">
                {CONTACT_EMAIL}
              </a>{' '}
              ünvanına yazın — tələb 30 gün ərzində icra olunur.
            </li>
          </ol>
        </section>

        <section className="mt-8">
          <h2 className="font-heading text-xl font-bold text-brand-navy">Nə silinir, nə saxlanılır</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-ink">
            <li>
              <strong>Dərhal silinir:</strong> ad və soyad, e-poçt, fənn, şifrə, Google ilə giriş
              bağlantısı, səbət və bütün aktiv sessiyalar. Hesaba bir daha daxil olmaq mümkün olmur.
            </li>
            <li>
              <strong>Adsız saxlanılır:</strong> sifariş və ödəniş qeydləri (mühasibat), verilmiş
              sertifikatların yoxlama qeydləri, sınaq nəticələri — bu qeydlər artıq sizinlə
              əlaqələndirilmir.
            </li>
            <li>
              <strong>Müəlliflər üçün:</strong> başqa istifadəçilərin artıq aldığı materiallar
              onlar üçün əlçatan qalır.
            </li>
          </ul>
          <p className="mt-3 text-sm text-brand-muted">
            Ətraflı:{' '}
            <Link to="/mexfilik" className="text-brand-blue underline">
              Məxfilik siyasəti
            </Link>
          </p>
        </section>

        {user ? (
          <section className="card mt-10">
            <h2 className="font-heading text-xl font-bold text-brand-navy">Hesabı sil</h2>
            {isAdmin ? (
              <p className="mt-3 text-sm text-brand-muted">Admin hesabı buradan silinə bilməz.</p>
            ) : (
              <>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink">
                  Daxil olduğunuz hesab: <strong>{user.email}</strong>. Bu əməliyyat geri
                  qaytarılmır. Təsdiq üçün aşağıya <strong>SİL</strong> yazın.
                </p>
                <input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  aria-label="Təsdiq üçün SİL yazın"
                  placeholder="SİL"
                  className="mt-4 w-full max-w-xs rounded-xl border border-brand-border px-4 py-2.5 text-sm"
                />
                <div className="mt-3">
                  <ErrorNote message={error} />
                </div>
                <Button
                  variant="danger"
                  className="mt-4"
                  disabled={deleting || confirmText.trim().toLocaleUpperCase('az') !== 'SİL'}
                  onClick={handleDelete}
                >
                  {deleting ? 'Silinir…' : 'Hesabı həmişəlik sil'}
                </Button>
              </>
            )}
          </section>
        ) : null}
      </article>
    </div>
  );
}
