'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Reusable function to check if the current user is an admin
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const role = user.user_metadata?.role;
  if (role !== 'admin' && role !== 'super_admin') {
    throw new Error("Forbidden: Admin access required");
  }
  return { supabase, user, role };
}

// Ensure the caller is super_admin for destructive actions
async function requireSuperAdmin() {
  const { supabase, user, role } = await requireAdmin();
  if (role !== 'super_admin') {
    throw new Error("Forbidden: Super Admin access required");
  }
  return { supabase, user, role };
}

// Log admin action (writes to admin_audit_logs if the table exists)
async function logAdminAction(supabase: any, adminId: string, action: string, targetType: string, targetId: string, metadata: any = {}) {
  try {
    // Attempt to log, ignore if table doesn't exist yet (before migration runs)
    await supabase.from('admin_audit_logs').insert({
      admin_user_id: adminId,
      action,
      target_type: targetType,
      target_id: targetId,
      metadata
    });
  } catch (e) {
    console.error("Audit log failed (possibly missing table):", e);
  }
}

export async function getDashboardMetrics() {
  const { supabase } = await requireAdmin();

  // We have to use service role to access auth.users reliably if RLS prevents it.
  // Wait, from the server action, if we use the normal server client, it might not have access to auth.users.
  // Since we are building an admin panel, we can use the service role key for admin reads.
  // Actually, we can just instantiate a service role client here for admin tasks.
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const adminAuthClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    { data: users },
    { count: totalBriefings },
    { count: totalStories }
  ] = await Promise.all([
    adminAuthClient.auth.admin.listUsers(),
    supabase.from('briefings').select('*', { count: 'exact', head: true }),
    supabase.from('stories').select('*', { count: 'exact', head: true })
  ]);

  const allUsers = users?.users || [];
  const activeUsers = allUsers.filter(u => u.last_sign_in_at).length;
  
  // Calculate audio generated (briefings with audio_path)
  const { count: audioBriefings } = await supabase
    .from('briefings')
    .select('*', { count: 'exact', head: true })
    .not('audio_path', 'is', null);

  return {
    totalUsers: allUsers.length,
    activeUsers,
    totalBriefings: totalBriefings || 0,
    totalStories: totalStories || 0,
    audioGenerated: audioBriefings || 0,
    bannedUsers: allUsers.filter(u => u.banned_until).length,
  };
}

export async function getUsers(page = 1, pageSize = 20, search = '') {
  await requireAdmin();
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const adminAuthClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { users }, error } = await adminAuthClient.auth.admin.listUsers();
  if (error) throw error;

  let filtered = users;
  if (search) {
    const s = search.toLowerCase();
    filtered = users.filter(u => 
      (u.email?.toLowerCase().includes(s)) || 
      (u.user_metadata?.name?.toLowerCase().includes(s))
    );
  }

  // Basic pagination
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return {
    users: paginated,
    total: filtered.length,
    page,
    pageSize
  };
}

export async function getUserDetails(id: string) {
  const { supabase } = await requireAdmin();
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const adminAuthClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user }, error } = await adminAuthClient.auth.admin.getUserById(id);
  if (error || !user) throw new Error("User not found");

  const [
    { count: briefingsCount },
    { count: savedCount }
  ] = await Promise.all([
    supabase.from('briefings').select('*', { count: 'exact', head: true }).eq('user_id', id),
    supabase.from('saved_stories').select('*', { count: 'exact', head: true }).eq('user_id', id)
  ]);

  return {
    user,
    usage: {
      briefingsCount: briefingsCount || 0,
      savedCount: savedCount || 0
    }
  };
}

export async function banUser(id: string, reason: string) {
  const { user: admin, role } = await requireAdmin();
  if (role !== 'super_admin') throw new Error("Super Admin required to ban");

  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const adminAuthClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Ban for 100 years
  const { error } = await adminAuthClient.auth.admin.updateUserById(id, {
    ban_duration: '876000h' 
  });
  
  if (error) throw error;

  // Attempt to log
  await logAdminAction(adminAuthClient, admin.id, 'BAN_USER', 'user', id, { reason });
  revalidatePath('/admin/users');
}

export async function unbanUser(id: string) {
  const { user: admin, role } = await requireAdmin();
  if (role !== 'super_admin') throw new Error("Super Admin required to unban");

  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const adminAuthClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await adminAuthClient.auth.admin.updateUserById(id, {
    ban_duration: 'none' 
  });
  
  if (error) throw error;

  await logAdminAction(adminAuthClient, admin.id, 'UNBAN_USER', 'user', id);
  revalidatePath('/admin/users');
}

export async function getAuditLogs(page = 1, pageSize = 50) {
  const { supabase } = await requireAdmin();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabase
    .from('admin_audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) {
    console.error(error);
    return { logs: [], total: 0 };
  }

  return { logs: data || [], total: count || 0 };
}

export async function getSystemErrors(page = 1, pageSize = 50) {
  const { supabase } = await requireAdmin();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabase
    .from('system_errors')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) {
    return { errors: [], total: 0 };
  }

  return { errors: data || [], total: count || 0 };
}
