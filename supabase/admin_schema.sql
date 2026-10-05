-- Admin Panel Migration for Briefly
-- Run this script in your Supabase SQL Editor.

-- Note: The admin role is stored in auth.users.raw_user_meta_data->>'role'.
-- We also manage ban status via auth.users.banned_until (native Supabase feature),
-- but we might want to store reason and banner in a separate table if needed.
-- For simplicity, we just use native Supabase ban, and an admin_audit_logs table.

-- 1. Create Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs
  FOR SELECT USING (
    (auth.jwt()->'user_metadata'->>'role' = 'admin') OR 
    (auth.jwt()->'user_metadata'->>'role' = 'super_admin')
  );

-- Only admins can insert audit logs (via backend service role or directly if we allow)
-- But generally audit logs should be inserted securely by the backend using service_role.
-- However, if we insert via backend with service_role, RLS is bypassed anyway.

-- 2. Create Admin Settings Table
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Admins can view settings
CREATE POLICY "Admins can view settings" ON public.admin_settings
  FOR SELECT USING (
    (auth.jwt()->'user_metadata'->>'role' = 'admin') OR 
    (auth.jwt()->'user_metadata'->>'role' = 'super_admin')
  );

-- Only admins can update settings
CREATE POLICY "Admins can update settings" ON public.admin_settings
  FOR ALL USING (
    (auth.jwt()->'user_metadata'->>'role' = 'admin') OR 
    (auth.jwt()->'user_metadata'->>'role' = 'super_admin')
  );

-- 3. System Errors Table
CREATE TABLE IF NOT EXISTS public.system_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  service text NOT NULL,
  error_type text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'unresolved',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.system_errors ENABLE ROW LEVEL SECURITY;

-- Only admins can view system errors
CREATE POLICY "Admins can view system errors" ON public.system_errors
  FOR SELECT USING (
    (auth.jwt()->'user_metadata'->>'role' = 'admin') OR 
    (auth.jwt()->'user_metadata'->>'role' = 'super_admin')
  );

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT (auth.jwt()->'user_metadata'->>'role' = 'admin') OR (auth.jwt()->'user_metadata'->>'role' = 'super_admin');
$$;
