import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Avatar } from '../components/ui/Avatar';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { MenuList, type MenuItem } from '../components/ui/MenuList';
import type { UserRole } from '../types';

const roleLabels: Record<UserRole, { label: string; tone: 'neutral' | 'info' | 'paid' }> = {
  Student: { label: 'Şagird', tone: 'neutral' },
  Teacher: { label: 'Müəllim', tone: 'info' },
  Admin: { label: 'Admin', tone: 'paid' },
};

const general: MenuItem[] = [
  {
    key: 'verify',
    label: 'Sertifikat yoxlama',
    icon: 'certificate-outline',
    to: '/sertifikat-yoxla',
  },
  { key: 'prompts', label: 'Prompt Kitabxanası', icon: 'lightbulb-on-outline', to: '/promptlar' },
  { key: 'about', label: 'Haqqımızda', icon: 'information-outline', to: '/haqqimizda' },
];

/** Mobil tətbiqin «Profil» tabı — hesab, panellər və ümumi keçidlər. */
export default function ProfilePage() {
  const { user, isAdmin, isTeacher, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (!window.confirm('Hesabdan çıxmaq istəyirsiniz?')) return;
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    toast('Çıxış edildi.');
    navigate('/');
  }

  return (
    <div className="page">
      <div className="mx-auto max-w-xl space-y-5">
        {user ? (
          <>
            <div className="card flex items-start gap-4">
              <Avatar name={user.fullName} size="lg" />
              <div className="min-w-0 flex-1 space-y-1">
                <h1 className="line-clamp-2 font-heading text-lg font-semibold text-brand-navy">
                  {user.fullName}
                </h1>
                <p className="truncate text-[13px] text-brand-muted">{user.email}</p>
                {user.subject && <p className="text-[13px] text-brand-muted">{user.subject}</p>}
                <div className="flex flex-wrap gap-2 pt-1">
                  {user.roles.map((role) => (
                    <StatusBadge key={role} tone={roleLabels[role]?.tone ?? 'neutral'}>
                      {roleLabels[role]?.label ?? role}
                    </StatusBadge>
                  ))}
                </div>
              </div>
            </div>

            <MenuList
              title="Hesabım"
              items={[
                {
                  key: 'myTrainings',
                  label: 'Təlimlərim',
                  icon: 'school-outline',
                  to: '/panel/telimlerim',
                },
                {
                  key: 'purchased',
                  label: 'Aldıqlarım',
                  icon: 'shopping-outline',
                  to: '/panel/aldiqlarim',
                },
                { key: 'orders', label: 'Sifarişlərim', icon: 'receipt', to: '/sifarisler' },
                { key: 'cart', label: 'Səbət', icon: 'cart-outline', to: '/sebet' },
                {
                  key: 'certificates',
                  label: 'Sertifikatlarım',
                  icon: 'certificate',
                  to: '/panel/sertifikatlarim',
                },
              ]}
            />

            <MenuList
              title="Panellər"
              items={[
                {
                  key: 'teacher',
                  label: 'Müəllim paneli',
                  icon: 'briefcase-outline',
                  hint: isTeacher
                    ? 'Resurslar, sınaqlar, KSQ yoxlama'
                    : 'Müəllif olub material yükləyin',
                  to: '/panel',
                },
                ...(isAdmin
                  ? [
                      {
                        key: 'admin',
                        label: 'Admin paneli',
                        icon: 'shield-account-outline' as const,
                        hint: 'İcmal, moderasiya, istifadəçilər',
                        to: '/admin',
                      },
                    ]
                  : []),
              ]}
            />

            <MenuList title="Ümumi" items={general} />

            <Button variant="danger" fullWidth disabled={loggingOut} onClick={handleLogout}>
              <Icon name="logout" size={18} />
              Çıxış
            </Button>
          </>
        ) : (
          <>
            <div className="card space-y-2">
              <h1 className="font-heading text-lg font-semibold text-brand-navy">
                Hesabınıza daxil olun
              </h1>
              <p className="text-[13px] text-brand-muted">
                Təlimlərinizə, resurslarınıza və sertifikatlarınıza giriş.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/giris">
                  <Button>Daxil ol</Button>
                </Link>
                <Link to="/giris?mode=register">
                  <Button variant="secondary">Qeydiyyat</Button>
                </Link>
              </div>
            </div>
            <MenuList title="Ümumi" items={general} />
          </>
        )}
      </div>
    </div>
  );
}
