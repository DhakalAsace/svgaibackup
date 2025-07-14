'use client';

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, AlertCircle, FileQuestion, Mail } from "lucide-react";
import { findSimilarUrls, getCategoryRecommendations, popularConverters } from "@/lib/redirects";

// Client metadata export not supported in client components, moved to layout
export default function NotFound() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [similarUrls, setSimilarUrls] = useState<string[]>([]);
  const [categoryRecs, setCategoryRecs] = useState<string[]>([]);

  useEffect(() => {
    // Get similar URLs and category recommendations based on current pathname
    if (pathname) {
      setSimilarUrls(findSimilarUrls(pathname));
      setCategoryRecs(getCategoryRecommendations(pathname));
    }
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search for matching URLs
      const results = findSimilarUrls(searchQuery, 8);
      setSearchResults(results);
    }
  };

  const formatUrlForDisplay = (url: string) => {
    // Extract the meaningful part of the URL for display
    const parts = url.split('/').filter(Boolean);
    if (parts[0] === 'convert' && parts.length > 1) {
      return parts[1].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    if (parts[0] === 'gallery' && parts.length > 1) {
      return parts[1].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ') + ' Gallery';
    }
    if (parts[0] === 'learn' && parts.length > 1) {
      return parts[1].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return parts.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' > ');
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <FileQuestion className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-2">
          We couldn't find the page you're looking for
        </p>
        <p className="text-sm text-gray-500">
          Requested URL: <code className="bg-gray-100 px-2 py-1 rounded">{pathname}</code>
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search for a page
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Try 'png to svg' or 'svg editor'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
          
          {searchResults.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Search results:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {searchResults.map((url) => (
                  <Link
                    key={url}
                    href={url}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-blue-600 hover:underline">
                      {formatUrlForDisplay(url)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Suggested Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Did you mean?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Based on the URL you tried, you might be looking for:
            </p>
            <div className="space-y-2">
              {similarUrls.map((url) => (
                <Link
                  key={url}
                  href={url}
                  className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-600 font-medium">
                    {formatUrlForDisplay(url)}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              You might also be interested in:
            </p>
            <div className="space-y-2">
              {categoryRecs.map((url) => (
                <Link
                  key={url}
                  href={url}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-700">
                    {formatUrlForDisplay(url)}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Converters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Popular Converters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularConverters.map((converter) => (
              <Link
                key={converter.href}
                href={converter.href}
                className="group p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {converter.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {converter.searches} searches
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button asChild size="lg">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go to Homepage
          </Link>
        </Button>
        
        <Button variant="outline" asChild size="lg">
          <Link href="/convert" className="flex items-center gap-2">
            View All Converters
          </Link>
        </Button>
      </div>

      {/* Report Section */}
      <div className="mt-12 text-center">
        <Card className="inline-block">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-amber-600 mb-3">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Found a broken link?</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Help us improve by reporting this issue
            </p>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="mailto:support@svgai.org?subject=Broken Link Report"
                className="flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  const url = window.location.href;
                  window.location.href = `mailto:support@svgai.org?subject=Broken Link Report&body=I found a broken link: ${encodeURIComponent(url)}`;
                }}
              >
                <Mail className="w-4 h-4" />
                Report Broken Link
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}