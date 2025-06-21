
# PREVENT Design System

A comprehensive design system for the women's health platform PREVENT, built with React and Tailwind CSS.

## Features

- **Brand-consistent color palette** with coral, berry, and sage tones
- **Typography system** using Inter/IBM Plex Sans
- **Atomic Design methodology** (Atoms → Molecules → Organisms)
- **Full WCAG 2.2 AA accessibility** compliance
- **TypeScript support** with comprehensive type definitions
- **Smooth animations** and micro-interactions

## Quick Start

### 1. Import Design Tokens

```typescript
import { colors, typography, spacing } from '@/design-system/tokens';
```

### 2. Use Components

```typescript
import { Badge, Button, HealthCard } from '@/design-system/components';

function MyComponent() {
  return (
    <HealthCard
      title="Сердечно-сосудистая система"
      icon={Heart}
      status="low"
      value="85 bpm"
      subtitle="Пульс в покое"
      actionLabel="Подробнее"
      onAction={() => console.log('Action clicked')}
    />
  );
}
```

### 3. Apply Tailwind Classes

```typescript
// Use brand colors
<div className="bg-coral-500 text-white">Primary action</div>
<div className="bg-sage-100 text-sage-700">Secondary content</div>

// Use typography scale
<h1 className="text-h1">Main heading</h1>
<p className="text-body">Body text</p>
<span className="text-label">Label text</span>
```

## Component Library

### Atoms

- **Badge**: Status indicators with color coding and icons
- **Button**: Accessible buttons with loading states and variants
- **Tooltip**: Medical term explanations with proper ARIA support

### Molecules

- **HealthCard**: Organ system status with CTAs
- **DataRow**: Date + source + indicator for medical data
- **CycleTrackerChip**: Menstrual cycle phase indicators

### Color System

```typescript
// Health status colors
bg-status-low     // #66BFA6 - Low risk
bg-status-medium  // #F4B942 - Medium risk  
bg-status-high    // #DE3B4A - High risk

// Brand colors
bg-coral-500      // #F6635C - Primary care accent
bg-berry-500      // #B42F48 - Trust/menstruation
bg-sage-500       // #557C74 - Secondary CTAs

// Backgrounds
bg-background           // #FFF7F3 - Main UI
bg-background-secondary // #F8E2E0 - Card backgrounds
```

### Typography Scale

```typescript
text-h1          // 36px semibold
text-h2          // 24px medium
text-body        // 16px regular
text-body-large  // 18px regular
text-label       // 14px medium
text-caption     // 12px regular
```

## Accessibility

All components follow WCAG 2.2 AA guidelines:

- ✅ Color contrast ratios meet requirements
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus indicators
- ✅ ARIA labels and descriptions

## Animation System

Gentle, health-focused animations:

```typescript
animate-fade-in      // Entrance animation
animate-slide-up     // Slide content up
animate-gentle-bounce // Subtle attention grabber
animate-pulse-soft    // Soft pulsing effect
```

## Extending the System

### Adding New Components

1. Create component in appropriate atomic level folder
2. Follow existing patterns for props and accessibility
3. Add TypeScript types
4. Export from main index file
5. Document usage examples

### Custom Color Variants

```typescript
// Add to tailwind.prevent.config.ts
extend: {
  colors: {
    'custom-variant': {
      50: '#...',
      500: '#...',
      900: '#...',
    }
  }
}
```

### New Design Tokens

```typescript
// Add to src/design-system/tokens/
export const newToken = {
  // token definitions
} as const;
```

## Migration Guide

To migrate existing components to use the design system:

1. Replace color classes with brand equivalents
2. Update typography classes to design system scale
3. Replace custom components with design system components
4. Ensure accessibility standards are met

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)
- Screen readers (NVDA, JAWS, VoiceOver)

## Contributing

1. Follow atomic design principles
2. Maintain accessibility standards
3. Add TypeScript types for all props
4. Include usage examples in documentation
5. Test with screen readers

---

Built with ❤️ for women's health by the PREVENT team.
