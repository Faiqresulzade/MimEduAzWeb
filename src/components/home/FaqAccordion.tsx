import { useState } from 'react';
import { faqItems } from '../../data/static';

export function FaqAccordion() {
  // Prototipdəki `faqOpen` state-i: bir dəfədə yalnız biri açıq qalır.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-24 border-y border-brand-borderLight bg-brand-surface">
      <div className="shell py-14 sm:py-16">
        <h2 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
          Tez-tez verilən suallar
        </h2>

        <div className="mt-8 divide-y divide-brand-borderLight rounded-2xl border border-brand-border">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-brand-hoverBg"
                  >
                    <span className="font-heading text-[15px] font-semibold text-brand-navy">
                      {item.question}
                    </span>
                    <span
                      aria-hidden
                      className={`shrink-0 text-brand-blue transition-transform duration-200 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-brand-ink">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
