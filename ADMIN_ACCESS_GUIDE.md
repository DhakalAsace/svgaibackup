# Admin Access Guide for SVGAI

## ✅ Admin Setup Complete

**Admin User**: dhakalasace777@gmail.com  
**User ID**: 56fddafc-c72b-4c05-ad41-cae92e2861d1  
**Status**: ✅ Added to ADMIN_USER_IDS in .env.local

## 🚀 How to Access Admin Dashboard

1. **Make sure you're logged in** with dhakalasace777@gmail.com
2. **Navigate to**: https://svgai.org/admin (or http://localhost:3000/admin for local development)
3. **You should see**: Admin Dashboard with cleanup status monitoring

## 📊 Admin Dashboard Features

### Cleanup Status Monitor
- **Expired Videos Count**: Shows videos past their expiration date
- **Expired SVGs (Free/Starter)**: SVGs older than 7 days
- **Expired SVGs (Pro)**: SVGs older than 30 days  
- **Storage Queue (Pending)**: Files waiting to be deleted
- **Storage Queue (Processed)**: Successfully deleted files
- **Total Expired Content**: Sum of all expired items

### Manual Cleanup Controls
- **Refresh Button**: Update the status display
- **Run Cleanup Button**: Manually trigger cleanup for all expired content

### Retention Policy Display
Shows current retention periods:
- Free & Starter users: 7 days
- Pro users: 30 days
- Automatic cleanup runs daily at 2 AM UTC

## 🔧 Troubleshooting

### If you can't access /admin:
1. **Check you're logged in** - Must be authenticated
2. **Verify email matches** - Must be logged in as dhakalasace777@gmail.com
3. **Restart the app** - Environment variables need a restart to take effect
   ```bash
   # For local development
   npm run dev
   
   # For production
   vercel --prod
   ```

### If cleanup buttons don't work:
1. Check browser console for errors
2. Verify Supabase connection is working
3. Check that cleanup functions exist in database

## 🛡️ Security Notes

- Only users listed in `ADMIN_USER_IDS` can access /admin
- Admin dashboard is excluded from search engines (robots meta tag)
- All cleanup operations require admin authentication
- Admin actions are performed via Supabase RPC calls

## 📝 Adding More Admins

To add additional admin users:
```bash
# In .env.local
ADMIN_USER_IDS="56fddafc-c72b-4c05-ad41-cae92e2861d1,another-user-id-here"
```

Separate multiple user IDs with commas.

---

**Next Steps**: 
1. Log in with dhakalasace777@gmail.com
2. Visit /admin
3. Monitor and manage content cleanup as needed