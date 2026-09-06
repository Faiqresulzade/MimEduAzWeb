import { api } from './client';
import type { Certificate, CertificateVerifyResult } from '../types';

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
