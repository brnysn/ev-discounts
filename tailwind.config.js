/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "slide-infinite": "slide-x 30s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "slide-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            h1: {
              color: 'hsl(var(--primary))',
            },
            h2: {
              color: 'hsl(var(--primary))',
            },
            h3: {
              color: 'hsl(var(--primary))',
            },
            a: {
              color: 'hsl(var(--primary))',
              '&:hover': {
                color: 'hsl(var(--primary))',
              },
            },
            strong: {
              color: 'hsl(var(--primary))',
            },
            blockquote: {
              borderLeftColor: 'hsl(var(--muted))',
              color: 'hsl(var(--muted-foreground))',
              backgroundColor: 'hsl(var(--muted) / 0.1)',
              padding: '1rem',
              borderRadius: '0.375rem',
            },
            hr: {
              borderColor: 'hsl(var(--border))',
            },
            ul: {
              li: {
                '&::marker': {
                  color: 'hsl(var(--primary))',
                },
              },
            },
            ol: {
              li: {
                '&::marker': {
                  color: 'hsl(var(--primary))',
                },
              },
            },
            code: {
              color: 'hsl(var(--primary))',
              backgroundColor: 'hsl(var(--muted) / 0.3)',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            pre: {
              backgroundColor: 'hsl(var(--card))',
              code: {
                backgroundColor: 'transparent',
                color: 'inherit',
                padding: 0,
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} 