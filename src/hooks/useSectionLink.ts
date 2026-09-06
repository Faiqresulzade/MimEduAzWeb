import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Prototipdəki `section()` davranışı: başqa route-dasansa əvvəlcə hədəf
 * səhifəyə keç, sonra id-yə hamar sürüş. Eyni səhifədəsənsə birbaşa sürüş.
 */
export function useSectionLink() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (sectionId: string, path = '/') => {
      const scroll = () => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      if (location.pathname === path) {
        scroll();
        return;
      }

      navigate(`${path}#${sectionId}`);
    },
    [location.pathname, navigate],
  );
}

/** Hash ilə gələn route-larda uyğun bölməyə sürüşdürür. */
export function scrollToHash(hash: string) {
  if (!hash) return;
  const id = hash.replace('#', '');
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
