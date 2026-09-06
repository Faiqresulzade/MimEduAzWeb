import { Link } from 'react-router-dom';
import type { QuizSubmitResult } from '../../types';
import { Button } from '../ui/Button';

interface QuizResultProps {
  result: QuizSubmitResult;
  onRetry: () => void;
}

export function QuizResult({ result, onRetry }: QuizResultProps) {
  const tone = result.passed
    ? 'bg-free-bg text-free-text'
    : 'bg-danger-bg text-danger-text';

  return (
    <div className={`card !border-transparent ${tone}`}>
      <p className="font-heading text-4xl font-bold">{result.scorePercent}%</p>
      <p className="mt-2 text-sm font-medium">
        {result.correctCount} / {result.totalQuestions} doğru cavab · keçid balı{' '}
        {result.passPercent}%
      </p>
      <p className="mt-3 font-heading text-lg font-semibold">
        {result.passed ? 'Təbriklər, imtahanı keçdiniz!' : 'Keçid balı toplanmadı.'}
      </p>

      {result.passed && result.certificateCode && (
        <p className="mt-2 text-sm">
          Sertifikat kodu: <strong>{result.certificateCode}</strong>
        </p>
      )}

      <div className="mt-6">
        {result.passed ? (
          <Link to="/panel/sertifikatlarim">
            <Button>Sertifikatı gör</Button>
          </Link>
        ) : (
          <Button onClick={onRetry}>Yenidən cəhd et</Button>
        )}
      </div>
    </div>
  );
}
