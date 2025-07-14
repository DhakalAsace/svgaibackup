// These tests require Jest to be installed
// npm install --save-dev jest @jest/globals @types/jest
// import { describe, test, expect } from '@jest/globals';
import { testSupabase, createTestUser, cleanupTestUser } from './setup';

describe('Credit System', () => {
  let testUserId: string;

  beforeEach(async () => {
    const user = await createTestUser();
    testUserId = user?.id || '';
  });

  afterEach(async () => {
    if (testUserId) {
      await cleanupTestUser(testUserId);
    }
  });

  test('Prevents race condition exploitation', async () => {
    // Give user 2 credits (enough for 1 SVG generation)
    await testSupabase
      .from('profiles')
      .update({ lifetime_credits_granted: 2, lifetime_credits_used: 0 })
      .eq('id', testUserId);

    // Attempt 10 concurrent SVG generations
    const promises = Array(10).fill(null).map(() => 
      testSupabase.rpc('check_credits_v3', {
        p_user_id: testUserId,
        p_identifier: testUserId,
        p_identifier_type: 'user_id',
        p_generation_type: 'svg'
      })
    );
    
    const results = await Promise.all(promises);
    const successful = results.filter(r => r.data?.[0]?.success).length;
    
    // Only 1 should succeed with row locking
    expect(successful).toBe(1);
  });

  test('Correctly deducts credits for different generation types', async () => {
    // Set up user with 3 credits
    await testSupabase
      .from('profiles')
      .update({ lifetime_credits_granted: 3, lifetime_credits_used: 0 })
      .eq('id', testUserId);

    // Generate an icon (1 credit)
    const iconResult = await testSupabase.rpc('check_credits_v3', {
      p_user_id: testUserId,
      p_identifier: testUserId,
      p_identifier_type: 'user_id',
      p_generation_type: 'icon'
    });

    expect(iconResult.data?.[0]?.success).toBe(true);
    expect(iconResult.data?.[0]?.remaining_credits).toBe(2);

    // Generate an SVG (2 credits)
    const svgResult = await testSupabase.rpc('check_credits_v3', {
      p_user_id: testUserId,
      p_identifier: testUserId,
      p_identifier_type: 'user_id',
      p_generation_type: 'svg'
    });

    expect(svgResult.data?.[0]?.success).toBe(true);
    expect(svgResult.data?.[0]?.remaining_credits).toBe(0);
  });

  test('Resets monthly credits on billing cycle', async () => {
    // Set up user as subscribed with used credits from last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    await testSupabase
      .from('profiles')
      .update({ 
        subscription_status: 'active',
        subscription_tier: 'starter',
        monthly_credits: 100,
        monthly_credits_used: 50,
        credits_reset_at: lastMonth.toISOString()
      })
      .eq('id', testUserId);

    // Check credits (should trigger reset)
    const result = await testSupabase.rpc('check_credits_v3', {
      p_user_id: testUserId,
      p_identifier: testUserId,
      p_identifier_type: 'user_id',
      p_generation_type: 'svg'
    });

    expect(result.data?.[0]?.success).toBe(true);
    expect(result.data?.[0]?.remaining_credits).toBe(98); // 100 - 2 for SVG
  });
});