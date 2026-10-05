import { getAuditLogs } from '@/lib/actions/admin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminLogsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { logs, total } = await getAuditLogs(page, 50);
  const totalPages = Math.ceil(total / 50);

  return (
    <div className="space-y-8 animate-fade-in opacity-0 fill-mode-forwards">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground mt-2">Immutable record of administrative actions.</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Timestamp</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Admin</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Action</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Target</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-background/50 trans-fast">
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{log.admin_user_id}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-interactive/10 text-interactive">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {log.target_type}: {log.target_id}
                  </td>
                  <td className="px-6 py-4">
                    <pre className="text-[10px] bg-background p-2 rounded border border-surface-border overflow-x-auto max-w-xs">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No audit logs found. Note: Ensure the admin_schema.sql migration is applied.
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
                href={`/admin/logs?page=${Math.max(1, page - 1)}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg border ${page === 1 ? 'opacity-50 pointer-events-none border-border' : 'border-surface-border hover:bg-surface-border hover:text-foreground text-muted-foreground trans-fast'}`}
              >
                Previous
              </Link>
              <Link 
                href={`/admin/logs?page=${Math.min(totalPages, page + 1)}`}
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
