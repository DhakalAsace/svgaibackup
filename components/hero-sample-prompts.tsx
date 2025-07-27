import { memo } from 'react'

interface SamplePromptsProps {
  onSelectPrompt: (prompt: string) => void
}

const samplePrompts = [
  {
    label: "Cute Red Panda",
    prompt: "Adorable red panda sitting on bamboo branch, fluffy tail, warm orange and brown colors, kawaii style illustration."
  },
  {
    label: "Eco Brand Logo",
    prompt: "Minimal eco logo 'TerraBloom' with sprouting seedling icon, fresh green and charcoal text, clean lines."
  },
  {
    label: "Coffee Cup Line Art",
    prompt: "Single-line art of steaming coffee cup with swirling beans, monochrome dark brown."
  },
  {
    label: "Space Rocket",
    prompt: "Cartoon rocket soaring past planets and stars, flat style, blue space, red rocket, orange flames."
  }
]

const HeroSamplePrompts = memo(({ onSelectPrompt }: SamplePromptsProps) => {
  return (
    <div className="mt-8">
      <p className="text-center text-sm text-gray-600 mb-3">
        Try these sample prompts:
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {samplePrompts.map((sample) => (
          <button
            key={sample.label}
            onClick={() => onSelectPrompt(sample.prompt)}
            className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  )
})

HeroSamplePrompts.displayName = 'HeroSamplePrompts'

export default HeroSamplePrompts