# Intel One Display Font Implementation

This project uses Intel One Display as the primary font family, providing a modern, clean, and professional appearance that aligns with Intel's design language.

## Font Weights Available

- **Light** (300): `intelone-display-light.ttf`
- **Regular** (400): `intelone-display-regular.ttf`
- **Medium** (500): `intelone-display-medium.ttf`

## Implementation Structure

### 1. Font Loading (`lib/fonts.ts`)
```typescript
import localFont from 'next/font/local'

export const intelOneDisplay = localFont({
  src: [
    {
      path: '../public/fonts/intelone-display-light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/intelone-display-regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/intelone-display-medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-intel-one-display',
  display: 'swap',
})
```

### 2. Layout Integration (`app/layout.tsx`)
```typescript
import { intelOneDisplay } from "@/lib/fonts"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${intelOneDisplay.variable} ${intelOneDisplay.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 3. Tailwind Configuration (`tailwind.config.ts`)
```typescript
fontFamily: {
  'intel': ['var(--font-intel-one-display)', 'system-ui', 'sans-serif'],
  'intel-light': ['var(--font-intel-one-display-light)', 'system-ui', 'sans-serif'],
  'intel-regular': ['var(--font-intel-one-display-regular)', 'system-ui', 'sans-serif'],
  'intel-medium': ['var(--font-intel-one-display-medium)', 'system-ui', 'sans-serif'],
  'sans': ['var(--font-intel-one-display)', 'system-ui', 'sans-serif'],
}
```

### 4. CSS Utilities (`app/globals.css`)
```css
.font-intel-light {
  font-family: var(--font-intel-one-display);
  font-weight: 300;
}

.font-intel-regular {
  font-family: var(--font-intel-one-display);
  font-weight: 400;
}

.font-intel-medium {
  font-family: var(--font-intel-one-display);
  font-weight: 500;
}

.text-intel-display {
  font-family: var(--font-intel-one-display);
  letter-spacing: -0.025em;
  font-feature-settings: 'cv01', 'cv02', 'cv03', 'cv04', 'cv05', 'cv06', 'cv07', 'cv08', 'cv09', 'cv10', 'cv11';
}
```

## Usage Guidelines

### Primary Usage Patterns

#### 1. Headings (Use Medium weight)
```tsx
<h1 className="text-3xl font-intel-medium text-intel-display tracking-tight">
  Main Title
</h1>

<h2 className="text-2xl font-intel-medium text-intel-display">
  Section Title
</h2>
```

#### 2. Body Text (Use Regular weight)
```tsx
<p className="font-intel-regular text-intel-display leading-7">
  Main content text that needs to be easily readable.
</p>
```

#### 3. Subtle/Secondary Text (Use Light weight)
```tsx
<p className="text-sm font-intel-light text-intel-display text-muted-foreground">
  Secondary information, captions, or subtle details.
</p>
```

#### 4. UI Elements (Use Medium weight)
```tsx
<Button className="font-intel-medium text-intel-display">
  Action Button
</Button>

<Badge className="font-intel-medium text-intel-display">
  Status Badge
</Badge>
```

### Tailwind Classes Reference

#### Font Family
- `font-intel` - Intel One Display with fallbacks
- `font-intel-light` - Light weight (300)
- `font-intel-regular` - Regular weight (400)
- `font-intel-medium` - Medium weight (500)

#### Typography Enhancement
- `text-intel-display` - Applies font family + optimized letter-spacing + font features

### Typography Components (`components/ui/typography.tsx`)

Pre-built components for consistent typography:

```tsx
import { TypographyH1, TypographyH2, TypographyP, TypographyMuted } from '@/components/ui/typography'

// Usage
<TypographyH1>Main Page Title</TypographyH1>
<TypographyH2>Section Heading</TypographyH2>
<TypographyP>Body paragraph text</TypographyP>
<TypographyMuted>Subtle secondary text</TypographyMuted>
```

## Best Practices

### 1. Weight Selection
- **Light (300)**: Subtle text, captions, secondary information
- **Regular (400)**: Body text, descriptions, general content
- **Medium (500)**: Headings, buttons, emphasis, UI labels

### 2. Combining Classes
Always combine font weight with the display class for optimal rendering:
```tsx
className="font-intel-medium text-intel-display"
```

### 3. Responsive Typography
```tsx
className="text-lg font-intel-regular text-intel-display md:text-xl lg:text-2xl"
```

### 4. Gradient Text with Intel Font
```tsx
className="text-3xl font-intel-medium bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent text-intel-display"
```

## Performance Considerations

- Fonts are loaded with `display: 'swap'` for optimal loading performance
- Font feature settings are applied for enhanced typography
- CSS variables ensure consistent font loading across components
- Fallback fonts (`system-ui`, `sans-serif`) provide graceful degradation

## Migration from Inter

When updating existing components:

1. Replace `font-bold` with `font-intel-medium`
2. Replace `font-medium` with `font-intel-regular`
3. Replace `font-light` with `font-intel-light`
4. Add `text-intel-display` for enhanced rendering
5. Update any custom font-family declarations

## Examples in Current Implementation

```tsx
// Main title
<h1 className="text-3xl font-intel-medium text-intel-display tracking-tight">
  DC DAT 4.0
</h1>

// Subtitle
<p className="text-sm font-intel-light text-intel-display">
  mobileye™
</p>

// Timer display
<div className="text-5xl font-intel-medium text-intel-display tracking-wider">
  {time}
</div>

// Button text
<Button className="font-intel-medium text-intel-display">
  Start Recording
</Button>

// Status badges
<Badge className="font-intel-medium text-intel-display">
  Logger
</Badge>
```

This implementation ensures consistent, professional typography throughout the DCDAT4.0 application while maintaining excellent performance and accessibility. 