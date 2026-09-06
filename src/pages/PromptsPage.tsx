import { useEffect, useRef, useState } from 'react';
import { prompts } from '../data/static';
import { Button } from '../components/ui/Button';

/** Kopyalandıqdan sonra düymə mətni 1.8 saniyə "Kopyalandı ✓" qalır. */
const COPIED_DURATION = 1800;

export default function PromptsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API bloklanıbsa köhnə üsulla kopyala.
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }

    setCopiedId(id);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopiedId(null), COPIED_DURATION);
  }

  return (
    <div className="shell py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-brand-navy">
          Prompt Kitabxanası
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted">
          Dərs planı, sual dəsti və valideyn rəyi üçün hazır promptlar. Mötərizədəki
          sahələri öz dərsinizə uyğun doldurun.
        </p>
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <article key={prompt.id} className="card flex flex-col">
            <h2 className="font-heading text-lg font-semibold text-brand-navy">
              {prompt.title}
            </h2>
            <p className="mt-1.5 text-sm text-brand-muted">{prompt.description}</p>

            <pre className="mt-4 flex-1 whitespace-pre-wrap rounded-xl bg-brand-chipBg p-4 font-body text-sm leading-relaxed text-brand-ink">
              {prompt.text}
            </pre>

            <Button
              className="mt-4"
              variant="secondary"
              fullWidth
              onClick={() => copy(prompt.id, prompt.text)}
            >
              {copiedId === prompt.id ? 'Kopyalandı ✓' : 'Promptu kopyala'}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
