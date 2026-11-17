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

/* -------------------------------------------------------------------------
 * 3. İmtahan silmə — spec §11.4
 * TODO(backend): DELETE /api/v1/resources/{resourceId}/quiz → 204
 * ---------------------------------------------------------------------- */
export const QUIZ_DELETE_SUPPORTED = false;

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
