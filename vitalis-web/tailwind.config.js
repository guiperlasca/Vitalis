/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0d9488',
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                secondary: {
                    DEFAULT: '#1e293b',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                // Tech Colors
                electric: {
                    DEFAULT: '#0066ff',
                    50: '#e6f0ff',
                    100: '#b3d1ff',
                    200: '#80b3ff',
                    300: '#4d94ff',
                    400: '#1a75ff',
                    500: '#0066ff',
                    600: '#0052cc',
                    700: '#003d99',
                    800: '#002966',
                    900: '#001433',
                },
                cyber: {
                    DEFAULT: '#8b5cf6',
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
                neon: {
                    DEFAULT: '#06b6d4',
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                },
                background: '#f8fafc',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Consolas', 'monospace'],
            },
            animation: {
                'blob': 'blob 7s infinite',
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
                'gradient-shift': 'gradient-shift 3s ease infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
            },
            keyframes: {
                blob: {
                    '0%': {
                        transform: 'translate(0px, 0px) scale(1)',
                    },
                    '33%': {
                        transform: 'translate(30px, -50px) scale(1.1)',
                    },
                    '66%': {
                        transform: 'translate(-20px, 20px) scale(0.9)',
                    },
                    '100%': {
                        transform: 'translate(0px, 0px) scale(1)',
                    },
                },
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0px)',
                    },
                    '50%': {
                        transform: 'translateY(-20px)',
                    },
                },
                glow: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)',
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(102, 126, 234, 0.8)',
                    },
                },
                shimmer: {
                    '0%': {
                        backgroundPosition: '-1000px 0',
                    },
                    '100%': {
                        backgroundPosition: '1000px 0',
                    },
                },
                'gradient-shift': {
                    '0%': {
                        backgroundPosition: '0% 50%',
                    },
                    '50%': {
                        backgroundPosition: '100% 50%',
                    },
                    '100%': {
                        backgroundPosition: '0% 50%',
                    },
                },
                'pulse-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)',
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(102, 126, 234, 0.8)',
                    },
                },
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(102, 126, 234, 0.3)',
                'glow': '0 0 20px rgba(102, 126, 234, 0.5)',
                'glow-lg': '0 0 40px rgba(102, 126, 234, 0.7)',
                'neon': '0 0 30px rgba(6, 182, 212, 0.6)',
                'electric': '0 0 30px rgba(0, 102, 255, 0.6)',
            },
        },
    },
    plugins: [],
}

