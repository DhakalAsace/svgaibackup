// Gallery Data Management System
// This file manages the SVG files for each gallery theme

export interface GallerySVG {
  filename: string
  title: string
  description: string
  tags: string[]
  downloadCount?: number
  featured?: boolean
}

export interface GalleryData {
  theme: string
  svgs: GallerySVG[]
}

// Map gallery slugs to their folder names in public/gallery/
export const galleryFolderMap: Record<string, string> = {
  "heart-svg": "heart",
  "hello-kitty-svg": "hello-kitty",
  "svg-download": "svg-download",
  "bluey-svg": "bluey",
  "felt-flower-center-svg": "felt-flower-center",
  "svg-icons": "svg-icons",
  "beavis-butthead-svg": "beavis-butthead",
  "graduation-cap-svg": "graduation-cap",
  "happy-birthday-svg": "happy-birthday",
  "mama-svg": "mama",
  "paw-print-svg": "paw-print",
  "stability-ability-svg": "stability-ability",
  "anime-svg": "anime",
  "bride-to-be-svg": "bride-to-be",
  "give-it-to-god-svg": "give-it-to-god",
  "give-it-to-god-lion-svg": "give-it-to-god-lion",
  "back-to-school-svg": "back-to-school",
  "animal-svg": "animal"
}

// Gallery data with SVG metadata
export const galleryData: Record<string, GallerySVG[]> = {
  "heart-svg": [
    {
      filename: "simple-heart.svg",
      title: "Simple Heart Icon",
      description: "Clean and minimalist heart shape perfect for UI design, love symbols, and Valentine's Day projects. Scalable vector graphic ideal for web and print",
      tags: ["heart", "love", "icon", "minimal", "valentine", "simple", "clean"],
      downloadCount: 15420,
      featured: true
    },
    {
      filename: "decorative-heart.svg",
      title: "Decorative Heart Design",
      description: "Ornate heart with intricate floral patterns for romantic designs, wedding invitations, and love-themed decorations. Features detailed scrollwork",
      tags: ["heart", "decorative", "floral", "romance", "wedding", "ornate", "fancy"],
      downloadCount: 8932
    },
    {
      filename: "gradient-heart.svg",
      title: "Gradient Heart",
      description: "Modern heart with beautiful gradient fill transitioning from pink to red. Perfect for contemporary designs and digital artwork",
      tags: ["heart", "gradient", "modern", "colorful", "pink", "red", "contemporary"],
      downloadCount: 12567
    },
    {
      filename: "outline-heart.svg",
      title: "Heart Outline",
      description: "Simple heart outline perfect for coloring pages, crafts, and minimalist designs. Clean vector path ideal for cutting machines",
      tags: ["heart", "outline", "line art", "craft", "coloring", "minimal", "cricut"],
      downloadCount: 9854
    },
    {
      filename: "animated-heart.svg",
      title: "Animated Beating Heart",
      description: "Heart with CSS animation for interactive web designs. Features smooth pulsing animation perfect for loading screens and interactive elements",
      tags: ["heart", "animated", "interactive", "web", "css", "animation", "pulse"],
      downloadCount: 7621,
      featured: true
    },
    {
      filename: "broken-heart.svg",
      title: "Broken Heart Symbol",
      description: "Split heart design representing heartbreak or separation. Ideal for emotional graphics, break-up content, and dramatic designs",
      tags: ["heart", "broken", "split", "heartbreak", "emotion", "sad", "separation"],
      downloadCount: 6543
    },
    {
      filename: "double-heart.svg",
      title: "Double Hearts Intertwined",
      description: "Two hearts connected together symbolizing eternal love and unity. Perfect for wedding designs and couple-themed projects",
      tags: ["heart", "double", "love", "couple", "wedding", "unity", "together"],
      downloadCount: 11234
    },
    {
      filename: "heart-hands.svg",
      title: "Heart Hands Gesture",
      description: "Hands forming a heart shape, representing love and care. Great for healthcare, charity, and community-focused designs",
      tags: ["heart", "hands", "gesture", "care", "love", "charity", "healthcare"],
      downloadCount: 8976
    },
    {
      filename: "pixel-heart.svg",
      title: "Pixel Heart 8-Bit Style",
      description: "Retro 8-bit pixel art heart perfect for gaming designs, retro themes, and nostalgic projects. Classic video game aesthetic",
      tags: ["heart", "pixel", "8-bit", "retro", "gaming", "nostalgia", "digital"],
      downloadCount: 13456
    },
    {
      filename: "heart-arrow.svg",
      title: "Heart with Cupid's Arrow",
      description: "Classic heart pierced by Cupid's arrow, symbolizing falling in love. Ideal for Valentine's Day and romantic occasions",
      tags: ["heart", "arrow", "cupid", "valentine", "love", "romance", "classic"],
      downloadCount: 10234,
      featured: true
    },
    {
      filename: "geometric-heart.svg",
      title: "Geometric Heart Pattern",
      description: "Modern geometric interpretation of a heart using triangular shapes. Perfect for contemporary and minimalist design projects",
      tags: ["heart", "geometric", "modern", "triangles", "abstract", "contemporary", "minimal"],
      downloadCount: 7890
    },
    {
      filename: "watercolor-heart.svg",
      title: "Watercolor Heart Effect",
      description: "Soft watercolor-style heart with flowing colors and artistic brush effects. Beautiful for artistic and creative projects",
      tags: ["heart", "watercolor", "artistic", "paint", "soft", "creative", "brush"],
      downloadCount: 9123
    },
    {
      filename: "neon-heart.svg",
      title: "Neon Heart Sign",
      description: "Glowing neon-style heart perfect for nightlife, entertainment, and modern urban designs. Features realistic neon tube effect",
      tags: ["heart", "neon", "glow", "light", "urban", "nightlife", "modern"],
      downloadCount: 11567
    },
    {
      filename: "heart-wings.svg",
      title: "Winged Heart Design",
      description: "Heart with angel wings symbolizing freedom and spiritual love. Great for memorial designs and inspirational content",
      tags: ["heart", "wings", "angel", "freedom", "spiritual", "memorial", "flying"],
      downloadCount: 8234
    },
    {
      filename: "celtic-heart.svg",
      title: "Celtic Heart Knot",
      description: "Traditional Celtic knot pattern forming a heart shape. Perfect for Irish-themed designs and cultural projects",
      tags: ["heart", "celtic", "knot", "irish", "traditional", "culture", "pattern"],
      downloadCount: 6789
    },
    {
      filename: "heart-puzzle.svg",
      title: "Heart Puzzle Pieces",
      description: "Heart made of interlocking puzzle pieces representing unity and completeness. Ideal for team building and relationship content",
      tags: ["heart", "puzzle", "pieces", "unity", "team", "complete", "together"],
      downloadCount: 7456
    },
    {
      filename: "flaming-heart.svg",
      title: "Heart on Fire",
      description: "Passionate heart engulfed in flames representing intense love or desire. Dynamic design for bold and energetic projects",
      tags: ["heart", "fire", "flame", "passion", "hot", "intense", "energy"],
      downloadCount: 9876
    },
    {
      filename: "heart-ribbon.svg",
      title: "Heart with Ribbon Banner",
      description: "Heart decorated with a flowing ribbon banner for adding custom text. Perfect for personalized Valentine's cards and gifts",
      tags: ["heart", "ribbon", "banner", "text", "customize", "valentine", "gift"],
      downloadCount: 10543
    },
    {
      filename: "heart-crown.svg",
      title: "Crowned Heart Royal",
      description: "Regal heart topped with a crown symbolizing love royalty. Excellent for princess themes and luxury branding",
      tags: ["heart", "crown", "royal", "queen", "king", "luxury", "regal"],
      downloadCount: 8123
    },
    {
      filename: "heart-lock.svg",
      title: "Heart Lock and Key",
      description: "Heart-shaped padlock with key representing secure love and commitment. Great for security and relationship themes",
      tags: ["heart", "lock", "key", "secure", "commitment", "safety", "private"],
      downloadCount: 7890
    },
    {
      filename: "mandala-heart.svg",
      title: "Heart Mandala Design",
      description: "Intricate mandala pattern arranged in heart shape for meditation and spiritual designs. Features symmetrical patterns",
      tags: ["heart", "mandala", "spiritual", "meditation", "pattern", "intricate", "zen"],
      downloadCount: 9234
    },
    {
      filename: "heart-infinity.svg",
      title: "Heart Infinity Symbol",
      description: "Heart merged with infinity symbol representing eternal love. Perfect for anniversary and forever-love themes",
      tags: ["heart", "infinity", "eternal", "forever", "love", "anniversary", "endless"],
      downloadCount: 11234
    },
    {
      filename: "glitter-heart.svg",
      title: "Glitter Sparkle Heart",
      description: "Heart filled with sparkling glitter effect for glamorous and festive designs. Eye-catching and celebratory",
      tags: ["heart", "glitter", "sparkle", "glamour", "festive", "shiny", "celebration"],
      downloadCount: 8567
    },
    {
      filename: "heart-balloon.svg",
      title: "Heart Shaped Balloon",
      description: "Floating heart-shaped balloon with string, perfect for party decorations and celebration graphics",
      tags: ["heart", "balloon", "party", "float", "celebration", "birthday", "festive"],
      downloadCount: 9876
    },
    {
      filename: "tribal-heart.svg",
      title: "Tribal Heart Tattoo",
      description: "Bold tribal art style heart design perfect for tattoo designs and edgy graphics. Features sharp angular patterns",
      tags: ["heart", "tribal", "tattoo", "bold", "art", "edgy", "design"],
      downloadCount: 7234
    },
    {
      filename: "heart-music.svg",
      title: "Musical Heart Notes",
      description: "Heart composed of musical notes and symbols for music lovers. Ideal for concert posters and music-themed designs",
      tags: ["heart", "music", "notes", "melody", "song", "musical", "rhythm"],
      downloadCount: 8901
    },
    {
      filename: "heart-tree.svg",
      title: "Heart Tree of Life",
      description: "Tree with heart-shaped canopy representing love and growth. Perfect for environmental and family-themed projects",
      tags: ["heart", "tree", "life", "nature", "growth", "family", "environment"],
      downloadCount: 7678
    },
    {
      filename: "sketch-heart.svg",
      title: "Hand Drawn Heart Sketch",
      description: "Artistic hand-sketched heart with pencil texture effect. Great for personal and handmade design projects",
      tags: ["heart", "sketch", "hand drawn", "pencil", "artistic", "personal", "handmade"],
      downloadCount: 6543
    },
    {
      filename: "heart-star.svg",
      title: "Star Heart Combination",
      description: "Heart and star shapes combined for rating and favorite designs. Perfect for review systems and wishlist icons",
      tags: ["heart", "star", "favorite", "rating", "like", "wishlist", "review"],
      downloadCount: 10234
    },
    {
      filename: "mechanical-heart.svg",
      title: "Mechanical Gear Heart",
      description: "Steampunk-style heart made of gears and mechanical parts. Unique design for industrial and sci-fi themes",
      tags: ["heart", "mechanical", "gears", "steampunk", "industrial", "sci-fi", "metal"],
      downloadCount: 7890
    },
    {
      filename: "heart-emoji.svg",
      title: "Heart Emoji Style",
      description: "Classic red heart emoji design for digital communication and social media use. Universal symbol of love",
      tags: ["heart", "emoji", "red", "social", "digital", "communication", "symbol"],
      downloadCount: 14567
    },
    {
      filename: "origami-heart.svg",
      title: "Origami Paper Heart",
      description: "Folded paper heart design inspired by Japanese origami art. Delicate and artistic representation",
      tags: ["heart", "origami", "paper", "fold", "japanese", "art", "craft"],
      downloadCount: 8234
    },
    {
      filename: "heart-frame.svg",
      title: "Decorative Heart Frame",
      description: "Empty heart-shaped frame perfect for photos and custom content. Ornate border design for special occasions",
      tags: ["heart", "frame", "border", "photo", "decorative", "custom", "ornate"],
      downloadCount: 9123
    },
    {
      filename: "rainbow-heart.svg",
      title: "Rainbow Pride Heart",
      description: "Heart filled with rainbow colors celebrating love and diversity. Perfect for LGBTQ+ pride and inclusive designs",
      tags: ["heart", "rainbow", "pride", "lgbtq", "diversity", "colorful", "inclusive"],
      downloadCount: 11234
    },
    {
      filename: "heart-chain.svg",
      title: "Chain of Hearts",
      description: "Multiple hearts linked together like a chain, symbolizing connection and unity. Great for relationship themes",
      tags: ["heart", "chain", "connected", "link", "unity", "relationship", "together"],
      downloadCount: 7567
    },
    {
      filename: "crystal-heart.svg",
      title: "Crystal Heart Gem",
      description: "Faceted crystal heart design with diamond-like appearance. Luxurious and precious looking graphic",
      tags: ["heart", "crystal", "gem", "diamond", "luxury", "precious", "faceted"],
      downloadCount: 8901
    },
    {
      filename: "heart-swirl.svg",
      title: "Swirling Heart Pattern",
      description: "Heart with decorative swirl patterns for elegant and flowing designs. Features graceful curves and flourishes",
      tags: ["heart", "swirl", "pattern", "elegant", "flowing", "decorative", "curves"],
      downloadCount: 7234
    },
    {
      filename: "minimalist-heart-set.svg",
      title: "Minimalist Heart Collection",
      description: "Set of ultra-simple heart variations for modern UI design. Clean lines and geometric precision",
      tags: ["heart", "minimalist", "set", "collection", "ui", "modern", "simple"],
      downloadCount: 12345
    },
    {
      filename: "heart-burst.svg",
      title: "Bursting Heart Explosion",
      description: "Heart with radiating burst effect for exciting and energetic designs. Dynamic visual impact",
      tags: ["heart", "burst", "explosion", "radiate", "energy", "dynamic", "impact"],
      downloadCount: 8567
    },
    {
      filename: "vintage-heart.svg",
      title: "Vintage Victorian Heart",
      description: "Ornate Victorian-era inspired heart with intricate details. Perfect for vintage and antique themed designs",
      tags: ["heart", "vintage", "victorian", "antique", "ornate", "classic", "detailed"],
      downloadCount: 7890
    },
    {
      filename: "heart-compass.svg",
      title: "Heart Compass Direction",
      description: "Heart integrated with compass design showing love as direction. Meaningful design for journey and guidance themes",
      tags: ["heart", "compass", "direction", "journey", "guide", "navigation", "travel"],
      downloadCount: 6789
    },
    {
      filename: "mosaic-heart.svg",
      title: "Mosaic Tile Heart",
      description: "Heart created from colorful mosaic tile pattern. Artistic design perfect for Mediterranean and artistic themes",
      tags: ["heart", "mosaic", "tile", "pattern", "artistic", "colorful", "mediterranean"],
      downloadCount: 8234
    },
    {
      filename: "heart-shield.svg",
      title: "Heart Shield Protection",
      description: "Heart incorporated into protective shield design. Symbolizes protecting love and defensive strength",
      tags: ["heart", "shield", "protection", "defend", "strong", "guard", "safety"],
      downloadCount: 7456
    },
    {
      filename: "calligraphy-heart.svg",
      title: "Calligraphy Heart Script",
      description: "Elegant heart drawn with calligraphic strokes. Beautiful for wedding invitations and formal designs",
      tags: ["heart", "calligraphy", "script", "elegant", "wedding", "formal", "artistic"],
      downloadCount: 9876
    },
    {
      filename: "heart-mandala-complex.svg",
      title: "Complex Heart Mandala",
      description: "Highly detailed mandala pattern forming heart shape. Intricate design for coloring and meditation",
      tags: ["heart", "mandala", "complex", "detailed", "meditation", "coloring", "intricate"],
      downloadCount: 8901
    },
    {
      filename: "graffiti-heart.svg",
      title: "Graffiti Street Art Heart",
      description: "Urban street art style heart with spray paint effect. Bold and edgy design for modern youth culture",
      tags: ["heart", "graffiti", "street art", "urban", "spray paint", "edgy", "youth"],
      downloadCount: 10234
    },
    {
      filename: "heart-constellation.svg",
      title: "Heart Star Constellation",
      description: "Heart shape formed by connected stars like a constellation. Dreamy design for cosmic and astrology themes",
      tags: ["heart", "constellation", "stars", "cosmic", "astrology", "space", "dreamy"],
      downloadCount: 7890
    },
    {
      filename: "lace-heart.svg",
      title: "Delicate Lace Heart",
      description: "Heart with intricate lace pattern details. Feminine and delicate design for romantic occasions",
      tags: ["heart", "lace", "delicate", "feminine", "romantic", "intricate", "pattern"],
      downloadCount: 8567
    },
    {
      filename: "heart-wave.svg",
      title: "Heart Wave Pattern",
      description: "Heart integrated with flowing wave design. Smooth and rhythmic pattern for dynamic layouts",
      tags: ["heart", "wave", "flow", "rhythm", "pattern", "dynamic", "smooth"],
      downloadCount: 7234
    },
    {
      filename: "retro-heart-badge.svg",
      title: "Retro Heart Badge",
      description: "Vintage-style heart badge with retro typography. Perfect for nostalgic and throwback designs",
      tags: ["heart", "retro", "badge", "vintage", "typography", "nostalgic", "classic"],
      downloadCount: 9123
    }
  ],
  "hello-kitty-svg": [
    {
      filename: "hello-kitty-face.svg",
      title: "Hello Kitty Face",
      description: "Simple Hello Kitty face outline with characteristic features including whiskers and bow. Perfect for coloring pages and crafts",
      tags: ["hello kitty", "face", "character", "outline", "sanrio", "cute", "kawaii"],
      downloadCount: 18543,
      featured: true
    },
    {
      filename: "hello-kitty-bow.svg",
      title: "Hello Kitty with Bow",
      description: "Hello Kitty with her signature pink bow, the iconic accessory that makes her instantly recognizable. Great for party decorations",
      tags: ["hello kitty", "bow", "pink", "cute", "accessory", "signature", "sanrio"],
      downloadCount: 14321
    },
    {
      filename: "hello-kitty-birthday.svg",
      title: "Birthday Hello Kitty",
      description: "Hello Kitty celebrating with birthday cake and candles. Festive design perfect for birthday invitations and party supplies",
      tags: ["hello kitty", "birthday", "cake", "party", "celebration", "candles", "festive"],
      downloadCount: 12765
    },
    {
      filename: "hello-kitty-heart.svg",
      title: "Hello Kitty with Heart",
      description: "Hello Kitty holding a heart with sparkles, expressing love and affection. Ideal for Valentine's Day and love-themed projects",
      tags: ["hello kitty", "heart", "love", "valentine", "romance", "sparkles", "cute"],
      downloadCount: 11234
    },
    {
      filename: "hello-kitty-flower.svg",
      title: "Floral Hello Kitty",
      description: "Hello Kitty surrounded by beautiful flowers in a garden setting. Spring-themed design for nature and floral projects",
      tags: ["hello kitty", "flowers", "garden", "spring", "nature", "floral", "bloom"],
      downloadCount: 9876
    },
    {
      filename: "hello-kitty-rainbow.svg",
      title: "Rainbow Hello Kitty",
      description: "Hello Kitty with colorful rainbow background spreading joy and happiness. Perfect for cheerful and positive designs",
      tags: ["hello kitty", "rainbow", "colorful", "happy", "cheerful", "bright", "joy"],
      downloadCount: 10543
    },
    {
      filename: "hello-kitty-star.svg",
      title: "Starry Hello Kitty",
      description: "Hello Kitty surrounded by twinkling stars and celestial elements. Dreamy design for night-themed projects",
      tags: ["hello kitty", "star", "night", "celestial", "twinkle", "dreamy", "space"],
      downloadCount: 8765
    },
    {
      filename: "hello-kitty-wave.svg",
      title: "Waving Hello Kitty",
      description: "Friendly Hello Kitty waving hello with a warm greeting gesture. Perfect for welcome signs and friendly designs",
      tags: ["hello kitty", "wave", "greeting", "hello", "friendly", "welcome", "gesture"],
      downloadCount: 13456
    },
    {
      filename: "hello-kitty-balloon.svg",
      title: "Balloon Hello Kitty",
      description: "Hello Kitty holding colorful balloons floating in the air. Festive design for parties and celebrations",
      tags: ["hello kitty", "balloon", "party", "float", "celebration", "festive", "fun"],
      downloadCount: 9234
    },
    {
      filename: "hello-kitty-pattern.svg",
      title: "Hello Kitty Pattern",
      description: "Repeating Hello Kitty face pattern perfect for backgrounds and textile designs. Seamless tile for various applications",
      tags: ["hello kitty", "pattern", "repeat", "background", "textile", "seamless", "tile"],
      downloadCount: 7890
    },
    {
      filename: "hello-kitty-princess.svg",
      title: "Princess Hello Kitty",
      description: "Hello Kitty dressed as a princess with crown and royal attire. Magical design for fairy tale themes",
      tags: ["hello kitty", "princess", "crown", "royal", "fairy tale", "magic", "dress"],
      downloadCount: 11567,
      featured: true
    },
    {
      filename: "hello-kitty-angel.svg",
      title: "Angel Hello Kitty",
      description: "Hello Kitty with angel wings and halo, spreading love and protection. Spiritual and heavenly design",
      tags: ["hello kitty", "angel", "wings", "halo", "heaven", "spiritual", "divine"],
      downloadCount: 8432
    },
    {
      filename: "hello-kitty-school.svg",
      title: "School Hello Kitty",
      description: "Hello Kitty ready for school with backpack and books. Educational theme perfect for back-to-school projects",
      tags: ["hello kitty", "school", "education", "backpack", "books", "student", "learn"],
      downloadCount: 9123
    },
    {
      filename: "hello-kitty-music.svg",
      title: "Musical Hello Kitty",
      description: "Hello Kitty playing music with notes floating around. Perfect for music-themed designs and entertainment",
      tags: ["hello kitty", "music", "notes", "melody", "song", "entertainment", "musical"],
      downloadCount: 7654
    },
    {
      filename: "hello-kitty-summer.svg",
      title: "Summer Hello Kitty",
      description: "Hello Kitty enjoying summer with sunglasses and beach theme. Vacation and holiday design",
      tags: ["hello kitty", "summer", "beach", "sunglasses", "vacation", "sun", "holiday"],
      downloadCount: 10987
    },
    {
      filename: "hello-kitty-christmas.svg",
      title: "Christmas Hello Kitty",
      description: "Hello Kitty celebrating Christmas with Santa hat and festive decorations. Holiday season special",
      tags: ["hello kitty", "christmas", "santa", "holiday", "festive", "winter", "snow"],
      downloadCount: 12345
    },
    {
      filename: "hello-kitty-halloween.svg",
      title: "Halloween Hello Kitty",
      description: "Hello Kitty in Halloween costume with pumpkin and spooky elements. Perfect for October celebrations",
      tags: ["hello kitty", "halloween", "pumpkin", "costume", "spooky", "october", "trick or treat"],
      downloadCount: 8901
    },
    {
      filename: "hello-kitty-easter.svg",
      title: "Easter Hello Kitty",
      description: "Hello Kitty with Easter eggs and bunny ears celebrating spring holiday. Festive Easter design",
      tags: ["hello kitty", "easter", "eggs", "bunny", "spring", "holiday", "pastel"],
      downloadCount: 7456
    },
    {
      filename: "hello-kitty-chef.svg",
      title: "Chef Hello Kitty",
      description: "Hello Kitty as a chef with cooking hat and utensils. Culinary theme for food and cooking projects",
      tags: ["hello kitty", "chef", "cooking", "food", "kitchen", "culinary", "baking"],
      downloadCount: 6789
    },
    {
      filename: "hello-kitty-doctor.svg",
      title: "Doctor Hello Kitty",
      description: "Hello Kitty dressed as a doctor with stethoscope. Healthcare and medical themed design",
      tags: ["hello kitty", "doctor", "medical", "healthcare", "nurse", "hospital", "care"],
      downloadCount: 8234
    },
    {
      filename: "hello-kitty-sports.svg",
      title: "Sports Hello Kitty",
      description: "Athletic Hello Kitty playing various sports. Active lifestyle and fitness theme",
      tags: ["hello kitty", "sports", "athletic", "fitness", "active", "exercise", "play"],
      downloadCount: 7123
    },
    {
      filename: "hello-kitty-mermaid.svg",
      title: "Mermaid Hello Kitty",
      description: "Hello Kitty as a magical mermaid swimming under the sea. Fantasy ocean theme",
      tags: ["hello kitty", "mermaid", "ocean", "sea", "fantasy", "underwater", "magical"],
      downloadCount: 9567
    },
    {
      filename: "hello-kitty-unicorn.svg",
      title: "Unicorn Hello Kitty",
      description: "Hello Kitty with unicorn horn and magical rainbow. Mythical creature theme",
      tags: ["hello kitty", "unicorn", "magical", "rainbow", "fantasy", "mythical", "horn"],
      downloadCount: 10234
    },
    {
      filename: "hello-kitty-tea-party.svg",
      title: "Tea Party Hello Kitty",
      description: "Hello Kitty hosting an elegant tea party with teacup and treats. Afternoon tea theme",
      tags: ["hello kitty", "tea party", "teacup", "elegant", "afternoon", "treats", "social"],
      downloadCount: 8456
    },
    {
      filename: "hello-kitty-reading.svg",
      title: "Reading Hello Kitty",
      description: "Hello Kitty enjoying a good book with glasses. Educational and literary theme",
      tags: ["hello kitty", "reading", "book", "glasses", "education", "library", "study"],
      downloadCount: 7890
    },
    {
      filename: "hello-kitty-paint.svg",
      title: "Artist Hello Kitty",
      description: "Creative Hello Kitty painting with brush and palette. Artistic and creative theme",
      tags: ["hello kitty", "artist", "paint", "creative", "brush", "palette", "art"],
      downloadCount: 8123
    },
    {
      filename: "hello-kitty-dance.svg",
      title: "Dancing Hello Kitty",
      description: "Hello Kitty dancing with music notes and movement. Entertainment and performance theme",
      tags: ["hello kitty", "dance", "music", "movement", "performance", "ballet", "fun"],
      downloadCount: 9345
    },
    {
      filename: "hello-kitty-space.svg",
      title: "Astronaut Hello Kitty",
      description: "Hello Kitty exploring space as an astronaut with rocket and planets. Space adventure theme",
      tags: ["hello kitty", "space", "astronaut", "rocket", "planets", "adventure", "cosmos"],
      downloadCount: 7678
    },
    {
      filename: "hello-kitty-graduation.svg",
      title: "Graduate Hello Kitty",
      description: "Hello Kitty celebrating graduation with cap and diploma. Achievement and education milestone",
      tags: ["hello kitty", "graduation", "diploma", "cap", "achievement", "education", "success"],
      downloadCount: 8901
    },
    {
      filename: "hello-kitty-camera.svg",
      title: "Photographer Hello Kitty",
      description: "Hello Kitty taking photos with camera. Photography and memories theme",
      tags: ["hello kitty", "camera", "photo", "photographer", "memories", "picture", "capture"],
      downloadCount: 7234
    },
    {
      filename: "hello-kitty-travel.svg",
      title: "Traveler Hello Kitty",
      description: "Hello Kitty ready for travel with suitcase and passport. Adventure and vacation theme",
      tags: ["hello kitty", "travel", "suitcase", "adventure", "vacation", "journey", "explore"],
      downloadCount: 9876
    },
    {
      filename: "hello-kitty-garden.svg",
      title: "Gardener Hello Kitty",
      description: "Hello Kitty gardening with watering can and plants. Nature and gardening theme",
      tags: ["hello kitty", "garden", "plants", "nature", "watering", "grow", "green"],
      downloadCount: 6543
    },
    {
      filename: "hello-kitty-ice-cream.svg",
      title: "Ice Cream Hello Kitty",
      description: "Hello Kitty enjoying delicious ice cream cone. Sweet treats and dessert theme",
      tags: ["hello kitty", "ice cream", "dessert", "sweet", "treat", "summer", "cone"],
      downloadCount: 10123
    },
    {
      filename: "hello-kitty-butterfly.svg",
      title: "Butterfly Hello Kitty",
      description: "Hello Kitty with beautiful butterflies flying around. Nature and transformation theme",
      tags: ["hello kitty", "butterfly", "nature", "flying", "beautiful", "wings", "transform"],
      downloadCount: 8567
    },
    {
      filename: "hello-kitty-cupcake.svg",
      title: "Cupcake Hello Kitty",
      description: "Hello Kitty with delicious cupcakes and bakery treats. Sweet bakery theme",
      tags: ["hello kitty", "cupcake", "bakery", "sweet", "dessert", "frosting", "treat"],
      downloadCount: 9234
    },
    {
      filename: "hello-kitty-superhero.svg",
      title: "Superhero Hello Kitty",
      description: "Hello Kitty as a superhero with cape saving the day. Hero and empowerment theme",
      tags: ["hello kitty", "superhero", "cape", "hero", "power", "strong", "save"],
      downloadCount: 11234
    },
    {
      filename: "hello-kitty-pirate.svg",
      title: "Pirate Hello Kitty",
      description: "Adventure-seeking Hello Kitty as a pirate with treasure. Maritime adventure theme",
      tags: ["hello kitty", "pirate", "treasure", "adventure", "ship", "ocean", "ahoy"],
      downloadCount: 7890
    },
    {
      filename: "hello-kitty-fairy.svg",
      title: "Fairy Hello Kitty",
      description: "Magical Hello Kitty as a fairy with wand and sparkles. Fantasy and magic theme",
      tags: ["hello kitty", "fairy", "magic", "wand", "sparkles", "fantasy", "wings"],
      downloadCount: 9567
    },
    {
      filename: "hello-kitty-winter.svg",
      title: "Winter Hello Kitty",
      description: "Hello Kitty bundled up for winter with scarf and mittens. Cold weather and snow theme",
      tags: ["hello kitty", "winter", "snow", "scarf", "mittens", "cold", "cozy"],
      downloadCount: 8432
    },
    {
      filename: "hello-kitty-beach-ball.svg",
      title: "Beach Ball Hello Kitty",
      description: "Hello Kitty playing with colorful beach ball. Summer fun and beach activities",
      tags: ["hello kitty", "beach ball", "summer", "play", "fun", "colorful", "beach"],
      downloadCount: 7654
    },
    {
      filename: "hello-kitty-sleepy.svg",
      title: "Sleepy Hello Kitty",
      description: "Cute Hello Kitty ready for bedtime with pajamas and pillow. Sleep and rest theme",
      tags: ["hello kitty", "sleepy", "bedtime", "pajamas", "pillow", "rest", "night"],
      downloadCount: 8901
    },
    {
      filename: "hello-kitty-shopping.svg",
      title: "Shopping Hello Kitty",
      description: "Hello Kitty enjoying shopping with bags and gifts. Retail and fashion theme",
      tags: ["hello kitty", "shopping", "bags", "retail", "fashion", "gifts", "mall"],
      downloadCount: 9123
    },
    {
      filename: "hello-kitty-yoga.svg",
      title: "Yoga Hello Kitty",
      description: "Hello Kitty practicing yoga poses for wellness. Health and mindfulness theme",
      tags: ["hello kitty", "yoga", "wellness", "health", "mindfulness", "exercise", "zen"],
      downloadCount: 7456
    },
    {
      filename: "hello-kitty-gamer.svg",
      title: "Gamer Hello Kitty",
      description: "Hello Kitty playing video games with controller. Gaming and technology theme",
      tags: ["hello kitty", "gamer", "video games", "controller", "gaming", "play", "tech"],
      downloadCount: 10234
    },
    {
      filename: "hello-kitty-scientist.svg",
      title: "Scientist Hello Kitty",
      description: "Hello Kitty conducting experiments in lab coat. Science and discovery theme",
      tags: ["hello kitty", "scientist", "lab", "experiment", "science", "discovery", "research"],
      downloadCount: 7890
    },
    {
      filename: "hello-kitty-pilot.svg",
      title: "Pilot Hello Kitty",
      description: "Hello Kitty flying airplane as a pilot. Aviation and travel adventure",
      tags: ["hello kitty", "pilot", "airplane", "flying", "aviation", "travel", "sky"],
      downloadCount: 8234
    },
    {
      filename: "hello-kitty-ballerina.svg",
      title: "Ballerina Hello Kitty",
      description: "Graceful Hello Kitty in tutu performing ballet. Dance and elegance theme",
      tags: ["hello kitty", "ballerina", "ballet", "dance", "tutu", "graceful", "perform"],
      downloadCount: 9876
    },
    {
      filename: "hello-kitty-detective.svg",
      title: "Detective Hello Kitty",
      description: "Hello Kitty solving mysteries with magnifying glass. Mystery and investigation theme",
      tags: ["hello kitty", "detective", "mystery", "magnifying glass", "investigate", "solve", "clue"],
      downloadCount: 7123
    },
    {
      filename: "hello-kitty-birthday-cake.svg",
      title: "Birthday Cake Hello Kitty",
      description: "Hello Kitty popping out of giant birthday cake. Surprise party theme",
      tags: ["hello kitty", "birthday cake", "surprise", "party", "celebration", "candles", "fun"],
      downloadCount: 11567
    },
    {
      filename: "hello-kitty-movie-star.svg",
      title: "Movie Star Hello Kitty",
      description: "Glamorous Hello Kitty as a movie star with sunglasses. Hollywood and fame theme",
      tags: ["hello kitty", "movie star", "hollywood", "glamour", "fame", "celebrity", "star"],
      downloadCount: 8765
    }
  ],
  "svg-download": [
    {
      filename: "download-icon.svg",
      title: "Download Icon",
      description: "Clean download icon with arrow",
      tags: ["download", "arrow", "icon", "ui"],
      featured: true
    },
    {
      filename: "social-media-icons.svg",
      title: "Social Media Icons Set",
      description: "Collection of popular social media icons",
      tags: ["social", "media", "icons", "set"],
      featured: true
    },
    {
      filename: "business-icons.svg",
      title: "Business Icons Pack",
      description: "Professional business and office icons",
      tags: ["business", "office", "professional", "icons"]
    },
    {
      filename: "navigation-arrows.svg",
      title: "Navigation Arrows",
      description: "Various arrow designs for navigation",
      tags: ["arrows", "navigation", "direction", "ui"]
    },
    {
      filename: "weather-icons.svg",
      title: "Weather Icons Collection",
      description: "Complete weather symbol collection",
      tags: ["weather", "climate", "forecast", "icons"]
    }
  ],
  "bluey-svg": [
    {
      filename: "bluey-character.svg",
      title: "Bluey Character",
      description: "Simple blue dog character outline",
      tags: ["bluey", "dog", "character", "cartoon"],
      featured: true
    },
    {
      filename: "bingo-character.svg",
      title: "Bingo Character",
      description: "Orange dog character outline",
      tags: ["bingo", "dog", "character", "cartoon"]
    },
    {
      filename: "bluey-family.svg",
      title: "Bluey Family",
      description: "Complete cartoon dog family",
      tags: ["bluey", "family", "dogs", "cartoon"],
      featured: true
    },
    {
      filename: "bluey-playing.svg",
      title: "Playful Bluey",
      description: "Playful dog with toy ball",
      tags: ["bluey", "play", "toy", "fun"]
    },
    {
      filename: "bluey-birthday.svg",
      title: "Birthday Party Bluey",
      description: "Party theme with cake and decorations",
      tags: ["bluey", "birthday", "party", "celebration"]
    }
  ],
  "felt-flower-center-svg": [
    {
      filename: "rolled-rose-center.svg",
      title: "Rolled Rose Template",
      description: "Spiral template for rolled felt roses",
      tags: ["rose", "rolled", "template", "craft"],
      featured: true
    },
    {
      filename: "layered-daisy-center.svg",
      title: "Layered Daisy Template",
      description: "Concentric circles for layered flowers",
      tags: ["daisy", "layers", "template", "circles"]
    },
    {
      filename: "sunflower-center.svg",
      title: "Sunflower Center Pattern",
      description: "Dotted pattern for realistic sunflower centers",
      tags: ["sunflower", "pattern", "dots", "template"],
      featured: true
    },
    {
      filename: "multi-size-centers.svg",
      title: "Multi-Size Center Collection",
      description: "Various shapes and sizes for different flowers",
      tags: ["multi", "sizes", "variety", "collection"]
    },
    {
      filename: "fringed-center.svg",
      title: "Fringed Flower Center",
      description: "Radial fringe cutting guide template",
      tags: ["fringe", "cutting", "guide", "template"]
    }
  ],
  "svg-icons": [
    {
      filename: "home-icon.svg",
      title: "Home Icon",
      description: "Simple home/house icon for navigation",
      tags: ["home", "house", "navigation", "ui"],
      featured: true
    },
    {
      filename: "menu-hamburger.svg",
      title: "Hamburger Menu",
      description: "Three-line hamburger menu icon",
      tags: ["menu", "hamburger", "navigation", "mobile"]
    },
    {
      filename: "heart-icon.svg",
      title: "Heart Icon",
      description: "Heart shape for favorites and likes",
      tags: ["heart", "favorite", "like", "love"]
    },
    {
      filename: "star-rating.svg",
      title: "Star Rating Icon",
      description: "Star icon for ratings and reviews",
      tags: ["star", "rating", "review", "favorite"]
    },
    {
      filename: "share-icon.svg",
      title: "Share Icon",
      description: "Share icon with connected nodes",
      tags: ["share", "social", "network", "connect"]
    }
  ],
  "beavis-butthead-svg": [
    {
      filename: "retro-tv.svg",
      title: "Retro TV Screen",
      description: "Classic 90s television set with static effect",
      tags: ["retro", "tv", "90s", "vintage", "screen"],
      featured: true
    },
    {
      filename: "rock-hand.svg",
      title: "Rock On Hand Sign",
      description: "Rock and roll hand gesture symbol",
      tags: ["rock", "hand", "music", "metal", "gesture"]
    },
    {
      filename: "skull-cool.svg",
      title: "Cool Skull Design",
      description: "Edgy skull illustration with attitude",
      tags: ["skull", "cool", "edgy", "rock", "design"],
      featured: true
    },
    {
      filename: "flame-design.svg",
      title: "Fire Flame Pattern",
      description: "Bold flame design for rebellious styles",
      tags: ["fire", "flame", "hot", "design", "pattern"]
    },
    {
      filename: "lightning-bolt.svg",
      title: "Lightning Bolt",
      description: "Electric lightning bolt symbol",
      tags: ["lightning", "bolt", "electric", "power", "energy"]
    },
    {
      filename: "speech-bubble-yeah.svg",
      title: "Yeah Speech Bubble",
      description: "Comic style speech bubble with 'Yeah!'",
      tags: ["speech", "bubble", "comic", "yeah", "text"]
    }
  ],
  "graduation-cap-svg": [
    {
      filename: "graduation-cap-simple.svg",
      title: "Simple Graduation Cap",
      description: "Clean mortarboard design for academic celebrations",
      tags: ["graduation", "cap", "academic", "simple", "education"],
      featured: true
    },
    {
      filename: "graduation-cap-tassel.svg",
      title: "Cap with Tassel",
      description: "Graduation cap with flowing tassel detail",
      tags: ["graduation", "cap", "tassel", "ceremony", "achievement"]
    },
    {
      filename: "graduation-cap-diploma.svg",
      title: "Cap and Diploma",
      description: "Graduation cap paired with diploma scroll",
      tags: ["graduation", "cap", "diploma", "degree", "success"],
      featured: true
    },
    {
      filename: "graduation-cap-stars.svg",
      title: "Starry Graduation Cap",
      description: "Mortarboard decorated with celebration stars",
      tags: ["graduation", "cap", "stars", "celebration", "honor"]
    },
    {
      filename: "graduation-cap-confetti.svg",
      title: "Cap with Confetti",
      description: "Festive graduation cap with confetti accents",
      tags: ["graduation", "cap", "confetti", "party", "festive"]
    },
    {
      filename: "graduation-cap-year-2024.svg",
      title: "Class of 2024 Cap",
      description: "Graduation cap with 2024 year marking",
      tags: ["graduation", "cap", "2024", "class", "year"]
    },
    {
      filename: "graduation-cap-academic.svg",
      title: "Academic Excellence Cap",
      description: "Formal academic mortarboard design",
      tags: ["graduation", "cap", "academic", "formal", "excellence"]
    },
    {
      filename: "graduation-cap-celebration.svg",
      title: "Celebration Cap",
      description: "Joyful graduation cap with party elements",
      tags: ["graduation", "cap", "celebration", "joy", "party"]
    }
  ],
  "happy-birthday-svg": [
    {
      filename: "birthday-cake.svg",
      title: "Birthday Cake",
      description: "Classic birthday cake with candles",
      tags: ["birthday", "cake", "candles", "celebration", "dessert"],
      featured: true
    },
    {
      filename: "birthday-balloons.svg",
      title: "Party Balloons",
      description: "Colorful birthday balloons floating",
      tags: ["birthday", "balloons", "party", "colorful", "floating"]
    },
    {
      filename: "happy-birthday-text.svg",
      title: "Happy Birthday Text",
      description: "Decorative happy birthday lettering",
      tags: ["birthday", "text", "lettering", "typography", "greeting"],
      featured: true
    },
    {
      filename: "birthday-present.svg",
      title: "Gift Present",
      description: "Wrapped birthday gift with bow",
      tags: ["birthday", "present", "gift", "bow", "surprise"]
    },
    {
      filename: "birthday-hat.svg",
      title: "Party Hat",
      description: "Festive cone-shaped party hat",
      tags: ["birthday", "hat", "party", "cone", "festive"]
    },
    {
      filename: "birthday-confetti.svg",
      title: "Confetti Celebration",
      description: "Scattered birthday confetti pattern",
      tags: ["birthday", "confetti", "celebration", "pattern", "festive"]
    },
    {
      filename: "birthday-banner.svg",
      title: "Birthday Banner",
      description: "Decorative birthday party banner",
      tags: ["birthday", "banner", "decoration", "party", "bunting"]
    },
    {
      filename: "birthday-number-candles.svg",
      title: "Number Candles",
      description: "Birthday age number candles design",
      tags: ["birthday", "candles", "numbers", "age", "celebration"]
    }
  ],
  "mama-svg": [
    {
      filename: "mama-heart.svg",
      title: "Mama Heart",
      description: "Mama text with decorative heart",
      tags: ["mama", "heart", "love", "mother", "family"],
      featured: true
    },
    {
      filename: "mama-bear.svg",
      title: "Mama Bear",
      description: "Protective mama bear illustration",
      tags: ["mama", "bear", "protective", "mother", "family"]
    },
    {
      filename: "blessed-mama.svg",
      title: "Blessed Mama",
      description: "Blessed mama inspirational text design",
      tags: ["mama", "blessed", "inspirational", "faith", "mother"],
      featured: true
    },
    {
      filename: "mama-flowers.svg",
      title: "Mama with Flowers",
      description: "Mama text decorated with floral elements",
      tags: ["mama", "flowers", "floral", "decorative", "mother"]
    },
    {
      filename: "super-mama.svg",
      title: "Super Mama",
      description: "Superhero-inspired mama design",
      tags: ["mama", "super", "hero", "strong", "mother"]
    },
    {
      filename: "mama-crown.svg",
      title: "Queen Mama",
      description: "Mama with royal crown design",
      tags: ["mama", "crown", "queen", "royal", "mother"]
    },
    {
      filename: "mama-and-baby.svg",
      title: "Mama and Baby",
      description: "Sweet mama and baby silhouette",
      tags: ["mama", "baby", "family", "love", "silhouette"]
    },
    {
      filename: "mama-love.svg",
      title: "Mama Love",
      description: "Mama surrounded by love symbols",
      tags: ["mama", "love", "hearts", "affection", "mother"]
    }
  ],
  "paw-print-svg": [
    {
      filename: "dog-paw-print.svg",
      title: "Dog Paw Print",
      description: "Classic canine paw print design",
      tags: ["paw", "dog", "print", "pet", "animal"],
      featured: true
    },
    {
      filename: "cat-paw-print.svg",
      title: "Cat Paw Print",
      description: "Delicate feline paw print",
      tags: ["paw", "cat", "print", "pet", "feline"]
    },
    {
      filename: "heart-paw.svg",
      title: "Heart Paw Print",
      description: "Paw print with heart-shaped pad",
      tags: ["paw", "heart", "love", "pet", "cute"],
      featured: true
    },
    {
      filename: "paw-trail.svg",
      title: "Paw Trail",
      description: "Walking paw print trail pattern",
      tags: ["paw", "trail", "walking", "pattern", "path"]
    },
    {
      filename: "bear-paw.svg",
      title: "Bear Paw Print",
      description: "Large bear paw print with claws",
      tags: ["paw", "bear", "wild", "claws", "nature"]
    },
    {
      filename: "paw-circle.svg",
      title: "Paw in Circle",
      description: "Paw print enclosed in circular frame",
      tags: ["paw", "circle", "logo", "badge", "design"]
    },
    {
      filename: "puppy-paws.svg",
      title: "Puppy Paws",
      description: "Small cute puppy paw prints",
      tags: ["paw", "puppy", "small", "cute", "baby"]
    },
    {
      filename: "paw-pattern.svg",
      title: "Paw Pattern",
      description: "Repeating paw print pattern design",
      tags: ["paw", "pattern", "repeat", "texture", "design"]
    }
  ],
  "stability-ability-svg": [
    {
      filename: "sarcastic-text.svg",
      title: "Sarcastic Quote",
      description: "Witty sarcastic text design with attitude",
      tags: ["sarcastic", "quote", "humor", "text", "attitude"],
      featured: true
    },
    {
      filename: "dark-humor-badge.svg",
      title: "Dark Humor Badge",
      description: "Edgy badge design for dark humor lovers",
      tags: ["dark", "humor", "badge", "edgy", "funny"]
    },
    {
      filename: "chaos-symbol.svg",
      title: "Organized Chaos",
      description: "Symbol representing controlled chaos",
      tags: ["chaos", "symbol", "organized", "abstract", "design"]
    },
    {
      filename: "sassy-quote.svg",
      title: "Sassy Statement",
      description: "Bold sassy quote with decorative elements",
      tags: ["sassy", "quote", "bold", "statement", "attitude"],
      featured: true
    },
    {
      filename: "warning-sign.svg",
      title: "Sarcasm Warning",
      description: "Humorous warning sign about sarcasm ahead",
      tags: ["warning", "sign", "sarcasm", "humor", "caution"]
    },
    {
      filename: "funny-knife.svg",
      title: "Stabby Humor",
      description: "Dark humor knife design with witty text",
      tags: ["knife", "humor", "dark", "funny", "edgy"]
    }
  ],
  "anime-svg": [
    {
      filename: "anime-eyes.svg",
      title: "Anime Eyes",
      description: "Classic large anime-style eyes with sparkles",
      tags: ["anime", "eyes", "manga", "sparkle", "kawaii"],
      featured: true
    },
    {
      filename: "chibi-character.svg",
      title: "Chibi Character",
      description: "Cute chibi-style character outline",
      tags: ["chibi", "character", "cute", "anime", "kawaii"]
    },
    {
      filename: "sakura-petals.svg",
      title: "Sakura Petals",
      description: "Cherry blossom petals floating design",
      tags: ["sakura", "petals", "cherry", "blossom", "japanese"],
      featured: true
    },
    {
      filename: "anime-cat-ears.svg",
      title: "Cat Ears Headband",
      description: "Cute anime-style cat ears accessory",
      tags: ["cat", "ears", "anime", "accessory", "neko"]
    },
    {
      filename: "manga-sparkles.svg",
      title: "Manga Sparkles",
      description: "Decorative sparkle effects for manga art",
      tags: ["manga", "sparkles", "effects", "shiny", "decorative"]
    },
    {
      filename: "japanese-fan.svg",
      title: "Japanese Fan",
      description: "Traditional folding fan design",
      tags: ["japanese", "fan", "traditional", "culture", "accessory"]
    },
    {
      filename: "anime-heart.svg",
      title: "Anime Heart",
      description: "Stylized heart in anime art style",
      tags: ["anime", "heart", "love", "kawaii", "cute"]
    },
    {
      filename: "manga-speech.svg",
      title: "Manga Speech Bubble",
      description: "Comic-style speech bubble for manga",
      tags: ["manga", "speech", "bubble", "comic", "dialogue"]
    }
  ],
  "bride-to-be-svg": [
    {
      filename: "bride-to-be-text.svg",
      title: "Bride to Be Text",
      description: "Elegant bride to be lettering design",
      tags: ["bride", "text", "wedding", "lettering", "elegant"],
      featured: true
    },
    {
      filename: "bride-crown.svg",
      title: "Bridal Crown",
      description: "Princess crown for the bride-to-be",
      tags: ["bride", "crown", "tiara", "princess", "wedding"]
    },
    {
      filename: "bride-ring.svg",
      title: "Engagement Ring",
      description: "Sparkling engagement ring design",
      tags: ["ring", "engagement", "diamond", "wedding", "sparkle"],
      featured: true
    },
    {
      filename: "bride-veil.svg",
      title: "Bridal Veil",
      description: "Flowing wedding veil illustration",
      tags: ["veil", "wedding", "bridal", "flowing", "elegant"]
    },
    {
      filename: "bride-flowers.svg",
      title: "Bridal Bouquet",
      description: "Beautiful flower bouquet for bride",
      tags: ["flowers", "bouquet", "wedding", "bridal", "floral"]
    },
    {
      filename: "bride-heart.svg",
      title: "Bride Heart",
      description: "Heart design with bride elements",
      tags: ["heart", "bride", "love", "wedding", "romance"]
    }
  ],
  "give-it-to-god-svg": [
    {
      filename: "praying-hands.svg",
      title: "Praying Hands",
      description: "Reverent praying hands in prayer position",
      tags: ["prayer", "hands", "faith", "worship", "spiritual"],
      featured: true
    },
    {
      filename: "cross-simple.svg",
      title: "Simple Cross",
      description: "Clean and simple Christian cross",
      tags: ["cross", "christian", "faith", "simple", "religious"]
    },
    {
      filename: "faith-text.svg",
      title: "Faith Text Design",
      description: "Inspirational faith typography",
      tags: ["faith", "text", "typography", "inspirational", "belief"],
      featured: true
    },
    {
      filename: "dove-peace.svg",
      title: "Peace Dove",
      description: "Dove symbolizing peace and Holy Spirit",
      tags: ["dove", "peace", "spirit", "bird", "symbol"]
    },
    {
      filename: "bible-book.svg",
      title: "Holy Bible",
      description: "Open Bible book illustration",
      tags: ["bible", "book", "holy", "scripture", "religious"]
    },
    {
      filename: "heart-cross.svg",
      title: "Cross in Heart",
      description: "Christian cross within heart shape",
      tags: ["cross", "heart", "love", "faith", "christian"]
    }
  ],
  "give-it-to-god-lion-svg": [
    {
      filename: "lion-faith.svg",
      title: "Lion of Faith",
      description: "Majestic lion representing faith and courage",
      tags: ["lion", "faith", "courage", "strength", "majestic"],
      featured: true
    },
    {
      filename: "lion-cross.svg",
      title: "Lion with Cross",
      description: "Powerful lion combined with Christian cross",
      tags: ["lion", "cross", "christian", "power", "faith"]
    },
    {
      filename: "god-lion-text.svg",
      title: "God's Lion Text",
      description: "Inspirational text with lion imagery",
      tags: ["text", "lion", "god", "inspirational", "typography"],
      featured: true
    },
    {
      filename: "courage-lion.svg",
      title: "Courageous Lion",
      description: "Lion symbolizing divine courage",
      tags: ["lion", "courage", "brave", "divine", "strength"]
    },
    {
      filename: "strength-lion.svg",
      title: "Lion of Strength",
      description: "Mighty lion representing God's strength",
      tags: ["lion", "strength", "mighty", "power", "god"]
    },
    {
      filename: "lion-prayer.svg",
      title: "Praying Lion",
      description: "Lion in reverent prayer position",
      tags: ["lion", "prayer", "reverent", "worship", "spiritual"]
    }
  ],
  "back-to-school-svg": [
    {
      filename: "school-bus.svg",
      title: "School Bus",
      description: "Classic yellow school bus design",
      tags: ["school", "bus", "transport", "yellow", "education"],
      featured: true
    },
    {
      filename: "pencil-and-ruler.svg",
      title: "Pencil and Ruler",
      description: "Essential school supplies duo",
      tags: ["pencil", "ruler", "supplies", "tools", "education"]
    },
    {
      filename: "school-backpack.svg",
      title: "School Backpack",
      description: "Student backpack ready for learning",
      tags: ["backpack", "school", "bag", "student", "supplies"],
      featured: true
    },
    {
      filename: "apple-for-teacher.svg",
      title: "Apple for Teacher",
      description: "Traditional red apple for teacher",
      tags: ["apple", "teacher", "red", "traditional", "gift"]
    },
    {
      filename: "abc-letters.svg",
      title: "ABC Letters",
      description: "Alphabet letters for early learning",
      tags: ["abc", "letters", "alphabet", "learning", "elementary"]
    },
    {
      filename: "notebook-and-pen.svg",
      title: "Notebook and Pen",
      description: "Writing essentials for note-taking",
      tags: ["notebook", "pen", "writing", "notes", "study"]
    },
    {
      filename: "chalkboard.svg",
      title: "Classroom Chalkboard",
      description: "Traditional classroom chalkboard",
      tags: ["chalkboard", "classroom", "board", "teaching", "education"]
    },
    {
      filename: "school-bell.svg",
      title: "School Bell",
      description: "Classic school bell ringing",
      tags: ["bell", "school", "ring", "time", "classic"]
    }
  ],
  "animal-svg": [
    {
      filename: "lion-head.svg",
      title: "Lion Head",
      description: "Majestic lion head with flowing mane",
      tags: ["lion", "head", "mane", "wild", "king"],
      featured: true
    },
    {
      filename: "elephant-simple.svg",
      title: "Simple Elephant",
      description: "Minimalist elephant silhouette",
      tags: ["elephant", "simple", "minimal", "safari", "trunk"]
    },
    {
      filename: "fox-geometric.svg",
      title: "Geometric Fox",
      description: "Modern geometric fox design",
      tags: ["fox", "geometric", "modern", "angular", "stylized"],
      featured: true
    },
    {
      filename: "owl-wise.svg",
      title: "Wise Owl",
      description: "Wise owl perched on branch",
      tags: ["owl", "wise", "bird", "night", "wisdom"]
    },
    {
      filename: "butterfly-wings.svg",
      title: "Butterfly Wings",
      description: "Delicate butterfly with spread wings",
      tags: ["butterfly", "wings", "insect", "delicate", "nature"]
    },
    {
      filename: "dolphin-jump.svg",
      title: "Jumping Dolphin",
      description: "Playful dolphin leaping from water",
      tags: ["dolphin", "jump", "ocean", "marine", "playful"]
    },
    {
      filename: "turtle-cute.svg",
      title: "Cute Turtle",
      description: "Adorable turtle with patterned shell",
      tags: ["turtle", "cute", "shell", "slow", "reptile"]
    },
    {
      filename: "bird-flying.svg",
      title: "Flying Bird",
      description: "Bird in flight with spread wings",
      tags: ["bird", "flying", "wings", "freedom", "sky"]
    }
  ]
}

// Helper functions
export function getGallerySVGs(theme: string): GallerySVG[] {
  return galleryData[theme] || []
}

export function getGalleryFolderPath(theme: string): string {
  const folder = galleryFolderMap[theme]
  return folder ? `/gallery/${folder}/` : `/gallery/${theme}/`
}

export function getSVGFullPath(theme: string, filename: string): string {
  return `${getGalleryFolderPath(theme)}${filename}`
}

export function getFeaturedSVGs(theme: string): GallerySVG[] {
  return getGallerySVGs(theme).filter(svg => svg.featured)
}

export function searchGallerySVGs(theme: string, query: string): GallerySVG[] {
  const svgs = getGallerySVGs(theme)
  const lowercaseQuery = query.toLowerCase()
  
  return svgs.filter(svg => 
    svg.title.toLowerCase().includes(lowercaseQuery) ||
    svg.description.toLowerCase().includes(lowercaseQuery) ||
    svg.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

// Get all SVGs across all galleries
export function getAllGallerySVGs(): { theme: string; svg: GallerySVG }[] {
  const allSVGs: { theme: string; svg: GallerySVG }[] = []
  
  Object.entries(galleryData).forEach(([theme, svgs]) => {
    svgs.forEach(svg => {
      allSVGs.push({ theme, svg })
    })
  })
  
  return allSVGs
}

// Get gallery statistics
export function getGalleryStats(theme: string): {
  totalSVGs: number
  featuredCount: number
  totalDownloads: number
} {
  const svgs = getGallerySVGs(theme)
  
  return {
    totalSVGs: svgs.length,
    featuredCount: svgs.filter(svg => svg.featured).length,
    totalDownloads: svgs.reduce((sum, svg) => sum + (svg.downloadCount || 0), 0)
  }
}