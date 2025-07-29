import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function monitorCreditResets() {
  console.log('\n=== Credit Reset Monitoring ===\n');

  try {
    // Get all active subscribers
    const { data: subscribers, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, subscription_tier, monthly_credits_used, credits_reset_at, billing_day')
      .not('subscription_tier', 'is', null)
      .eq('subscription_status', 'active')
      .order('credits_reset_at', { ascending: false });

    if (error) throw error;

    console.log(`Found ${subscribers.length} active subscribers\n`);

    // Group by reset status
    const resetToday = [];
    const needsReset = [];
    const recentlyReset = [];
    
    const today = new Date();
    const todayDay = today.getDate();

    for (const sub of subscribers) {
      const resetDate = sub.credits_reset_at ? new Date(sub.credits_reset_at) : null;
      const daysSinceReset = resetDate ? Math.floor((today.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24)) : 999;
      
      // Check if should reset today based on billing_day
      const shouldResetToday = sub.billing_day === todayDay || 
        (sub.billing_day > 28 && todayDay === new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate());
      
      if (daysSinceReset === 0) {
        resetToday.push(sub);
      } else if (shouldResetToday && daysSinceReset > 25) {
        needsReset.push(sub);
      } else if (daysSinceReset < 7) {
        recentlyReset.push(sub);
      }
    }

    // Report findings
    if (resetToday.length > 0) {
      console.log(`✅ Reset Today (${resetToday.length}):`);
      resetToday.forEach(sub => {
        console.log(`   - ${sub.email} (${sub.subscription_tier}) - Credits used: ${sub.monthly_credits_used}`);
      });
      console.log('');
    }

    if (needsReset.length > 0) {
      console.log(`⚠️  Needs Reset (${needsReset.length}):`);
      needsReset.forEach(sub => {
        console.log(`   - ${sub.email} (${sub.subscription_tier}) - Billing day: ${sub.billing_day}, Last reset: ${sub.credits_reset_at || 'Never'}`);
      });
      console.log('');
    }

    if (recentlyReset.length > 0) {
      console.log(`📅 Recently Reset (${recentlyReset.length}):`);
      recentlyReset.forEach(sub => {
        const resetDate = new Date(sub.credits_reset_at);
        console.log(`   - ${sub.email} (${sub.subscription_tier}) - Reset ${Math.floor((today.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24))} days ago`);
      });
    }

    // Check cron job status
    console.log('\n=== Cron Job Status ===');
    const { data: cronJobs, error: cronError } = await supabaseAdmin
      .from('cron.job')
      .select('jobname, schedule, active, nodename')
      .eq('jobname', 'reset-annual-subscriber-credits');

    if (!cronError && cronJobs && cronJobs.length > 0) {
      const job = cronJobs[0];
      console.log(`Cron job: ${job.active ? '✅ Active' : '❌ Inactive'}`);
      console.log(`Schedule: ${job.schedule}`);
      console.log(`Node: ${job.nodename || 'Not assigned'}`);
    } else {
      console.log('❌ Cron job not found');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the monitor
monitorCreditResets();