"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/contexts/CreditContext";
import { BrandLogo } from "@/components/brand-logo";
import { usePathname } from "next/navigation";
import { Crown, Menu, Code, FileDown, Film, Sparkles, ChevronDown, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@/lib/supabase";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define navigation links outside of component to ensure consistency
const navigationLinks = [
    {
      href: "/tools",
      label: "Tools",
      key: "tools",
      hasDropdown: true
    },
    {
      href: "/pricing",
      label: "Pricing",
      key: "pricing"
    },
    {
      href: "/blog",
      label: "Blog",
      key: "blog"
    }
  ];

// Define free tools for the submenu
const freeTools = [
  {
    title: 'SVG Editor',
    href: '/tools/svg-editor',
    icon: Code,
    badge: 'Free',
    description: 'Edit SVG code with live preview'
  },
  {
    title: 'SVG Optimizer',
    href: '/tools/svg-optimizer',
    icon: FileDown,
    badge: 'Free',
    description: 'Reduce file size without quality loss'
  },
  {
    title: 'Animation Tool',
    href: '/animate',
    icon: Sparkles,
    badge: 'Free',
    description: 'Create CSS animations for SVGs'
  },
  {
    title: 'SVG to Video',
    href: '/tools/svg-to-video',
    icon: Film,
    badge: 'Premium',
    description: 'AI transforms SVGs into dynamic videos'
  }
];

export default function Navbar() {
  const { session } = useAuth();
  const { creditInfo, loading: creditsLoading } = useCredits();
  const pathname = usePathname() || "";  // Ensure pathname is never undefined
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const checkSubscription = async () => {
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, subscription_tier')
          .eq('id', session.user.id)
          .single();
        
        setIsSubscribed(profile?.subscription_status === 'active');
        setSubscriptionTier(profile?.subscription_tier || null);
      }
      setLoading(false);
    };
    
    checkSubscription();
  }, [session, supabase]);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-gradient-to-b from-white/95 to-white/85 backdrop-blur-md shadow-sm">
      <div className="container flex h-20 items-center justify-between py-2">
        <Link href="/" className="flex items-center -ml-2" aria-label="SVGAI Home">
          <BrandLogo />
        </Link>

        <TooltipProvider>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-2">
            {navigationLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <NavigationMenuItem key={link.key}>
                    <NavigationMenuTrigger className="text-sm font-medium hover:bg-[#FF7043]/10 hover:text-[#FF7043] data-[state=open]:bg-[#FF7043]/10 data-[state=open]:text-[#FF7043]">
                      {link.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[400px] p-4">
                        <div className="space-y-2">
                          {freeTools.map((tool) => (
                            <Link
                              key={tool.href}
                              href={tool.href}
                              className="flex items-start gap-3 p-3 hover:bg-[#FF7043]/5 rounded-md transition-colors"
                            >
                              <tool.icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{tool.title}</span>
                                  <Badge 
                                    variant={tool.badge === 'Premium' ? 'default' : 'secondary'}
                                    className={tool.badge === 'Premium' ? 'bg-gradient-to-r from-[#FF7043] to-[#FFA726] border-0' : 'bg-green-500/10 border-green-500 text-green-700 font-medium'}
                                  >
                                    {tool.badge}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {tool.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                          <div className="pt-2 mt-2 border-t">
                            <Link 
                              href="/convert" 
                              className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
                            >
                              🔄 All Format Converters
                              <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG to SVG, JPG to SVG, SVG to PNG & 40+ formats
                            </p>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }


              return (
                <NavigationMenuItem key={link.key}>
                  <Link 
                    href={link.href} 
                    className={`inline-flex h-9 px-4 py-2 items-center justify-center rounded-md text-sm font-medium hover:bg-[#FF7043]/10 hover:text-[#FF7043] transition-colors ${
                      pathname === link.href ? 'bg-[#FF7043]/10 text-[#FF7043]' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        </TooltipProvider>

        <div className="flex items-center gap-3">
          {/* Primary CTA - Generate SVG (hidden on dashboard, homepage, login, signup, and results) */}
          {pathname !== '/dashboard' && pathname !== '/' && pathname !== '/login' && pathname !== '/signup' && pathname !== '/results' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    asChild 
                    className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] hover:opacity-90 text-white border-0 shadow-sm"
                  >
                    <Link href="/">
                      <Sparkles className="w-4 h-4 mr-1.5" />
                      Generate SVG
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">Create custom SVG images with AI</p>
                  <p className="text-xs text-muted-foreground">From text descriptions • No upload needed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Dashboard for logged in users (hidden on dashboard page) */}
          {session && pathname !== '/dashboard' && (
            <Link 
              href="/dashboard"
              className="hidden md:flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
          )}

          {/* Login and Signup buttons */}
          {!session && (
            <>
              {pathname !== '/login' && pathname !== '/signup' && (
                <Button size="sm" variant="ghost" asChild className="hover:bg-gray-100/50">
                  <Link href="/login">Login</Link>
                </Button>
              )}
              {pathname === '/signup' && (
                <Button size="sm" variant="ghost" asChild className="hover:bg-gray-100/50">
                  <Link href="/login">Login</Link>
                </Button>
              )}
              {(pathname === '/' || pathname === '/login' || pathname === '/pricing') && (
                <Button 
                  size="sm" 
                  asChild 
                  variant="ghost"
                  className="!bg-gradient-to-r from-[#FF7043] to-[#FFA726] hover:opacity-90 !text-white hover:!text-white border-0 shadow-sm [&>*]:!text-white !font-medium"
                >
                  <Link href="/signup" className="!text-white">Sign Up</Link>
                </Button>
              )}
            </>
          )}

          {/* Credits and user section */}
          {session && (
            <>
              {/* Credits display */}
              {!creditsLoading && creditInfo && (
                <div className="flex items-center gap-3">
                  {/* Special display for pricing page */}
                  {pathname === '/pricing' ? (
                    <div className="flex items-center gap-2">
                      {isSubscribed ? (
                        <Badge variant="default" className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] border-0">
                          <Crown className="w-3 h-3 mr-1" />
                          Current Plan: {subscriptionTier === 'pro' ? 'Pro' : 'Starter'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-orange-200 text-orange-600">
                          <span className="font-medium">{creditInfo.creditsRemaining}</span>
                          <span className="ml-1">free credits left</span>
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <>
                      <Badge 
                        variant="outline" 
                        className="border-gray-300 bg-gray-50 text-gray-700 px-2 sm:px-3 py-1 hidden sm:flex"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1 sm:mr-1.5 text-[#FF7043]" />
                        <span className="font-semibold">{creditInfo.creditsRemaining}</span>
                        <span className="ml-1 font-normal hidden sm:inline">credits</span>
                        <span className="ml-1 font-normal sm:hidden">cr</span>
                      </Badge>
                      
                      {/* Get More button when low on credits (hidden on pricing page) */}
                      {!isSubscribed && creditInfo.creditsRemaining < 10 && pathname !== '/results' && (
                        <Button 
                          size="sm" 
                          asChild 
                          className="h-8 text-sm bg-gradient-to-r from-orange-500 to-orange-600 !text-white hover:!text-white border-0 shadow-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-200 [&>*]:!text-white"
                        >
                          <Link href="/pricing" className="!text-white">
                            <Sparkles className="w-3 h-3 mr-1 !text-white sm:inline hidden" />
                            <span className="!text-white hidden sm:inline">Get More Credits</span>
                            <span className="!text-white sm:hidden">Get Credits</span>
                          </Link>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              )}
              
              {/* Divider */}
              <div className="hidden md:block h-8 w-px bg-gray-200" />
            </>
          )}
          
          <UserMenu />
          
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 flex flex-col gap-4">
                {/* Mobile user info */}
                {session && !creditsLoading && creditInfo && (
                  <div className="pb-4 border-b">
                    <Badge 
                      variant="outline" 
                      className="border-gray-300 bg-gray-50 text-gray-700 px-3 py-1.5 w-full justify-center"
                    >
                      <Sparkles className="w-4 h-4 mr-2 text-[#FF7043]" />
                      <span className="font-semibold text-base">{creditInfo.creditsRemaining}</span>
                      <span className="ml-1 font-normal">credits remaining</span>
                    </Badge>
                  </div>
                )}
                
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-1">
                  {/* Primary CTA for mobile (hidden on dashboard, homepage, login, signup, and results) */}
                  {pathname !== '/dashboard' && pathname !== '/' && pathname !== '/login' && pathname !== '/signup' && pathname !== '/results' && (
                    <Link 
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3 px-2 text-base font-medium bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white rounded-md transition-opacity hover:opacity-90 mb-2"
                    >
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      Generate SVG
                    </Link>
                  )}
                  
                  {navigationLinks.map((link) => {
                    // Special handling for Tools link with dropdown
                    if (link.hasDropdown) {
                      return (
                        <Accordion key={link.key} type="single" collapsible className="border-0">
                          <AccordionItem value="tools" className="border-0">
                            <AccordionTrigger className="py-3 hover:no-underline">
                              <span className={`text-base font-medium ${
                                pathname === link.href ? 'text-primary' : 'text-foreground'
                              }`}>
                                {link.label}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-4 space-y-2">
                                {freeTools.map((tool) => (
                                  <Link
                                    key={tool.href}
                                    href={tool.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-start gap-3 py-2 hover:bg-[#FF7043]/5 rounded-md px-2 transition-colors"
                                  >
                                    <tool.icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{tool.title}</span>
                                        <Badge 
                                          variant={tool.badge === 'Premium' ? 'default' : 'secondary'}
                                          className={tool.badge === 'Premium' ? 'bg-gradient-to-r from-[#FF7043] to-[#FFA726] border-0 text-white' : 'bg-green-500/10 border-green-500 text-green-700 font-medium'}
                                        >
                                          {tool.badge}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {tool.description}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                                <div className="pt-2 mt-2 border-t">
                                  <Link 
                                    href="/convert" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm text-primary hover:underline flex items-center gap-1 py-2 px-2 font-medium"
                                  >
                                    🔄 All Format Converters
                                    <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                                  </Link>
                                  <p className="text-xs text-muted-foreground px-2 mt-1">
                                    PNG to SVG, JPG to SVG, SVG to PNG & 40+ formats
                                  </p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      );
                    }
                    
                    // Regular links
                    return (
                      <Link 
                        key={link.key}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`py-3 px-2 text-base font-medium hover:bg-[#FF7043]/10 hover:text-[#FF7043] rounded-md transition-colors ${
                          pathname === link.href ? 'text-[#FF7043] bg-[#FF7043]/10' : 'text-foreground'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
                
                {/* Mobile Actions */}
                <div className="pt-4 border-t space-y-3">
                  {session && pathname !== '/dashboard' && (
                    <Link 
                      href="/dashboard"
                      className="block py-2 text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  {!session && (
                    <>
                      {pathname !== '/login' && pathname !== '/signup' && (
                        <Button 
                          variant="ghost"
                          asChild 
                          className="w-full hover:bg-gray-100/50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/login">Login</Link>
                        </Button>
                      )}
                      {pathname === '/signup' && (
                        <Button 
                          variant="ghost"
                          asChild 
                          className="w-full hover:bg-gray-100/50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/login">Login</Link>
                        </Button>
                      )}
                      {(pathname === '/' || pathname === '/login') && (
                        <Button 
                          asChild 
                          variant="ghost"
                          className="w-full !bg-gradient-to-r from-[#FF7043] to-[#FFA726] hover:opacity-90 !text-white hover:!text-white border-0 [&>*]:!text-white !font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/signup" className="!text-white">Sign Up</Link>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
