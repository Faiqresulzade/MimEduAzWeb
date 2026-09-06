import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { quizApi, resourcesApi } from '../api';
import { markQuizPassed } from '../api/pending';
import { apiErrorMessage } from '../hooks/useApiError';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { QuizQuestionCard } from '../components/quiz/QuizQuestionCard';
import { QuizResult } from '../components/quiz/QuizResult';
import { Button } from '../components/ui/Button';
import { ErrorNote } from '../components/ui/ErrorNote';
import { Spinner } from '../components/ui/Spinner';
import type { QuizMeta, QuizQuestion, QuizSubmitResult } from '../types';

export default function QuizPage() {
  const { resourceId = '' } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [meta, setMeta] = useState<QuizMeta | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizSubmitResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const quizMeta = await resourcesApi.quizMeta(resourceId);
        if (cancelled) return;
        setMeta(quizMeta);

        const list = await quizApi.questions(quizMeta.id);
        if (cancelled) return;
        setQuestions(list.slice().sort((a, b) => a.orderIndex - b.orderIndex));
      } catch (err) {
        if (!cancelled) setError(apiErrorMessage(err, 'İmtahan tapılmadı.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [resourceId]);

  async function handleSubmit() {
    if (!meta) return;

    if (Object.keys(answers).length !== questions.length) {
      toast('Bütün suallara cavab verin.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = questions.map((question) => ({
        questionId: question.id,
        selectedIndex: answers[question.id],
      }));
      const submitted = await quizApi.submit(meta.id, payload);
      setResult(submitted);

      if (submitted.passed) {
        // TODO(backend): attempt statusu üçün endpoint əlavə olunanda silinsin.
        markQuizPassed(user?.id ?? '', resourceId);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast(apiErrorMessage(err, 'İmtahan göndərilmədi.'));
    } finally {
      setSubmitting(false);
    }
  }

  function retry() {
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) return <Spinner />;

  if (error || !meta) {
    return (
      <div className="shell py-14">
        <ErrorNote message={error ?? 'İmtahan tapılmadı.'} />
        <Link
          to={`/resurslar/${resourceId}`}
          className="mt-4 inline-block text-sm font-semibold text-brand-blue"
        >
          &larr; Resursa qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="shell max-w-3xl py-10 sm:py-14">
      <Link
        to={`/resurslar/${resourceId}`}
        className="text-sm font-semibold text-brand-blue"
      >
        &larr; Resursa qayıt
      </Link>

      <header className="mt-6">
        <h1 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
          {meta.resourceName}
        </h1>
        <p className="mt-2 text-sm text-brand-muted">
          Keçid balı {meta.passPercent}% · {meta.questionCount} sual
        </p>
      </header>

      {result ? (
        <div className="mt-8">
          <QuizResult result={result} onRetry={retry} />
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {questions.map((question, index) => (
              <QuizQuestionCard
                key={question.id}
                question={question}
                index={index}
                selectedIndex={answers[question.id]}
                onSelect={(optionIndex) =>
                  setAnswers((current) => ({ ...current, [question.id]: optionIndex }))
                }
              />
            ))}
          </div>

          <div className="sticky bottom-4 mt-6">
            <Button fullWidth disabled={submitting} onClick={handleSubmit}>
              {submitting ? 'Göndərilir…' : 'Təqdim et'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
