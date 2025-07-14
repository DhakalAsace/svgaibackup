"use client"

import { Suspense } from "react"
import { NavMenuSkeleton } from "@/components/ui/loading"
import dynamic from "next/dynamic"

// Dynamically import navbar to prevent hydration issues
const Navbar = dynamic(
  () => import("./navbar"),
  {
    loading: () => <NavMenuSkeleton />,
    ssr: true
  }
)

export function NavbarWithLoading() {
  return (
    <Suspense fallback={<NavMenuSkeleton />}>
      <Navbar />
    </Suspense>
  )
}