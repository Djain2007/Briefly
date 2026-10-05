import { getUsers } from '@/lib/actions/admin';
import Link from 'next/link';
import { Search, MoreVertical, ShieldAlert } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search as string || '';

  const { users, total, pageSize } = await getUsers(page, 20, search);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-8 animate-fade-in opacity-0 fill-mode-forwards">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-2">Manage all Briefly user accounts.</p>
        </div>
        
        <form className="relative w-full sm:w-auto" action="/admin/users">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            name="search" 
            defaultValue={search}
            placeholder="Search by email or name..." 
            className="w-full sm:w-80 pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-interactive trans-fast text-sm"
          />
        </form>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">User</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Role</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Last Active</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Joined</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(u => {
                const isBanned = !!u.banned_until;
                const role = u.user_metadata?.role || 'user';
                return (
                  <tr key={u.id} className="hover:bg-background/50 trans-fast">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-interactive/10 flex items-center justify-center text-interactive font-bold uppercase shrink-0">
                          {u.email?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{u.user_metadata?.name || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isBanned ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-error/10 text-error">
                          <ShieldAlert size={12} /> Banned
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${role === 'super_admin' ? 'bg-purple-500/10 text-purple-500' : role === 'admin' ? 'bg-blue-500/10 text-blue-500' : 'bg-surface-border text-muted-foreground'}`}>
                        {role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/users/${u.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-surface-border hover:text-foreground trans-fast"
                      >
                        <MoreVertical size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No users found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Link 
                href={`/admin/users?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg border ${page === 1 ? 'opacity-50 pointer-events-none border-border' : 'border-surface-border hover:bg-surface-border hover:text-foreground text-muted-foreground trans-fast'}`}
              >
                Previous
              </Link>
              <Link 
                href={`/admin/users?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ''}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg border ${page === totalPages ? 'opacity-50 pointer-events-none border-border' : 'border-surface-border hover:bg-surface-border hover:text-foreground text-muted-foreground trans-fast'}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
