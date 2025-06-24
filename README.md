# SVG AI

A modern web application for generating SVGs using AI. Create logos, icons, and illustrations effortlessly with natural language prompts.

## Features

- Generate SVGs from text prompts using Replicate API
- Browse a collection of SVG examples organized by category:
  - Logos (9)
  - Icons (10)
  - Illustrations (20+)
- Responsive design with optimized performance
- SEO-friendly structure with proper metadata
- Interactive hero section with auto-advancing SVG showcase

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Copy `env.template.example` to `.env.local` and fill in your credentials
4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Technology Stack

- Next.js 15
- React 19
- Tailwind CSS
- Supabase
- Replicate API
- Stripe (Payment Processing)

## Security Best Practices

### Payment Security
- **Webhook Validation**: All Stripe webhooks are validated using signature verification and timestamp checks
- **Rate Limiting**: API endpoints are protected with rate limiting (requires Upstash Redis)
- **Idempotency**: Webhook events are processed only once using idempotency keys
- **Audit Trail**: All payment events are logged for security monitoring
- **Environment Variables**: Sensitive keys are stored in environment variables, never in code

### Database Security
- **Row-Level Security**: Implemented on all sensitive tables
- **Race Condition Protection**: Credit deduction uses row-level locking
- **Service Role Keys**: Used only in server-side code, never exposed to client

### API Security
- **HTTPS Only**: All payment endpoints require secure connections
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc. on payment routes
- **Input Validation**: All user inputs are validated and sanitized
- **SQL Injection Protection**: Using parameterized queries via Supabase

### Development Security
- Never commit `.env.local` or any file containing secrets
- Use test mode for Stripe during development
- Review all payment-related code changes
- Run security audits regularly: `npm audit`

For detailed security procedures, see `/docs/PAYMENT_SECURITY_PROCEDURES.md`

## Deployment

This project is configured for easy deployment on Vercel.
