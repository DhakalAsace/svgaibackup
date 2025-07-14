# Set Up Webhooks Right Now! 🚀

Follow these steps to get your webhooks working in the next 5 minutes.

## Step 1: Install Stripe CLI (2 minutes)

### On Mac:
```bash
brew install stripe/stripe-cli/stripe
```

### On Windows:
Go to: https://github.com/stripe/stripe-cli/releases
Download: `stripe_X.X.X_windows_x86_64.zip`
Extract and add to PATH

### On Linux/WSL:
```bash
# For Linux/WSL (which you're using)
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

## Step 2: Login to Stripe (1 minute)

```bash
stripe login
```

This will:
1. Show a pairing code
2. Open your browser
3. Ask you to confirm the code
4. Success message appears

## Step 3: Start Listening for Webhooks (30 seconds)

In your project directory (`/mnt/a/svgai-1`), run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

You'll see:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef (^C to quit)
```

**⚠️ COPY THAT SECRET! You need it for the next step.**

## Step 4: Add Secret to Environment (1 minute)

Open `/mnt/a/svgai-1/.env.local` and add:

```bash
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef
```

(Use YOUR secret from step 3, not this example!)

## Step 5: Restart Your Dev Server (30 seconds)

1. Stop your Next.js server (Ctrl+C)
2. Start it again:
```bash
npm run dev
```

## Step 6: Sync Your Existing Subscription (1 minute)

Since you already have a subscription that was created without webhooks:

1. Go to http://localhost:3000/dashboard
2. Look for the "Sync Stripe Subscription" button
3. Click it!
4. You should see a success message
5. Your subscription should now show as active!

## Step 7: Test Everything Works (2 minutes)

Let's make sure webhooks are working for future subscriptions:

### Option A: Test with Stripe CLI
```bash
# In a new terminal (keep stripe listen running!)
stripe trigger checkout.session.completed
```

Check the terminal with `stripe listen` - you should see the event was forwarded.

### Option B: Do a Real Test Purchase
1. Go to your pricing page
2. Click subscribe on a plan
3. Use test card: `4242 4242 4242 4242`
4. Any future date for expiry
5. Any 3 digits for CVC
6. Complete checkout
7. Check your database - it should update automatically!

## You're Done! 🎉

Your webhooks are now working. Here's what happens automatically now:
- ✅ New subscriptions sync instantly
- ✅ Cancellations are handled
- ✅ Renewals reset your limits
- ✅ Failed payments are tracked

## Important Reminders

1. **Keep `stripe listen` running** while developing
2. **The webhook secret changes** each time you run `stripe listen`
3. **In production**, you'll set up webhooks differently (in Stripe Dashboard)

## Troubleshooting

### "command not found: stripe"
The CLI isn't installed. Go back to Step 1.

### "Webhook signature verification failed"
Your `.env.local` secret doesn't match. Copy the new secret from `stripe listen`.

### Nothing happens when I trigger events
1. Is `stripe listen` still running?
2. Did you restart your Next.js server after adding the secret?
3. Check your Next.js console for errors

### "No signatures found matching the expected signature"
You're using a production webhook secret with test data. Make sure you're using the secret from `stripe listen`.

## What's Next?

1. **Now**: Your local webhooks are working!
2. **Later**: When you deploy, set up production webhooks in Stripe Dashboard
3. **Always**: Test your payment flow end-to-end before going live

That's it! Your webhooks are set up and your subscription should be synced. 🚀