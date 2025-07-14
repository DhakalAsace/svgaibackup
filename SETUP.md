# SVG AI Setup Instructions

## Environment Variables Required

Create a `.env.local` file with the following variables:

```env
# Database Configuration
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
POSTGRES_HOST=your_postgres_host

# Supabase Configuration
SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# Replicate API
REPLICATE_API_TOKEN=your_replicate_api_token

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # From Stripe Dashboard > Webhooks
NEXT_PUBLIC_URL=https://svgai.org  # Your production URL
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run database migrations (already applied):
- Profile subscription fields
- Subscriptions table
- Generation limit functions

## Stripe Setup

1. Create webhook endpoint in Stripe Dashboard:
   - URL: `https://svgai.org/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`

2. Products already created in Stripe:
   - Starter: prod_SPHEKt3vyhUXhW ($12/month)
   - Pro: prod_SPHES57RnhBWJq ($35/month)

## Running the Application

Development:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## Pricing Structure

- **Free (No Signup)**: 1 generation to try
- **Free (With Signup)**: 3 total generations/month
- **Starter**: $12/month for 60 generations
- **Pro**: $35/month for 250 generations

## Features Implemented

1. ✅ Watermarks for free users
2. ✅ Soft/hard signup prompts
3. ✅ Subscription management
4. ✅ Usage tracking
5. ✅ Stripe integration
6. ✅ User dashboard
7. ✅ Pricing page
8. ✅ Upsell messages throughout journey

## API Costs

- Recraft V3 SVG: $0.08/generation
- Recraft 20B Icon: $0.044/generation