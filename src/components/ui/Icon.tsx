import {
  mdiAccountCircle,
  mdiAccountCircleOutline,
  mdiAccountGroupOutline,
  mdiArrowLeft,
  mdiBookshelf,
  mdiBriefcaseOutline,
  mdiCameraDocument,
  mdiCartOutline,
  mdiCashMultiple,
  mdiCertificate,
  mdiCertificateOutline,
  mdiChartLine,
  mdiChevronRight,
  mdiClipboardText,
  mdiClipboardTextOutline,
  mdiClose,
  mdiCommentQuestionOutline,
  mdiFolderOutline,
  mdiHome,
  mdiHomeOutline,
  mdiInboxOutline,
  mdiInformationOutline,
  mdiLightbulbOnOutline,
  mdiLogout,
  mdiMagnify,
  mdiMinus,
  mdiOpenInNew,
  mdiPlus,
  mdiReceipt,
  mdiSchool,
  mdiSchoolOutline,
  mdiShieldAccountOutline,
  mdiShieldCheckOutline,
  mdiShoppingOutline,
  mdiTextBoxSearchOutline,
  mdiTimerOutline,
  mdiTuneVariant,
  mdiUpload,
  mdiViewDashboardOutline,
} from '@mdi/js';

/**
 * Mobil tətbiqdəki `MaterialCommunityIcons` ilə eyni ikonlar (@mdi/js yolları).
 * Ad mobil koddakı kimi yazılır ki, ekranlar birə-bir köçürülə bilsin.
 */
const paths = {
  'account-circle': mdiAccountCircle,
  'account-circle-outline': mdiAccountCircleOutline,
  'account-group-outline': mdiAccountGroupOutline,
  'arrow-left': mdiArrowLeft,
  bookshelf: mdiBookshelf,
  'briefcase-outline': mdiBriefcaseOutline,
  'camera-document': mdiCameraDocument,
  'cart-outline': mdiCartOutline,
  'cash-multiple': mdiCashMultiple,
  certificate: mdiCertificate,
  'certificate-outline': mdiCertificateOutline,
  'chart-line': mdiChartLine,
  'chevron-right': mdiChevronRight,
  'clipboard-text': mdiClipboardText,
  'clipboard-text-outline': mdiClipboardTextOutline,
  close: mdiClose,
  'comment-question-outline': mdiCommentQuestionOutline,
  'folder-outline': mdiFolderOutline,
  home: mdiHome,
  'home-outline': mdiHomeOutline,
  'inbox-outline': mdiInboxOutline,
  'information-outline': mdiInformationOutline,
  'lightbulb-on-outline': mdiLightbulbOnOutline,
  logout: mdiLogout,
  magnify: mdiMagnify,
  minus: mdiMinus,
  'open-in-new': mdiOpenInNew,
  plus: mdiPlus,
  receipt: mdiReceipt,
  school: mdiSchool,
  'school-outline': mdiSchoolOutline,
  'shield-account-outline': mdiShieldAccountOutline,
  'shield-check-outline': mdiShieldCheckOutline,
  'shopping-outline': mdiShoppingOutline,
  'text-box-search-outline': mdiTextBoxSearchOutline,
  'timer-outline': mdiTimerOutline,
  'tune-variant': mdiTuneVariant,
  upload: mdiUpload,
  'view-dashboard-outline': mdiViewDashboardOutline,
} as const;

export type IconName = keyof typeof paths;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

/** Rəng `currentColor`-dur — `text-*` sinfi ilə verilir. */
export function Icon({ name, size = 24, className = '' }: IconProps) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      fill="currentColor"
    >
      <path d={paths[name]} />
    </svg>
  );
}
