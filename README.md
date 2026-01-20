# Lisa Cohen Physical Therapy & Health Center

A modern, accessible, and visually striking website for Lisa Cohen Physical Therapy & Health Center. Built with vanilla JavaScript and CSS for optimal performance, featuring a vibrant multi-color design system and comprehensive accessibility features.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Design System](#design-system)
- [JavaScript Modules](#javascript-modules)
- [CSS Architecture](#css-architecture)
- [Accessibility](#accessibility)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Browser Support](#browser-support)

---

## Features

### Visual Design
- **Multi-color palette** - Teal, coral, gold, and mint accents complementing purple base
- **Animated gradients** - Dynamic hero section with shifting color animations
- **Glassmorphism effects** - Modern frosted glass UI elements
- **Micro-interactions** - Smooth hover effects, transitions, and animations
- **Dark gradient footer** - Professional dark theme footer section

### Accessibility (IS 5568 AA Compliant)
- **Floating accessibility button** - Always visible, colorful gradient design
- **Circular accessibility panel** - 10 customizable options
- **Font size adjustment** - 50% to 200% scaling
- **High contrast modes** - Multiple contrast themes
- **Color inversion** - Full color invert with image preservation
- **Animation toggle** - Disable all animations
- **RTL support** - Right-to-left text direction
- **Readable font** - Switch to Arial for better readability
- **Link underlining** - Force underlines on all links
- **Grayscale images** - Remove color from images
- **Settings persistence** - Saved to localStorage

### Responsive Design
- **Mobile-first approach** - Optimized for all device sizes
- **Touch-friendly** - 48px minimum touch targets
- **Responsive navigation** - Hamburger menu on mobile
- **Flexible grid layouts** - CSS Grid and Flexbox

### Performance
- **Vanilla JavaScript** - No framework overhead
- **ES6 modules** - Efficient code splitting
- **Vite build system** - Fast development and optimized production builds
- **Optimized assets** - Compressed images, minified CSS/JS

### Content Features
- **Dynamic content rendering** - Services, products, articles from data.js
- **Image slideshow** - Auto-playing carousel with keyboard support
- **Contact form** - Real-time validation with success modal
- **Interactive map** - Leaflet.js integration
- **Smooth scrolling** - Scroll-snap horizontal sections

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup |
| CSS3 | Styling with custom properties |
| Vanilla JavaScript | ES6 modules, no framework |
| Vite 7.3.1 | Build tool and dev server |
| Leaflet.js | Interactive maps |
| GitHub Pages | Hosting and deployment |

---

## Project Structure

```
LisaCohenPhisio/
├── index.html                 # Homepage
├── about.html                 # About page
├── products.html              # Orthopedic insoles catalog
├── services.html              # Services listing
├── articles.html              # Articles/blog listing
├── package.json               # Node.js configuration
├── vite.config.js             # Vite build configuration
├── server.js                  # Development server (legacy)
│
├── css/
│   ├── variables.css          # Design tokens & color palette
│   ├── styles-clean.css       # Base styles, layout, typography
│   ├── components.css         # UI components (cards, buttons, forms)
│   ├── accessibility.css      # Accessibility panel & floating button
│   ├── animations.css         # Scroll reveal & micro-interactions
│   └── helpers.css            # Utility classes
│
├── js/
│   ├── app.js                 # Main SiteManager orchestrator
│   ├── data.js                # Static data (services, products, articles)
│   ├── map.js                 # Leaflet map integration
│   ├── basepath.js            # GitHub Pages base path helper
│   └── modules/
│       ├── AccessibilityManager.js  # All accessibility features
│       ├── NavigationManager.js     # Responsive navigation
│       ├── ContentManager.js        # Dynamic content rendering
│       └── FormManager.js           # Form validation & submission
│
├── partials/
│   ├── header.html            # Site header & navigation
│   ├── footer.html            # Site footer
│   ├── contact.html           # Contact form & info
│   └── a11y.html              # Accessibility panel markup
│
└── images/                    # Image assets
```

---

## Getting Started

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/LisaCohenPhisio.git
cd LisaCohenPhisio

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Validate project structure
npm run validate
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (hot reload) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run validate` | Validate project structure |

---

## Design System

### Color Palette

#### Primary - Purple
```css
--purple-025 to --purple-900  /* Light to dark purple scale */
```

#### Accent Colors
```css
--teal-050 to --teal-600      /* Health/healing - cards, sections */
--coral-050 to --coral-600    /* Warmth - primary CTAs, highlights */
--gold-050 to --gold-500      /* Premium - prices, special badges */
--mint-050 to --mint-300      /* Fresh - alternating backgrounds */
```

### Gradients
```css
--gradient-hero       /* Purple → Teal → Coral (hero text) */
--gradient-cta        /* Coral → Gold (primary buttons) */
--gradient-secondary  /* Teal gradient (secondary buttons) */
--gradient-footer     /* Purple-800 → Purple-900 (dark footer) */
```

### Typography
```css
--font-heading: 'Outfit', sans-serif;
--font-body: 'Inter', sans-serif;
```

### Spacing Scale
```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 2.5rem;
```

### Border Radius
```css
--radius: 20px;
--radius-sm: 12px;
```

---

## JavaScript Modules

### SiteManager (app.js)
Main application controller that orchestrates all managers.

```javascript
class SiteManager {
  init()                    // Initialize all managers
  initializeManagers()      // Create manager instances
  setupAnimations()         // IntersectionObserver for scroll animations
  getManager(name)          // Access manager by name
}
```

### AccessibilityManager
Handles all accessibility features with localStorage persistence.

**Settings:**
- `fontSize` - 50% to 200%
- `contrastHigh` - High contrast mode
- `invertColors` - Color inversion
- `readableFont` - Arial font
- `underlineLinks` - Force link underlines
- `grayscaleImages` - Remove image colors
- `noAnimations` - Disable animations
- `rtl` - Right-to-left direction

### NavigationManager
Manages responsive navigation and mobile menu.

**Features:**
- Hamburger toggle on mobile (< 880px)
- Active link highlighting
- Smooth scroll with offset compensation
- Keyboard navigation support

### ContentManager
Renders dynamic content from data.js.

**Methods:**
- `renderServices()` - Service cards grid
- `renderProducts()` - Product catalog
- `renderArticles()` - Article listings
- `updateYear()` - Dynamic copyright year

### FormManager
Contact form handling with validation.

**Features:**
- Real-time field validation
- Email format checking
- Success modal display
- Error message display

### SlideshowManager
Image carousel with auto-play.

**Features:**
- 4-second auto-advance
- Keyboard controls (arrows, Home, End)
- Pause on hover/focus
- IntersectionObserver pause when off-screen

---

## CSS Architecture

### File Organization

| File | Purpose |
|------|---------|
| `variables.css` | Design tokens, colors, spacing |
| `styles-clean.css` | Base styles, layout, sections |
| `components.css` | Cards, buttons, forms, slideshow |
| `accessibility.css` | A11y panel, floating button |
| `animations.css` | Keyframes, scroll reveal |
| `helpers.css` | Utility classes |

### Component Examples

#### Cards
```css
.card {
  border-left: 4px solid var(--teal-400);  /* Colored accent */
  /* Hover: border changes to coral, top gradient appears */
}
```

#### Buttons
```css
.btn-primary    /* Coral-Gold gradient */
.btn-secondary  /* Teal gradient */
.btn-outline    /* Teal border */
.btn-ghost      /* Transparent */
```

#### Section Headers
```css
.section h2::after {
  /* Coral-to-teal gradient underline */
}
```

---

## Accessibility

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate focusable elements |
| `Enter` | Activate buttons/links |
| `Escape` | Close accessibility panel |
| `Arrow Keys` | Slideshow navigation |
| `Home/End` | First/last slide |

### ARIA Implementation
- `role="navigation"` - Navigation landmark
- `role="dialog"` - Accessibility panel modal
- `aria-expanded` - Mobile menu state
- `aria-selected` - Slideshow dots
- `aria-label` - Descriptive labels
- `aria-live="polite"` - Setting change announcements

### Focus Management
- Visible focus indicators (3px outline)
- Focus trap in modal dialogs
- Skip link for main content

---

## Development Guide

### Best Practices

#### JavaScript
- Use ES6 modules for imports/exports
- Implement defensive programming (null checks)
- Follow single responsibility principle
- Add JSDoc comments for complex functions

#### CSS
- Use CSS custom properties for consistency
- Follow BEM-like naming conventions
- Keep component styles self-contained
- Mobile-first media queries

#### Accessibility
- Always include ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain 4.5:1 color contrast

### Testing Checklist
- [ ] Site loads without JavaScript errors
- [ ] Accessibility button visible and functional
- [ ] All accessibility options work
- [ ] Navigation works on mobile/desktop
- [ ] Form validation provides feedback
- [ ] Keyboard navigation throughout
- [ ] RTL mode displays correctly
- [ ] Reduced motion respected

### Common Issues

**Module Import Errors**
- Check relative paths are correct
- Verify class names match exports

**CSS Not Loading**
- Check Network tab for 404s
- Verify file paths in HTML

**Accessibility Panel Issues**
- Check console for errors
- Verify DOM elements exist before init

---

## Deployment

### GitHub Pages (Configured)

```bash
# Build and deploy
npm run build
# Push to main branch - GitHub Actions deploys automatically
```

### Manual Deployment

1. Run `npm run build`
2. Upload `dist/` folder to hosting
3. Configure base path if not root

### Other Platforms
- **Netlify** - Connect repo for auto-deploy
- **Vercel** - Import project
- **Traditional** - FTP upload dist folder

---

## Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

### Required Features
- CSS Custom Properties
- ES6 Modules
- IntersectionObserver
- CSS Grid & Flexbox
- backdrop-filter (graceful degradation)

---

## License

Proprietary - Lisa Cohen Physical Therapy & Health Center

---

## Contact

For technical support or questions about this website, please contact the development team.
