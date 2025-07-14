export interface GalleryTheme {
  slug: string
  title: string
  description: string
  searchVolume: number
  keywords: string[]
  samplePrompts: string[]
  relatedThemes: string[]
}

export const galleryThemes: Record<string, GalleryTheme> = {
  "heart-svg": {
    slug: "heart-svg",
    title: "Heart SVG Collection",
    description: "Beautiful heart SVG designs perfect for Valentine's Day, love cards, and romantic projects. Download free heart vectors or create custom ones with AI.",
    searchVolume: 9900,
    keywords: ["heart svg", "love svg", "valentine svg", "heart icon", "heart vector", "romantic svg"],
    samplePrompts: [
      "minimalist heart outline icon",
      "decorative floral heart design",
      "geometric heart pattern",
      "hand-drawn heart illustration"
    ],
    relatedThemes: ["happy-birthday-svg", "mama-svg", "bride-to-be-svg"]
  },
  "hello-kitty-svg": {
    slug: "hello-kitty-svg",
    title: "Hello Kitty SVG Collection",
    description: "Adorable Hello Kitty SVG designs for crafts, t-shirts, and party decorations. Perfect for fans and creative projects.",
    searchVolume: 4400,
    keywords: ["hello kitty svg", "hello kitty vector", "sanrio svg", "kitty svg", "hello kitty free svg"],
    samplePrompts: [
      "hello kitty face outline",
      "hello kitty with bow",
      "hello kitty birthday design",
      "hello kitty pattern"
    ],
    relatedThemes: ["anime-svg", "bluey-svg", "happy-birthday-svg"]
  },
  "svg-download": {
    slug: "svg-download",
    title: "SVG File Download Collection",
    description: "Free SVG downloads for all your creative needs. Browse thousands of high-quality vector files ready for instant download.",
    searchVolume: 4400,
    keywords: ["svg file download", "free svg download", "download svg", "svg files free", "svg download free"],
    samplePrompts: [
      "popular svg icons pack",
      "decorative svg bundle",
      "svg graphics collection",
      "vector art download"
    ],
    relatedThemes: ["svg-icons", "heart-svg", "animal-svg"]
  },
  "bluey-svg": {
    slug: "bluey-svg",
    title: "Bluey SVG Collection",
    description: "Fun Bluey cartoon SVG designs for kids' parties, crafts, and fan projects. High-quality vector files of your favorite characters.",
    searchVolume: 2900,
    keywords: ["bluey svg", "bluey svg free", "bluey cartoon svg", "bluey character svg", "bluey vector"],
    samplePrompts: [
      "bluey character outline",
      "bluey family design",
      "bluey birthday party svg",
      "bluey and bingo svg"
    ],
    relatedThemes: ["hello-kitty-svg", "paw-print-svg", "animal-svg"]
  },
  "felt-flower-center-svg": {
    slug: "felt-flower-center-svg",
    title: "Felt Flower Center SVG Free Collection",
    description: "Beautiful felt flower center templates in SVG format. Perfect for craft projects, Cricut designs, and handmade flower decorations.",
    searchVolume: 2900,
    keywords: ["felt flower center svg free", "flower center svg", "felt flower template", "flower center template svg", "cricut flower svg"],
    samplePrompts: [
      "rolled felt flower center",
      "layered flower center design",
      "3D flower center template",
      "simple flower center pattern"
    ],
    relatedThemes: ["graduation-cap-svg", "back-to-school-svg", "happy-birthday-svg"]
  },
  "svg-icons": {
    slug: "svg-icons",
    title: "Download SVG Icons Collection",
    description: "Premium collection of SVG icons for web design, mobile apps, and user interfaces. Download free icons or generate custom ones with AI.",
    searchVolume: 2900,
    keywords: ["download svg icons", "svg icons free", "svg icon pack", "free svg icons download", "vector icons svg"],
    samplePrompts: [
      "modern user interface icon set",
      "minimalist social media icons",
      "colorful app icons collection",
      "outline style navigation icons"
    ],
    relatedThemes: ["svg-download", "heart-svg", "paw-print-svg"]
  },
  "beavis-butthead-svg": {
    slug: "beavis-butthead-svg",
    title: "Free Beavis and Butthead SVG Collection",
    description: "Nostalgic Beavis and Butthead SVG designs for fans of the classic cartoon. Perfect for t-shirts, stickers, and retro projects.",
    searchVolume: 1900,
    keywords: ["free beavis and butthead svg", "beavis butthead svg", "beavis svg", "butthead svg", "90s cartoon svg"],
    samplePrompts: [
      "beavis character design",
      "butthead portrait svg",
      "beavis and butthead logo",
      "cornholio svg design"
    ],
    relatedThemes: ["anime-svg", "stability-ability-svg", "give-it-to-god-svg"]
  },
  "graduation-cap-svg": {
    slug: "graduation-cap-svg",
    title: "Graduation Cap SVG Collection",
    description: "Celebrate academic achievements with graduation cap SVG designs. Perfect for graduation cards, decorations, and commemorative gifts.",
    searchVolume: 1300,
    keywords: ["graduation cap svg", "graduation svg", "grad cap svg", "mortarboard svg", "graduation hat svg"],
    samplePrompts: [
      "simple graduation cap icon",
      "graduation cap with tassel",
      "decorative grad cap design",
      "graduation cap with diploma"
    ],
    relatedThemes: ["back-to-school-svg", "happy-birthday-svg", "mama-svg"]
  },
  "happy-birthday-svg": {
    slug: "happy-birthday-svg",
    title: "Happy Birthday SVG Collection",
    description: "Festive happy birthday SVG designs for cards, banners, and party decorations. Create memorable birthday celebrations with these vectors.",
    searchVolume: 1300,
    keywords: ["happy birthday svg", "birthday svg", "birthday card svg", "birthday banner svg", "birthday svg free"],
    samplePrompts: [
      "happy birthday text design",
      "birthday cake svg",
      "birthday balloons svg",
      "birthday party decorations"
    ],
    relatedThemes: ["heart-svg", "mama-svg", "graduation-cap-svg"]
  },
  "mama-svg": {
    slug: "mama-svg",
    title: "Mama SVG Collection",
    description: "Heartwarming mama SVG designs for Mother's Day, gifts, and family projects. Show your love with these beautiful vector designs.",
    searchVolume: 1300,
    keywords: ["mama svg", "mom svg", "mother svg", "mama bear svg", "mama svg free"],
    samplePrompts: [
      "mama bear design",
      "blessed mama text",
      "mama floral design",
      "mama heart svg"
    ],
    relatedThemes: ["heart-svg", "happy-birthday-svg", "bride-to-be-svg"]
  },
  "paw-print-svg": {
    slug: "paw-print-svg",
    title: "Paw Print SVG Collection",
    description: "Cute paw print SVG designs for pet lovers, animal projects, and veterinary use. Perfect for dog and cat themed crafts.",
    searchVolume: 1300,
    keywords: ["paw print svg", "dog paw svg", "cat paw svg", "animal paw svg", "paw svg free"],
    samplePrompts: [
      "simple paw print icon",
      "dog paw trail design",
      "cat paw print pattern",
      "wildlife paw prints"
    ],
    relatedThemes: ["animal-svg", "bluey-svg", "heart-svg"]
  },
  "stability-ability-svg": {
    slug: "stability-ability-svg",
    title: "I Have Stability Ability to Stab SVG Collection",
    description: "Humorous and edgy SVG designs featuring the popular 'stability ability' meme. Perfect for sarcastic t-shirts and gifts.",
    searchVolume: 1300,
    keywords: ["i have stability ability to stab svg", "stability ability svg", "funny svg", "sarcastic svg", "meme svg"],
    samplePrompts: [
      "stability ability text design",
      "knife humor svg",
      "sarcastic quote design",
      "dark humor svg"
    ],
    relatedThemes: ["beavis-butthead-svg", "give-it-to-god-svg", "anime-svg"]
  },
  "anime-svg": {
    slug: "anime-svg",
    title: "Anime SVG Collection",
    description: "Popular anime SVG designs for fans and creators. Features characters, symbols, and Japanese-inspired artwork for various projects.",
    searchVolume: 650,
    keywords: ["anime svg", "svg anime", "manga svg", "anime character svg", "japanese svg", "anime svg free"],
    samplePrompts: [
      "anime character silhouette",
      "manga style eyes",
      "japanese text design",
      "anime logo svg"
    ],
    relatedThemes: ["hello-kitty-svg", "beavis-butthead-svg", "heart-svg"]
  },
  "bride-to-be-svg": {
    slug: "bride-to-be-svg",
    title: "Bride to Be SVG Collection",
    description: "Elegant bride to be SVG designs for bachelorette parties, wedding preparations, and bridal shower decorations.",
    searchVolume: 390,
    keywords: ["bride to be svg", "bride svg", "wedding svg", "bachelorette svg", "bridal svg"],
    samplePrompts: [
      "bride to be text design",
      "wedding ring svg",
      "bridal crown design",
      "bachelorette party svg"
    ],
    relatedThemes: ["heart-svg", "mama-svg", "happy-birthday-svg"]
  },
  "give-it-to-god-svg": {
    slug: "give-it-to-god-svg",
    title: "SVG Give It to God Collection",
    description: "Inspirational faith-based SVG designs featuring 'Give it to God' messages. Perfect for religious crafts and spiritual projects.",
    searchVolume: 320,
    keywords: ["svg give it to god", "give it to god svg", "faith svg", "christian svg", "religious svg"],
    samplePrompts: [
      "give it to god text design",
      "faith quote svg",
      "praying hands svg",
      "cross with text svg"
    ],
    relatedThemes: ["give-it-to-god-lion-svg", "mama-svg", "heart-svg"]
  },
  "give-it-to-god-lion-svg": {
    slug: "give-it-to-god-lion-svg",
    title: "SVG Give It to God Lion Collection",
    description: "Powerful faith designs combining 'Give it to God' messages with lion imagery. Symbolizing strength and faith in one design.",
    searchVolume: 320,
    keywords: ["svg give it to god lion", "give it to god lion svg", "lion faith svg", "christian lion svg", "religious lion svg"],
    samplePrompts: [
      "lion with faith quote",
      "majestic lion prayer design",
      "give it to god lion face",
      "spiritual lion svg"
    ],
    relatedThemes: ["give-it-to-god-svg", "animal-svg", "stability-ability-svg"]
  },
  "back-to-school-svg": {
    slug: "back-to-school-svg",
    title: "Back to School SVG Collection",
    description: "Fun back to school SVG designs for teachers, students, and parents. Perfect for classroom decorations and school supplies.",
    searchVolume: 260,
    keywords: ["back to school svg", "school svg", "teacher svg", "student svg", "classroom svg"],
    samplePrompts: [
      "back to school banner",
      "school supplies svg",
      "teacher appreciation design",
      "first day of school svg"
    ],
    relatedThemes: ["graduation-cap-svg", "happy-birthday-svg", "mama-svg"]
  },
  "animal-svg": {
    slug: "animal-svg",
    title: "Animal SVG Collection",
    description: "Diverse collection of animal SVG designs featuring wildlife, pets, and creatures. Perfect for nature projects and animal lovers.",
    searchVolume: 210,
    keywords: ["animal svg", "wildlife svg", "pet svg", "animal vector", "creature svg"],
    samplePrompts: [
      "safari animal silhouettes",
      "farm animal collection",
      "pet portrait designs",
      "wild animal patterns"
    ],
    relatedThemes: ["paw-print-svg", "bluey-svg", "give-it-to-god-lion-svg"]
  }
}

export function getGalleryTheme(slug: string): GalleryTheme | undefined {
  return galleryThemes[slug]
}

export function getAllGalleryThemes(): GalleryTheme[] {
  return Object.values(galleryThemes)
}

export function getRelatedThemes(slug: string): GalleryTheme[] {
  const theme = getGalleryTheme(slug)
  if (!theme) return []
  
  return theme.relatedThemes
    .map(relatedSlug => getGalleryTheme(relatedSlug))
    .filter((theme): theme is GalleryTheme => theme !== undefined)
}