import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trainingsApi } from '../api';
import { apiErrorMessage } from '../hooks/useApiError';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/Button';
import { ErrorNote } from '../components/ui/ErrorNote';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Spinner } from '../components/ui/Spinner';
import { StatusBadge } from '../components/ui/Badge';
import { VideoEmbed } from '../components/ui/VideoEmbed';
import { CertificateModal } from '../components/trainings/CertificateModal';
import type { TrainingLessons } from '../types';

export default function TrainingLessonsPage() {
  const { id = '' } = useParams();
  const { toast } = useToast();

  const [data, setData] = useState<TrainingLessons | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyLessonId, setBusyLessonId] = useState<string | null>(null);
  const [newCertificate, setNewCertificate] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    trainingsApi
      .lessons(id)
      .then((result) => !cancelled && setData(result))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Dərslər açılmadı.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function toggle(lessonId: string, isCompleted: boolean) {
    if (!data) return;
    setBusyLessonId(lessonId);

    try {
      const progress = isCompleted
        ? await trainingsApi.uncompleteLesson(id, lessonId)
        : await trainingsApi.completeLesson(id, lessonId);

      setData((current) =>
        current
          ? {
              ...current,
              lessons: current.lessons.map((lesson) =>
                lesson.id === lessonId
                  ? {
                      ...lesson,
                      isCompleted: progress.isCompleted,
                      completedAt: progress.isCompleted
                        ? (lesson.completedAt ?? new Date().toISOString())
                        : null,
                    }
                  : lesson,
              ),
              completedLessonCount: progress.completedLessonCount,
              totalLessonCount: progress.totalLessonCount,
              progressPercent: progress.progressPercent,
              status: progress.status,
              certificateCode: progress.certificateCode ?? current.certificateCode,
            }
          : current,
      );

      // Sertifikat yalnız 100%-ə çatanda gəlir — təbrik modalı bir dəfə göstərilir.
      if (progress.certificateCode && !data.certificateCode) {
        setNewCertificate(progress.certificateCode);
      }
    } catch (err) {
      toast(apiErrorMessage(err, 'Əməliyyat alınmadı.'));
    } finally {
      setBusyLessonId(null);
    }
  }

  if (loading) return <Spinner />;

  if (error || !data) {
    return (
      <div className="shell py-14">
        <ErrorNote message={error ?? 'Dərslər tapılmadı.'} />
        <Link
          to={`/telimler/${id}`}
          className="mt-4 inline-block text-sm font-semibold text-brand-blue"
        >
          ← Təlimə qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-10 sm:py-14">
      <Link to={`/telimler/${id}`} className="text-sm font-semibold text-brand-blue">
        ← {data.trainingName}
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
          Dərslər
        </h1>
        <StatusBadge tone={data.status === 'Completed' ? 'free' : 'info'}>
          {data.status === 'Completed' ? 'Tamamlandı' : 'Davam edir'}
        </StatusBadge>
      </div>

      <div className="card mt-5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-brand-muted">
            {data.completedLessonCount} / {data.totalLessonCount} dərs tamamlanıb
          </span>
          <span className="font-heading font-semibold text-brand-navy">
            {data.progressPercent}%
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar value={data.progressPercent} />
        </div>

        {data.certificateCode && (
          <p className="mt-4 rounded-xl bg-free-bg px-4 py-3 text-sm font-medium text-free-text">
            Sertifikat kodunuz: <strong>{data.certificateCode}</strong>
          </p>
        )}
      </div>

      <ol className="mt-6 space-y-4">
        {data.lessons.map((lesson, index) => (
          <li key={lesson.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="font-heading text-[13px] font-bold text-brand-faint">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-1 font-heading text-lg font-semibold text-brand-navy">
                  {lesson.title}
                </h2>
                {lesson.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-ink">
                    {lesson.description}
                  </p>
                )}
                {lesson.durationMinutes !== null && (
                  <p className="mt-1.5 text-sm text-brand-muted">
                    {lesson.durationMinutes} dəqiqə
                  </p>
                )}
              </div>

              {lesson.isCompleted && <StatusBadge tone="free">Tamamlanıb</StatusBadge>}
            </div>

            {lesson.videoUrl && (
              <VideoEmbed url={lesson.videoUrl} title={lesson.title} />
            )}

            <Button
              className="mt-4"
              size="sm"
              variant={lesson.isCompleted ? 'secondary' : 'primary'}
              disabled={busyLessonId === lesson.id}
              onClick={() => toggle(lesson.id, lesson.isCompleted)}
            >
              {busyLessonId === lesson.id
                ? 'Gözləyin…'
                : lesson.isCompleted
                  ? 'İşarəni götür'
                  : 'Tamamladım'}
            </Button>
          </li>
        ))}
      </ol>

      {newCertificate && (
        <CertificateModal
          code={newCertificate}
          trainingName={data.trainingName}
          onClose={() => setNewCertificate(null)}
        />
      )}
    </div>
  );
}
