"use client"

import { Edit, PaintBucket, Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function HowItWorks() {
  const router = useRouter()
  
  const steps = [
    {
      icon: Edit,
      title: "1. Describe Your Icon",
      description: "Type a simple prompt describing the icon you need, like 'settings gear' or 'shopping cart'."
    },
    {
      icon: PaintBucket,
      title: "2. Customize the Style",
      description: "Choose from multiple icon styles including outline, colored shapes, gradients, and more."
    },
    {
      icon: Download,
      title: "3. Download Your SVG",
      description: "Get your professional vector icon in SVG format, ready to use in any project."
    }
  ]
  
  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">How Our AI Icon Generator Works</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Creating professional vector icons with our AI icon maker is simple and takes just seconds. Follow these three easy steps:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF0E6] rounded-full flex items-center justify-center mb-4">
                <step.icon className="h-8 w-8 text-[#FF7043]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#4E342E]">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Button 
            onClick={() => router.push('#top')}
            className="py-3 px-8 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-bold text-lg rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40 transition-all"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Try the Icon Generator
          </Button>
        </div>
      </div>
    </section>
  )
}