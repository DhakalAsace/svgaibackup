import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | SVG AI",
  description: "The page you are looking for does not exist",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-10 text-center">
      <h1 className="text-4xl font-bold mb-3">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved. 
        Some features may not be available in this static deployment.
      </p>
      <Button asChild>
        <Link href="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Homepage
        </Link>
      </Button>
    </div>
  );
}