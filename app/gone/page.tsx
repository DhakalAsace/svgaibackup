import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, XCircle, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Removed | SVG AI",
  description: "This page has been permanently removed",
  robots: "noindex, nofollow",
};

export default function GonePage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <XCircle className="w-10 h-10 text-gray-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">410 - Page Removed</h1>
        <p className="text-xl text-gray-600 mb-2">
          This page has been permanently removed
        </p>
        <p className="text-gray-500">
          The content you're looking for is no longer available on our site.
        </p>
      </div>

      {/* Info Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Why was this page removed?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Pages are removed for various reasons:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>The feature or service has been discontinued</li>
            <li>Content has been merged with another page</li>
            <li>The page was part of a beta program that has ended</li>
            <li>Technical or security reasons</li>
          </ul>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Looking for something specific?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/convert"
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-semibold text-blue-900 mb-1">SVG Converters</h3>
              <p className="text-sm text-blue-700">
                Convert between SVG and other formats
              </p>
            </Link>
            
            <Link
              href="/ai-icon-generator"
              className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <h3 className="font-semibold text-purple-900 mb-1">AI Icon Generator</h3>
              <p className="text-sm text-purple-700">
                Create custom SVG icons with AI
              </p>
            </Link>
            
            <Link
              href="/tools/svg-editor"
              className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <h3 className="font-semibold text-green-900 mb-1">SVG Editor</h3>
              <p className="text-sm text-green-700">
                Edit and customize SVG files online
              </p>
            </Link>
            
            <Link
              href="/learn"
              className="block p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <h3 className="font-semibold text-amber-900 mb-1">Learn About SVG</h3>
              <p className="text-sm text-amber-700">
                Tutorials and guides for SVG
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button asChild size="lg">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
        </Button>
        
        <Button variant="outline" asChild size="lg">
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Visit Our Blog
          </Link>
        </Button>
      </div>
    </div>
  );
}