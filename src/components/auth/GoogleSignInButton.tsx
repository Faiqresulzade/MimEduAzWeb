import { useEffect, useRef, useState } from 'react';
import { authApi } from '../../api';

/** Google Identity Services-in istifadə etdiyimiz hissəsi. */
interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
    ux_mode?: 'popup' | 'redirect';
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }): void;
  renderButton(
    parent: HTMLElement,
    options: {
      type?: 'standard' | 'icon';
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      shape?: 'rectangular' | 'pill' | 'circle' | 'square';
      locale?: string;
      width?: number;
    },
  ): void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

const SCRIPT_URL = 'https://accounts.google.com/gsi/client';

let scriptPromise: Promise<void> | null = null;
let configPromise: Promise<string | null> | null = null;

/** Skript bir dəfə yüklənir, bütün düymələr onu paylaşır. */
function loadScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Google skripti yüklənmədi.'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/** Client ID backend-dən gəlir — onu yalnız serverdə (Render) qurmaq kifayətdir. */
function loadClientId(): Promise<string | null> {
  configPromise ??= authApi
    .googleConfig()
    .then((config) => config.clientId)
    .catch(() => {
      configPromise = null;
      return null;
    });
  return configPromise;
}

interface GoogleSignInButtonProps {
  /** Google-un verdiyi ID token ("credential"). */
  onCredential: (idToken: string) => void;
}

/**
 * Google-un rəsmi "Google ilə davam et" düyməsi. Backend-də Client ID qurulmayıbsa
 * və ya skript yüklənmirsə (məs. bloklanıb) heç nə göstərilmir.
 */
export function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onCredential);
  const [available, setAvailable] = useState(true);

  // Google callback-i bir dəfə qeyd olunur - ən son handler-i ref vasitəsilə çağırır.
  useEffect(() => {
    callback.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const clientId = await loadClientId();
      if (!clientId) {
        if (!cancelled) setAvailable(false);
        return;
      }

      try {
        await loadScript();
      } catch {
        if (!cancelled) setAvailable(false);
        return;
      }

      const google = window.google?.accounts?.id;
      if (cancelled || !google || !container.current) return;

      google.initialize({
        client_id: clientId,
        callback: (response) => callback.current(response.credential),
        ux_mode: 'popup',
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      google.renderButton(container.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        locale: 'az',
        // Google düymənin enini pikseldə istəyir (maks. 400).
        width: Math.min(400, container.current.offsetWidth || 320),
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!available) return null;

  return (
    <div>
      <div ref={container} className="flex min-h-[44px] w-full justify-center" />
      <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[.08em] text-brand-faint">
        <span className="h-px flex-1 bg-brand-borderLight" />
        və ya
        <span className="h-px flex-1 bg-brand-borderLight" />
      </div>
    </div>
  );
}
