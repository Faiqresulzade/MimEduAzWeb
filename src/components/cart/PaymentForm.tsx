import { useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { ErrorNote } from '../ui/ErrorNote';
import { Input } from '../ui/Input';

interface PaymentFormProps {
  submitting: boolean;
  /**
   * Kart məlumatları BURADAN KƏNARA ÇIXMIR — yalnız kart sahibinin adı
   * `customerName` kimi backend-ə ötürülür (API_FRONTEND.md §4).
   */
  onSubmit: (customerName: string) => void;
}

export function PaymentForm({ submitting, onSubmit }: PaymentFormProps) {
  const [holder, setHolder] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState<string | null>(null);

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, '')
      .slice(0, 19)
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const digits = number.replace(/\s/g, '');
    if (!holder.trim() || digits.length < 12) {
      setError('Kart sahibinin adını və 16 rəqəmli kart nömrəsini yazın.');
      return;
    }

    setError(null);
    onSubmit(holder.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="font-heading text-lg font-bold text-brand-navy">Ödəniş</h2>
      <p className="mt-1.5 text-sm text-brand-muted">
        Demo rejim — kart məlumatları heç yerə göndərilmir və saxlanılmır.
      </p>

      <div className="mt-5 space-y-4">
        <Input
          name="cardHolder"
          label="Kart sahibinin adı"
          value={holder}
          onChange={(event) => setHolder(event.target.value)}
          placeholder="NIGAR ALIYEVA"
          autoComplete="off"
        />
        <Input
          name="cardNumber"
          label="Kart nömrəsi"
          value={number}
          onChange={(event) => setNumber(formatCardNumber(event.target.value))}
          placeholder="4169 7388 1234 5678"
          inputMode="numeric"
          autoComplete="off"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="expiry"
            label="Bitmə tarixi"
            value={expiry}
            onChange={(event) => setExpiry(formatExpiry(event.target.value))}
            placeholder="AA/İİ"
            inputMode="numeric"
            autoComplete="off"
          />
          <Input
            name="cvc"
            label="CVC"
            value={cvc}
            onChange={(event) => setCvc(event.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="123"
            inputMode="numeric"
            autoComplete="off"
          />
        </div>

        <ErrorNote message={error} />

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Ödəniş edilir…' : 'Ödənişi tamamla'}
        </Button>
      </div>
    </form>
  );
}
