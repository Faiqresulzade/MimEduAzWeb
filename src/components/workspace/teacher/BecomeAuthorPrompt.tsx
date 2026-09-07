import { useState, type FormEvent } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { Button } from '../../ui/Button';
import { ErrorNote } from '../../ui/ErrorNote';
import { Input } from '../../ui/Input';

/**
 * Şagird hesabı resurs yükləyə bilmir (backend `POST /resources`-da 403 verir).
 * Yükləmə formasının yerinə bu təklif göstərilir.
 */
export function BecomeAuthorPrompt() {
  const { becomeAuthor } = useAuth();
  const { toast } = useToast();

  const [subject, setSubject] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await becomeAuthor({ subject: subject.trim() || undefined });
      toast('Artıq müəllif hesabınız var. Material yükləyə bilərsiniz.');
    } catch (err) {
      setError(apiErrorMessage(err, 'Keçid alınmadı.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">Yüklə</h2>
      <p className="mt-1.5 text-sm text-brand-muted">
        Material yükləmək üçün müəllif hesabı lazımdır.
      </p>

      <form onSubmit={handleSubmit} className="card mt-5">
        <h3 className="font-heading text-base font-bold text-brand-navy">Müəllif ol</h3>
        <p className="mt-1.5 text-sm text-brand-muted">
          Hesabınız şagird hesabıdır. Müəllif olduqda Resurs Bankına iş vərəqi, test və
          təqdimat yükləyə, satışın <strong>80%-ini</strong> qazana bilərsiniz. Mövcud
          təlimləriniz və sertifikatlarınız olduğu kimi qalır.
        </p>

        <div className="mt-4 max-w-sm">
          <Input
            name="subject"
            label="Fənn (istəyə bağlı)"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Riyaziyyat"
          />
        </div>

        {error && (
          <div className="mt-4">
            <ErrorNote message={error} />
          </div>
        )}

        <Button type="submit" className="mt-4" disabled={submitting}>
          {submitting ? 'Gözləyin…' : 'Müəllif ol'}
        </Button>
      </form>
    </section>
  );
}
