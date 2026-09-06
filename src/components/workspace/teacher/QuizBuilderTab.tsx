import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { resourcesApi } from '../../../api';
import { QUIZ_DELETE_SUPPORTED } from '../../../api/pending';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { useToast } from '../../../hooks/useToast';
import { Button } from '../../ui/Button';
import { Chip } from '../../ui/Chip';
import { EmptyState } from '../../ui/EmptyState';
import { ErrorNote } from '../../ui/ErrorNote';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Spinner } from '../../ui/Spinner';
import type { QuizMeta, Resource } from '../../../types';

interface DraftQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

export default function QuizBuilderTab() {
  const { toast } = useToast();

  const [resources, setResources] = useState<Resource[]>([]);
  const [quizzes, setQuizzes] = useState<Record<string, QuizMeta>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [resourceId, setResourceId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [drafts, setDrafts] = useState<DraftQuestion[]>([]);
  const [passPercent, setPassPercent] = useState(70);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmMode, setConfirmMode] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [nextDraftId, setNextDraftId] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const mine = await resourcesApi.mine();
        if (cancelled) return;
        setResources(mine);
        if (mine.length > 0) setResourceId(mine[0].id);

        // Hər resursun quiz metadata-sını ayrıca çəkirik (toplu endpoint yoxdur).
        const withQuiz = mine.filter((item) => item.hasQuiz);
        const metas = await Promise.allSettled(
          withQuiz.map((item) => resourcesApi.quizMeta(item.id)),
        );
        if (cancelled) return;

        const map: Record<string, QuizMeta> = {};
        metas.forEach((entry) => {
          if (entry.status === 'fulfilled') map[entry.value.resourceId] = entry.value;
        });
        setQuizzes(map);
      } catch (err) {
        if (!cancelled) setLoadError(apiErrorMessage(err, 'Resurslar yüklənmədi.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const existingQuiz = quizzes[resourceId] ?? null;

  const existingQuizList = useMemo(
    () =>
      Object.values(quizzes).sort((a, b) =>
        a.resourceName.localeCompare(b.resourceName, 'az'),
      ),
    [quizzes],
  );

  function addDraft() {
    const filled = options.map((option) => option.trim()).filter(Boolean);

    if (questionText.trim().length < 5 || filled.length < 2) {
      setFormError('Sual və ən azı iki variant yazılmalıdır.');
      return;
    }
    if (correctIndex >= filled.length) {
      setFormError('Düzgün variant boş ola bilməz.');
      return;
    }

    setDrafts((current) => [
      ...current,
      {
        id: nextDraftId,
        questionText: questionText.trim(),
        options: filled,
        correctOptionIndex: correctIndex,
      },
    ]);
    setNextDraftId((id) => id + 1);
    setQuestionText('');
    setOptions(['', '', '']);
    setCorrectIndex(0);
    setFormError(null);
  }

  async function publish(mode: 'append' | 'replace') {
    if (!resourceId) {
      setFormError('Əvvəlcə resurs seçin.');
      return;
    }
    if (drafts.length === 0) {
      setFormError('Ən azı bir sual əlavə edin.');
      return;
    }

    setPublishing(true);
    try {
      const saved = await resourcesApi.saveQuiz(resourceId, {
        passPercent,
        mode,
        questions: drafts.map(({ questionText: text, options: opts, correctOptionIndex }) => ({
          questionText: text,
          options: opts,
          correctOptionIndex,
        })),
      });

      setQuizzes((current) => ({ ...current, [saved.resourceId]: saved }));
      setResources((current) =>
        current.map((item) =>
          item.id === saved.resourceId ? { ...item, hasQuiz: true } : item,
        ),
      );
      setDrafts([]);
      setConfirmMode(false);
      setFormError(null);
      toast(mode === 'replace' ? 'İmtahan əvəz edildi.' : 'İmtahan dərc edildi.');
    } catch (err) {
      setFormError(apiErrorMessage(err, 'İmtahan yadda saxlanmadı.'));
    } finally {
      setPublishing(false);
    }
  }

  function handlePublishClick() {
    if (existingQuiz) {
      setConfirmMode(true);
      return;
    }
    void publish('append');
  }

  if (loading) return <Spinner />;
  if (loadError) return <ErrorNote message={loadError} />;

  if (resources.length === 0) {
    return (
      <EmptyState
        title="Əvvəlcə resurs yükləyin"
        text="İmtahan yalnız öz resurslarınıza əlavə edilə bilər."
      />
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-brand-navy">İmtahanlar</h2>
        <p className="mt-1.5 text-sm text-brand-muted">
          Öz resurslarınıza imtahan əlavə edin. Keçid balını toplayan müəllim avtomatik
          sertifikat alır.
        </p>
      </div>

      <div className="card">
        <Select
          name="resourceId"
          label="Resurs"
          value={resourceId}
          onChange={(event) => {
            setResourceId(event.target.value);
            setConfirmMode(false);
          }}
        >
          {resources.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
              {quizzes[item.id] ? ' (imtahanı var)' : ''}
            </option>
          ))}
        </Select>

        {existingQuiz && (
          <p className="mt-3 rounded-xl bg-online-bg px-4 py-3 text-sm text-online-text">
            Bu resursda artıq {existingQuiz.questionCount} suallıq imtahan var (keçid balı{' '}
            {existingQuiz.passPercent}%).
          </p>
        )}
      </div>

      <div className="card">
        <h3 className="font-heading text-base font-bold text-brand-navy">Sual əlavə et</h3>

        <div className="mt-4 space-y-4">
          <Input
            name="questionText"
            label="Sual mətni"
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            placeholder="1/2 + 1/4 neçəyə bərabərdir?"
          />

          {options.map((option, index) => (
            <Input
              key={index}
              name={`option-${index}`}
              label={`Variant ${index + 1}${index === 2 ? ' (opsional)' : ''}`}
              value={option}
              onChange={(event) =>
                setOptions((current) =>
                  current.map((item, i) => (i === index ? event.target.value : item)),
                )
              }
            />
          ))}

          <div>
            <span className="mb-2 block font-heading text-[13px] font-semibold text-brand-slate">
              Düzgün variant
            </span>
            <div className="flex flex-wrap gap-2">
              {options.map((_, index) => (
                <Chip
                  key={index}
                  active={correctIndex === index}
                  onClick={() => setCorrectIndex(index)}
                >
                  Variant {index + 1}
                </Chip>
              ))}
            </div>
          </div>

          <ErrorNote message={formError} />

          <Button variant="secondary" onClick={addDraft}>
            Əlavə et
          </Button>
        </div>
      </div>

      {drafts.length > 0 && (
        <div className="card">
          <h3 className="font-heading text-base font-bold text-brand-navy">
            Qaralama ({drafts.length} sual)
          </h3>

          <ol className="mt-4 space-y-3">
            {drafts.map((draft, index) => (
              <li
                key={draft.id}
                className="flex items-start gap-3 rounded-xl bg-brand-chipBg p-4"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white font-heading text-xs font-bold text-brand-blue">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-brand-navy">{draft.questionText}</p>
                  <p className="mt-1 text-xs text-brand-muted">
                    Doğru: {draft.options[draft.correctOptionIndex]}
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    setDrafts((current) => current.filter((item) => item.id !== draft.id))
                  }
                >
                  Sil
                </Button>
              </li>
            ))}
          </ol>

          <div className="mt-5 max-w-[200px]">
            <Input
              name="passPercent"
              type="number"
              min={1}
              max={100}
              label="Keçid balı (%)"
              value={passPercent}
              onChange={(event) => setPassPercent(Number(event.target.value))}
            />
          </div>

          {confirmMode && existingQuiz ? (
            <div className="mt-5 rounded-xl bg-paid-bg p-4">
              <p className="font-heading text-sm font-semibold text-paid-text">
                Bu resursda artıq imtahan var
              </p>
              <p className="mt-1.5 text-sm text-paid-text">
                Mövcud: {existingQuiz.questionCount} sual · Yeni: {drafts.length} sual.
                Köhnə sualları əvəz etmək, yoxsa üzərinə əlavə etmək istəyirsiniz?
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" disabled={publishing} onClick={() => publish('replace')}>
                  Əvəz et
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={publishing}
                  onClick={() => publish('append')}
                >
                  Əlavə et
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={publishing}
                  onClick={() => setConfirmMode(false)}
                >
                  İmtina
                </Button>
              </div>
            </div>
          ) : (
            <Button className="mt-5" disabled={publishing} onClick={handlePublishClick}>
              {publishing ? 'Göndərilir…' : 'Dərc et'}
            </Button>
          )}
        </div>
      )}

      <div>
        <h3 className="font-heading text-base font-bold text-brand-navy">
          Mövcud imtahanlarım
        </h3>

        {existingQuizList.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Hələ imtahan yaratmamısınız" />
          </div>
        ) : (
          <ul className="card mt-3 !p-0">
            {existingQuizList.map((quiz) => (
              <li
                key={quiz.id}
                className="flex flex-wrap items-center gap-3 border-b border-brand-borderLight px-5 py-4 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[15px] font-semibold text-brand-navy">
                    {quiz.resourceName}
                  </p>
                  <p className="mt-0.5 text-sm text-brand-muted">
                    {quiz.questionCount} sual · keçid balı {quiz.passPercent}%
                  </p>
                </div>
                <Link to={`/imtahan/${quiz.resourceId}`}>
                  <Button variant="secondary" size="sm">
                    Önizləmə
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={!QUIZ_DELETE_SUPPORTED}
                  title={
                    QUIZ_DELETE_SUPPORTED
                      ? undefined
                      : 'Silmə backend-də hazır olanda aktivləşəcək.'
                  }
                  onClick={() => toast('İmtahan silmə hələ mövcud deyil.')}
                >
                  Sil
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
