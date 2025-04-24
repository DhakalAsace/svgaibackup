"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/contexts/AuthContext";
import { BrandLogo } from "@/components/brand-logo";
import { usePathname } from "next/navigation";

// Define navigation links outside of component to ensure consistency
const navigationLinks = [
    {
      href: "/ai-icon-generator",
      label: "Icon Generator",
      key: "icon-generator"
    },
    {
      href: "/#features",
      label: "Features",
      key: "features"
    },
    {
      href: "/#use-cases",
      label: "Use Cases",
      key: "use-cases"
    },
    {
      href: "/#how-it-works",
      label: "How It Works",
      key: "how-it-works"
    },
    {
      href: "/blog",
      label: "Blog",
      key: "blog"
    }
  ];

export default function Navbar() {
  const { session } = useAuth();
  const pathname = usePathname() || "";  // Ensure pathname is never undefined
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-brand/95 backdrop-blur supports-[backdrop-filter]:bg-brand/60">
      <div className="container flex h-20 items-center justify-between py-2">
        <Link href="/" className="flex items-center -ml-2" aria-label="SVGAI Home">
          <BrandLogo />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navigationLinks.map((link) => (
            <Link 
              key={link.key} 
              href={link.href} 
              className={`text-secondary hover:text-primary transition-colors text-sm font-medium ${
                pathname === link.href ? 'text-primary' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session && (
            <Button variant="outline" size="sm" asChild className="text-secondary border-secondary hover:bg-primary/10">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
