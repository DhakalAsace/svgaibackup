"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function IconGeneratorFAQ() {
  const faqs = [
    {
      question: "What makes this the best AI icon generator?",
      answer: "Our AI icon generator uses advanced technology specifically optimized for SVG creation, producing cleaner, more professional vector icons than other tools. We offer 11 different icon styles, complete commercial usage rights, and professional SVG output - all completely free with no signup required."
    },
    {
      question: "How do I create vector icons with AI?",
      answer: "Creating vector icons with our AI is simple: 1) Type a descriptive prompt like 'settings gear icon' or 'shopping cart icon' 2) Choose your preferred style from our 11 options 3) Click 'Generate My Icon Now' 4) Download your professional SVG file. The entire process takes seconds, with no design skills required."
    },
    {
      question: "Can I use the free AI app icon generator commercially?",
      answer: "Yes, all icons created with our free AI icon generator come with full commercial usage rights. You can use them in apps, websites, marketing materials, print products, and any other commercial projects without restrictions or attribution requirements."
    },
    {
      question: "What icon styles does your AI icon maker support?",
      answer: "Our AI icon maker supports 11 different styles including outline, colored outline, outline gradient, colored shapes, colored shapes gradient, broken line, doodle fill, doodle offset fill, offset fill, uneven fill, and standard icon style. This variety allows you to find the perfect style for any project or brand."
    },
    {
      question: "How is this AI SVG generator different from other tools?",
      answer: "Our AI SVG generator produces true vector graphics in clean, optimized SVG format - not raster images. This means your icons will scale perfectly to any size without losing quality. We also offer more style options, faster generation times, and complete commercial usage rights without requiring signup or payment."
    },
    {
      question: "Can I create custom icon sets for my design system?",
      answer: "Absolutely! Our AI icon generator is perfect for creating consistent icon sets for design systems. Simply use similar prompts and select the same style for all icons to maintain visual consistency. Many designers use our tool to create complete icon libraries for their UI kits and design systems."
    },
    {
      question: "Where can I learn more about AI icon generation?",
      answer: <>Check out our detailed guides: <a href="/blog/best-ai-icon-tools" className="text-primary hover:underline">Best AI Icon Tools</a>, <a href="/blog/ai-icon-maker-vs-traditional-design" className="text-primary hover:underline">AI vs Traditional Design</a>, <a href="/blog/how-to-create-app-icons-with-ai" className="text-primary hover:underline">Creating App Icons with AI</a>, <a href="/blog/guide-ai-icon-creation" className="text-primary hover:underline">Complete Guide to AI Icon Creation</a>, and <a href="/blog/best-ai-icon-generators-compared" className="text-primary hover:underline">Best AI Icon Generators Compared</a>.</>
    }
  ]
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#4E342E]">Frequently Asked Questions</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Everything you need to know about our AI icon generator and how to create professional vector icons.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-[#4E342E]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}