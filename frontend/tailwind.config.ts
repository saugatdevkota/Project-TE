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
                primary: '#4f46e5', // indigo-600
                secondary: '#10b981', // emerald-500
                accent: '#fbbf24', // amber-400
            },
        },
    },
    plugins: [],
}
export default config
