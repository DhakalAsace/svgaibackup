import crypto from 'crypto';

export interface WebhookEvent {
  id: string;
  type: string;
  created: number;
  data: any;
}

export class WebhookSecurity {
  private static readonly MAX_AGE_SECONDS = 300; // 5 minutes
  
  static validateTimestamp(timestamp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return (now - timestamp) <= this.MAX_AGE_SECONDS;
  }
  
  static generateIdempotencyKey(eventId: string): string {
    return crypto.createHash('sha256').update(eventId).digest('hex');
  }
}