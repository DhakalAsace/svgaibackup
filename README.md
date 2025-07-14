# SVG AI - The Ultimate SVG Platform

🚀 **A comprehensive SEO-optimized platform targeting 250,000+ monthly searches with 40+ converters, AI generation, galleries, and educational content.**

## 🎯 Project Overview

SVG AI is a full-featured SVG platform combining:
- **40 Free Converters**: PNG to SVG, SVG to PNG, and 38 more formats
- **AI SVG Generation**: Create custom SVGs with natural language
- **19 Themed Galleries**: Heart, Flowers, Christmas, and more
- **12 Learn Pages**: Comprehensive SVG education
- **Free Tools**: Editor, Optimizer, CSS Animator
- **Premium Features**: SVG to Video/GIF export

### Key Metrics
- **Target**: 150,000 organic sessions/month
- **Search Volume**: 250,000+ monthly searches covered
- **Monetization**: Free tools → Premium AI features

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account
- Stripe account
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/svgai.git
cd svgai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### Environment Setup

Required environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# AI Generation
REPLICATE_API_TOKEN=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## 📂 Project Structure

```
svgai/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── convert/           # 40 converter pages
│   ├── gallery/           # 19 gallery themes
│   ├── learn/             # 12 educational pages
│   ├── tools/             # Free tools (editor, optimizer)
│   └── ai-icon-generator/ # Premium AI generation
├── components/            # React components
├── lib/                   # Utilities and core logic
├── public/               # Static assets
├── types/                # TypeScript definitions
└── migrations/           # Database schemas
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS + Shadcn/ui
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4
- **AI**: Replicate API
- **Monitoring**: Custom solution

## 📚 Documentation

### Launch & Operations
- 📋 [Launch Guide](./docs/LAUNCH_GUIDE.md) - Pre-launch checklist and procedures
- 🔧 [Operations Guide](./docs/OPERATIONS_GUIDE.md) - Daily monitoring and maintenance
- 🚨 [Incident Response](./docs/INCIDENT_RESPONSE_PLAN.md) - Emergency procedures

### Features & Implementation
- 🎨 [Feature Documentation](./docs/FEATURE_DOCUMENTATION.md) - All features explained
- 📈 [SEO Implementation](./docs/SEO_IMPLEMENTATION_SUMMARY.md) - SEO strategy details
- 💻 [Developer Guide](./docs/DEVELOPER_GUIDE.md) - Code architecture and guides

### Security & Payments
- 🔒 [Security Implementation](./docs/SECURITY_IMPLEMENTATION_SUMMARY.md)
- 💳 [Payment Implementation](./docs/PAYMENT_IMPLEMENTATION_STATUS.md)
- 🛡️ [Payment Security](./docs/PAYMENT_SECURITY_PROCEDURES.md)

### Setup Guides
- 🚀 [Vercel Deployment](./docs/VERCEL_DEPLOYMENT_GUIDE.md)
- 📡 [Webhook Setup](./docs/WEBHOOK_SETUP.md)
- 🗄️ [Upstash Redis Setup](./docs/UPSTASH_REDIS_SETUP_GUIDE.md)

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

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Environment Variables in Vercel
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all variables from `.env.local`
4. Redeploy for changes to take effect

### Post-Deployment
1. Configure custom domain
2. Set up Stripe webhooks with production URL
3. Update Supabase URL allowlist
4. Enable analytics tracking
5. Monitor initial traffic

## 🤝 Contributing

We welcome contributions! Please see our [Developer Guide](./docs/DEVELOPER_GUIDE.md) for:
- Code architecture overview
- How to add new converters
- How to add gallery themes
- Testing guidelines
- Performance best practices

## 📈 Performance

- **Core Web Vitals**: All green metrics
- **PageSpeed Score**: 95+ on all pages
- **Load Time**: < 2s for converter pages
- **SEO Score**: 100/100 on Lighthouse

## 🔐 Security

- Webhook signature validation
- Rate limiting on all APIs
- Row-level security in database
- Input sanitization
- Content Security Policy
- Regular security audits

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

- Documentation: See `/docs` folder
- Issues: GitHub Issues
- Email: support@svgai.org

---

**Built with ❤️ for the SVG community**
