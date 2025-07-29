"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Gift } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";

function SignUpFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  
  // Get the returnUrl parameter and preserve any additional params
  const returnUrl = searchParams.get('returnUrl');
  const preservePrompt = searchParams.get('preservePrompt');
  
  // Construct redirect path with preservePrompt if needed
  let redirectPath = returnUrl || '/';
  if (preservePrompt === 'true' && !redirectPath.includes('preservePrompt')) {
    redirectPath += (redirectPath.includes('?') ? '&' : '?') + 'preservePrompt=true';
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signUp(email, password);
      setIsSuccess(true);
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle(redirectPath);
    } catch (error: any) {
      setError(error.message || "An error occurred with Google sign in");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Generate more SVGs and icons with AI. Save all your designs to access anytime.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSuccess ? (
          <div className="py-8">
            <div className="text-center space-y-6">
              {/* Success icon with brand styling */}
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#FF7043]/20 to-[#FF5722]/20 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF7043] to-[#FF5722] rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              
              {/* Title and description with brand colors */}
              <div className="space-y-3">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#FF7043] to-[#FF5722] bg-clip-text text-transparent">
                  Check your inbox!
                </h3>
                <p className="text-lg text-gray-600">We've sent a verification link to</p>
              </div>
              
              {/* Email address with brand styling */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7043]/10 to-[#FF5722]/10 blur-xl"></div>
                <div className="relative bg-white border-2 border-[#FF7043]/20 rounded-2xl px-8 py-5 max-w-sm mx-auto shadow-lg">
                  <p className="text-lg font-semibold text-gray-900 break-all">
                    {email}
                  </p>
                </div>
              </div>
              
              {/* Credits badge with enhanced animation */}
              <div className="space-y-4">
                <p className="text-lg text-gray-700 font-medium">
                  Click the link in your email to activate your account and unlock
                </p>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF7043] to-[#FF5722] blur-lg opacity-40 animate-pulse"></div>
                  <div className="relative inline-flex items-center gap-3 bg-gradient-to-r from-[#FF7043] to-[#FF5722] text-white rounded-full px-8 py-4 shadow-xl transform hover:scale-105 transition-transform">
                    <Gift className="h-6 w-6" />
                    <span className="text-xl font-bold">6 free AI credits</span>
                  </div>
                </div>
              </div>
              
              {/* Helper text with icon */}
              <div className="pt-6 flex items-center justify-center gap-2 text-gray-500">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm">
                  Email should arrive within a few minutes
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Google first */}
            <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
          </form>
          
          <p className="text-xs text-center text-gray-400 mt-4">
            By signing up, you agree to our{" "}
            <a href="/terms" className="text-gray-500 hover:text-gray-600 underline" target="_blank" rel="noopener noreferrer">
              Terms
            </a>{" "}
            &{" "}
            <a href="/privacy" className="text-gray-500 hover:text-gray-600 underline" target="_blank" rel="noopener noreferrer">
              Privacy
            </a>
          </p>
        </div>
        )}
      </CardContent>
      {!isSuccess && (
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-[#0084FF] hover:underline">
              Login
            </a>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

export function SignUpForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpFormContent />
    </Suspense>
  );
}