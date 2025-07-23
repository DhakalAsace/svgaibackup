// Style mappings for SVG and Icon generators
// Maps API values to user-friendly display names

// SVG Generator Style Mapping (Recraft V3 SVG)
export const SVG_STYLE_MAP = {
  "any": { 
    display: "Auto",
    apiValue: "any",
    tooltip: "Let AI select the best style for your design"
  },
  "engraving": { 
    display: "Etching",
    apiValue: "engraving",
    tooltip: "Fine parallel lines creating depth and texture"
  },
  "line_art": { 
    display: "Monoline",
    apiValue: "line_art",
    tooltip: "Single-weight continuous line drawings"
  },
  "line_circuit": { 
    display: "Schematic",
    apiValue: "line_circuit",
    tooltip: "Technical diagrams with connected elements"
  },
  "linocut": { 
    display: "Woodcut",
    apiValue: "linocut",
    tooltip: "Bold, carved print style with high contrast"
  }
} as const;

// Icon Generator Style Mapping (Recraft 20b)
export const ICON_STYLE_MAP = {
  "icon": { 
    display: "Icon",
    apiValue: "icon",
    tooltip: "Standard icon design"
  },
  "icon/broken_line": { 
    display: "Dashed",
    apiValue: "icon/broken_line",
    tooltip: "Icons with broken line segments"
  },
  "icon/colored_outline": { 
    display: "Colorstroke",
    apiValue: "icon/colored_outline",
    tooltip: "Colored outlines without fills"
  },
  "icon/colored_shapes": { 
    display: "Colorfill",
    apiValue: "icon/colored_shapes",
    tooltip: "Solid color filled shapes"
  },
  "icon/colored_shapes_gradient": { 
    display: "Duotone",
    apiValue: "icon/colored_shapes_gradient",
    tooltip: "Two-color gradient fills"
  },
  "icon/doodle_fill": { 
    display: "Scribble",
    apiValue: "icon/doodle_fill",
    tooltip: "Hand-drawn sketchy fill"
  },
  "icon/doodle_offset_fill": { 
    display: "Scribble-offset",
    apiValue: "icon/doodle_offset_fill",
    tooltip: "Sketchy style with depth effect"
  },
  "icon/offset_fill": { 
    display: "Shadow",
    apiValue: "icon/offset_fill",
    tooltip: "Icons with drop shadow effect"
  },
  "icon/outline": { 
    display: "Stroke",
    apiValue: "icon/outline",
    tooltip: "Line-only icons without fills"
  },
  "icon/outline_gradient": { 
    display: "Gradient-stroke",
    apiValue: "icon/outline_gradient",
    tooltip: "Outlines with gradient colors"
  },
  "icon/uneven_fill": { 
    display: "Rough-fill",
    apiValue: "icon/uneven_fill",
    tooltip: "Organic, textured fill style"
  }
} as const;

// Type definitions
export type SvgStyleKey = keyof typeof SVG_STYLE_MAP;
export type IconStyleKey = keyof typeof ICON_STYLE_MAP;

// Helper function to get display name from API value
export const getStyleDisplay = (apiValue: string, isIcon: boolean = false): string => {
  const map = isIcon ? ICON_STYLE_MAP : SVG_STYLE_MAP;
  return (map as any)[apiValue]?.display || apiValue;
};

// Helper function to get API value from display name
export const getStyleApiValue = (displayName: string, isIcon: boolean = false): string => {
  const map = isIcon ? ICON_STYLE_MAP : SVG_STYLE_MAP;
  const entry = Object.entries(map).find(([_, value]) => value.display === displayName);
  return entry?.[0] || displayName;
};

// Helper function to get tooltip for a style
export const getStyleTooltip = (apiValue: string, isIcon: boolean = false): string => {
  const map = isIcon ? ICON_STYLE_MAP : SVG_STYLE_MAP;
  return (map as any)[apiValue]?.tooltip || "";
};

// Get all style options for dropdown
export const getSvgStyleOptions = () => {
  return Object.entries(SVG_STYLE_MAP).map(([key, value]) => ({
    value: key,
    label: value.display,
    tooltip: value.tooltip
  }));
};

export const getIconStyleOptions = () => {
  return Object.entries(ICON_STYLE_MAP).map(([key, value]) => ({
    value: key,
    label: value.display,
    tooltip: value.tooltip
  }));
};