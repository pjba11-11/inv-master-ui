import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Surface layers
                'surface-0': 'var(--surface-0)',
                'surface-1': 'var(--surface-1)',
                'surface-2': 'var(--surface-2)',
                'surface-3': 'var(--surface-3)',

                // Primary accent (warm gold)
                'primary-50': 'var(--primary-50)',
                'primary-100': 'var(--primary-100)',
                'primary-200': 'var(--primary-200)',
                'primary-300': 'var(--primary-300)',
                'primary-400': 'var(--primary-400)',
                'primary-500': 'var(--primary-500)',
                'primary-600': 'var(--primary-600)',
                'primary-700': 'var(--primary-700)',

                // Semantic colors
                'success': 'var(--success)',
                'warning': 'var(--warning)',
                'error': 'var(--error)',
                'info': 'var(--info)',

                // Neutrals
                'neutral-50': 'var(--neutral-50)',
                'neutral-100': 'var(--neutral-100)',
                'neutral-200': 'var(--neutral-200)',
                'neutral-300': 'var(--neutral-300)',
                'neutral-400': 'var(--neutral-400)',
                'neutral-500': 'var(--neutral-500)',
                'neutral-600': 'var(--neutral-600)',
                'neutral-700': 'var(--neutral-700)',
                'neutral-800': 'var(--neutral-800)',
                'neutral-900': 'var(--neutral-900)',

                // Text
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'text-muted': 'var(--text-muted)',
                'text-inverse': 'var(--text-inverse)',
            },
            backgroundImage: {
                'gradient-stat-primary': 'var(--gradient-stat-primary)',
                'gradient-stat-success': 'var(--gradient-stat-success)',
                'gradient-stat-warning': 'var(--gradient-stat-warning)',
                'gradient-stat-info': 'var(--gradient-stat-info)',
                'gradient-primary': 'var(--gradient-primary)',
                'gradient-card-elevated': 'var(--gradient-card-elevated)',
            },
        },
    },
    plugins: [],
};

export default config;
