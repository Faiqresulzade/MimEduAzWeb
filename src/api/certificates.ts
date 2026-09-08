import { api, API_BASE } from './client';
import type { Certificate, CertificateVerifyResult } from '../types';

/**
 * Sertifikat sənədinin publik linki — token tələb etmir, ona görə birbaşa
 * `<a href>` / `<img src>` kimi işlədilə bilər (cavab fayl axınıdır, JSON deyil).
 */
export function certificateDocumentUrl(code: string, format: 'png' | 'pdf' = 'png') {
  const path = `${API_BASE}/certificates/${encodeURIComponent(code)}/download`;
  return format === 'pdf' ? `${path}?format=pdf` : path;
}

export const certificatesApi = {
  async mine() {
    const { data } = await api.get<Certificate[]>('/certificates/mine');
    return data;
  },

  /** Publik — token tələb etmir. Kod tapılmasa da 200 + isValid:false qaytarır. */
  async verify(code: string) {
    const { data } = await api.get<CertificateVerifyResult>(
      `/certificates/verify/${encodeURIComponent(code)}`,
    );
    return data;
  },

  async issue(userFullName: string, trainingId: string) {
    const { data } = await api.post<Certificate>('/certificates/issue', {
      userFullName,
      trainingId,
    });
    return data;
  },
};
