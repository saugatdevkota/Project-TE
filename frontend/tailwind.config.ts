import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF5A5F', // Coral (Superprof-like)
                    50: '#FFF0F1',
                    100: '#FFE1E2',
                    200: '#FFC3C5',
                    300: '#FFA5A8',
                    400: '#FF878B',
                    500: '#FF5A5F',
                    600: '#E64045',
                    700: '#CC2B30',
                    800: '#B31D21',
                    900: '#991215',
                },
                secondary: '#10B981', // Emerald (unchanged for success states)
                coral: '#FF5A5F',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '3rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
export default config
