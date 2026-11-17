import type { PaymentRedirect } from '../types';

/**
 * 3-D Secure 2 üçün brauzer məlumatı (AzeriCard M_INFO): ekran ölçüsü və saat qurşağı.
 * Base64 JSON — kart məlumatı deyil.
 */
export function buildClientInfo(): string {
  const info = {
    browserScreenHeight: String(window.screen.height),
    browserScreenWidth: String(window.screen.width),
    browserTZ: String(new Date().getTimezoneOffset()),
  };
  return btoa(JSON.stringify(info));
}

/**
 * İstifadəçini AzeriCard-ın ödəniş səhifəsinə göndərir: backend-in imzaladığı sahələrlə
 * gizli form yaradılır və POST edilir. Kart məlumatı yalnız bank səhifəsində daxil edilir.
 */
export function submitPaymentForm(payment: PaymentRedirect) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = payment.url;
  form.style.display = 'none';

  for (const [name, value] of Object.entries(payment.fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
