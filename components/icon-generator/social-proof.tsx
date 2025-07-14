"use client"

import { Users, Star, Award } from "lucide-react"

export default function SocialProof() {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#4E342E]">Trusted by Icon Designers Worldwide</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join over 10,000 designers, developers, and marketers who use our AI icon generator to create professional vector graphics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FFF8F6] rounded-xl p-6 flex flex-col items-center text-center">
            <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Users className="h-6 w-6 text-[#FF7043]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#4E342E]">10,000+ Users</h3>
            <p className="text-gray-600">Creators from various industries rely on our AI icon generator daily.</p>
          </div>

          <div className="bg-[#FFF8F6] rounded-xl p-6 flex flex-col items-center text-center">
            <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Star className="h-6 w-6 text-[#FF7043]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#4E342E]">4.8/5 Rating</h3>
            <p className="text-gray-600">Our AI icon generator is highly rated for its quality and ease of use.</p>
          </div>

          <div className="bg-[#FFF8F6] rounded-xl p-6 flex flex-col items-center text-center">
            <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Award className="h-6 w-6 text-[#FF7043]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#4E342E]">50,000+ Icons</h3>
            <p className="text-gray-600">Over fifty thousand professional SVG icons created with our AI generator.</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF7043] to-[#FFA726] text-white flex items-center justify-center font-bold text-xl mr-4">
                SJ
              </div>
              <div>
                <h4 className="font-semibold text-[#4E342E]">Sarah Johnson</h4>
                <p className="text-sm text-gray-500">UI/UX Designer</p>
              </div>
            </div>
            <p className="text-gray-600 italic">"This AI icon generator has transformed my workflow. I can create consistent icon sets for my design systems in minutes instead of hours."</p>
            <div className="flex mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2196F3] to-[#64B5F6] text-white flex items-center justify-center font-bold text-xl mr-4">
                DC
              </div>
              <div>
                <h4 className="font-semibold text-[#4E342E]">David Chen</h4>
                <p className="text-sm text-gray-500">App Developer</p>
              </div>
            </div>
            <p className="text-gray-600 italic">"The vector quality is impressive - I use this AI icon maker for all my app projects now. Clean SVGs that scale perfectly across all devices."</p>
            <div className="flex mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>

          <div className="hidden lg:block bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8E24AA] to-[#BA68C8] text-white flex items-center justify-center font-bold text-xl mr-4">
                MG
              </div>
              <div>
                <h4 className="font-semibold text-[#4E342E]">Maria Garcia</h4>
                <p className="text-sm text-gray-500">Marketing Director</p>
              </div>
            </div>
            <p className="text-gray-600 italic">"We needed custom icons for our brand materials, and this free AI icon generator delivered exactly what we needed without any design costs."</p>
            <div className="flex mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}