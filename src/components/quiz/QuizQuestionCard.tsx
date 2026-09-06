import type { QuizQuestion } from '../../types';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  index: number;
  selectedIndex: number | undefined;
  onSelect: (optionIndex: number) => void;
}

export function QuizQuestionCard({
  question,
  index,
  selectedIndex,
  onSelect,
}: QuizQuestionCardProps) {
  return (
    <fieldset className="card">
      <legend className="sr-only">Sual {index + 1}</legend>

      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-online-bg font-heading text-[13px] font-bold text-brand-blueDark">
          {index + 1}
        </span>
        <p className="font-heading text-[15px] font-semibold leading-snug text-brand-navy">
          {question.questionText}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedIndex === optionIndex;
          return (
            <button
              key={optionIndex}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(optionIndex)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                isSelected
                  ? 'border-brand-blue bg-online-bg text-brand-navy'
                  : 'border-brand-border bg-white text-brand-ink hover:border-[#c9d8ef] hover:bg-brand-hoverBg'
              }`}
            >
              <span
                aria-hidden
                className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected ? 'border-brand-blue' : 'border-brand-border'
                }`}
              >
                {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" />}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
