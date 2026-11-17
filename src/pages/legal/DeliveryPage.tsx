import { Link } from 'react-router-dom';
import { LegalPage, LegalSection } from '../../components/legal/LegalLayout';
import { RESPONSE_DAYS, SUPPORT_EMAIL, TERMS_UPDATED_AT } from '../../data/legal';

const link = 'text-brand-blue underline';

/** Xidmətin təqdim edilməsi: fiziki çatdırılma yoxdur — müştəri aldığını nə vaxt və necə alır. */
export default function DeliveryPage() {
  return (
    <LegalPage
      title="Xidmətin təqdim edilməsi"
      updatedAt={TERMS_UPDATED_AT}
      intro={
        <p>
          Platformada fiziki məhsul satılmır və çatdırılma yoxdur. Bütün məhsullar onlayn təqdim
          olunur və bank ödənişi təsdiqləndikdən dərhal sonra hesabınızda açılır.
        </p>
      }
    >
      <LegalSection title="Rəqəmsal resurslar">
        <p>
          İş vərəqi, test, təqdimat və digər fayllar ödənişdən dərhal sonra{' '}
          <Link to="/panel/aldiqlarim" className={link}>
            Aldıqlarım
          </Link>{' '}
          bölməsində endirmə üçün açılır. Endirmə sayı məhdud deyil.
        </p>
      </LegalSection>

      <LegalSection title="Video və onlayn təlimlər">
        <p>
          Təlim ödənişdən dərhal sonra{' '}
          <Link to="/panel/telimlerim" className={link}>
            Təlimlərim
          </Link>{' '}
          bölməsində açılır. Giriş müddəti məhdud deyil — platforma fəaliyyət göstərdiyi müddətdə
          dərslərə istənilən vaxt baxa bilərsiniz.
        </p>
      </LegalSection>

      <LegalSection title="Canlı təlimlər">
        <p>
          Canlı təlimin tarixi, saatı və formatı təlim səhifəsində göstərilir. Onlayn görüşün
          linki təlim başlamazdan əvvəl{' '}
          <Link to="/panel/telimlerim" className={link}>
            Təlimlərim
          </Link>{' '}
          bölməsində yerləşdirilir; e-poçtla göndərilmir. Canlı təlimdə yer sayı məhduddur (25
          nəfər) — yer qalmayanda alış mümkün olmur.
        </p>
      </LegalSection>

      <LegalSection title="Sınaqlar">
        <p>
          Ödənişli sınaq ödənişdən dərhal sonra başlamaq üçün açılır. Hər sınaq bir dəfə verilir;
          vaxt sınağa başladığınız andan hesablanır və nəticə bitirdikdən dərhal sonra görünür.
        </p>
      </LegalSection>

      <LegalSection title="Sertifikatlar">
        <p>
          Təlim və ya sınaq uğurla tamamlandıqda sertifikat avtomatik verilir və{' '}
          <Link to="/panel/sertifikatlarim" className={link}>
            Sertifikatlarım
          </Link>{' '}
          bölməsində PNG/PDF kimi endirilə bilər.
        </p>
      </LegalSection>

      <LegalSection title="Giriş açılmasa">
        <p>
          Ödəniş təsdiqlənib, lakin məhsul hesabınızda görünmürsə, səhifəni yeniləyin və{' '}
          <Link to="/sifarisler" className={link}>
            Sifarişlərim
          </Link>{' '}
          bölməsində sifarişin statusunu yoxlayın. Problem qalarsa, sifariş nömrəsi ilə{' '}
          {SUPPORT_EMAIL} ünvanına yazın — {RESPONSE_DAYS} iş günü ərzində həll edirik və ya{' '}
          <Link to="/geri-qaytarma" className={link}>
            pulu qaytarırıq
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
