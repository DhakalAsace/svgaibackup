"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Sparkles, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HeroSection() {
  // Sample prompts for inspiration - include keywords for SEO
  const samplePrompts = [
    "Modern shopping cart icon for e-commerce",
    "Professional gear settings icon",
    "Professional gear settings icon",
    "Clean search magnifying glass UI icon",
    "Elegant music note icon",
    "App icon for productivity timer with pomodoro technique."
  ];
  
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [style, setStyle] = useState("icon");
  const [size, setSize] = useState("1024x1024");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const router = useRouter();
  
  // Style options available in the API
  const styleOptions = [
    { value: "icon", label: "Standard Icon" },
    { value: "icon/broken_line", label: "Broken Line" },
    { value: "icon/colored_outline", label: "Colored Outline" },
    { value: "icon/colored_shapes", label: "Colored Shapes" },
    { value: "icon/colored_shapes_gradient", label: "Colored Shapes Gradient" },
    { value: "icon/doodle_fill", label: "Doodle Fill" },
    { value: "icon/doodle_offset_fill", label: "Doodle Offset Fill" },
    { value: "icon/offset_fill", label: "Offset Fill" },
    { value: "icon/outline", label: "Outline" },
    { value: "icon/outline_gradient", label: "Outline Gradient" },
    { value: "icon/uneven_fill", label: "Uneven Fill" }
  ];
  
  // Size options
  const sizeOptions = [
    "1024x1024", "1365x1024", "1024x1365", "1536x1024", 
    "1024x1536", "1820x1024", "1024x1820", "1024x2048", 
    "2048x1024", "1434x1024", "1024x1434", "1024x1280", 
    "1280x1024", "1024x1707", "1707x1024"
  ];
  
  // Aspect ratio options
  const aspectRatioOptions = [
    "1:1", "4:3", "3:4", "3:2", "2:3", "16:9", "9:16", 
    "1:2", "2:1", "7:5", "5:7", "4:5", "5:4", "3:5", "5:3",
    "Not set"
  ];
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError("");
    
    try {
      const response = await fetch("/api/generate-icon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt,
          style, // Use selected style
          size, // Use selected size
          aspect_ratio: aspectRatio // Use selected aspect ratio
        }),
      });
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        throw new Error(`Failed to parse server response (Status: ${response.status})`);
      }
      
      if (response.status === 429) {
        setError(responseData.error || "You've reached your daily generation limit. Please try again tomorrow.");
        setIsGenerating(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || `Failed to generate icon (Status: ${response.status})`);
      }
      
      if (responseData.success) {
        // Extract data from the response
        const data = responseData.data || {};
        
        if (data.svgUrl) {
          const { svgUrl, remainingGenerations } = data;
          
          // Store the SVG URL in session storage before navigating
          console.log('[HeroSection] Storing SVG URL in sessionStorage:', svgUrl);
          sessionStorage.setItem('resultSvgUrl', svgUrl);

          // Keep other relevant info in query params, but remove svgUrl
          const queryParams = new URLSearchParams();
          if (remainingGenerations !== undefined) {
            queryParams.set('remaining', remainingGenerations.toString());
          }
          queryParams.set('prompt', prompt);
          queryParams.set('type', 'icon');

          const pushPath = `/results?${queryParams.toString()}`;
          console.log('[HeroSection] Pushing path:', pushPath);
          router.push(pushPath);
        } else {
          console.error("API response indicates success but SVG URL is missing:", responseData);
          throw new Error("The icon was generated but the URL was not returned correctly. Please try again.");
        }
      } else {
        throw new Error(responseData.error || "Failed to get SVG URL from the server.");
      }
    } catch (err) {
      console.error("Error in generation process:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to generate icon";
      
      if (errMsg.includes("504") || errMsg.includes("timeout") || errMsg.includes("timed out")) {
        setError("Icon generation timed out. The AI model typically takes 15-30 seconds to generate SVGs. Please try again when the AI service is less busy.");
      } else {
        setError(errMsg);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#FFF8F6] to-white py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Award badge */}
        <div className="flex justify-center mb-8">
          <div className="relative h-12 flex items-center justify-center w-44">
            <Image 
              src="/laurel.svg" 
              alt="AI Icon Generator award badge" 
              width={156} 
              height={80}
              priority={true}
              className="object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none" 
            />
            <div className="flex flex-col items-center justify-center z-10">
              <span className="text-[#000000] font-bold text-sm">#1 Rated</span>
              <span className="text-[#000000] font-bold text-sm">Icon Generator</span>
            </div>
          </div>
        </div>
        
        {/* Main heading with exact content as specified in content strategy */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 leading-tight">
          <span className="text-[#4E342E]">AI </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7043] to-[#FFA726]">Icon Generator</span>
          <span className="text-[#4E342E]">: Create Professional Vector Icons in Seconds</span>
        </h1>
        
        <h2 className="text-center text-[#4E342E] text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Generate custom vector icons for your apps, websites, and brands — completely free, no signup required. Our AI-powered free icon creator turns simple text prompts into professional SVG icons instantly.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Main input area */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <Textarea
                id="prompt-input"
                className="w-full rounded-lg border border-gray-200 bg-[#FAFAFA] py-4 px-4 text-base md:text-lg text-[#4E342E] placeholder-gray-400 focus:border-[#FF7043] focus:outline-none focus:ring-1 focus:ring-[#FF7043]/30 resize-none min-h-[100px] transition-all"
                placeholder="Try: settings icon, juice bottle icon, heart health icon, shopping cart icon, coffee cup icon, book icon..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                aria-label="Enter text prompt for AI icon generation"
                autoFocus
              />
              
              {/* Sample prompts for better UX and keyword inclusion */}
              <div className="mt-3 flex flex-wrap gap-2">
                {samplePrompts.map((samplePrompt, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(samplePrompt)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                  >
                    {samplePrompt.substring(0, 20)}...
                  </button>
                ))}
              </div>
              
              {/* Advanced Settings Toggle Button */}
              <button 
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="mt-4 flex items-center justify-center text-sm font-medium text-[#6D4C41] hover:text-[#FF7043] transition-colors"
              >
                <Settings size={16} className="mr-2" />
                Advanced Settings
              </button>
              
              {/* Collapsible Advanced Options Section */}
              {showAdvancedOptions && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                  {/* Style dropdown */}
                  <div>
                    <label htmlFor="style-select" className="block text-sm font-medium text-gray-700 mb-1">Icon Style</label>
                    <select
                      id="style-select"
                      className="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 py-1.5"
                      value={style}
                      onChange={e => setStyle(e.target.value)}
                    >
                      {styleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Size dropdown */}
                  <div>
                    <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <select
                      id="size-select"
                      className="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 py-1.5"
                      value={size}
                      onChange={e => setSize(e.target.value)}
                    >
                      {sizeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Aspect Ratio dropdown */}
                  <div>
                    <label htmlFor="aspect-ratio-select" className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                    <select
                      id="aspect-ratio-select"
                      className="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 py-1.5"
                      value={aspectRatio}
                      onChange={e => setAspectRatio(e.target.value)}
                    >
                      {aspectRatioOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Generate button */}
              <button
                className="w-full mt-5 py-3.5 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-bold text-base rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin mr-2 h-5 w-5" />
                    Creating your icon (15-30 seconds)...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate My Icon Now
                  </span>
                )}
              </button>
              
              {/* Error message */}
              {error && (
                <div className="mt-3 text-sm text-[#D84315] bg-[#FFF3F0] p-3 rounded-md border border-[#FFCCBC]">
                  {error}
                </div>
              )}
            </div>
          </div>
          
          {/* Example showcase */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-base font-bold text-[#4E342E] mb-4">Example Icons</h2>
              
              {/* Grid of example icons */}
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-[#FAFAFA] rounded-lg flex items-center justify-center border border-gray-100 p-4">
                  <Image 
                    src="/icon-generator-examples/search-magnifying-glass-icon.svg" 
                    alt="AI-generated search magnifying glass icon for UI interfaces"
                    width={200}
                    height={200}
                    className="w-5/6 h-5/6 object-contain"
                  />
                </div>
                <div className="aspect-square bg-[#FAFAFA] rounded-lg flex items-center justify-center border border-gray-100 p-4">
                  <Image 
                    src="/icon-generator-examples/notification-bell-with-subtle-animation-indicators.svg" 
                    alt="AI-generated notification bell icon with animation indicators"
                    width={200}
                    height={200}
                    className="w-5/6 h-5/6 object-contain"
                  />
                </div>
                <div className="aspect-square bg-[#FAFAFA] rounded-lg flex items-center justify-center border border-gray-100 p-4">
                  <Image 
                    src="/icon-generator-examples/shopping-cart-icon.svg" 
                    alt="AI-generated shopping cart icon for e-commerce websites"
                    width={200}
                    height={200}
                    className="w-5/6 h-5/6 object-contain"
                  />
                </div>
                <div className="aspect-square bg-[#FAFAFA] rounded-lg flex items-center justify-center border border-gray-100 p-4">
                  <Image 
                    src="/icon-generator-examples/productivity-timer-pomodoro-icon.svg" 
                    alt="AI-generated productivity timer pomodoro icon for task management apps"
                    width={200}
                    height={200}
                    className="w-5/6 h-5/6 object-contain"
                  />
                </div>
              </div>
              
              {/* Description with SEO keywords naturally incorporated */}
              <div className="mt-4">
                <p className="text-sm text-[#4E342E]">
                  Our free AI icon generator creates professional SVG icons with clean vector paths and consistent design elements. Unlike other icon makers, our AI vector icon creator delivers instantly usable results. Perfect for UI/UX design, app development, business applications, social media, and technology interfaces.
                </p>
                <div className="mt-2 text-sm flex flex-wrap gap-2">
                  <span className="text-[#FF7043] font-medium">Free icon creation</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-[#FF7043] font-medium">SVG vector format</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-[#FF7043] font-medium">AI-powered design</span>
                </div>
                
                {/* Links to blog posts for content cluster SEO */}
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <p className="text-xs text-[#4E342E] font-medium mb-2">Learn more about AI icons:</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <a href="/blog/best-ai-icon-tools" className="text-[#FF7043] hover:underline">Best AI Icon Tools</a>
                    <span className="text-gray-500">•</span>
                    <a href="/blog/ai-icon-maker-vs-traditional-design" className="text-[#FF7043] hover:underline">AI vs Traditional Design</a>
                    <span className="text-gray-500">•</span>
                    <a href="/blog/how-to-create-app-icons-with-ai" className="text-[#FF7043] hover:underline">App Icon Tutorial</a>
                    <span className="text-gray-500">•</span>
                    <a href="/blog/guide-ai-icon-creation" className="text-[#FF7043] hover:underline">Complete Guide</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}