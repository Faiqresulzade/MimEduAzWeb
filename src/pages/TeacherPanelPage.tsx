import { WorkspaceLayout } from '../layouts/WorkspaceLayout';
import type { WorkspaceTab } from '../components/workspace/TabBar';

const tabs: WorkspaceTab[] = [
  { to: '/panel/telimlerim', label: 'Təlimlərim' },
  { to: '/panel/resurslarim', label: 'Resurslarım' },
  { to: '/panel/yukle', label: 'Yüklə' },
  { to: '/panel/imtahanlar', label: 'İmtahanlar' },
  { to: '/panel/sertifikatlarim', label: 'Sertifikatlarım' },
  { to: '/panel/qazanc', label: 'Qazanc' },
];

export default function TeacherPanelPage() {
  return (
    <WorkspaceLayout title="Müəllim paneli" roleLabel="Müəllim · müəllif" tabs={tabs} />
  );
}
