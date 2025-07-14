import { Metadata } from "next"
import ConverterPageTemplate from "@/components/converter-page-template"
import { getConverterBySlug } from "@/app/convert/converter-config"
import { generateConverterMetadata } from "@/lib/seo/structured-data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, FileCode, Layers, Ruler, Building2, Zap, Crown } from "lucide-react"
import { SvgToDxfConverter } from "./svg-to-dxf-converter"

const converterConfig = getConverterBySlug("svg-to-dxf")!
const currentUrl = "https://svgai.org/convert/svg-to-dxf"

export const metadata: Metadata = generateConverterMetadata(converterConfig, currentUrl)

// Coming Soon Converter Component
function SvgToDxfComingSoon() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-[#FF7043] to-[#FFA726] rounded-full flex items-center justify-center mx-auto mb-6">
          <FileCode className="w-10 h-10 text-white" />
        </div>
        
        <Badge className="mb-4" variant="secondary">
          <Crown className="w-3 h-3 mr-1" />
          Coming Soon
        </Badge>
        
        <h2 className="text-2xl font-bold text-[#4E342E] mb-4">
          Professional CAD Conversion
        </h2>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We're developing advanced SVG to DXF conversion for professional CAD workflows. 
          Get notified when it's ready!
        </p>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            This converter requires complex CAD format handling. Try our AI SVG generator for custom technical drawings in the meantime.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/ai-icon-generator"
            className="px-6 py-3 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            Try AI SVG Generator
          </Link>
          <Link 
            href="/convert/svg-to-pdf"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            Try SVG to PDF Instead
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SvgToDxfConverterPage() {
  return (
    <ConverterPageTemplate
      title={converterConfig.metaTitle}
      description={converterConfig.metaDescription}
      keywords={converterConfig.keywords}
      converterConfig={converterConfig}
      converterType={{
        from: "svg",
        to: "dxf",
        fromFull: "SVG",
        toFull: "DXF"
      }}
      heroTitle="SVG to DXF Converter"
      heroSubtitle="Convert scalable vector graphics to AutoCAD DXF format for professional CAD workflows. Perfect for technical drawings and engineering projects."
      converterComponent={<SvgToDxfConverter />}
      features={[
        {
          title: "Professional CAD Format",
          description: "DXF (Drawing Exchange Format) is AutoCAD's standard for sharing vector graphics between CAD applications"
        },
        {
          title: "Technical Drawing Ready",
          description: "Preserve precise measurements and scaling information essential for engineering and architectural projects"
        },
        {
          title: "Layer Preservation",
          description: "Maintain SVG groups as DXF layers for organized technical drawings and easy editing in CAD software"
        },
        {
          title: "Industry Standard",
          description: "DXF files work with AutoCAD, SolidWorks, Fusion 360, and virtually all professional CAD applications"
        },
        {
          title: "Precision Engineering",
          description: "Maintain vector accuracy and dimensional precision required for manufacturing and construction"
        },
        {
          title: "Workflow Integration",
          description: "Seamlessly import converted files into your existing CAD workflow without data loss"
        }
      ]}
      howItWorksSteps={[
        {
          title: "Upload SVG File",
          description: "Select your SVG file containing technical drawings, logos, or vector graphics that need CAD compatibility."
        },
        {
          title: "Configure CAD Settings",
          description: "Set units, layer options, and precision settings to match your CAD workflow requirements."
        },
        {
          title: "Download DXF File",
          description: "Get your professional DXF file ready for import into AutoCAD, SolidWorks, or other CAD applications."
        }
      ]}
      faqs={[
        {
          question: "What is DXF format and why use it?",
          answer: "DXF (Drawing Exchange Format) is AutoCAD's open format for sharing vector graphics between CAD applications. It's essential for technical drawings, engineering projects, and manufacturing workflows where precise measurements matter."
        },
        {
          question: "Will my SVG maintain precision in DXF?",
          answer: "Yes, our converter preserves vector accuracy and dimensional precision. Technical drawings and measured graphics convert with full fidelity for professional CAD use."
        },
        {
          question: "Which CAD software supports DXF files?",
          answer: "Virtually all CAD applications support DXF including AutoCAD, SolidWorks, Fusion 360, Inventor, CATIA, Rhino, and many others. It's the universal CAD exchange format."
        },
        {
          question: "Can I convert technical drawings and blueprints?",
          answer: "Absolutely! SVG technical drawings convert perfectly to DXF, maintaining layers, dimensions, and precision required for engineering and architectural workflows."
        },
        {
          question: "Are SVG layers preserved as DXF layers?",
          answer: "Yes, SVG groups and organized elements are converted to DXF layers, making it easy to manage complex technical drawings in your CAD software."
        },
        {
          question: "What's the difference between SVG and DXF?",
          answer: "SVG is web-optimized vector graphics, while DXF is CAD-optimized with precise units, layers, and technical drawing features. DXF is essential for engineering and manufacturing."
        }
      ]}
      relatedConverters={[
        {
          title: "SVG to PDF Converter",
          href: "/convert/svg-to-pdf",
          description: "Convert SVG to PDF for technical documentation and printing"
        },
        {
          title: "DXF to SVG Converter",
          href: "/convert/dxf-to-svg",
          description: "Convert AutoCAD DXF files back to web-friendly SVG format"
        },
        {
          title: "SVG to EPS Converter",
          href: "/convert/svg-to-eps",
          description: "Professional vector format for print and design workflows"
        },
        {
          title: "AI Technical Drawing Generator",
          href: "/ai-icon-generator",
          description: "Create custom technical drawings and CAD graphics with AI"
        }
      ]}
      additionalSections={
        <section className="py-16 bg-gradient-to-br from-[#FFF8F6] to-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-[#4E342E] mb-6 text-center">
              Why Convert SVG to DXF for CAD?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <Building2 className="w-8 h-8 text-[#FF7043] mb-2" />
                  <CardTitle>Engineering & Architecture</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Convert architectural plans, technical schematics, and engineering drawings 
                    from web-friendly SVG to CAD-ready DXF format for professional workflows.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <Layers className="w-8 h-8 text-[#FF7043] mb-2" />
                  <CardTitle>Manufacturing & Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Import logos, part diagrams, and technical illustrations into CAD software 
                    for CNC machining, 3D printing, and manufacturing processes.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="font-semibold text-[#4E342E] mb-2 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Coming Soon: Advanced CAD Features
              </h3>
              <p className="text-gray-700">
                Our SVG to DXF converter is in development with features like unit conversion, 
                layer mapping, dimension preservation, and optimization for technical workflows.
              </p>
            </div>
          </div>
        </section>
      }
    />
  )
}

// Enable static generation for better performance
export const revalidate = 3600 // 1 hour