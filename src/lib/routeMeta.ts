import { matchPath } from 'react-router-dom';

/** Mobil tətbiqin alt tab bar-ı ilə eyni beş bölmə. */
export type TabKey = 'home' | 'trainings' | 'resources' | 'exams' | 'profile';

export interface RouteMeta {
  /** App bar başlığı (mobil `strings.titles`). */
  title: string;
  /** Tab kökü isə — alt tab bar görünür, geri düyməsi yoxdur. */
  tab?: TabKey;
  /** Tarixçə boşdursa (birbaşa link) geri düyməsinin apardığı ünvan. */
  back?: (params: Record<string, string | undefined>) => string;
  /** Sınaq icrası kimi ekranlarda geri düyməsi göstərilmir. */
  noBack?: boolean;
}

const to = (path: string) => () => path;

const routes: [pattern: string, meta: RouteMeta][] = [
  ['/', { title: 'MIMEDU.AZ', tab: 'home' }],
  ['/telimler', { title: 'Təlimlər', tab: 'trainings' }],
  ['/resurslar', { title: 'Resurs Bankı', tab: 'resources' }],
  ['/sinaqlar', { title: 'Sınaqlar', tab: 'exams' }],
  ['/profil', { title: 'Profil', tab: 'profile' }],

  ['/telimler/:id', { title: 'Təlim', back: to('/telimler') }],
  ['/telimler/:id/dersler', { title: 'Dərslər', back: (p) => `/telimler/${p.id}` }],
  ['/resurslar/:id', { title: 'Resurs', back: to('/resurslar') }],
  ['/imtahan/:resourceId', { title: 'İmtahan', back: (p) => `/resurslar/${p.resourceId}` }],
  ['/muellif/:id', { title: 'Müəllif', back: to('/resurslar') }],
  ['/sinaqlar/:id', { title: 'Sınaq', back: to('/sinaqlar') }],
  ['/sinaqlar/:id/cehd/:attemptId', { title: 'Sınaq', noBack: true }],
  ['/sinaq-neticesi/:attemptId', { title: 'Sınaq nəticəsi', back: to('/sinaqlar') }],
  ['/blog/:id', { title: 'Blog', back: to('/') }],
  ['/promptlar', { title: 'Prompt Kitabxanası', back: to('/profil') }],
  ['/haqqimizda', { title: 'Haqqımızda', back: to('/profil') }],
  ['/sertifikat-yoxla', { title: 'Sertifikat yoxlama', back: to('/profil') }],
  ['/sertifikat-yoxla/:code', { title: 'Sertifikat yoxlama', back: to('/profil') }],
  ['/giris', { title: 'Giriş', back: to('/profil') }],
  ['/sebet', { title: 'Səbət', back: to('/profil') }],
  ['/sifarisler', { title: 'Sifarişlərim', back: to('/profil') }],

  ['/panel', { title: 'Müəllim paneli', back: to('/profil') }],
  ['/panel/telimlerim', { title: 'Təlimlərim', back: to('/profil') }],
  ['/panel/aldiqlarim', { title: 'Aldıqlarım', back: to('/profil') }],
  ['/panel/sertifikatlarim', { title: 'Sertifikatlarım', back: to('/profil') }],
  ['/panel/resurslarim', { title: 'Resurslarım', back: to('/panel') }],
  ['/panel/yukle', { title: 'Yüklə', back: to('/panel') }],
  ['/panel/imtahanlar', { title: 'İmtahanlar', back: to('/panel') }],
  ['/panel/sinaqlarim', { title: 'Sınaqlarım', back: to('/panel') }],
  ['/panel/qazanc', { title: 'Qazanc', back: to('/panel') }],
  ['/panel/ksq-yoxlama', { title: 'KSQ yoxlama', back: to('/panel') }],

  ['/admin', { title: 'Admin paneli', back: to('/profil') }],
  ['/admin/icmal', { title: 'İcmal', back: to('/admin') }],
  ['/admin/moderasiya', { title: 'Moderasiya', back: to('/admin') }],
  ['/admin/sinaqlar', { title: 'Sınaq moderasiyası', back: to('/admin') }],
  ['/admin/telimler', { title: 'Təlimlər', back: to('/admin') }],
  ['/admin/istifadeciler', { title: 'İstifadəçilər', back: to('/admin') }],
  ['/admin/satis', { title: 'Satış', back: to('/admin') }],
  ['/admin/sertifikatlar', { title: 'Sertifikatlar', back: to('/admin') }],
  ['/admin/loglar', { title: 'Loglar', back: to('/admin') }],
];

export function resolveRouteMeta(pathname: string) {
  for (const [pattern, meta] of routes) {
    const match = matchPath(pattern, pathname);
    if (match) return { meta, params: match.params };
  }
  return { meta: { title: 'MIMEDU.AZ', back: to('/') } as RouteMeta, params: {} };
}
