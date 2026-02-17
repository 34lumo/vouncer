-- ============================================
-- VOUNCER - ROLE-BASED AUTHENTICATION SETUP
-- ============================================

-- 1. VERIFY PROFILES TABLE STRUCTURE
-- The 'role' column is already TEXT, so it accepts any value including 'bouncer'
-- No schema changes needed

-- 2. SET UP TEST USERS WITH DIFFERENT ROLES
-- Replace these UUIDs with actual user IDs from your auth.users table

-- Example: Set current user as admin
-- UPDATE profiles 
-- SET role = 'admin', full_name = 'Admin User'
-- WHERE id = 'YOUR_USER_ID_HERE';

-- Example: Create/update a bouncer user
-- First, you need to create the user in Supabase Auth Dashboard
-- Then run:
-- UPDATE profiles 
-- SET role = 'bouncer', full_name = 'Bouncer Test'
-- WHERE id = 'BOUNCER_USER_ID_HERE';

-- 3. QUERY TO CHECK CURRENT ROLES
SELECT 
  p.id,
  p.full_name,
  p.role,
  u.email
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.role, p.full_name;

-- 4. HELPER FUNCTION: Get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE SQL STABLE;

-- 5. EXAMPLE: Set specific users to specific roles
-- Uncomment and replace with actual IDs:

-- Set admin role
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@vouncer.com';

-- Set bouncer role  
-- UPDATE profiles SET role = 'bouncer' WHERE email = 'bouncer@vouncer.com';

-- Set owner role
-- UPDATE profiles SET role = 'owner' WHERE email = 'owner@vouncer.com';

-- 6. VERIFY ROLES ARE SET
-- Run this to see all users and their roles:
-- SELECT 
--   p.id,
--   u.email,
--   p.full_name,
--   p.role,
--   p.updated_at
-- FROM profiles p
-- JOIN auth.users u ON p.id = u.id
-- WHERE p.role IS NOT NULL
-- ORDER BY p.role;
