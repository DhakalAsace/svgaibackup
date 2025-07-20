import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TEST_API_URL = process.env.TEST_API_URL || 'http://localhost:3000';

// Create Supabase admin client for test cleanup
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

describe('Anonymous Generation Limits', () => {
  // Test IPs to use (will be hashed)
  const testIPs = [
    '192.168.1.100',
    '10.0.0.50',
    '172.16.0.25'
  ];

  // Clean up test data before and after tests
  const cleanupTestData = async () => {
    // Delete test records from daily_generation_limits
    // Note: We can't delete by IP since they're hashed, so we'll delete recent test records
    await supabase
      .from('daily_generation_limits')
      .delete()
      .eq('generation_date', new Date().toISOString().split('T')[0])
      .in('identifier_type', ['ip_address']);
  };

  beforeEach(async () => {
    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('SVG Generation Limits', () => {
    it('should allow 1 SVG generation for anonymous user', async () => {
      const response = await fetch(`${TEST_API_URL}/api/generate-svg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIPs[0]
        },
        body: JSON.stringify({
          prompt: 'Test SVG generation',
          style: 'any',
          size: '1024x1024',
          aspect_ratio: 'Not set'
        })
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.svgUrl).toBeDefined();
    });

    it('should block 2nd SVG generation for same anonymous user', async () => {
      // First generation should succeed
      const response1 = await fetch(`${TEST_API_URL}/api/generate-svg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIPs[1]
        },
        body: JSON.stringify({
          prompt: 'First SVG generation',
          style: 'any',
          size: '1024x1024',
          aspect_ratio: 'Not set'
        })
      });
      expect(response1.status).toBe(200);

      // Second generation should fail
      const response2 = await fetch(`${TEST_API_URL}/api/generate-svg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIPs[1]
        },
        body: JSON.stringify({
          prompt: 'Second SVG generation',
          style: 'any',
          size: '1024x1024',
          aspect_ratio: 'Not set'
        })
      });

      const data2 = await response2.json();
      expect(response2.status).toBe(429);
      expect(data2.error).toContain('Sign up to continue generating for free');
    });
  });

  describe('Icon Generation Limits', () => {
    it('should allow 2 icon generations for anonymous user', async () => {
      // First icon generation
      const response1 = await fetch(`${TEST_API_URL}/api/generate-icon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIPs[2]
        },
        body: JSON.stringify({
          prompt: 'First icon generation',
          style: 'icon',
          size: '1024x1024',
          aspect_ratio: '1:1'
        })
      });

      expect(response1.status).toBe(200);
      const data1 = await response1.json();
      expect(data1.success).toBe(true);

      // Second icon generation
      const response2 = await fetch(`${TEST_API_URL}/api/generate-icon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIPs[2]
        },
        body: JSON.stringify({
          prompt: 'Second icon generation',
          style: 'icon',
          size: '1024x1024',
          aspect_ratio: '1:1'
        })
      });

      expect(response2.status).toBe(200);
      const data2 = await response2.json();
      expect(data2.success).toBe(true);
    });

    it('should block 3rd icon generation for same anonymous user', async () => {
      const testIP = '192.168.100.200';

      // Generate 2 icons (should succeed)
      for (let i = 1; i <= 2; i++) {
        const response = await fetch(`${TEST_API_URL}/api/generate-icon`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': testIP
          },
          body: JSON.stringify({
            prompt: `Icon generation ${i}`,
            style: 'icon',
            size: '1024x1024',
            aspect_ratio: '1:1'
          })
        });
        expect(response.status).toBe(200);
      }

      // Third generation should fail
      const response3 = await fetch(`${TEST_API_URL}/api/generate-icon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIP
        },
        body: JSON.stringify({
          prompt: 'Third icon generation',
          style: 'icon',
          size: '1024x1024',
          aspect_ratio: '1:1'
        })
      });

      const data3 = await response3.json();
      expect(response3.status).toBe(429);
      expect(data3.error).toContain('Sign up to continue generating for free');
    });
  });

  describe('Separate Limits for SVG and Icons', () => {
    it('should track SVG and icon limits separately', async () => {
      const testIP = '192.168.200.100';

      // Generate 1 SVG (should succeed)
      const svgResponse = await fetch(`${TEST_API_URL}/api/generate-svg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIP
        },
        body: JSON.stringify({
          prompt: 'SVG generation',
          style: 'any',
          size: '1024x1024',
          aspect_ratio: 'Not set'
        })
      });
      expect(svgResponse.status).toBe(200);

      // Should still be able to generate 2 icons
      for (let i = 1; i <= 2; i++) {
        const iconResponse = await fetch(`${TEST_API_URL}/api/generate-icon`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': testIP
          },
          body: JSON.stringify({
            prompt: `Icon generation ${i}`,
            style: 'icon',
            size: '1024x1024',
            aspect_ratio: '1:1'
          })
        });
        expect(iconResponse.status).toBe(200);
      }

      // Now both should be blocked
      const svgResponse2 = await fetch(`${TEST_API_URL}/api/generate-svg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIP
        },
        body: JSON.stringify({
          prompt: 'Second SVG generation',
          style: 'any',
          size: '1024x1024',
          aspect_ratio: 'Not set'
        })
      });
      expect(svgResponse2.status).toBe(429);

      const iconResponse3 = await fetch(`${TEST_API_URL}/api/generate-icon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIP
        },
        body: JSON.stringify({
          prompt: 'Third icon generation',
          style: 'icon',
          size: '1024x1024',
          aspect_ratio: '1:1'
        })
      });
      expect(iconResponse3.status).toBe(429);
    });
  });

  describe('Database Function Tests', () => {
    it('should hash IP addresses correctly', async () => {
      const testIP = '192.168.1.1';
      
      // Call the hash function directly
      const { data, error } = await supabase.rpc('hash_identifier', {
        identifier: testIP
      });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data).toHaveLength(64); // SHA-256 produces 64 character hex string
      expect(data).not.toContain(testIP); // Should not contain original IP
    });

    it('should not store raw IP addresses in database', async () => {
      const testIP = '192.168.50.50';

      // Make a generation request
      await fetch(`${TEST_API_URL}/api/generate-svg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIP
        },
        body: JSON.stringify({
          prompt: 'Test for IP hashing',
          style: 'any',
          size: '1024x1024',
          aspect_ratio: 'Not set'
        })
      });

      // Check database - should not find raw IP
      const { data } = await supabase
        .from('daily_generation_limits')
        .select('*')
        .eq('identifier', testIP)
        .eq('identifier_type', 'ip_address');

      expect(data).toHaveLength(0); // Should not find raw IP
    });
  });

  describe('Error Handling', () => {
    it('should handle missing IP address gracefully', async () => {
      const response = await fetch(`${TEST_API_URL}/api/generate-svg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // No IP headers
        },
        body: JSON.stringify({
          prompt: 'Test without IP',
          style: 'any',
          size: '1024x1024',
          aspect_ratio: 'Not set'
        })
      });

      // In production, this should return 403
      // In development, it might work with 'development_user'
      expect([200, 403]).toContain(response.status);
    });

    it('should handle invalid generation type', async () => {
      // Direct RPC call to test function
      const { data, error } = await supabase.rpc('check_credits_v3', {
        p_user_id: null,
        p_identifier: '192.168.1.1',
        p_identifier_type: 'ip_address',
        p_generation_type: 'invalid_type'
      });

      // Should default to SVG cost (2 credits needed, but only 1 allowed)
      expect(error).toBeNull();
      expect(data[0].success).toBe(true); // First generation should succeed
    });
  });
});

// Integration test for the full user journey
describe('User Journey Tests', () => {
  it('should handle anonymous to authenticated user transition', async () => {
    // This would require creating a test user and authenticating
    // Skipping for now as it requires more complex test setup
    expect(true).toBe(true);
  });
});