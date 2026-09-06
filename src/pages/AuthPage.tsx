import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { apiErrorMessage } from '../hooks/useApiError';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ErrorNote } from '../components/ui/ErrorNote';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const [params] = useSearchParams();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>(
    params.get('mode') === 'register' ? 'register' : 'login',
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function switchAuth() {
    setMode((current) => (current === 'login' ? 'register' : 'login'));
    setError(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    // Client-side validasiya (spec §7)
    if (mode === 'register' && fullName.trim().length < 3) {
      setError('Ad və soyadınızı yazın.');
      return;
    }
    if (!email.includes('@') || password.length < 4) {
      setError('E-poçt düzgün olsun, şifrə ən azı 4 simvol.');
      return;
    }

    setSubmitting(true);
    try {
      const user =
        mode === 'login'
          ? await login({ email: email.trim(), password })
          : await register({
              fullName: fullName.trim(),
              email: email.trim(),
              password,
              subject: subject.trim() || undefined,
            });

      toast(`Xoş gəldiniz, ${user.fullName.split(' ')[0]}!`);
      // Rol backend-in qaytardığı `roles` massivindən oxunur, e-poçtdan yox.
      navigate(user.roles.includes('Admin') ? '/admin' : '/panel', { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, 'Giriş alınmadı.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="font-heading text-2xl font-bold text-brand-navy">
            {mode === 'login' ? 'Hesaba daxil ol' : 'Müəllif hesabı aç'}
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            {mode === 'login'
              ? 'Təlimlərinizə, resurslarınıza və sertifikatlarınıza giriş.'
              : 'Materiallarınızı yükləyin, satışın 80%-i sizin olsun.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <>
                <Input
                  name="fullName"
                  label="Ad və soyad"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  placeholder="Nigar Əliyeva"
                />
                <Input
                  name="subject"
                  label="Fənn (istəyə bağlı)"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Riyaziyyat"
                />
              </>
            )}

            <Input
              name="email"
              type="email"
              label="E-poçt"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="ad@mimedu.az"
            />

            <Input
              name="password"
              type="password"
              label="Şifrə"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="••••••••"
            />

            <ErrorNote message={error} />

            <Button type="submit" fullWidth disabled={submitting}>
              {submitting
                ? 'Gözləyin…'
                : mode === 'login'
                  ? 'Daxil ol'
                  : 'Qeydiyyatdan keç'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-brand-muted">
            {mode === 'login' ? 'Hesabınız yoxdur?' : 'Artıq hesabınız var?'}{' '}
            <button
              type="button"
              onClick={switchAuth}
              className="font-heading font-semibold text-brand-blue hover:underline"
            >
              {mode === 'login' ? 'Qeydiyyatdan keçin' : 'Daxil olun'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
