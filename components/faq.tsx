import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export default function Faq() {
  const faqs = [
    {
      question: "How does the AI SVG generator work?",
      answer:
        "Our AI SVG generator uses advanced machine learning models to convert your text descriptions into SVG graphics. Simply describe what you want, and our text to SVG AI will generate a vector graphic based on your description. You can then customize it with our tools and download it for use in your projects.",
    },
    {
      question: "Do I need design skills to use the SVG generator AI?",
      answer:
        "Not at all! Our AI SVG generator is designed to be accessible to everyone, regardless of design experience. Our AI handles the complex design work based on your text descriptions, making it easy for anyone to create professional-looking vector graphics.",
    },
    {
      question: "What file formats can I download?",
      answer:
        "All users can download SVG and PNG formats.",
    },
    {
      question: "Can I use the generated SVGs commercially?",
      answer:
        "Yes! All SVGs generated with our AI SVG generator are royalty-free and can be used for both personal and commercial projects. You own the rights to the graphics you create with our tool.",
    },
    {
      question: "Is there a limit to how many SVGs I can generate?",
      answer:
        "Free users can try 1 generation without signup. Sign up for a free account to get 3 total generations per month. Starter plan offers 100 credits per month for $19, and Pro plan includes 350 credits per month for $39.",
    },
    {
      question: "How accurate is the AI at interpreting my descriptions?",
      answer:
        "Our AI has been trained on millions of vector graphics and can understand a wide range of descriptions. For best results, be specific about shapes, colors, and style in your prompts. You can always refine the results using our editing tools.",
    },
  ]

  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold bg-gradient-to-r from-[#FF7043]/10 to-[#FFA726]/10 text-[#FF7043]">
            FAQ
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800">
            Text to SVG AI Generator: Common Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to frequently asked questions about using our AI SVG generator.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 md:p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-gray-200/80">
                <AccordionTrigger className="text-left text-gray-800 font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm pt-1 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 md:mt-16 text-center bg-white rounded-xl p-8 max-w-3xl mx-auto border border-gray-200/80 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is ready to help you with any questions you might have about our text to SVG AI generator.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 transition-colors">
              Read Documentation
            </Button>
            <Button className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white hover:opacity-90 transition-opacity">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
