import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { apiErrorMessage } from '../hooks/useApiError';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ErrorNote } from '../components/ui/ErrorNote';
import type { AccountType } from '../types';

type Mode = 'login' | 'register';

const ACCOUNT_TYPES: { value: AccountType; title: string; hint: string }[] = [
  {
    value: 'Student',
    title: 'Təlim almaq istəyirəm',
    hint: 'Təlimlərə yazıl, dərslərə bax, sertifikat al.',
  },
  {
    value: 'Teacher',
    title: 'Material satmaq istəyirəm',
    hint: 'Yuxarıdakıların hamısı + Resurs Bankına material yüklə (80% pay).',
  },
];

export default function AuthPage() {
  const [params] = useSearchParams();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>(
    params.get('mode') === 'register' ? 'register' : 'login',
  );
  const [accountType, setAccountType] = useState<AccountType>(
    params.get('type') === 'teacher' ? 'Teacher' : 'Student',
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
              // Fənn yalnız müəllif hesabında mənalıdır.
              subject:
                accountType === 'Teacher' ? subject.trim() || undefined : undefined,
              accountType,
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
            {mode === 'login' ? 'Hesaba daxil ol' : 'Yeni hesab aç'}
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            {mode === 'login'
              ? 'Təlimlərinizə, resurslarınıza və sertifikatlarınıza giriş.'
              : 'Hesab növünü seçin — sonradan müəllif hesabına keçmək mümkündür.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <>
                <fieldset>
                  <legend className="text-[13px] font-semibold text-brand-slate">
                    Hesab növü
                  </legend>
                  <div className="mt-2 space-y-2">
                    {ACCOUNT_TYPES.map((option) => {
                      const active = accountType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setAccountType(option.value)}
                          aria-pressed={active}
                          className={`flex w-full flex-col rounded-xl border px-4 py-3 text-left transition ${
                            active
                              ? 'border-brand-blue bg-brand-chipBg'
                              : 'border-brand-border bg-white hover:bg-brand-hoverBg'
                          }`}
                        >
                          <span className="font-heading text-sm font-semibold text-brand-navy">
                            {option.title}
                          </span>
                          <span className="mt-0.5 text-[13px] text-brand-muted">
                            {option.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <Input
                  name="fullName"
                  label="Ad və soyad"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  placeholder="Nigar Əliyeva"
                />

                {accountType === 'Teacher' && (
                  <Input
                    name="subject"
                    label="Fənn (istəyə bağlı)"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Riyaziyyat"
                  />
                )}
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
