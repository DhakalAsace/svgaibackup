import { converterConfigs } from '../app/convert/converter-config'
import { getConvertersByTrafficCategory, getTrafficCategory } from '../lib/converter-traffic-groups'

console.log('Testing Converter Traffic Groups\n')

// Get grouped converters
const groups = getConvertersByTrafficCategory()

// Display summary
console.log('Traffic Category Summary:')
console.log(`- High Traffic (>10k searches): ${groups.high.length} converters`)
console.log(`- Medium Traffic (1k-10k searches): ${groups.medium.length} converters`)
console.log(`- Low Traffic (<1k searches): ${groups.low.length} converters`)
console.log(`- Total: ${groups.high.length + groups.medium.length + groups.low.length} converters\n`)

// Display converters by group
console.log('High Traffic Converters (15 min revalidation):')
groups.high.forEach(c => {
  console.log(`  - ${c.urlSlug}: ${c.searchVolume.toLocaleString()} searches`)
})

console.log('\nMedium Traffic Converters (30 min revalidation):')
groups.medium.forEach(c => {
  console.log(`  - ${c.urlSlug}: ${c.searchVolume.toLocaleString()} searches`)
})

console.log('\nLow Traffic Converters (60 min revalidation):')
groups.low.forEach(c => {
  console.log(`  - ${c.urlSlug}: ${c.searchVolume.toLocaleString()} searches`)
})

// Verify all converters are categorized
const allConverters = converterConfigs.filter(c => c.routeType === 'convert')
const categorizedCount = groups.high.length + groups.medium.length + groups.low.length
console.log(`\nVerification: ${categorizedCount} of ${allConverters.length} converters categorized`)

// Test specific converter lookups
console.log('\nTest Specific Converters:')
const testSlugs = ['png-to-svg', 'image-to-svg', 'heic-to-svg']
testSlugs.forEach(slug => {
  const converter = converterConfigs.find(c => c.urlSlug === slug)
  if (converter) {
    const category = getTrafficCategory(converter.searchVolume)
    console.log(`  - ${slug}: ${converter.searchVolume} searches → ${category} traffic`)
  }
})