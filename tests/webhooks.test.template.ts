// @ts-nocheck
// These tests require Jest to be installed
// npm install --save-dev jest @jest/globals @types/jest
// import { describe, test, expect } from '@jest/globals';
import crypto from 'crypto';

describe('Webhook Security', () => {
  test('Rejects invalid signatures', async () => {
    const response = await fetch('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'stripe-signature': 'invalid_signature' },
      body: JSON.stringify({ type: 'checkout.session.completed' })
    });
    expect(response.status).toBe(400);
  });
  
  test('Rejects old timestamps', async () => {
    const oldTimestamp = Math.floor(Date.now() / 1000) - 400; // 6+ minutes old
    const payload = JSON.stringify({
      id: 'evt_test',
      type: 'checkout.session.completed',
      created: oldTimestamp
    });
    
    // Generate valid signature with old timestamp
    const signature = generateTestSignature(payload, oldTimestamp);
    
    const response = await fetch('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'stripe-signature': signature },
      body: payload
    });
    expect(response.status).toBe(400);
  });
});

function generateTestSignature(payload: string, timestamp: number): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || 'test_secret';
  const signedPayload = `${timestamp}.${payload}`;
  // Primary signature (v1)
  const v1 = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  // Secondary signature (v0) – Stripe often supplies multiple versions
  const v0 = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp - 10}.${payload}`)
    .digest('hex');
  return `t=${timestamp},v1=${v1},v0=${v0}`;
}