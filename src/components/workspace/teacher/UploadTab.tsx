import { useRef, useState, type FormEvent } from 'react';
import { resourcesApi } from '../../../api';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { useToast } from '../../../hooks/useToast';
import { Button } from '../../ui/Button';
import { ErrorNote } from '../../ui/ErrorNote';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import {
  ACCEPTED_UPLOAD_TYPES,
  GRADES,
  MAX_UPLOAD_MB,
  RESOURCE_TYPE_OPTIONS,
  SUBJECTS,
} from '../../../lib/constants';
import type { ResourceType } from '../../../types';

export default function UploadTab() {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [grade, setGrade] = useState(5);
  const [type, setType] = useState<ResourceType>('WorkSheet');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(3);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setName('');
    setSubject(SUBJECTS[0]);
    setGrade(5);
    setType('WorkSheet');
    setIsPaid(false);
    setPrice(3);
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 5) {
      setError('Resursun adı ən azı 5 simvol olsun.');
      return;
    }
    if (!file) {
      setError('Yüklənəcək faylı seçin.');
      return;
    }
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setError(`Fayl ölçüsü ${MAX_UPLOAD_MB} MB-dan çox ola bilməz.`);
      return;
    }
    if (isPaid && price <= 0) {
      setError('Ödənişli resurs üçün qiymət yazın.');
      return;
    }

    setSubmitting(true);
    try {
      await resourcesApi.upload({
        name: name.trim(),
        subject,
        grade,
        type,
        isPaid,
        price,
        file,
      });
      toast('Resurs moderasiyaya göndərildi.');
      reset();
    } catch (err) {
      setError(apiErrorMessage(err, 'Yükləmə alınmadı.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">Yüklə</h2>
      <p className="mt-1.5 text-sm text-brand-muted">
        PDF, DOCX və ya PPTX formatında, maksimum {MAX_UPLOAD_MB} MB. Material
        moderasiyadan sonra Resurs Bankına düşür.
      </p>

      <form onSubmit={handleSubmit} className="card mt-5 space-y-4">
        <Input
          name="name"
          label="Resursun adı"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Kəsrlərin toplanması — iş vərəqi"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            name="subject"
            label="Fənn"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          >
            {SUBJECTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Select
            name="grade"
            label="Sinif"
            value={grade}
            onChange={(event) => setGrade(Number(event.target.value))}
          >
            {GRADES.map((item) => (
              <option key={item} value={item}>
                {item}-ci sinif
              </option>
            ))}
          </Select>
        </div>

        <Select
          name="type"
          label="Tip"
          value={type}
          onChange={(event) => setType(event.target.value as ResourceType)}
        >
          {RESOURCE_TYPE_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>

        <div>
          <span className="mb-1.5 block font-heading text-[13px] font-semibold text-brand-slate">
            Fayl
          </span>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_UPLOAD_TYPES}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink file:mr-3 file:rounded-pill file:border-0 file:bg-brand-chipBg file:px-4 file:py-1.5 file:font-heading file:text-[13px] file:font-semibold file:text-brand-blue"
          />
          {file && (
            <p className="mt-1.5 text-xs text-brand-faint">
              {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
            </p>
          )}
        </div>

        <div className="rounded-xl bg-brand-chipBg p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(event) => setIsPaid(event.target.checked)}
              className="h-4 w-4 accent-brand-blue"
            />
            <span className="font-heading text-sm font-semibold text-brand-slate">
              Ödənişli resurs
            </span>
          </label>

          {isPaid && (
            <div className="mt-4">
              <Input
                name="price"
                type="number"
                min={1}
                step={0.5}
                label="Qiymət (₼)"
                value={price}
                onChange={(event) => setPrice(Number(event.target.value))}
                hint="Satışın 80%-i sizə, 20%-i platformaya gedir."
              />
            </div>
          )}
        </div>

        <ErrorNote message={error} />

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Göndərilir…' : 'Göndər'}
        </Button>
      </form>
    </section>
  );
}
