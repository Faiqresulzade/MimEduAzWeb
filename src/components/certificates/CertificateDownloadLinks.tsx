import { certificateDocumentUrl } from '../../api';
import { buttonClasses, type ButtonSize } from '../ui/buttonStyles';

/**
 * Sertifikat sənədinin endirmə linkləri. Endpoint publikdir və fayl axını
 * qaytarır, ona görə fetch yox, birbaşa <a href> istifadə olunur.
 */
export function CertificateDownloadLinks({
  code,
  size = 'sm',
}: {
  code: string;
  size?: ButtonSize;
}) {
  return (
    <>
      <a
        href={certificateDocumentUrl(code, 'png')}
        download
        className={buttonClasses('secondary', size)}
      >
        PNG endir
      </a>
      <a
        href={certificateDocumentUrl(code, 'pdf')}
        download
        className={buttonClasses('secondary', size)}
      >
        PDF endir
      </a>
    </>
  );
}
