import React from 'react';
import { useTheme } from '@contexts/ThemeContext';
import { ThemeToggle } from '@molecules';

const ThemeTest = () => {
  const { theme, getThemeColors, isDark, isPlayful } = useTheme();
  const themeColors = getThemeColors();

  return (
    <div className="min-h-screen theme-aware-bg transition-colors duration-300 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold theme-aware-text mb-2">
            Theme System Test
          </h1>
          <p className="text-lg theme-aware-text-secondary">
            Current theme: <span className="font-semibold capitalize">{theme}</span>
          </p>
        </div>

        {/* Theme Controls */}
        <div className="bg-white dark:bg-gray-800 theme-aware-surface rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold theme-aware-text mb-4">Theme Controls</h2>
          <div className="flex flex-wrap gap-4">
            <ThemeToggle variant="button" size="md" showLabel={true} />
            <ThemeToggle variant="dropdown" size="md" showLabel={true} />
            <ThemeToggle variant="simple" size="md" showLabel={false} />
          </div>
        </div>

        {/* Color Display */}
        <div className="theme-aware-surface rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold theme-aware-text mb-4">Current Theme Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(themeColors).map(([key, value]) => (
              <div key={key} className="text-center">
                <div
                  className="w-full h-16 rounded-lg mb-2 border theme-aware-border"
                  style={{ backgroundColor: value }}
                ></div>
                <div className="text-sm font-medium theme-aware-text capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </div>
                <div className="text-xs theme-aware-text-secondary">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Utilities */}
        <div className="theme-aware-surface rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold theme-aware-text mb-4">Theme Utilities</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="theme-aware-text">isDark:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDark ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isDark ? 'true' : 'false'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="theme-aware-text">isPlayful:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isPlayful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isPlayful ? 'true' : 'false'}
              </span>
            </div>
          </div>
        </div>

        {/* CSS Variables Test */}
        <div className="theme-aware-surface rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold theme-aware-text mb-4">CSS Variables Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-theme-primary text-white p-4 rounded-lg text-center">
              Primary Background
            </div>
            <div className="bg-theme-secondary text-white p-4 rounded-lg text-center">
              Secondary Background
            </div>
            <div className="bg-theme-accent text-white p-4 rounded-lg text-center">
              Accent Background
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <p className="text-theme-primary font-semibold">Primary Text Color</p>
            <p className="text-theme-secondary font-semibold">Secondary Text Color</p>
            <p className="text-theme-accent font-semibold">Accent Text Color</p>
          </div>
        </div>

        {/* Gradient Test */}
        <div className="theme-aware-surface rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold theme-aware-text mb-4">Gradient Test</h2>
          <div className="space-y-4">
            <div className="bg-gradient-primary text-white p-4 rounded-lg text-center">
              Primary Gradient Background
            </div>
            <div className="bg-gradient-rainbow text-white p-4 rounded-lg text-center">
              Rainbow Gradient Background
            </div>
            <div className="bg-gradient-sunshine text-black p-4 rounded-lg text-center">
              Sunshine Gradient Background
            </div>
            <div className="text-center">
              <h3 className="text-gradient text-3xl font-bold">Gradient Text</h3>
              <p className="text-gradient-primary text-2xl font-semibold">Primary Gradient Text</p>
              <p className="text-gradient-playful text-xl font-medium">Playful Gradient Text</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;
