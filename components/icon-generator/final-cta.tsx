"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function FinalCTA() {
  const router = useRouter()
  
  return (
    <section className="py-16 bg-gradient-to-br from-[#FFF8F6] to-white">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#4E342E]">
          Ready to Create Professional Icons in Seconds?
        </h2>
        
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of designers and developers using our AI icon generator to create beautiful vector graphics for their projects.
        </p>
        
        <Button 
          onClick={() => router.push('#top')}
          className="py-4 px-10 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-bold text-lg rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40 transition-all"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Generate My Icon Now
        </Button>
        
        <p className="mt-4 text-sm text-gray-500">
          Completely free, no signup required. Try it now!
        </p>
      </div>
    </section>
  )
}