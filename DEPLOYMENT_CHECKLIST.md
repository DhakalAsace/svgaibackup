# 🚀 Vercel Deployment Checklist

## 📋 Quick Checklist (Copy & Check Off)

### 1. Prerequisites
- [ ] Supabase account created
- [ ] Stripe account created  
- [ ] Upstash Redis account created
- [ ] OpenAI API key obtained
- [ ] Replicate API token obtained
- [ ] Vercel account created

### 2. Supabase Setup
- [ ] Created new Supabase project
- [ ] Copied project URL, anon key, and service role key
- [ ] Connected to project: `supabase link --project-ref YOUR_REF`
- [ ] Ran migrations: `supabase db push`
- [ ] Verified RLS is enabled on all tables

### 3. Stripe Setup  
- [ ] Created products in Stripe Dashboard:
  - [ ] Starter Monthly ($12) - saved price ID
  - [ ] Starter Annual ($120) - saved price ID  
  - [ ] Pro Monthly ($29) - saved price ID
  - [ ] Pro Annual ($290) - saved price ID
- [ ] Will add webhook after deployment (need production URL)

### 4. Environment Setup
- [ ] Copied `.env.example` to `.env.local`
- [ ] Filled in all values in `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=✓
  NEXT_PUBLIC_SUPABASE_ANON_KEY=✓
  SUPABASE_SERVICE_ROLE_KEY=✓
  STRIPE_SECRET_KEY=✓
  STRIPE_WEBHOOK_SECRET=(will get after deploy)
  STRIPE_PRICE_STARTER_MONTHLY=✓
  STRIPE_PRICE_STARTER_ANNUAL=✓
  STRIPE_PRICE_PRO_MONTHLY=✓
  STRIPE_PRICE_PRO_ANNUAL=✓
  UPSTASH_REDIS_REST_URL=✓
  UPSTASH_REDIS_REST_TOKEN=✓
  OPENAI_API_KEY_ONE=✓
  REPLICATE_API_TOKEN=✓
  ```

### 5. Pre-Deployment Verification
- [ ] Ran `npm run lint` - no errors
- [ ] Ran `npm run type-check` - no errors
- [ ] Ran `node scripts/pre-deployment-check.js` - all passed
- [ ] Verified `.gitignore` includes sensitive files
- [ ] Committed all changes to Git

### 6. Deploy to Vercel
- [ ] Installed Vercel CLI: `npm i -g vercel`
- [ ] Logged in: `vercel login`
- [ ] Deployed: `vercel` (or connected via dashboard)
- [ ] Added all environment variables in Vercel dashboard

### 7. Post-Deployment  
- [ ] Got production URL: https://_____.vercel.app
- [ ] Updated Stripe webhook:
  - [ ] Added endpoint URL: `https://YOUR-APP.vercel.app/api/webhooks/stripe`
  - [ ] Selected all required events
  - [ ] Copied webhook secret to Vercel env vars
- [ ] Redeployed after adding webhook secret

### 8. Testing Production
- [ ] Homepage loads correctly
- [ ] Can generate SVG as anonymous user
- [ ] Signup flow works
- [ ] Login/logout works
- [ ] Stripe checkout completes (test mode)
- [ ] Credits deduct properly
- [ ] Dashboard shows generations

### 9. Final Steps
- [ ] Switched Stripe to live mode (when ready)
- [ ] Added custom domain (optional)
- [ ] Set up monitoring/analytics
- [ ] Announced launch! 🎉

## 🆘 Quick Troubleshooting

**Build fails on Vercel?**
- Check all env vars are set in Vercel dashboard
- Look at Function logs in Vercel

**Database connection errors?**
- Verify Supabase project is not paused
- Check service role key is correct

**Stripe webhooks failing?**
- Verify webhook secret matches exactly
- Check endpoint URL is correct
- Look at Stripe webhook logs

**Need help?**
- Check `/docs/VERCEL_DEPLOYMENT_GUIDE.md` for detailed steps
- Review error logs in Vercel dashboard
- Check Supabase logs for database issues