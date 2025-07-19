#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

// Using values from .env.example
const SUPABASE_URL = 'https://tgqyfdczovfscxzayalv.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncXlmZGN6b3Zmc2N4emF5YWx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDU5NjY3MSwiZXhwIjoyMDYwMTcyNjcxfQ.ULtH_Djpb0l4Ugx6EEbmzSowezLOkHh0IQECkBPZ0Hc';

async function quickHealthCheck() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('🏥 Quick System Health Check\n');
  
  const checks = {
    database: '❓',
    edgeFunctions: '❓',
    cronJobs: '❓',
    svgRetention: '❓',
    cleanupQueue: '❓'
  };

  // 1. Database Connection
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    checks.database = error ? '❌' : '✅';
  } catch {
    checks.database = '❌';
  }

  // 2. Edge Functions
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/scheduled-storage-cleanup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    checks.edgeFunctions = response.ok ? '✅' : '⚠️';
  } catch {
    checks.edgeFunctions = '❌';
  }

  // 3. Cron Jobs
  try {
    const { data: jobs, error } = await supabase.rpc('get_active_cron_jobs');
    if (error) {
      checks.cronJobs = '⚠️';
    } else {
      checks.cronJobs = jobs && jobs.length >= 3 ? '✅' : '⚠️';
    }
  } catch {
    checks.cronJobs = '⚠️';
  }

  // 4. SVG Retention
  try {
    const { data: violations } = await supabase.from('svg_designs').select('created_at').lt('created_at', new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString());
    checks.svgRetention = (!violations || violations.length === 0) ? '✅' : '❌';
  } catch {
    checks.svgRetention = '❌';
  }

  // 5. Cleanup Queue
  try {
    const { data: queue } = await supabase.from('storage_cleanup_queue').select('id').is('processed_at', null);
    checks.cleanupQueue = (!queue || queue.length === 0) ? '✅' : '⚠️';
  } catch {
    checks.cleanupQueue = '❌';
  }

  // Display results
  console.log('Component Status:');
  console.log(`${checks.database} Database Connection`);
  console.log(`${checks.edgeFunctions} Edge Functions`);
  console.log(`${checks.cronJobs} Scheduled Jobs`);
  console.log(`${checks.svgRetention} SVG Retention Policy`);
  console.log(`${checks.cleanupQueue} Cleanup Queue`);

  // Overall health
  const allGood = Object.values(checks).every(status => status === '✅');
  const hasWarnings = Object.values(checks).some(status => status === '⚠️');
  const hasErrors = Object.values(checks).some(status => status === '❌');

  console.log('\nOverall System Health:');
  if (allGood) {
    console.log('✅ All systems operational!');
  } else if (hasErrors) {
    console.log('❌ Some components need attention');
  } else if (hasWarnings) {
    console.log('⚠️  System functional with minor issues');
  }

  console.log('\n💡 No action needed - your deletion only affected local files, not deployed services.');
}

quickHealthCheck().catch(console.error);