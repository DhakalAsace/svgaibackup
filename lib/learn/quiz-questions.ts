export const svgQuizQuestions = {
  // What is SVG quiz questions
  whatIsSvg: [
    {
      id: "svg-basics-1",
      question: "What does SVG stand for?",
      options: [
        "Scalable Vector Graphics",
        "Simple Vector Graphics",
        "Standard Visual Graphics",
        "Structured Vector Graphics"
      ],
      correctAnswer: 0,
      explanation: "SVG stands for Scalable Vector Graphics, an XML-based format for describing two-dimensional vector graphics.",
      difficulty: "beginner" as const
    },
    {
      id: "svg-basics-2",
      question: "Which of the following is NOT a characteristic of SVG?",
      options: [
        "Resolution independent",
        "Can be styled with CSS",
        "Stores pixel data",
        "Supports animation"
      ],
      correctAnswer: 2,
      explanation: "SVG does not store pixel data. Instead, it uses mathematical formulas to describe shapes, making it resolution independent.",
      difficulty: "beginner" as const
    },
    {
      id: "svg-basics-3",
      question: "What is the primary advantage of SVG over raster formats like PNG?",
      options: [
        "Smaller file size for photos",
        "Better color accuracy",
        "Infinite scalability without quality loss",
        "Faster loading times"
      ],
      correctAnswer: 2,
      explanation: "SVG's main advantage is infinite scalability. Vector graphics maintain perfect quality at any size, unlike raster formats that become pixelated when enlarged.",
      difficulty: "beginner" as const
    },
    {
      id: "svg-basics-4",
      question: "Which language is SVG based on?",
      options: [
        "HTML",
        "XML",
        "JavaScript",
        "CSS"
      ],
      correctAnswer: 1,
      explanation: "SVG is based on XML (Extensible Markup Language), which makes it both human-readable and machine-parseable.",
      difficulty: "intermediate" as const
    },
    {
      id: "svg-basics-5",
      question: "For which type of graphics is SVG LEAST suitable?",
      options: [
        "Logos and icons",
        "Charts and diagrams",
        "Photographs",
        "Illustrations"
      ],
      correctAnswer: 2,
      explanation: "SVG is least suitable for photographs because complex images with many colors and details result in very large file sizes. Raster formats like JPEG are better for photos.",
      difficulty: "intermediate" as const
    }
  ],

  // SVG File quiz questions
  svgFile: [
    {
      id: "svg-file-1",
      question: "What is the file extension for SVG files?",
      options: [
        ".svg",
        ".svgx",
        ".vector",
        ".xml"
      ],
      correctAnswer: 0,
      explanation: "SVG files use the .svg file extension. While they are XML-based, they have their own specific extension.",
      difficulty: "beginner" as const
    },
    {
      id: "svg-file-2",
      question: "Which application can NOT open SVG files?",
      options: [
        "Web browsers",
        "Adobe Illustrator",
        "Text editors",
        "None of the above - all can open SVG files"
      ],
      correctAnswer: 3,
      explanation: "All of the listed applications can open SVG files. Browsers display them visually, design software can edit them, and text editors can view/edit the XML code.",
      difficulty: "beginner" as const
    },
    {
      id: "svg-file-3",
      question: "What is the root element of an SVG file?",
      options: [
        "<xml>",
        "<svg>",
        "<vector>",
        "<graphics>"
      ],
      correctAnswer: 1,
      explanation: "The <svg> element is the root element of every SVG file. It defines the SVG namespace and viewport.",
      difficulty: "intermediate" as const
    },
    {
      id: "svg-file-4",
      question: "Which attribute defines the coordinate system of an SVG?",
      options: [
        "viewport",
        "coordinates",
        "viewBox",
        "canvas"
      ],
      correctAnswer: 2,
      explanation: "The viewBox attribute defines the coordinate system and aspect ratio of the SVG content. It allows SVG to scale properly.",
      difficulty: "intermediate" as const
    },
    {
      id: "svg-file-5",
      question: "Can SVG files contain JavaScript?",
      options: [
        "No, SVG is only for graphics",
        "Yes, but it's not recommended",
        "Yes, SVG supports scripting",
        "Only in certain browsers"
      ],
      correctAnswer: 2,
      explanation: "SVG files can contain JavaScript within <script> tags, allowing for interactive and dynamic graphics. However, this should be used carefully for security reasons.",
      difficulty: "advanced" as const
    }
  ],

  // SVG File Format quiz questions
  svgFileFormat: [
    {
      id: "svg-format-1",
      question: "What type of graphics format is SVG?",
      options: [
        "Raster/Bitmap",
        "Vector",
        "Hybrid",
        "Compressed"
      ],
      correctAnswer: 1,
      explanation: "SVG is a vector graphics format that uses mathematical descriptions to define shapes rather than a grid of pixels.",
      difficulty: "beginner" as const
    },
    {
      id: "svg-format-2",
      question: "Which SVG element is used to create a circle?",
      options: [
        "<round>",
        "<ellipse>",
        "<circle>",
        "<sphere>"
      ],
      correctAnswer: 2,
      explanation: "The <circle> element is used to create circular shapes in SVG. It requires cx, cy (center coordinates) and r (radius) attributes.",
      difficulty: "beginner" as const
    },
    {
      id: "svg-format-3",
      question: "What does the 'd' attribute in a <path> element contain?",
      options: [
        "Display settings",
        "Path data commands",
        "Dimensions",
        "Direction"
      ],
      correctAnswer: 1,
      explanation: "The 'd' attribute contains path data - a series of commands and coordinates that define the shape of the path.",
      difficulty: "intermediate" as const
    },
    {
      id: "svg-format-4",
      question: "Which command in SVG path data moves the cursor without drawing?",
      options: [
        "L (Line)",
        "C (Curve)",
        "M (Move)",
        "Z (Close)"
      ],
      correctAnswer: 2,
      explanation: "The 'M' (Move) command moves the cursor to a new position without drawing anything. It's typically used to start a new sub-path.",
      difficulty: "intermediate" as const
    },
    {
      id: "svg-format-5",
      question: "What is the purpose of the <defs> element in SVG?",
      options: [
        "Define default styles",
        "Store reusable elements like gradients and patterns",
        "Set definitions for shapes",
        "Declare defensive coding practices"
      ],
      correctAnswer: 1,
      explanation: "The <defs> element is used to store graphical objects that can be reused later, such as gradients, patterns, filters, and symbols.",
      difficulty: "advanced" as const
    }
  ],

  // Convert SVG to PNG Windows quiz questions
  convertSvgToPngWindows: [
    {
      id: "convert-win-1",
      question: "Which built-in Windows application can convert SVG to PNG?",
      options: [
        "Windows Photo Viewer",
        "Paint 3D",
        "Notepad",
        "Windows Media Player"
      ],
      correctAnswer: 1,
      explanation: "Paint 3D, included with Windows 10 and 11, can open SVG files and save them as PNG, though with limited features.",
      difficulty: "beginner" as const
    },
    {
      id: "convert-win-2",
      question: "What is the main advantage of using online converters for SVG to PNG conversion?",
      options: [
        "Better quality output",
        "No software installation required",
        "Faster processing",
        "More secure"
      ],
      correctAnswer: 1,
      explanation: "Online converters require no software installation, making them the quickest way to convert files without setting up tools on your computer.",
      difficulty: "beginner" as const
    },
    {
      id: "convert-win-3",
      question: "Which command-line tool is most commonly used for batch SVG to PNG conversion on Windows?",
      options: [
        "PowerShell",
        "Command Prompt",
        "ImageMagick",
        "Windows Terminal"
      ],
      correctAnswer: 2,
      explanation: "ImageMagick is the most popular command-line tool for image conversion, including SVG to PNG, and supports batch processing.",
      difficulty: "intermediate" as const
    },
    {
      id: "convert-win-4",
      question: "What resolution (DPI) is typically recommended for web use when converting SVG to PNG?",
      options: [
        "72-96 DPI",
        "150 DPI",
        "300 DPI",
        "600 DPI"
      ],
      correctAnswer: 0,
      explanation: "72-96 DPI is standard for web images. Higher resolutions like 300 DPI are used for print materials.",
      difficulty: "intermediate" as const
    },
    {
      id: "convert-win-5",
      question: "How can you maintain transparency when converting SVG to PNG?",
      options: [
        "It's not possible",
        "Use JPEG format instead",
        "Enable transparent background option",
        "Reduce the DPI"
      ],
      correctAnswer: 2,
      explanation: "Most conversion tools have a transparent background option that preserves any transparency in the SVG when converting to PNG.",
      difficulty: "advanced" as const
    }
  ],

  // Batch SVG to PNG quiz questions
  batchSvgToPng: [
    {
      id: "batch-1",
      question: "What is the primary benefit of batch conversion?",
      options: [
        "Better quality output",
        "Processing files sequentially",
        "Smaller file sizes",
        "More format options"
      ],
      correctAnswer: 1,
      explanation: "Automated conversion allows you to process files efficiently, saving significant time compared to manual conversion.",
      difficulty: "beginner" as const
    },
    {
      id: "batch-2",
      question: "Which ImageMagick command is used for batch conversion that modifies files in place?",
      options: [
        "convert",
        "mogrify",
        "identify",
        "montage"
      ],
      correctAnswer: 1,
      explanation: "The 'mogrify' command modifies images in place and can process files with wildcards, making it ideal for automated operations.",
      difficulty: "intermediate" as const
    },
    {
      id: "batch-3",
      question: "In a bash script, which wildcard pattern selects all SVG files?",
      options: [
        "*.svg",
        "?.svg",
        "svg.*",
        "[svg]"
      ],
      correctAnswer: 0,
      explanation: "The pattern '*.svg' matches all files ending with .svg extension. The asterisk (*) is a wildcard that matches any characters.",
      difficulty: "beginner" as const
    },
    {
      id: "batch-4",
      question: "What's the best practice for organizing batch conversion output?",
      options: [
        "Overwrite original files",
        "Use the same directory",
        "Create a separate output directory",
        "Random file placement"
      ],
      correctAnswer: 2,
      explanation: "Creating a separate output directory keeps original files safe and makes it easy to manage converted files.",
      difficulty: "intermediate" as const
    },
    {
      id: "batch-5",
      question: "Which Node.js library combination is commonly used for SVG optimization and conversion?",
      options: [
        "Express + MongoDB",
        "React + Redux",
        "SVGO + Sharp",
        "Jest + Mocha"
      ],
      correctAnswer: 2,
      explanation: "SVGO (SVG Optimizer) optimizes SVG files, while Sharp is a high-performance image processing library that can convert formats.",
      difficulty: "advanced" as const
    }
  ]
}

// Learning modules configuration
export const learningModules = [
  {
    id: "fundamentals",
    title: "SVG Fundamentals",
    description: "Master the basics of SVG, understanding what it is and how it works",
    duration: "2 hours",
    difficulty: "beginner" as const,
    lessons: [
      {
        id: "intro-svg",
        title: "Introduction to SVG",
        slug: "what-is-svg"
      },
      {
        id: "svg-files",
        title: "Working with SVG Files",
        slug: "svg-file"
      },
      {
        id: "svg-format",
        title: "Understanding SVG File Format",
        slug: "svg-file-format"
      }
    ],
    quiz: {
      id: "fundamentals-quiz",
      title: "Test Your SVG Fundamentals",
      questions: 10
    },
    certificate: true
  },
  {
    id: "conversion",
    title: "SVG Conversion Mastery",
    description: "Learn to convert between SVG and other formats efficiently",
    duration: "3 hours",
    difficulty: "intermediate" as const,
    lessons: [
      {
        id: "svg-to-png-windows",
        title: "Convert SVG to PNG on Windows",
        slug: "convert-svg-to-png-windows"
      },
      {
        id: "batch-conversion",
        title: "Batch SVG to PNG Conversion",
        slug: "svg-to-png-guide"
      },
      {
        id: "png-to-svg",
        title: "Convert PNG to SVG",
        slug: "convert-png-to-svg"
      }
    ],
    quiz: {
      id: "conversion-quiz",
      title: "Conversion Techniques Quiz",
      questions: 8
    }
  },
  {
    id: "advanced",
    title: "Advanced SVG Techniques",
    description: "Explore animations, optimization, and advanced SVG features",
    duration: "5 hours",
    difficulty: "advanced" as const,
    lessons: [
      {
        id: "svg-animation",
        title: "SVG CSS Animation",
        slug: "svg-css-animation"
      },
      {
        id: "react-native-svg",
        title: "React Native SVG Animation",
        slug: "react-native-svg-animation"
      },
      {
        id: "optimization",
        title: "SVG Optimization Techniques",
        slug: "best-svg-converters"
      }
    ],
    quiz: {
      id: "advanced-quiz",
      title: "Advanced SVG Mastery",
      questions: 12
    },
    certificate: true
  }
]