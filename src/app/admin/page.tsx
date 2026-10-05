import { getDashboardMetrics } from '@/lib/actions/admin';
import { Users, Activity, PlayCircle, Library } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const metrics = await getDashboardMetrics();

  const STATS = [
    { label: 'Total Users', value: metrics.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Users', value: metrics.activeUsers, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total Briefings', value: metrics.totalBriefings, icon: PlayCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Stories', value: metrics.totalStories, icon: Library, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in opacity-0 fill-mode-forwards">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of Briefly system metrics and usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
              <div className="text-4xl font-bold text-foreground">
                {stat.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm">
          <h2 className="text-lg font-bold mb-6">Security Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-surface-border">
              <span className="font-medium text-muted-foreground">Banned Accounts</span>
              <span className="font-bold text-error">{metrics.bannedUsers}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-surface-border">
              <span className="font-medium text-muted-foreground">Audio Generated</span>
              <span className="font-bold text-interactive">{metrics.audioGenerated}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm">
          <h2 className="text-lg font-bold mb-6">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-surface-border">
              <span className="font-medium text-muted-foreground">Database</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full uppercase tracking-wider">Healthy</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-surface-border">
              <span className="font-medium text-muted-foreground">Storage (R2)</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full uppercase tracking-wider">Healthy</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-surface-border">
              <span className="font-medium text-muted-foreground">AI Services</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full uppercase tracking-wider">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
