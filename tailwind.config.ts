
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'montserrat': ['Montserrat', 'sans-serif'],
				'roboto': ['Roboto', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Обновленные кастомные цвета PREVENT в мягких женственных тонах
				prevent: {
					lavender: '#B8A8D8',
					'soft-pink': '#E8C5D4', 
					peach: '#F5D5AE',
					'light-gray': '#FAF9FC',
					'risk-low': '#7BC4A4',
					'risk-medium': '#E8B87A',
					'risk-high': '#E8A07A'
				},
				// Дополнительная палитра для женственного дизайна
				feminine: {
					'lavender-50': '#FAF9FC',
					'lavender-100': '#F0EDF5',
					'lavender-200': '#E6E0EB',
					'lavender-300': '#D1C7D8',
					'lavender-400': '#B8A8D8',
					'lavender-500': '#9F89C5',
					'pink-50': '#FDF7F9',
					'pink-100': '#F9EEF2',
					'pink-200': '#F3DCE5',
					'pink-300': '#E8C5D4',
					'pink-400': '#DBACBF',
					'pink-500': '#CE93AA',
					'peach-50': '#FEFCF8',
					'peach-100': '#FDF8F0',
					'peach-200': '#FAF0E1',
					'peach-300': '#F5E4CD',
					'peach-400': '#F5D5AE',
					'peach-500': '#F0C688'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(40px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'glow': {
					'0%': {
						boxShadow: '0 0 5px rgba(184, 168, 216, 0.2), 0 0 10px rgba(184, 168, 216, 0.2), 0 0 15px rgba(184, 168, 216, 0.2)'
					},
					'100%': {
						boxShadow: '0 0 5px rgba(184, 168, 216, 0.5), 0 0 10px rgba(184, 168, 216, 0.5), 0 0 15px rgba(184, 168, 216, 0.5)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.8s ease-out',
				'glow': 'glow 2s ease-in-out infinite alternate'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
