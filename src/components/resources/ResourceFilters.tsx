import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { ALL_FILTER, ALL_GRADES, SUBJECTS } from '../../lib/constants';

interface ResourceFiltersProps {
  subject: string;
  grade: string;
  /** Mövcud resurslardan dinamik çıxarılmış sinif nömrələri. */
  availableGrades: number[];
  resultCount: number;
  onSubjectChange: (subject: string) => void;
  onGradeChange: (grade: string) => void;
  onClear: () => void;
}

export function ResourceFilters({
  subject,
  grade,
  availableGrades,
  resultCount,
  onSubjectChange,
  onGradeChange,
  onClear,
}: ResourceFiltersProps) {
  const isFiltered = subject !== ALL_FILTER || grade !== ALL_GRADES;

  const summary = [
    subject === ALL_FILTER ? 'Bütün fənlər' : subject,
    grade === ALL_GRADES ? 'bütün siniflər' : `${grade}-ci sinif`,
    `${resultCount} resurs`,
  ].join(' · ');

  return (
    <div className="space-y-5">
      <div>
        <h2 className="mb-3 font-heading text-[13px] font-bold uppercase tracking-[.08em] text-brand-faint">
          Fənn
        </h2>
        <div className="flex flex-wrap gap-2">
          <Chip active={subject === ALL_FILTER} onClick={() => onSubjectChange(ALL_FILTER)}>
            {ALL_FILTER}
          </Chip>
          {SUBJECTS.map((item) => (
            <Chip key={item} active={subject === item} onClick={() => onSubjectChange(item)}>
              {item}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-heading text-[13px] font-bold uppercase tracking-[.08em] text-brand-faint">
          Sinif
        </h2>
        <div className="flex flex-wrap gap-2">
          <Chip active={grade === ALL_GRADES} onClick={() => onGradeChange(ALL_GRADES)}>
            {ALL_GRADES}
          </Chip>
          {availableGrades.map((item) => (
            <Chip
              key={item}
              active={grade === String(item)}
              onClick={() => onGradeChange(String(item))}
            >
              {item}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-borderLight pt-4">
        <p className="text-sm font-medium text-brand-slate">{summary}</p>
        {isFiltered && (
          <Button variant="secondary" size="sm" onClick={onClear}>
            Filtri təmizlə
          </Button>
        )}
      </div>
    </div>
  );
}
