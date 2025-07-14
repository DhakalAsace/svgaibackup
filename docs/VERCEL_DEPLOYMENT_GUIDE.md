# Vercel Deployment Guide - Step by Step

## Pre-Deployment Checklist

### 1. Set Up Your Accounts & Services

#### a) Supabase Setup
1. **Create Supabase Project** (if not already done)
   - Go to https://supabase.com
   - Create new project
   - Save your project URL and keys

2. **Run Database Migrations**
   ```bash
   # Connect to your Supabase project
   supabase link --project-ref your-project-ref
   
   # Run all migrations in order
   supabase db push
   ```

3. **Enable Row Level Security**
   - Go to Supabase Dashboard > Authentication > Policies
   - Verify RLS is enabled on all tables

#### b) Stripe Setup
1. **Create Stripe Account**
   - Go to https://stripe.com
   - Set up your account
   - Get API keys from Dashboard > Developers > API keys

2. **Create Products & Prices**
   ```bash
   # Use Stripe CLI or Dashboard to create:
   # 1. Starter Monthly ($12)
   # 2. Starter Annual ($120)
   # 3. Pro Monthly ($29)
   # 4. Pro Annual ($290)
   ```

3. **Configure Webhook Endpoint**
   - In Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

#### c) Upstash Redis Setup
1. **Create Upstash Account**
   - Go to https://upstash.com
   - Create new Redis database
   - Copy REST URL and token

#### d) API Keys Setup
1. **OpenAI API Key**
   - Go to https://platform.openai.com
   - Create API key for SVG generation

2. **Replicate API Key**
   - Go to https://replicate.com
   - Create API token for icon generation

### 2. Prepare Your Repository

#### a) Update Environment Variables File
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual values
```

#### b) Verify Git Ignore
```bash
# Ensure these are in .gitignore
.env
.env.local
.env.production
.mcp.json
```

#### c) Commit Your Changes
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 3. Deploy to Vercel

#### a) Initial Deployment
1. **Connect to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Or use Vercel Dashboard**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your Git repository
   - Select the main branch

#### b) Configure Environment Variables in Vercel
1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Environment Variables
3. Add all variables from your .env.local:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_STARTER_MONTHLY=price_xxx
STRIPE_PRICE_STARTER_ANNUAL=price_xxx
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_ANNUAL=price_xxx

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# AI APIs
OPENAI_API_KEY_ONE=sk-xxx
REPLICATE_API_TOKEN=r8_xxx
```

#### c) Configure Domain (Optional)
1. In Vercel Dashboard > Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 4. Post-Deployment Setup

#### a) Update Stripe Webhook URL
1. Go back to Stripe Dashboard
2. Update webhook endpoint to your production URL:
   - `https://your-app.vercel.app/api/webhooks/stripe`
   - Or your custom domain

#### b) Test Core Functionality
1. **Test Anonymous User Flow**
   - Visit homepage
   - Try generating an SVG without login
   - Should prompt for signup after 1 generation

2. **Test Authentication**
   - Sign up for new account
   - Verify email (check Supabase Auth settings)
   - Login/logout flow

3. **Test Payment Flow**
   - Go to pricing page
   - Select a plan
   - Complete Stripe checkout (use test cards)
   - Verify subscription is active

4. **Test Generation with Credits**
   - Generate SVGs (costs 2 credits)
   - Generate icons (costs 1 credit)
   - Verify credit deduction

#### c) Monitor Initial Traffic
1. **Vercel Analytics**
   - Check Functions tab for API performance
   - Monitor error rates

2. **Supabase Dashboard**
   - Check database queries
   - Monitor auth logs

3. **Stripe Dashboard**
   - Verify webhook deliveries
   - Check payment logs

### 5. Production Checklist

#### Security
- [ ] All environment variables are set in Vercel
- [ ] Stripe is in production mode (not test mode)
- [ ] Supabase RLS policies are active
- [ ] No hardcoded secrets in code

#### Performance
- [ ] Images are optimized
- [ ] Database indexes are created
- [ ] API routes have proper caching headers

#### Monitoring
- [ ] Error tracking is set up (e.g., Sentry)
- [ ] Analytics are configured
- [ ] Uptime monitoring is active

#### Legal
- [ ] Privacy policy is published
- [ ] Terms of service are published
- [ ] Cookie consent (if needed)

### 6. Common Issues & Solutions

#### Build Failures
```bash
# If build fails, check logs:
vercel logs

# Common fixes:
# 1. Ensure all env vars are set
# 2. Clear cache and redeploy:
vercel --force
```

#### Database Connection Issues
- Verify Supabase project is not paused
- Check connection pooling settings
- Ensure service role key is correct

#### Payment Issues
- Verify Stripe webhook secret matches
- Check Stripe API version compatibility
- Ensure products/prices exist in Stripe

### 7. Maintenance Tasks

#### Weekly
- Review error logs
- Check credit usage patterns
- Monitor subscription metrics

#### Monthly
- Review and optimize database queries
- Update dependencies
- Audit security logs

#### As Needed
- Scale Vercel plan based on usage
- Optimize images and assets
- Update pricing or features

## Quick Deploy Commands

```bash
# First time setup
git clone your-repo
cd your-repo
npm install
cp .env.example .env.local
# Edit .env.local with your values

# Deploy to Vercel
vercel

# Subsequent deploys
git push origin main
# Vercel auto-deploys from main branch

# Manual production deploy
vercel --prod
```

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Your app issues: https://github.com/your-username/your-repo/issues