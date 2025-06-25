"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/contexts/CreditContext";
import { BrandLogo } from "@/components/brand-logo";
import { usePathname } from "next/navigation";
import { Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";

// Define navigation links outside of component to ensure consistency
const navigationLinks = [
    {
      href: "/ai-icon-generator",
      label: "Icon Generator",
      key: "icon-generator"
    },
    {
      href: "/animate",
      label: "Animate",
      key: "animate"
    },
    {
      href: "/pricing",
      label: "Pricing",
      key: "pricing"
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
      href: "/learn",
      label: "Learn",
      key: "learn"
    },
    {
      href: "/blog",
      label: "Blog",
      key: "blog"
    }
  ];

export default function Navbar() {
  const { session } = useAuth();
  const { creditInfo, loading: creditsLoading } = useCredits();
  const pathname = usePathname() || "";  // Ensure pathname is never undefined
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const checkSubscription = async () => {
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', session.user.id)
          .single();
        
        setIsSubscribed(profile?.subscription_status === 'active');
      }
      setLoading(false);
    };
    
    checkSubscription();
  }, [session, supabase]);
  
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
          {/* Show upgrade button only for logged-in users who are not subscribed */}
          {!loading && session && !isSubscribed && (
            <Button 
              size="sm" 
              asChild 
              className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] hover:opacity-90 text-white border-0 shadow-sm"
            >
              <Link href="/pricing">
                <Crown className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Upgrade</span>
                <span className="sm:hidden">Pro</span>
              </Link>
            </Button>
          )}
          
          {session && (
            <Button variant="outline" size="sm" asChild className="text-secondary border-secondary hover:bg-primary/10">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          {!session && (
            <>
              <Button size="sm" asChild className="bg-[#FF7043] text-white hover:bg-[#FF5722]">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}

          {session && isSubscribed && <ManageSubscriptionButton />}
          {session && !creditsLoading && creditInfo && (
            <span className="text-sm text-gray-700">Credits left: {creditInfo.creditsRemaining}</span>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
