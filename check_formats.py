import json

# Our converter formats from config
our_formats = [
    'png', 'svg', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'ico', 'heic',
    'eps', 'ai', 'pdf', 'dxf', 'stl', 'emf', 'wmf', 'html', 'ttf', 'avif', 'mp4'
]

# Load CloudConvert data
with open('cloudconvert_formats.json', 'r') as f:
    data = json.load(f)
    conversions = data['data']

# Check each format pair
print('=== CloudConvert Format Support Analysis ===\n')

supported_conversions = []
unsupported_conversions = []

for from_fmt in our_formats:
    for to_fmt in our_formats:
        if from_fmt != to_fmt:
            # Check if this conversion exists
            found = False
            credits = 0
            engine = ""
            for conv in conversions:
                if (conv['input_format'].lower() == from_fmt.lower() and 
                    conv['output_format'].lower() == to_fmt.lower()):
                    found = True
                    credits = conv.get('credits', 1)
                    engine = conv.get('engine', 'unknown')
                    break
            
            conversion_key = f"{from_fmt.upper()} → {to_fmt.upper()}"
            if found:
                supported_conversions.append({
                    'conversion': conversion_key,
                    'credits': credits,
                    'engine': engine
                })
            else:
                unsupported_conversions.append(conversion_key)

print("✅ SUPPORTED CONVERSIONS:")
for conv in supported_conversions:
    print(f"   {conv['conversion']} (Credits: {conv['credits']}, Engine: {conv['engine']})")

print(f"\n❌ UNSUPPORTED CONVERSIONS:")
for conv in unsupported_conversions:
    print(f"   {conv}")

print(f"\n=== SUMMARY ===")
print(f"Total conversions checked: {len(supported_conversions) + len(unsupported_conversions)}")
print(f"Supported by CloudConvert: {len(supported_conversions)}")
print(f"Unsupported: {len(unsupported_conversions)}")
print(f"Support percentage: {(len(supported_conversions)/(len(supported_conversions) + len(unsupported_conversions)))*100:.1f}%")