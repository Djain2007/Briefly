const { createClient } = require('@supabase/supabase-js');

// Usage: node --env-file=.env.local scripts/make-admin.js <user_email>

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: node --env-file=.env.local scripts/make-admin.js <user_email>");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function makeAdmin() {
  console.log(`Looking up user with email: ${email}`);
  
  // Since we don't have a direct email lookup that bypasses pagination easily in v2 without admin.listUsers,
  // we can use listUsers or query the profiles table if we want the ID, but auth.admin is required.
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error("Failed to list users:", listError.message);
    process.exit(1);
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    console.error(`User with email ${email} not found.`);
    process.exit(1);
  }

  console.log(`Found user ID: ${user.id}`);
  console.log(`Updating role to 'super_admin'...`);

  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, role: 'super_admin' }
  });

  if (error) {
    console.error("Failed to update user:", error.message);
    process.exit(1);
  }

  console.log(`Successfully granted super_admin role to ${email}.`);
}

makeAdmin();
