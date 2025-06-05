import { useTheme } from "@contexts/ThemeContext";
import {
  Heart,
  Moon,
  Palette,
  Rainbow,
  Smile,
  Sparkles,
  Sun,
} from "lucide-react";
import { ThemeToggle } from "@molecules";

const ThemeDemo = () => {
  const { theme, getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  const colorPalettes = [
    {
      name: "Primary Colors",
      colors: [
        { name: "Primary 50", class: "bg-primary-50", hex: "#eff6ff" },
        { name: "Primary 100", class: "bg-primary-100", hex: "#dbeafe" },
        { name: "Primary 200", class: "bg-primary-200", hex: "#bfdbfe" },
        { name: "Primary 300", class: "bg-primary-300", hex: "#93c5fd" },
        { name: "Primary 400", class: "bg-primary-400", hex: "#60a5fa" },
        { name: "Primary 500", class: "bg-primary-500", hex: "#3b82f6" },
        { name: "Primary 600", class: "bg-primary-600", hex: "#2563eb" },
        { name: "Primary 700", class: "bg-primary-700", hex: "#1d4ed8" },
        { name: "Primary 800", class: "bg-primary-800", hex: "#1e40af" },
        { name: "Primary 900", class: "bg-primary-900", hex: "#1e3a8a" },
      ],
    },
    {
      name: "Secondary Colors",
      colors: [
        { name: "Secondary 50", class: "bg-secondary-50", hex: "#fff7ed" },
        { name: "Secondary 100", class: "bg-secondary-100", hex: "#ffedd5" },
        { name: "Secondary 200", class: "bg-secondary-200", hex: "#fed7aa" },
        { name: "Secondary 300", class: "bg-secondary-300", hex: "#fdba74" },
        { name: "Secondary 400", class: "bg-secondary-400", hex: "#fb923c" },
        { name: "Secondary 500", class: "bg-secondary-500", hex: "#f97316" },
        { name: "Secondary 600", class: "bg-secondary-600", hex: "#ea580c" },
        { name: "Secondary 700", class: "bg-secondary-700", hex: "#c2410c" },
        { name: "Secondary 800", class: "bg-secondary-800", hex: "#9a3412" },
        { name: "Secondary 900", class: "bg-secondary-900", hex: "#7c2d12" },
      ],
    },
    {
      name: "Sunshine Colors",
      colors: [
        { name: "Sunshine 50", class: "bg-sunshine-50", hex: "#fffbeb" },
        { name: "Sunshine 100", class: "bg-sunshine-100", hex: "#fef3c7" },
        { name: "Sunshine 200", class: "bg-sunshine-200", hex: "#fde68a" },
        { name: "Sunshine 300", class: "bg-sunshine-300", hex: "#fcd34d" },
        { name: "Sunshine 400", class: "bg-sunshine-400", hex: "#fbbf24" },
        { name: "Sunshine 500", class: "bg-sunshine-500", hex: "#f59e0b" },
        { name: "Sunshine 600", class: "bg-sunshine-600", hex: "#d97706" },
        { name: "Sunshine 700", class: "bg-sunshine-700", hex: "#b45309" },
        { name: "Sunshine 800", class: "bg-sunshine-800", hex: "#92400e" },
        { name: "Sunshine 900", class: "bg-sunshine-900", hex: "#78350f" },
      ],
    },
    {
      name: "Rainbow Colors",
      colors: [
        { name: "Rainbow Red", class: "bg-rainbow-red", hex: "#ef4444" },
        { name: "Rainbow Orange", class: "bg-rainbow-orange", hex: "#f97316" },
        { name: "Rainbow Yellow", class: "bg-rainbow-yellow", hex: "#eab308" },
        { name: "Rainbow Green", class: "bg-rainbow-green", hex: "#22c55e" },
        { name: "Rainbow Blue", class: "bg-rainbow-blue", hex: "#3b82f6" },
        { name: "Rainbow Purple", class: "bg-rainbow-purple", hex: "#a855f7" },
        { name: "Rainbow Pink", class: "bg-rainbow-pink", hex: "#ec4899" },
      ],
    },
    {
      name: "Pastel Colors",
      colors: [
        { name: "Pastel Blue", class: "bg-pastel-blue", hex: "#e0f2fe" },
        { name: "Pastel Green", class: "bg-pastel-green", hex: "#f0fdf4" },
        { name: "Pastel Yellow", class: "bg-pastel-yellow", hex: "#fefce8" },
        { name: "Pastel Pink", class: "bg-pastel-pink", hex: "#fdf2f8" },
        { name: "Pastel Purple", class: "bg-pastel-purple", hex: "#faf5ff" },
        { name: "Pastel Orange", class: "bg-pastel-orange", hex: "#fff7ed" },
      ],
    },
  ];

  const componentExamples = [
    {
      title: "Buttons",
      components: [
        { label: "Primary", className: "btn btn-primary" },
        { label: "Secondary", className: "btn btn-secondary" },
        { label: "Success", className: "btn btn-success" },
        { label: "Playful", className: "btn btn-playful" },
      ],
    },
    {
      title: "Cards",
      components: [
        { label: "Default Card", className: "card p-4" },
        { label: "Elevated Card", className: "card-elevated p-4" },
        { label: "Playful Card", className: "card-playful p-4" },
      ],
    },
    {
      title: "Text Gradients",
      components: [
        {
          label: "Gradient Text",
          className: "text-gradient text-2xl font-bold",
        },
        {
          label: "Playful Gradient",
          className: "text-gradient-playful text-2xl font-bold",
        },
      ],
    },
    {
      title: "Background Gradients",
      components: [
        {
          label: "Primary Gradient",
          className: "bg-gradient-primary text-white px-4 py-2 rounded-lg",
        },
        {
          label: "Rainbow Gradient",
          className: "bg-gradient-rainbow text-white px-4 py-2 rounded-lg",
        },
        {
          label: "Sunshine Gradient",
          className: "bg-gradient-sunshine text-black px-4 py-2 rounded-lg",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-rainbow text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Palette className="w-12 h-12" />
            <h1 className="text-4xl md:text-6xl font-bold">Theme Showcase</h1>
            <Rainbow className="w-12 h-12" />
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Explore our beautiful color palette and theme system
          </p>

          {/* Current Theme Display */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Current Theme</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                {theme === "light" && <Sun className="w-6 h-6" />}
                {theme === "dark" && <Moon className="w-6 h-6" />}
                {theme === "playful" && <Sparkles className="w-6 h-6" />}
                <span className="text-xl font-bold capitalize">{theme}</span>
              </div>
              <ThemeToggle variant="dropdown" size="md" showLabel={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Color Palettes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Color Palettes
          </h2>

          <div className="space-y-12">
            {colorPalettes.map((palette, index) => (
              <div
                key={index + palette.name}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  {palette.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                  {palette.colors.map((color, colorIndex) => (
                    <div key={colorIndex + color.name} className="text-center">
                      <div
                        className={`${color.class} w-full h-16 rounded-lg mb-2 border border-gray-200`}
                      ></div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {color.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {color.hex}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Component Examples */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Component Examples
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {componentExamples.map((section, index) => (
              <div
                key={index + section.title}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.components.map((component, compIndex) => (
                    <div
                      key={compIndex + component.label}
                      className={component.className}
                    >
                      {component.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Theme Controls */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Smile className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Try Different Themes</h2>
            <Heart className="w-8 h-8" />
          </div>
          <p className="text-xl mb-8">
            Experience how our preschool interface adapts to different themes
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ThemeToggle variant="button" size="lg" showLabel={true} />
            <ThemeToggle variant="dropdown" size="lg" showLabel={true} />
            <ThemeToggle variant="simple" size="lg" showLabel={false} />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <Sun className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold">Light Theme</h4>
              <p className="text-sm opacity-90">
                Clean and bright for day time
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <Moon className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold">Dark Theme</h4>
              <p className="text-sm opacity-90">Easy on the eyes for evening</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <Sparkles className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold">Playful Theme</h4>
              <p className="text-sm opacity-90">Fun and colorful for kids</p>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Examples */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Typography Scale
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="space-y-4">
              <div className="text-6xl font-bold text-gradient">Heading 1</div>
              <div className="text-5xl font-bold text-gray-800 dark:text-white">
                Heading 2
              </div>
              <div className="text-4xl font-bold text-gray-800 dark:text-white">
                Heading 3
              </div>
              <div className="text-3xl font-semibold text-gray-800 dark:text-white">
                Heading 4
              </div>
              <div className="text-2xl font-semibold text-gray-800 dark:text-white">
                Heading 5
              </div>
              <div className="text-xl font-medium text-gray-800 dark:text-white">
                Heading 6
              </div>
              <div className="text-lg text-gray-700 dark:text-gray-300">
                Large Text
              </div>
              <div className="text-base text-gray-600 dark:text-gray-400">
                Body Text
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Small Text
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-600">
                Extra Small Text
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Theme Info */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            Current Theme Details
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(themeColors).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div
                    className="w-full h-12 rounded-lg mb-2 border border-gray-200"
                    style={{ backgroundColor: value }}
                  ></div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </div>
                  <div className="text-xs text-gray-500">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThemeDemo;
