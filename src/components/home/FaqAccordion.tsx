import { useState } from 'react';
import { faqItems } from '../../data/static';
import { Icon } from '../ui/Icon';

export function FaqAccordion() {
  // Prototipdəki `faqOpen` state-i: bir dəfədə yalnız biri açıq qalır.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-24 lg:border-y lg:border-brand-borderLight lg:bg-brand-surface">
      <div className="shell py-4 lg:py-16">
        <h2 className="font-heading text-[22px] font-bold text-brand-navy lg:text-3xl">
          Tez-tez verilən suallar
        </h2>

        <div className="mt-3 divide-y divide-brand-borderLight overflow-hidden rounded-2xl border border-brand-border bg-brand-surface lg:mt-8">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-brand-hoverBg"
                  >
                    <span className="font-heading text-sm font-semibold text-brand-navy lg:text-[15px]">
                      {item.question}
                    </span>
                    <Icon name={isOpen ? 'minus' : 'plus'} size={20} className="text-brand-blue" />
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
