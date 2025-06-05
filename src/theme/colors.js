/**
#fff * Theme Colors Configuration for Preschool UI (Ultra High Contrast for all themes)
 */

const colors = {
  // Primary brand colors (Ultra High Contrast)
  brand: {
    primary: {
      light: "#1976d2", // xanh dương đậm nhạt (hover/background)
      main: "#042818",  // xanh đen cực đậm, nổi bật
      dark: "#000000",  // đen tuyệt đối (hover nhấn mạnh)
      contrast: "#FFFFFF",
    },
    secondary: {
      light: "#fff9c4", // vàng nhạt
      main: "#ffd600",  // vàng tươi, nổi bật
      dark: "#b29500",  // vàng đậm
      contrast: "#042818",
    },
    accent: {
      light: "#ffcdd2", // đỏ nhạt
      main: "#e53935",  // đỏ tươi
      dark: "#b71c1c",  // đỏ đậm nhấn
      contrast: "#FFFFFF",
    },
  },

  // Semantic colors (Tương phản cực cao)
  semantic: {
    success: {
      light: "#b2dfdb", // xanh ngọc nhạt
      main: "#009688",  // xanh ngọc đậm
      dark: "#004d40",  // xanh đậm
      contrast: "#042818",
    },
    warning: {
      light: "#ffe0b2", // cam nhạt
      main: "#ff9800",  // cam đậm
      dark: "#b26a00",  // cam đậm nhấn
      contrast: "#042818",
    },
    error: {
      light: "#ffcdd2", // đỏ nhạt
      main: "#e53935",  // đỏ tươi
      dark: "#b71c1c",  // đỏ rất đậm
      contrast: "#FFFFFF",
    },
    info: {
      light: "#bbdefb", // xanh biển nhạt
      main: "#1976d2",  // xanh dương đậm
      dark: "#0d47a1",  // xanh đậm
      contrast: "#042818",
    },
  },

  // Preschool specific colors (Rainbow đậm, tương phản cao)
  preschool: {
    sunshine: {
      light: "#fff9c4", // vàng nhạt
      main: "#ffd600",  // vàng tươi
      dark: "#b29500",  // vàng nhấn
      contrast: "#042818",
    },
    rainbow: {
      red: "#e53935",    // đỏ tươi
      orange: "#ff9800", // cam đậm
      yellow: "#ffd600", // vàng tươi
      green: "#009688",  // xanh ngọc đậm
      blue: "#1976d2",   // xanh dương đậm
      purple: "#8e24aa", // tím đậm
      pink: "#f06292"    // hồng đậm
    },
    pastel: {
      blue: "#1976d2",   // blue đậm
      green: "#b2dfdb",  // green nhạt
      yellow: "#fff9c4", // yellow nhạt
      pink: "#ffcdd2",   // pink nhạt
      purple: "#ede7f6", // purple pastel
      orange: "#ffe0b2"  // orange nhạt
    },
  },

  // Neutral colors (Tương phản cực cao)
  neutral: {
    white: "#FFFFFF",
    gray: {
      50: "#ffffff",
      100: "#f8fafc",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#22223b",
      800: "#042818",  // Xanh đen cực đậm, dùng cho text/nav chính
      900: "#000000",  // Đen tuyệt đối
    },
    black: "#042818",   // xanh đen cực đậm
  },

  // Background variations (Gradient mạnh)
  backgrounds: {
    default: "#ffffff",                // trắng tinh khiết
    paper: "#f8fafc",                  // trắng xanh nhạt
    muted: "#e2e8f0",                  // xám nhạt
    accent: "#1976d2",                 // xanh dương đậm
    rainbow: "linear-gradient(135deg, #1976d2 0%, #e53935 100%)",
    sunshine: "linear-gradient(135deg, #fff9c4 0%, #ffd600 100%)",
  },

  // Text colors (Tương phản cực cao)
  text: {
    primary: "#042818",     // xanh đen cực đậm
    secondary: "#22223b",   // xám xanh đậm
    muted: "#64748b",       // xám nhạt
    disabled: "#cbd5e1",    // xám rất nhạt
    inverse: "#FFFFFF",     // trắng
    accent: "#1976d2",      // xanh dương đậm
  },

  // Border colors
  border: {
    light: "#042818",     // xanh đen cực đậm
    medium: "#22223b",    // xám xanh đậm
    dark: "#000000",      // đen tuyệt đối
    accent: "#e53935",    // đỏ tươi
  },
};

// Theme variants for different contexts
const themes = {
  // Light theme (Ultra High Contrast)
  light: {
    background: colors.backgrounds.default,
    surface: colors.backgrounds.paper,
    primary: colors.brand.primary.main,
    secondary: colors.brand.secondary.main,
    accent: colors.brand.accent.main,
    text: colors.text.primary,
    textSecondary: colors.text.secondary,
    border: colors.border.light,
  },

  // Dark theme (Modern, true dark, high contrast, easy to read)
  dark: {
    background: "#181a20", // Xám xanh đen rất tối
    surface: "#23263a", // Xám xanh đậm
    primary: "#60a5fa", // Xanh dương sáng, nổi bật
    secondary: "#ffe066", // Vàng kem sáng
    accent: "#f472b6", // Hồng pastel sáng
    text: "#f1f5f9", // Trắng xanh nhạt
    textSecondary: "#aab4f6", // Xanh nhạt
    border: "#334155", // Xám xanh trung bình
    success: "#38bdf8", // Xanh dương pastel sáng
    warning: "#ffe066", // Vàng kem sáng
    error: "#ffb7b2", // Đỏ pastel sáng
    info: "#60a5fa", // Xanh dương sáng
  },

  // Playful theme (Ultra High Contrast)
  playful: {
    background: colors.preschool.pastel.yellow,
    surface: colors.backgrounds.default,
    primary: colors.preschool.sunshine.main,
    secondary: colors.preschool.rainbow.pink,
    accent: colors.preschool.rainbow.purple,
    text: colors.text.primary,
    textSecondary: colors.text.secondary,
    border: colors.border.light,
  },
};

const componentColors = {
  button: {
    primary: {
      bg: colors.brand.primary.main,
      hover: colors.brand.primary.dark,
      text: colors.brand.primary.contrast,
      border: colors.brand.primary.main,
    },
    secondary: {
      bg: colors.brand.secondary.main,
      hover: colors.brand.secondary.dark,
      text: colors.brand.secondary.contrast,
      border: colors.brand.secondary.main,
    },
    success: {
      bg: colors.semantic.success.main,
      hover: colors.semantic.success.dark,
      text: colors.semantic.success.contrast,
      border: colors.semantic.success.main,
    },
    playful: {
      bg: colors.preschool.sunshine.main,
      hover: colors.preschool.sunshine.dark,
      text: colors.preschool.sunshine.contrast,
      border: colors.preschool.sunshine.main,
    },
  },

  input: {
    default: {
      bg: colors.backgrounds.default,
      border: colors.border.medium,
      focusBorder: colors.brand.primary.main,
      text: colors.text.primary,
      placeholder: colors.text.muted,
    },
    error: {
      bg: colors.semantic.error.light,
      border: colors.semantic.error.main,
      focusBorder: colors.semantic.error.dark,
      text: colors.text.primary,
      placeholder: colors.text.muted,
    },
  },

  card: {
    default: {
      bg: colors.backgrounds.default,
      border: colors.border.light,
      shadow: "soft",
    },
    elevated: {
      bg: colors.backgrounds.default,
      border: "none",
      shadow: "medium",
    },
    playful: {
      bg: colors.preschool.pastel.yellow,
      border: colors.border.light,
      shadow: "playful",
    },
  },
};

// Utility theme classes for Tailwind-based components
const themeClasses = {
  backgroundPrimary: "bg-theme-primary",
  backgroundSecondary: "bg-theme-secondary",
  backgroundSurface: "bg-theme-surface",
  backgroundDefault: "bg-theme-bg",
  backgroundAccent: "bg-theme-accent",
  textPrimary: "text-theme-primary",
  textSecondary: "text-theme-secondary",
  textDefault: "theme-aware-text",
  textMuted: "theme-aware-text-secondary",
  borderDefault: "theme-aware-border",
  borderPrimary: "border-theme-primary",
  borderSecondary: "border-theme-secondary",
  buttonPrimary:
    "bg-theme-primary text-white border-theme-primary hover:opacity-90 font-bold border-2 shadow-md",
  buttonSecondary:
    "bg-theme-secondary text-black border-theme-secondary hover:opacity-90 font-bold border-2 shadow-md",
  buttonOutline:
    "bg-transparent text-theme-primary border-theme-primary hover:bg-theme-primary hover:text-white font-bold border-2 shadow-md",
  inputDefault:
    "theme-aware-bg theme-aware-text theme-aware-border border-2 font-medium shadow-sm focus:border-theme-primary focus:ring-theme-primary",
  inputError:
    "border-red-700 text-red-700 focus:border-red-700 focus:ring-red-700 border-2 font-medium shadow-md",
};

export { colors, themes, componentColors, themeClasses };
