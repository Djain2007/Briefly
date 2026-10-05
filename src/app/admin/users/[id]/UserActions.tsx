'use client';

import { useState } from 'react';
import { banUser, unbanUser } from '@/lib/actions/admin';
import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserActions({ userId, isBanned, currentRole }: { userId: string, isBanned: boolean, currentRole: string }) {
  const [loading, setLoading] = useState(false);
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [banReason, setBanReason] = useState('');
  const router = useRouter();

  if (currentRole !== 'super_admin') {
    return (
      <div className="p-4 rounded-xl border border-border bg-surface text-sm text-muted-foreground flex items-center gap-3">
        <ShieldAlert size={16} />
        Only super administrators can perform destructive actions on users.
      </div>
    );
  }

  const handleBan = async () => {
    if (!banReason.trim()) return alert("Please provide a reason for the ban.");
    setLoading(true);
    try {
      await banUser(userId, banReason);
      setShowBanConfirm(false);
      router.refresh();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async () => {
    if (!confirm("Are you sure you want to unban this user?")) return;
    setLoading(true);
    try {
      await unbanUser(userId);
      router.refresh();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {isBanned ? (
        <div className="p-6 rounded-2xl border border-error/20 bg-error/5 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-error">
            <ShieldAlert size={20} />
            <h3 className="font-bold">Account Banned</h3>
          </div>
          <p className="text-sm text-error/80">This account is currently banned and cannot access Briefly.</p>
          <button 
            onClick={handleUnban}
            disabled={loading}
            className="self-start px-4 py-2 bg-error text-white text-sm font-bold rounded-lg hover:bg-error/90 trans-fast disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Unban User'}
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-border bg-surface flex flex-col gap-4">
          <div className="flex items-center gap-3 text-foreground">
            <AlertTriangle size={20} className="text-warning" />
            <h3 className="font-bold">Danger Zone</h3>
          </div>
          
          {showBanConfirm ? (
            <div className="space-y-4 animate-fade-in opacity-0 fill-mode-forwards">
              <p className="text-sm font-medium text-error">You are about to ban this user. They will immediately lose access to the application.</p>
              <input 
                type="text" 
                value={banReason}
                onChange={e => setBanReason(e.target.value)}
                placeholder="Reason for ban (required)"
                className="w-full px-4 py-2 text-sm bg-background border border-error/50 rounded-lg focus:ring-2 focus:ring-error focus:outline-none"
              />
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleBan}
                  disabled={loading || !banReason.trim()}
                  className="px-4 py-2 bg-error text-white text-sm font-bold rounded-lg hover:bg-error/90 trans-fast disabled:opacity-50"
                >
                  {loading ? 'Banning...' : 'Confirm Ban'}
                </button>
                <button 
                  onClick={() => { setShowBanConfirm(false); setBanReason(''); }}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground trans-fast"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Ban this user from accessing Briefly.</div>
              <button 
                onClick={() => setShowBanConfirm(true)}
                className="px-4 py-2 bg-background border border-error/20 text-error hover:bg-error hover:text-white text-sm font-bold rounded-lg trans-fast"
              >
                Ban User
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
