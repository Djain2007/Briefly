# Briefly Admin Architecture

## Overview
The Briefly Admin Panel provides secure, server-side verified access to system monitoring, user management, and audit logs.

## Security Model
1. **Authentication:** The admin panel is protected by Supabase Auth and Next.js Middleware. All routes under `/admin` require the user to be logged in.
2. **Authorization:** We utilize the `role` attribute inside the user's `raw_user_meta_data`. Valid roles for admin access are `admin` and `super_admin`.
3. **Role Checks:**
   - Frontend routes (`/admin/*`) are protected by `src/lib/supabase/middleware.ts`.
   - Server Actions (`src/lib/actions/admin.ts`) independently verify the role using `supabase.auth.getUser()`. Destructive actions (like banning users) require the `super_admin` role.
4. **Row Level Security (RLS):** New tables (`admin_audit_logs`, `system_errors`, `admin_settings`) have strict RLS policies allowing only admins to select/update data based on `auth.jwt()->'user_metadata'->>'role'`.

## Database Tables
The admin functionality relies on the following new tables (defined in `supabase/admin_schema.sql`):
- `admin_audit_logs`: Immutable record of administrative actions.
- `system_errors`: Tracking of backend/API failures.
- `admin_settings`: Dynamic application configuration.

## Setup Instructions

### 1. Apply Database Migrations
Before the admin panel can fully function (specifically for logs and errors), you must execute the SQL migration script located at:
`supabase/admin_schema.sql`

Copy the contents of this file and execute it in your Supabase project's SQL Editor.

### 2. Create the First Admin
To create the first `super_admin`, you can use the provided script. You need Node.js 20+ and your environment variables properly configured in `.env.local`.

Run the following command from the project root:
```bash
node --env-file=.env.local scripts/make-admin.js <your_email@example.com>
```

This will look up your user account and update your `raw_user_meta_data` to grant you the `super_admin` role.

### 3. Usage
Once granted the role, navigate to `https://your-domain.com/admin` (or `http://localhost:3000/admin` locally).
You will now see the admin dashboard.

## API / Server Actions
All admin server actions are housed in `src/lib/actions/admin.ts`:
- `getDashboardMetrics()`
- `getUsers()`
- `getUserDetails()`
- `banUser()` / `unbanUser()`
- `getAuditLogs()`
- `getSystemErrors()`

These functions use the `SUPABASE_SERVICE_ROLE_KEY` internally to bypass RLS for administrative data reads, while strict authorization checks at the top of the function ensure only authorized users can execute them.
