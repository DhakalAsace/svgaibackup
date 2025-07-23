import { checkAdminAuth } from '@/lib/admin-auth';
import { CleanupStatusDashboard } from '@/components/admin/cleanup-status';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - SVGAI',
  description: 'Admin tools and monitoring for SVGAI',
  robots: {
    index: false,
    follow: false,
  },
};

// Force dynamic rendering since we use cookies for auth
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAdmin = await checkAdminAuth();
  
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage SVGAI operations</p>
      </div>
      
      <div className="space-y-6">
        <CleanupStatusDashboard />
        
        {/* Additional admin sections can be added here */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <p className="text-sm text-gray-600">
              Additional admin tools and statistics can be added here.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">System Health</h2>
            <p className="text-sm text-gray-600">
              System monitoring and health checks can be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}