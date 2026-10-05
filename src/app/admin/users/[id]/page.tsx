import { getUserDetails } from '@/lib/actions/admin';
import Link from 'next/link';
import { ArrowLeft, User as UserIcon, Calendar, Activity, PlayCircle, Library, Shield } from 'lucide-react';
import { UserActions } from './UserActions';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, usage } = await getUserDetails(id);

  const supabase = await createClient();
  const { data: { user: adminUser } } = await supabase.auth.getUser();
  const adminRole = adminUser?.user_metadata?.role || 'admin';

  const role = user.user_metadata?.role || 'user';
  const name = user.user_metadata?.name || 'Unknown';
  const isBanned = !!user.banned_until;

  return (
    <div className="space-y-8 animate-fade-in opacity-0 fill-mode-forwards">
      <div>
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-4 trans-fast">
          <ArrowLeft size={16} /> Back to Users
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-interactive/10 flex items-center justify-center text-interactive font-bold text-2xl uppercase shrink-0">
              {user.email?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                {user.email} 
                <span className="text-border px-2">•</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${role === 'super_admin' ? 'bg-purple-500/10 text-purple-500' : role === 'admin' ? 'bg-blue-500/10 text-blue-500' : 'bg-surface-border text-muted-foreground'}`}>
                  {role.replace('_', ' ')}
                </span>
                {isBanned && (
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-error/10 text-error">
                    Banned
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="p-6 rounded-2xl bg-surface border border-border shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <UserIcon size={20} className="text-muted-foreground" /> Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">User ID</div>
                <div className="font-mono text-sm">{user.id}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Joined</div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Calendar size={14} className="text-muted-foreground" />
                  {new Date(user.created_at).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Last Sign In</div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Activity size={14} className="text-muted-foreground" />
                  {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Email Confirmed</div>
                <div className="text-sm font-medium">
                  {user.email_confirmed_at ? new Date(user.email_confirmed_at).toLocaleDateString() : 'Pending'}
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col items-center justify-center text-center">
              <PlayCircle size={32} className="text-interactive mb-3" />
              <div className="text-3xl font-bold">{usage.briefingsCount}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Briefings</div>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col items-center justify-center text-center">
              <Library size={32} className="text-interactive mb-3" />
              <div className="text-3xl font-bold">{usage.savedCount}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Saved Stories</div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="p-6 rounded-2xl bg-surface border border-border shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Shield size={20} className="text-muted-foreground" /> Administration
            </h2>
            <UserActions userId={user.id} isBanned={isBanned} currentRole={adminRole} />
          </section>
        </div>
      </div>
    </div>
  );
}
