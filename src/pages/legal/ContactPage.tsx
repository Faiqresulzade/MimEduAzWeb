import { LegalPage, LegalSection, SellerDetails } from '../../components/legal/LegalLayout';
import { RESPONSE_DAYS, SUPPORT_EMAIL, SUPPORT_HOURS } from '../../data/legal';

/** Əlaqə — satıcının rekvizitləri, telefon, e-poçt, iş saatları. */
export default function ContactPage() {
  return (
    <LegalPage
      title="Əlaqə"
      intro={
        <p>
          Sual, şikayət və ya ödənişlə bağlı müraciətiniz üçün bizə yazın və ya zəng edin.
          Sifarişlə bağlı müraciətdə sifariş nömrəsini (məs. MIM-1234) qeyd edin.
        </p>
      }
    >
      <LegalSection title="Rekvizitlər">
        <SellerDetails />
      </LegalSection>

      <LegalSection title="İş saatları">
        <p>
          {SUPPORT_HOURS}. E-poçt ({SUPPORT_EMAIL}) ilə müraciətlərə {RESPONSE_DAYS} iş günü
          ərzində cavab veririk.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
