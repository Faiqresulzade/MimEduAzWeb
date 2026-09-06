/**
 * ============================================================================
 * BACKEND-DƏ HƏLƏ MÖVCUD OLMAYAN ƏMƏLİYYATLAR
 * ============================================================================
 * Frontend spesifikasiyası bu funksionallıqları tələb edir, lakin hazırkı
 * backend-də (MimEduAz) uyğun endpoint yoxdur. Hər funksiya frontend-də
 * hesablanır və ya lokal olaraq saxlanılır.
 *
 * Backend hazır olanda: YALNIZ bu faylın içindəki funksiyaların gövdəsini
 * real `api.get/post` çağırışı ilə əvəz edin — komponentlərə toxunmaq
 * lazım deyil, çünki qaytardıqları tiplər dəyişmir.
 * ============================================================================
 */

import type { AuthorEarnings, PlatformStats, Resource, Training } from '../types';

/** Backend-dəki komissiya faizi (GET /admin/sales → commissionPercent) ilə eynidir. */
export const COMMISSION_PERCENT = 0.2;

/* -------------------------------------------------------------------------
 * 1. Müəllif qazancı — spec §11.2, §11.6
 * TODO(backend): GET /api/v1/resources/mine/earnings → AuthorEarnings
 *
 * Hazırkı yaxınlaşma: ödənişli resursu yalnız satın almış istifadəçi endirə
 * bilir (API_FRONTEND.md §2), ona görə `downloads` sayı satılan ədədin ən
 * yaxın proksisidir. Pulsuz resurslar qazanca daxil edilmir.
 * ---------------------------------------------------------------------- */
export function computeAuthorEarnings(resources: Resource[]): AuthorEarnings {
  const perResource = resources
    .filter((r) => r.isPaid && r.status === 'Approved')
    .map((r) => ({
      resourceId: r.id,
      name: r.name,
      unitsSold: r.downloads,
      price: r.price,
      net: r.downloads * r.price * (1 - COMMISSION_PERCENT),
    }));

  const grossTotal = perResource.reduce((sum, r) => sum + r.unitsSold * r.price, 0);

  return {
    grossTotal,
    commissionTotal: grossTotal * COMMISSION_PERCENT,
    netTotal: grossTotal * (1 - COMMISSION_PERCENT),
    commissionPercent: COMMISSION_PERCENT,
    perResource,
  };
}

/** Tək resursun qazanc etiketi (spec §11.2: satılan × qiymət × 0.8). */
export function resourceEarning(resource: Resource): number | null {
  if (!resource.isPaid) return null;
  return resource.downloads * resource.price * (1 - COMMISSION_PERCENT);
}

/* -------------------------------------------------------------------------
 * 2. Ödəniş (payout) tələbi — spec §11.6
 * TODO(backend): POST /api/v1/payouts/request { cardNumber } → 202 Accepted
 * ---------------------------------------------------------------------- */
export const MIN_PAYOUT_BALANCE = 20;

export async function requestPayout(_cardNumber: string): Promise<void> {
  // Backend yoxdur — demo rejimdə sadəcə uğurlu sayılır.
  await new Promise((resolve) => setTimeout(resolve, 300));
}

/* -------------------------------------------------------------------------
 * 3. İmtahan silmə — spec §11.4
 * TODO(backend): DELETE /api/v1/resources/{resourceId}/quiz → 204
 * ---------------------------------------------------------------------- */
export const QUIZ_DELETE_SUPPORTED = false;

/* -------------------------------------------------------------------------
 * 4. Ana səhifə statistikası — spec §5.2
 * TODO(backend): GET /api/v1/stats → PlatformStats
 *
 * Prototipdəki baza rəqəm (1170) mövcud resurs sayının üstünə gəlir.
 * ---------------------------------------------------------------------- */
const STATS_RESOURCE_BASELINE = 1170;
const STATS_TEACHER_BASELINE = 2400;

export function computePlatformStats(
  resourceCount: number,
  trainings: Training[],
): PlatformStats {
  return {
    resourceCount: STATS_RESOURCE_BASELINE + resourceCount,
    trainingCount: trainings.length,
    teacherCount: STATS_TEACHER_BASELINE,
    totalDownloads: trainings.reduce((sum, t) => sum + t.seatsTaken, 0),
  };
}

/* -------------------------------------------------------------------------
 * 5. "İmtahan keçilib" statusu — spec §6.3, §6.4
 * TODO(backend): GET /api/v1/quiz/attempts/mine → { quizId, passed }[]
 *
 * Backend attempt-ləri saxlayır, amma oxumaq üçün endpoint vermir.
 * Müvəqqəti həll: uğurlu submit-dən sonra nəticə brauzerdə qeyd olunur.
 * ---------------------------------------------------------------------- */
const PASSED_QUIZ_KEY = 'mimedu.passedQuizzes';

function readPassedMap(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(PASSED_QUIZ_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function markQuizPassed(userId: string, resourceId: string) {
  const map = readPassedMap();
  const passed = new Set(map[userId] ?? []);
  passed.add(resourceId);
  map[userId] = [...passed];
  localStorage.setItem(PASSED_QUIZ_KEY, JSON.stringify(map));
}

export function getPassedResourceIds(userId: string | undefined): Set<string> {
  if (!userId) return new Set();
  return new Set(readPassedMap()[userId] ?? []);
}

/* -------------------------------------------------------------------------
 * 6. Bütün verilmiş sertifikatların siyahısı (admin) — spec §12.5
 * TODO(backend): GET /api/v1/admin/certificates → CertificateDto[]
 *
 * Backend yalnız `/certificates/mine` və `/certificates/verify/{code}`
 * verir. Admin panelində hazırda yalnız cari sessiyada verilmiş
 * sertifikatlar göstərilir.
 * ---------------------------------------------------------------------- */
export const ADMIN_CERTIFICATE_LIST_SUPPORTED = false;
