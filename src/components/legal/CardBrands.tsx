/**
 * Qəbul olunan kartlar. Rəsmi Visa/Mastercard loqo faylları brend qaydalarına görə yalnız
 * rəsmi mənbədən (bank/acquirer-in verdiyi "acceptance mark" dəsti) götürülməlidir — onlar
 * gələnə qədər neytral mətn nişanları göstərilir. Fayllar public/brands/ qovluğuna qoyulanda
 * bu komponent <img> ilə əvəz olunur.
 */
const BRANDS = ['Visa', 'Mastercard'];

export function CardBrands({ compact = false }: { compact?: boolean }) {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Qəbul olunan kartlar">
      {BRANDS.map((brand) => (
        <li
          key={brand}
          className={`rounded-md border border-brand-border bg-white font-heading font-bold tracking-wide text-brand-navy ${
            compact ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
          }`}
        >
          {brand}
        </li>
      ))}
      <li className={`text-brand-faint ${compact ? 'text-[11px]' : 'text-xs'}`}>
        3-D Secure · AZN
      </li>
    </ul>
  );
}
