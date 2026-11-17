import { Link } from 'react-router-dom';
import { LegalPage, LegalSection } from '../../components/legal/LegalLayout';
import { RESPONSE_DAYS, SUPPORT_EMAIL, TERMS_UPDATED_AT } from '../../data/legal';

/**
 * Geri qaytarma siyasəti. Qərar: rəqəmsal məhsul yalnız xəta hallarında qaytarılır
 * (texniki xəta, ikiqat ödəniş, təsvirə uyğunsuzluq). Kart sistemləri bunun açıq yazılmasını tələb edir.
 */
export default function RefundPage() {
  return (
    <LegalPage
      title="Geri qaytarma siyasəti"
      updatedAt={TERMS_UPDATED_AT}
      intro={
        <p>
          Platformada satılan bütün məhsullar rəqəmsaldır və ödəniş təsdiqləndikdən dərhal sonra
          istifadəyə verilir. Ona görə alınmış məhsulun dəyəri, aşağıda göstərilən hallar istisna
          olmaqla, geri qaytarılmır.
        </p>
      }
    >
      <LegalSection title="1. Pulun qaytarıldığı hallar">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Texniki xəta:</strong> ödəniş edilib, lakin məhsula giriş açılmayıb və biz
            problemi müraciətdən sonra {RESPONSE_DAYS} iş günü ərzində həll edə bilməmişik.
          </li>
          <li>
            <strong>İkiqat ödəniş:</strong> eyni sifariş üçün kartdan bir neçə dəfə pul çıxılıb —
            artıq ödənilən məbləğ həmişə tam qaytarılır.
          </li>
          <li>
            <strong>Məhsul təsvirə uyğun deyil:</strong> fayl açılmır, zədəlidir, boşdur və ya
            məzmunu səhifədəki təsvirdən əhəmiyyətli dərəcədə fərqlənir.
          </li>
          <li>
            <strong>Canlı təlim ləğv edilib:</strong> təlim bizim tərəfimizdən ləğv edilərsə və ya
            təxirə salınarsa və yeni tarix sizə uyğun deyilsə — tam qaytarılır.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Qaytarılmayan hallar">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            fikrinizi dəyişdiyiniz, məhsulu səhvən aldığınız və ya artıq lazım olmadığı hallarda;
          </li>
          <li>resurs endirildikdən, video təlimə və ya sınağa başlandıqdan sonra;</li>
          <li>canlı təlimdə iştirak etmədiyiniz halda (təlim baş tutubsa).</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Necə müraciət etmək">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            {SUPPORT_EMAIL} ünvanına yazın: sifariş nömrəsi (məs. MIM-1234,{' '}
            <Link to="/sifarisler" className="text-brand-blue underline">
              Sifarişlərim
            </Link>{' '}
            bölməsində görünür), problemin təsviri və mümkünsə ekran görüntüsü.
          </li>
          <li>Müraciətə {RESPONSE_DAYS} iş günü ərzində cavab veririk.</li>
          <li>
            Qaytarma təsdiqlənərsə, pul ödəniş edilən karta qaytarılır. Pulun hesaba düşməsi
            bankınızdan asılı olaraq 3–30 iş günü çəkə bilər.
          </li>
        </ol>
        <p>Müraciət ödəniş tarixindən sonra 30 gün ərzində qəbul olunur.</p>
      </LegalSection>

      <LegalSection title="4. Qaytarmadan sonra">
        <p>
          Pul qaytarıldıqda alınmış məhsula giriş bağlanır. Müəllimin həmin satışdan payı onun
          balansından çıxılır.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
