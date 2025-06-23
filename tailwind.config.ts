import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'intel': ['var(--font-intel-one-display)', 'system-ui', 'sans-serif'],
        'intel-light': ['var(--font-intel-one-display-light)', 'system-ui', 'sans-serif'],
        'intel-regular': ['var(--font-intel-one-display-regular)', 'system-ui', 'sans-serif'],
        'intel-medium': ['var(--font-intel-one-display-medium)', 'system-ui', 'sans-serif'],
        'sans': ['var(--font-intel-one-display)', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
          tertiary: "hsl(var(--background-tertiary))",
        },
        foreground: "hsl(var(--foreground))",
        glass: {
          primary: "hsl(var(--glass-primary))",
          secondary: "hsl(var(--glass-secondary))",
          tertiary: "hsl(var(--glass-tertiary))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glass: "hsl(var(--primary-glass))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          glass: "hsl(var(--card-glass))",
        },
        "blue-dark": {
          50: "hsl(var(--blue-dark-50))",
          100: "hsl(var(--blue-dark-100))",
          200: "hsl(var(--blue-dark-200))",
          300: "hsl(var(--blue-dark-300))",
          400: "hsl(var(--blue-dark-400))",
          500: "hsl(var(--blue-dark-500))",
          600: "hsl(var(--blue-dark-600))",
          700: "hsl(var(--blue-dark-700))",
          800: "hsl(var(--blue-dark-800))",
          900: "hsl(var(--blue-dark-900))",
          950: "hsl(var(--blue-dark-950))",
        },
        navy: {
          50: "220 30% 90%",
          100: "220 35% 80%",
          200: "220 40% 70%",
          300: "220 45% 60%",
          400: "220 50% 50%",
          500: "220 55% 40%",
          600: "220 60% 30%",
          700: "220 65% 20%",
          800: "220 70% 12%",
          900: "220 75% 8%",
          950: "220 80% 4%",
        },
        midnight: {
          50: "215 30% 85%",
          100: "215 35% 75%",
          200: "215 40% 65%",
          300: "215 45% 55%",
          400: "215 50% 45%",
          500: "215 55% 35%",
          600: "215 60% 25%",
          700: "215 65% 15%",
          800: "215 70% 8%",
          900: "215 75% 4%",
          950: "215 80% 2%",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
      },
      backdropBlur: {
        'glass': 'var(--glass-blur)',
      },
      boxShadow: {
        'glass': 'var(--shadow-glass)',
        'glass-lg': 'var(--shadow-glass-lg)',
        'blue-glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'blue-glow-lg': '0 0 40px rgba(59, 130, 246, 0.7)',
        'navy-glow': '0 0 20px rgba(30, 58, 138, 0.6)',
        'navy-glow-lg': '0 0 40px rgba(30, 58, 138, 0.8)',
      },
              keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
          "liquid-flow": {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '25%': { transform: 'translateY(-2px) rotate(0.5deg)' },
            '50%': { transform: 'translateY(-4px) rotate(0deg)' },
            '75%': { transform: 'translateY(-2px) rotate(-0.5deg)' },
          },
          "gradient-shift": {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          "status-pulse": {
            '0%, 100%': { opacity: '1', transform: 'scale(1)' },
            '50%': { opacity: '0.8', transform: 'scale(1.05)' },
          },
          "glass-shimmer": {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
          "blue-pulse": {
            '0%, 100%': { 
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
              transform: 'scale(1)' 
            },
            '50%': { 
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)',
              transform: 'scale(1.02)' 
            },
          },
          "recording-ring": {
            '0%': { 
              strokeDasharray: '1, 300',
              strokeDashoffset: '0',
              opacity: '0.6'
            },
            '50%': { 
              strokeDasharray: '150, 300',
              strokeDashoffset: '-50',
              opacity: '0.4'
            },
            '100%': { 
              strokeDasharray: '300, 300',
              strokeDashoffset: '-300',
              opacity: '0.6'
            }
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          "liquid-flow": "liquid-flow 6s ease-in-out infinite",
          "gradient-shift": "gradient-shift 8s ease infinite",
          "status-pulse": "status-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          "glass-shimmer": "glass-shimmer 2s ease-in-out infinite",
          "blue-pulse": "blue-pulse 3s ease-in-out infinite",
          "recording-ring": "recording-ring 3s linear infinite",
        },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
