import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_EMAIL, PRIVACY_UPDATED_AT } from '../data/legal';
import { SellerDetails } from '../components/legal/LegalLayout';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-heading text-xl font-bold text-brand-navy">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-brand-ink">{children}</div>
    </section>
  );
}

/** Məxfilik siyasəti — sayt və MIMEDU.AZ Android tətbiqi üçün (Google Play tələbi). */
export default function PrivacyPage() {
  return (
    <div className="page">
      <article className="max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-brand-navy">Məxfilik siyasəti</h1>
        <p className="mt-2 text-sm text-brand-muted">Son yenilənmə: {PRIVACY_UPDATED_AT}</p>

        <p className="mt-6 text-base leading-relaxed text-brand-ink">
          Bu siyasət MIMEDU.AZ veb saytının (mimedu.az) və MIMEDU.AZ mobil tətbiqinin (Android,
          paket adı <code>az.mimedu.app</code>) hansı məlumatları topladığını, necə istifadə
          etdiyini və sizin hüquqlarınızı izah edir.
        </p>

        <Section title="Məlumatların nəzarətçisi">
          <p>Şəxsi məlumatlarınızın emalına görə məsul şəxs:</p>
          <SellerDetails />
        </Section>

        <Section title="1. Topladığımız məlumatlar">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Hesab məlumatları:</strong> ad və soyad, e-poçt ünvanı, şifrə (yalnız
              şifrələnmiş hash kimi saxlanılır), hesab növü (şagird/müəllim), istəyə görə fənn.
            </li>
            <li>
              <strong>Google ilə giriş:</strong> Google hesabınızın adı, e-poçtu və Google
              identifikatoru. Google şifrənizi görmürük.
            </li>
            <li>
              <strong>Platformadakı fəaliyyət:</strong> səbət, sifarişlər, təlimlərə yazılma və
              dərs irəliləyişi, sınaq və test nəticələri, verilən sertifikatlar, müəllimlərin
              yüklədiyi materiallar.
            </li>
            <li>
              <strong>Ödəniş məlumatları:</strong> kart məlumatları (tam nömrə, bitmə tarixi,
              CVV) AzeriCard/ABB tərəfindən onların təhlükəsiz səhifəsində emal olunur və bizə
              ötürülmür. Biz yalnız sifariş nömrəsini, məbləği, ödənişin statusunu, bankın
              qaytardığı maskalanmış kart nömrəsini, əməliyyat (RRN) və təsdiq kodunu, həmçinin
              şərtlərlə razılaşdığınız anı saxlayırıq.
            </li>
            <li>
              <strong>Müəllif ödənişləri:</strong> qazancını çıxaran müəllimdən bank hesabının
              IBAN-ı, hesab sahibinin adı və FİN kodu toplanır — yalnız bank köçürməsi və vergi
              uçotu üçün. Kart nömrəsi toplanmır.
            </li>
            <li>
              <strong>KSQ cavab kartı şəkilləri:</strong> müəllim kamera ilə cavab kartını
              çəkəndə şəkil yalnız cavabları oxumaq üçün serverə göndərilir. Şəkil emal olunduqdan
              sonra saxlanılmır; yalnız nəticə (bal, cavablar) yadda saxlanılır.
            </li>
            <li>
              <strong>Texniki məlumatlar:</strong> təhlükəsizlik və xətaların aradan qaldırılması
              üçün server sorğu jurnalları (IP ünvanı, sorğu vaxtı, xəta mətnləri).
            </li>
          </ul>
          <p>
            Tətbiq reklam göstərmir, reklam identifikatorundan istifadə etmir və məkan, kontaktlar
            və ya mikrofon məlumatlarını toplamır.
          </p>
        </Section>

        <Section title="2. İcazələr (mobil tətbiq)">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Kamera:</strong> KSQ cavab kartlarının oxunması və sertifikat QR kodunun
              skan edilməsi üçün. Yalnız siz bu funksiyanı açanda istifadə olunur.
            </li>
            <li>
              <strong>Fayllar/qalereya:</strong> material yükləmək və ya şəkil seçmək üçün
              yalnız sizin seçdiyiniz fayllar.
            </li>
            <li>
              <strong>İnternet:</strong> platformanın serveri ilə əlaqə üçün.
            </li>
          </ul>
        </Section>

        <Section title="3. Məlumatlardan necə istifadə edirik">
          <ul className="list-disc space-y-2 pl-5">
            <li>hesabınızı yaratmaq və girişi təmin etmək;</li>
            <li>təlim, resurs və sınaqlara çıxışı vermək, sertifikat hazırlamaq;</li>
            <li>sertifikatın koda görə yoxlanmasını təmin etmək;</li>
            <li>müəllimlərə satış və qazanc hesabatı göstərmək;</li>
            <li>xidmətin təhlükəsizliyini qorumaq və xətaları aradan qaldırmaq.</li>
          </ul>
          <p>Məlumatlarınızı satmırıq və reklam məqsədilə istifadə etmirik.</p>
        </Section>

        <Section title="4. Üçüncü tərəflər">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Hostinq:</strong> server və verilənlər bazası bulud provayderlərində
              (Render, Cloudflare) yerləşir.
            </li>
            <li>
              <strong>Google:</strong> Google ilə giriş seçildikdə identifikasiya üçün.
            </li>
            <li>
              <strong>ABB və AzeriCard:</strong> kartla ödənişin emalı və 3-D Secure təsdiqi
              üçün. Onlara sifariş nömrəsi, məbləğ və e-poçtunuz ötürülür; kart məlumatlarını siz
              birbaşa onların səhifəsində daxil edirsiniz.
            </li>
            <li>
              <strong>Süni intellekt xidməti:</strong> KSQ cavab kartı şəkli cavabların oxunması
              üçün süni intellekt API-sinə (OpenRouter vasitəsilə) göndərilir; şəkil təlim məqsədilə istifadə edilmir və
              bizim tərəfimizdən saxlanılmır.
            </li>
          </ul>
          <p>
            İctimai görünən məlumatlar: müəllimin adı onun paylaşdığı materiallarda, sertifikat
            sahibinin adı isə sertifikat kodunu bilən hər kəsə sertifikat yoxlamasında görünür.
          </p>
        </Section>

        <Section title="5. Təhlükəsizlik və saxlanma">
          <p>
            Bütün əlaqə HTTPS ilə şifrələnir. Şifrələr hash şəklində saxlanılır. Mobil tətbiqdə
            giriş token-ləri cihazın təhlükəsiz yaddaşında (Android Keystore) saxlanılır.
          </p>
          <p>
            Məlumatlar hesabınız aktiv olduğu müddətdə saxlanılır. Hesab silindikdən sonra şəxsi
            məlumatlar silinir (aşağıya bax). Sifariş, ödəniş və müəllif ödənişi qeydləri
            mühasibat və vergi qanunvericiliyinin tələb etdiyi müddət ərzində saxlanılır.
          </p>
          <p>
            Saytda girişi davam etdirmək üçün brauzerin yerli yaddaşında (localStorage) giriş
            token-i saxlanılır; reklam və izləmə cookie-ləri istifadə edilmir. Çıxış etdikdə token
            silinir.
          </p>
        </Section>

        <Section title="6. Hesabın və məlumatların silinməsi">
          <p>
            Hesabınızı istənilən vaxt özünüz silə bilərsiniz: mobil tətbiqdə{' '}
            <strong>Profil → Hesabı sil</strong>, saytda isə{' '}
            <Link to="/hesabi-sil" className="text-brand-blue underline">
              mimedu.az/hesabi-sil
            </Link>{' '}
            səhifəsində. Silinmə zamanı ad, e-poçt, fənn, şifrə, Google bağlantısı və səbət
            dərhal silinir və hesaba bir daha daxil olmaq mümkün olmur. Sifariş, ödəniş və verilmiş
            sertifikat qeydləri mühasibat və sertifikatın yoxlanması məqsədilə adsız şəkildə
            saxlanıla bilər. Müəllimin artıq satılmış materialları onları almış istifadəçilər
            üçün əlçatan qalır.
          </p>
        </Section>

        <Section title="7. Uşaqlar">
          <p>
            Platforma müəllimlər və böyüklər üçün nəzərdə tutulub və 13 yaşdan kiçik uşaqlara
            yönəlməyib. Belə istifadəçidən məlumat toplandığını bilsək, onu siləcəyik. Ödəniş
            etmək üçün 18 yaş və ya valideynin (qanuni nümayəndənin) razılığı tələb olunur.
          </p>
        </Section>

        <Section title="8. Hüquqlarınız">
          <p>
            Məlumatlarınıza baxmaq, düzəltmək və ya silinməsini tələb etmək hüququnuz var. Bunun
            üçün bizə yazın:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-blue underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="9. Dəyişikliklər">
          <p>
            Bu siyasət yenilənə bilər. Əhəmiyyətli dəyişikliklər bu səhifədə tarixlə dərc
            olunur.
          </p>
        </Section>
      </article>
    </div>
  );
}
