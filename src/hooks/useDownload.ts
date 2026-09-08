import { useCallback, useState } from 'react';
import { ApiError, fileUrl, resourcesApi } from '../api';
import { useToast } from './useToast';

/**
 * Sayğacı artırır və resursu açır.
 * Fayl resursu → endirmə linki; video/xarici link → yeni tabda açılır.
 */
export function useDownload() {
  const { toast } = useToast();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const download = useCallback(
    async (resourceId: string) => {
      setPendingId(resourceId);
      try {
        const result = await resourcesApi.download(resourceId);

        if (result.isExternal) {
          // Xarici link olduğu kimi açılır — API origin əlavə edilmir.
          window.open(result.downloadUrl, '_blank', 'noopener,noreferrer');
          toast('Link yeni tabda açıldı.');
        } else {
          window.open(fileUrl(result.downloadUrl), '_blank', 'noopener,noreferrer');
          toast('Endirmə başladı.');
        }
        return result;
      } catch (error) {
        if (error instanceof ApiError && error.status === 403) {
          toast('Bu resursu endirmək üçün əvvəlcə satın alın.');
        } else if (error instanceof ApiError && error.status === 401) {
          toast('Bunun üçün hesaba daxil olun.');
        } else {
          toast('Endirmə alınmadı.');
        }
        return null;
      } finally {
        setPendingId(null);
      }
    },
    [toast],
  );

  return { download, pendingId };
}
