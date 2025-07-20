import { Metadata } from 'next'
import MonitoringDashboard from '@/components/monitoring-dashboard'

export const metadata: Metadata = {
  title: 'System Monitoring',
  description: 'Monitor system health, performance, and alerts',
}

export default function MonitoringPage() {
  return <MonitoringDashboard />
}