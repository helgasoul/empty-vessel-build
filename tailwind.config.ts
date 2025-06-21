
import type { Config } from "tailwindcss";
import { colors, typography, spacing, borderRadius, shadows } from './src/design-system/tokens';

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
				sans: typography.fontFamily.primary,
				body: typography.fontFamily.secondary,
			},
			fontSize: {
				'h1': [typography.fontSize.h1, { lineHeight: typography.lineHeight.tight, fontWeight: typography.fontWeight.semibold }],
				'h2': [typography.fontSize.h2, { lineHeight: typography.lineHeight.normal, fontWeight: typography.fontWeight.medium }],
				'h3': [typography.fontSize.h3, { lineHeight: typography.lineHeight.normal, fontWeight: typography.fontWeight.medium }],
				'h4': [typography.fontSize.h4, { lineHeight: typography.lineHeight.normal, fontWeight: typography.fontWeight.medium }],
				'body': [typography.fontSize.body, { lineHeight: typography.lineHeight.normal }],
				'body-large': [typography.fontSize.bodyLarge, { lineHeight: typography.lineHeight.normal }],
				'body-small': [typography.fontSize.bodySmall, { lineHeight: typography.lineHeight.normal }],
				'label': [typography.fontSize.label, { lineHeight: typography.lineHeight.normal, fontWeight: typography.fontWeight.medium }],
				'caption': [typography.fontSize.caption, { lineHeight: typography.lineHeight.normal }],
			},
			colors: {
				// PREVENT Brand Colors - Direct color assignments
				primary: {
					50: '#F3F1FF',
					100: '#E8E1FF',
					200: '#D4C7FF',
					300: '#B8A8FF',
					400: '#9B7CFF',
					500: '#7C3AED',
					600: '#6D28D9',
					700: '#5B21B6',
					800: '#4C1D95',
					900: '#3C1A78',
					DEFAULT: '#7C3AED',
					foreground: '#FFFFFF',
				},
				
				gradient: {
					50: '#FDF2F8',
					100: '#FCE7F3',
					200: '#FBCFE8',
					300: '#F9A8D4',
					400: '#F472B6',
					500: '#EC4899',
					600: '#DB2777',
					700: '#BE185D',
					800: '#9D174D',
					900: '#831843',
					DEFAULT: '#EC4899',
				},
				
				accent: {
					50: '#F0F9FF',
					100: '#E0F2FE',
					200: '#BAE6FD',
					300: '#7DD3FC',
					400: '#38BDF8',
					500: '#0EA5E9',
					600: '#0284C7',
					700: '#0369A1',
					800: '#075985',
					900: '#0C4A6E',
					DEFAULT: '#0EA5E9',
					foreground: '#FFFFFF',
				},
				
				// Background system
				background: {
					DEFAULT: '#FAFAFA',
					secondary: '#F8FAFC',
					tertiary: '#FFFFFF',
				},
				
				// Text system
				foreground: '#1E293B',
				text: {
					primary: '#1E293B',
					secondary: '#64748B',
					tertiary: '#94A3B8',
					inverse: '#FFFFFF',
					brand: '#7C3AED',
				},
				
				// Status colors
				status: {
					low: '#10B981',
					medium: '#F59E0B',
					high: '#EF4444',
					success: '#10B981',
					warning: '#F59E0B',
					error: '#EF4444',
					info: '#3B82F6',
				},
				
				// Semantic health colors
				health: {
					menstruation: '#EC4899',
					ovulation: '#F97316',
					fertility: '#10B981',
					pregnancy: '#F59E0B',
					menopause: '#7C3AED',
				},
				
				// UI colors
				border: {
					DEFAULT: '#E2E8F0',
					light: '#E2E8F0',
					medium: '#CBD5E1',
					dark: '#94A3B8',
				},
				
				// shadcn/ui compatibility
				secondary: {
					DEFAULT: '#F8FAFC',
					foreground: '#1E293B',
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#F8FAFC',
					foreground: '#64748B',
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#1E293B',
				},
				card: {
					DEFAULT: '#F8FAFC',
					foreground: '#1E293B',
				},
				input: '#CBD5E1',
				ring: '#7C3AED',
				
				sidebar: {
					DEFAULT: '#F8FAFC',
					foreground: '#1E293B',
					primary: '#7C3AED',
					'primary-foreground': '#FFFFFF',
					accent: '#FFFFFF',
					'accent-foreground': '#1E293B',
					border: '#E2E8F0',
					ring: '#7C3AED',
				}
			},
			borderRadius: {
				...borderRadius,
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			boxShadow: shadows,
			backgroundImage: {
				'gradient-brand': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #0EA5E9 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #F3F1FF 0%, #FDF2F8 100%)',
				'gradient-accent': 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
				'gradient-background': 'linear-gradient(135deg, #FAFAFA 0%, #F8FAFC 100%)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
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
				'gentle-bounce': {
					'0%, 100%': {
						transform: 'translateY(0)',
					},
					'50%': {
						transform: 'translateY(-4px)',
					}
				},
				'pulse-soft': {
					'0%': {
						opacity: '1',
					},
					'50%': {
						opacity: '0.7',
					},
					'100%': {
						opacity: '1',
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.8s ease-out',
				'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
