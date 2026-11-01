import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { adminApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { MenuList, type MenuItem } from '../ui/MenuList';
import { BecomeAuthorPrompt } from './teacher/BecomeAuthorPrompt';

const learnerItems: MenuItem[] = [
  { key: 'trainings', label: 'Təlimlərim', icon: 'school-outline', to: '/panel/telimlerim' },
  { key: 'purchased', label: 'Aldıqlarım', icon: 'shopping-outline', to: '/panel/aldiqlarim' },
  { key: 'certs', label: 'Sertifikatlarım', icon: 'certificate', to: '/panel/sertifikatlarim' },
];

const authorItems: MenuItem[] = [
  {
    key: 'ksq',
    label: 'KSQ yoxlama',
    icon: 'camera-document',
    hint: 'Cavab kartlarını şəkil ilə yoxla',
    to: '/panel/ksq-yoxlama',
  },
  {
    key: 'resources',
    label: 'Resurslarım',
    icon: 'folder-outline',
    hint: 'Statuslar, endirmə və qazanc',
    to: '/panel/resurslarim',
  },
  {
    key: 'upload',
    label: 'Yüklə',
    icon: 'upload',
    hint: 'Fayl (PDF, DOCX, PPTX) və ya video/link',
    to: '/panel/yukle',
  },
  {
    key: 'quiz',
    label: 'İmtahanlar',
    icon: 'comment-question-outline',
    hint: 'Resurslarınıza imtahan əlavə edin',
    to: '/panel/imtahanlar',
  },
  {
    key: 'exams',
    label: 'Sınaqlarım',
    icon: 'timer-outline',
    hint: 'Vaxt limitli sınaq qurucusu',
    to: '/panel/sinaqlarim',
  },
  { key: 'earnings', label: 'Qazanc', icon: 'cash-multiple', to: '/panel/qazanc' },
];

/** Mobil tətbiqin «Müəllim paneli» ekranı. */
function TeacherPanelMenu() {
  const { canPublishResources } = useAuth();

  // Şagird hesabı material satmır — əvvəlcə «Müəllif ol» təklifi.
  if (!canPublishResources) {
    return (
      <div className="space-y-5">
        <BecomeAuthorPrompt />
        <MenuList title="Öyrənmə" items={learnerItems} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-[13px] text-brand-muted">Müəllim · müəllif</p>
      <MenuList title="Müəllif" items={authorItems} />
      <MenuList title="Öyrənmə" items={learnerItems} />
    </div>
  );
}

/** Mobil tətbiqin «Admin paneli» ekranı. */
function AdminPanelMenu() {
  const [pending, setPending] = useState<{ resources: number; exams: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .dashboard()
      .then(
        (data) =>
          !cancelled &&
          setPending({ resources: data.content.pendingResources, exams: data.exams.pendingExams }),
      )
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5">
      <MenuList
        title="İdarəetmə"
        items={[
          { key: 'dash', label: 'İcmal', icon: 'view-dashboard-outline', to: '/admin/icmal' },
          {
            key: 'moderation',
            label: 'Moderasiya',
            icon: 'shield-check-outline',
            hint: pending ? `${pending.resources} resurs gözləyir` : undefined,
            to: '/admin/moderasiya',
          },
          {
            key: 'exams',
            label: 'Sınaq moderasiyası',
            icon: 'clipboard-text-outline',
            hint: pending ? `${pending.exams} sınaq gözləyir` : undefined,
            to: '/admin/sinaqlar',
          },
          { key: 'trainings', label: 'Təlimlər', icon: 'school-outline', to: '/admin/telimler' },
          {
            key: 'users',
            label: 'İstifadəçilər',
            icon: 'account-group-outline',
            to: '/admin/istifadeciler',
          },
          { key: 'sales', label: 'Satış', icon: 'chart-line', to: '/admin/satis' },
          {
            key: 'certs',
            label: 'Sertifikatlar',
            icon: 'certificate-outline',
            to: '/admin/sertifikatlar',
          },
          { key: 'logs', label: 'Loglar', icon: 'text-box-search-outline', to: '/admin/loglar' },
        ]}
      />
      <MenuList
        items={[
          {
            key: 'teacher',
            label: 'Müəllim paneli',
            icon: 'briefcase-outline',
            to: '/panel',
          },
        ]}
      />
    </div>
  );
}

/**
 * Panelin kök ünvanı: masaüstündə ilk taba yönləndirir (yan menyu var),
 * mobildə isə tətbiqdəki kimi bölmələr siyahısını göstərir.
 */
export function PanelIndex({ kind }: { kind: 'teacher' | 'admin' }) {
  const isDesktop = useIsDesktop();
  if (isDesktop) return <Navigate to={kind === 'admin' ? 'icmal' : 'telimlerim'} replace />;
  return kind === 'admin' ? <AdminPanelMenu /> : <TeacherPanelMenu />;
}
