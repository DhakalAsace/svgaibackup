import { memo } from 'react'
import { getSvgStyleOptions, getStyleTooltip } from "@/lib/style-mappings"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

const HeroAdvancedOptions = memo(() => {
  const styleOptions = getSvgStyleOptions()
  
  return (
    <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <select 
            className="w-full px-3 py-2 border rounded-md"
            defaultValue="modern"
          >
            {styleOptions.map(style => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colors
          </label>
          <select 
            className="w-full px-3 py-2 border rounded-md"
            defaultValue="auto"
          >
            <option value="auto">Auto (AI Decides)</option>
            <option value="vibrant">Vibrant</option>
            <option value="pastel">Pastel</option>
            <option value="monochrome">Monochrome</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <HelpCircle className="w-4 h-4" />
        <span>Advanced options help refine your AI-generated SVG</span>
      </div>
    </div>
  )
})

HeroAdvancedOptions.displayName = 'HeroAdvancedOptions'

export default HeroAdvancedOptions