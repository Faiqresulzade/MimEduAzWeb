import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api';
import type { ItemType } from '../types';
import { useAuth } from './useAuth';
import { useCart } from './useCart';
import { useToast } from './useToast';

/**
 * "Səbətə əlavə et" davranışının tək mərkəzi:
 * login yoxlaması + backend biznes qaydalarının (400/409) toast-a çevrilməsi.
 */
export function useAddToCart() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const add = useCallback(
    async (itemType: ItemType, itemId: string) => {
      if (!isAuthenticated) {
        toast('Bunun üçün hesaba daxil olun.');
        navigate('/giris');
        return;
      }

      setPendingId(itemId);
      try {
        await addItem(itemType, itemId);
        toast('Səbətə əlavə edildi.');
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          toast(error.message || 'Bu məhsul artıq səbətdədir.');
        } else if (error instanceof ApiError) {
          toast(error.detail || 'Səbətə əlavə etmək alınmadı.');
        } else {
          toast('Səbətə əlavə etmək alınmadı.');
        }
      } finally {
        setPendingId(null);
      }
    },
    [isAuthenticated, addItem, toast, navigate],
  );

  return { add, pendingId };
}
