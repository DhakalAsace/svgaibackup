import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "API Not Available | SVG AI",
  description: "This API is not available in static mode",
};

export default function ApiNotAvailable() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-10 text-center">
      <h1 className="text-3xl font-bold mb-2">API Not Available</h1>
      <p className="text-gray-600 mb-6">
        This API endpoint is not available in static deployment mode.
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