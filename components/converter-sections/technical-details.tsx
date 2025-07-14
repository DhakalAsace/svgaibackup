"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PublicConverterConfig } from '@/app/convert/public-converter-config'

interface TechnicalDetailsProps {
  config: PublicConverterConfig
  content: {
    technicalDetailsSection: {
      conversionProcess: string
      fromFormatDetails: string
      toFormatDetails: string
    }
    comparisonSection: {
      title: string
      comparisons: Array<{
        aspect: string
        fromFormat: string
        toFormat: string
      }>
    }
  }
}

export default function TechnicalDetails({ config, content }: TechnicalDetailsProps) {
  return (
    <>
      {/* Technical Details */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Technical Details
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  {content.technicalDetailsSection.conversionProcess}
                </p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="min-h-[150px]">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {config.fromFormat} Technical Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {content.technicalDetailsSection.fromFormatDetails}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="min-h-[150px]">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {config.toFormat} Technical Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {content.technicalDetailsSection.toFormatDetails}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Format Comparison Table */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {content.comparisonSection.title}
          </h2>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-6 py-4 text-left font-semibold">Aspect</th>
                  <th className="px-6 py-4 text-left font-semibold">{config.fromFormat}</th>
                  <th className="px-6 py-4 text-left font-semibold">{config.toFormat}</th>
                </tr>
              </thead>
              <tbody>
                {content.comparisonSection.comparisons.map((comparison, index) => (
                  <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium">{comparison.aspect}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {comparison.fromFormat}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {comparison.toFormat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}