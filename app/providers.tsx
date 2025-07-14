"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { CreditProvider } from "@/contexts/CreditContext";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { RouteLoading } from "@/components/route-loading";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CreditProvider>
        <AnalyticsProvider>
          <LoadingProvider>
            <RouteLoading />
            {children}
          </LoadingProvider>
        </AnalyticsProvider>
      </CreditProvider>
    </AuthProvider>
  );
}
