/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            spacing: {
                128: '32rem',
                144: '36rem',
            },
            borderRadius: {
                '4xl': '2rem',
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            container: {
                center: 'true',
                padding: {
                    DEFAULT: '1rem',
                    sm: '1rem',
                    lg: '2rem',
                    xl: '2rem',
                    '2xl': '3rem',
                },
            },
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
            },
            colors: {
                black: '#000',
                white: '#fff',
                gray: {
                    200: '#F4F4F4',
                    300: '#E8E8E8',
                    400: '#D1D1D1',
                    500: '#A3A3A3',
                    600: '#767676',
                    700: '#484848',
                    800: '#313131',
                    900: '#1A1A1A',
                },
                purple: {
                    200: '#F4F4F4',
                    300: '#E8E8E8',
                    400: '#D1D1D1',
                    500: '#A3A3A3',
                    600: '#767676',
                    700: '#484848',
                    800: '#313131',
                    900: '#8831E1',
                },
                'electric-violet': {
                    50: '#faf5ff',
                    100: '#f2e9fe',
                    200: '#e8d7fd',
                    300: '#d6b7fb',
                    400: '#bd89f7',
                    500: '#a45cf0',
                    600: '#8831e1',
                    700: '#7929c7',
                    800: '#6627a2',
                    900: '#542083',
                    950: '#380b60',
                },
                'button-bg': '#3490dc', // Default background color
                'button-text': '#ffffff', // Default text color
                'button-hover-bg': '#1d72b8', // Default hover background color
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    1: 'hsl(var(--chart-1))',
                    2: 'hsl(var(--chart-2))',
                    3: 'hsl(var(--chart-3))',
                    4: 'hsl(var(--chart-4))',
                    5: 'hsl(var(--chart-5))',
                },
            },
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                cormorant: ['Cormorant Upright', 'sans-serif'],
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0',
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                    to: {
                        height: '0',
                    },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    safelist: ['bg-button-bg', 'text-button-text', 'hover:bg-button-hover-bg'],
    plugins: [require('tailwindcss-animate'),
        plugin(function ({ addVariant }) {
      addVariant('rtl', '[dir="rtl"] &');
      // Optional: LTR variant if needed
      addVariant('ltl', '[dir="ltr"] &');
    }),
    ],
};
