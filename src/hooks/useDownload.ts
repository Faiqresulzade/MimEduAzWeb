import { useCallback, useState } from 'react';
import { ApiError, fileUrl, resourcesApi } from '../api';
import { useToast } from './useToast';

/** Pulsuz endirmə: sayğacı artırır və faylı yeni tabda açır. */
export function useDownload() {
  const { toast } = useToast();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const download = useCallback(
    async (resourceId: string) => {
      setPendingId(resourceId);
      try {
        const result = await resourcesApi.download(resourceId);
        window.open(fileUrl(result.downloadUrl), '_blank', 'noopener,noreferrer');
        toast('Endirmə başladı.');
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
