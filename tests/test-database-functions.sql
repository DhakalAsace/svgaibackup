-- Test SQL script for database functions
-- Run this in Supabase SQL Editor to verify the implementation

-- Test 1: Test IP hashing function
SELECT '🧪 Test 1: IP Hashing' as test;
SELECT 
  hash_identifier('192.168.1.1') as hashed_ip,
  length(hash_identifier('192.168.1.1')) as hash_length,
  hash_identifier('192.168.1.1') = hash_identifier('192.168.1.1') as is_consistent,
  hash_identifier('192.168.1.1') != '192.168.1.1' as is_different_from_original;

-- Test 2: Test check_credits_v3 for anonymous SVG generation
SELECT '🧪 Test 2: Anonymous SVG Generation' as test;
SELECT * FROM check_credits_v3(
  null::uuid,           -- p_user_id (null for anonymous)
  '192.168.100.1',      -- p_identifier
  'ip_address',         -- p_identifier_type
  'svg'                 -- p_generation_type
);

-- Test 3: Test check_credits_v3 for anonymous icon generation
SELECT '🧪 Test 3: Anonymous Icon Generation' as test;
SELECT * FROM check_credits_v3(
  null::uuid,           -- p_user_id (null for anonymous)
  '192.168.100.2',      -- p_identifier
  'ip_address',         -- p_identifier_type
  'icon'                -- p_generation_type
);

-- Test 4: Check what's stored in daily_generation_limits
SELECT '🧪 Test 4: Check stored data (should be hashed)' as test;
SELECT 
  left(identifier, 20) || '...' as identifier_preview,
  identifier_type,
  generation_date,
  generation_type,
  count
FROM daily_generation_limits
WHERE generation_date = CURRENT_DATE
AND identifier_type = 'ip_address'
ORDER BY created_at DESC
LIMIT 10;

-- Test 5: Verify limits are enforced
SELECT '🧪 Test 5: Test limit enforcement' as test;

-- First, insert test data to simulate reaching limits
DO $$
DECLARE
  v_hashed_ip TEXT;
BEGIN
  -- Get hashed IP
  v_hashed_ip := hash_identifier('192.168.200.1');
  
  -- Insert record showing 1 SVG already generated
  INSERT INTO daily_generation_limits 
    (identifier, identifier_type, generation_date, generation_type, count)
  VALUES 
    (v_hashed_ip, 'ip_address', CURRENT_DATE, 'svg', 1)
  ON CONFLICT (identifier, identifier_type, generation_date, generation_type)
  DO UPDATE SET count = 1;
  
  -- Insert record showing 2 icons already generated
  INSERT INTO daily_generation_limits 
    (identifier, identifier_type, generation_date, generation_type, count)
  VALUES 
    (v_hashed_ip, 'ip_address', CURRENT_DATE, 'icon', 2)
  ON CONFLICT (identifier, identifier_type, generation_date, generation_type)
  DO UPDATE SET count = 2;
END $$;

-- Now test that limits are enforced
SELECT 'Should block SVG (already at limit)' as test_case, * 
FROM check_credits_v3(null::uuid, '192.168.200.1', 'ip_address', 'svg');

SELECT 'Should block icon (already at limit)' as test_case, * 
FROM check_credits_v3(null::uuid, '192.168.200.1', 'ip_address', 'icon');

-- Test 6: Test cleanup function
SELECT '🧪 Test 6: Test cleanup of old records' as test;

-- Insert old test data
INSERT INTO daily_generation_limits 
  (identifier, identifier_type, generation_date, generation_type, count)
VALUES 
  ('old-test-hash-1', 'ip_address', CURRENT_DATE - INTERVAL '10 days', 'svg', 1),
  ('old-test-hash-2', 'ip_address', CURRENT_DATE - INTERVAL '8 days', 'icon', 2);

-- Count before cleanup
SELECT count(*) as records_before_cleanup 
FROM daily_generation_limits 
WHERE generation_date < CURRENT_DATE - INTERVAL '7 days'
AND identifier_type = 'ip_address';

-- Run cleanup
SELECT cleanup_old_generation_limits();

-- Count after cleanup
SELECT count(*) as records_after_cleanup 
FROM daily_generation_limits 
WHERE generation_date < CURRENT_DATE - INTERVAL '7 days'
AND identifier_type = 'ip_address';

-- Test 7: Verify separate tracking
SELECT '🧪 Test 7: Verify SVG and Icon limits are separate' as test;

-- Clean test IP first
DELETE FROM daily_generation_limits 
WHERE identifier = hash_identifier('192.168.250.1');

-- Generate 1 SVG (should succeed)
SELECT 'First SVG' as action, * 
FROM check_credits_v3(null::uuid, '192.168.250.1', 'ip_address', 'svg');

-- Generate 1st icon (should succeed even after SVG)
SELECT 'First Icon' as action, * 
FROM check_credits_v3(null::uuid, '192.168.250.1', 'ip_address', 'icon');

-- Generate 2nd icon (should succeed)
SELECT 'Second Icon' as action, * 
FROM check_credits_v3(null::uuid, '192.168.250.1', 'ip_address', 'icon');

-- Try 2nd SVG (should fail - limit is 1)
SELECT 'Second SVG (should fail)' as action, * 
FROM check_credits_v3(null::uuid, '192.168.250.1', 'ip_address', 'svg');

-- Try 3rd icon (should fail - limit is 2)
SELECT 'Third Icon (should fail)' as action, * 
FROM check_credits_v3(null::uuid, '192.168.250.1', 'ip_address', 'icon');

-- Cleanup test data
DELETE FROM daily_generation_limits 
WHERE identifier LIKE 'old-test-hash-%'
OR identifier = hash_identifier('192.168.250.1')
OR identifier = hash_identifier('192.168.200.1');