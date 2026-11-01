import { useSyncExternalStore } from 'react';

/** Tailwind `lg` (1024px) — bundan aşağıda sayt mobil tətbiq görünüşünə keçir. */
const QUERY = '(min-width: 1024px)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

export function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}
