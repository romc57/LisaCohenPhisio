# Lisa Cohen Physical Therapy & Health Center Website

A modern, accessible, and modular website for Lisa Cohen Physical Therapy & Health Center, built with vanilla JavaScript and CSS for optimal performance and maintainability.

## 🏗️ Architecture

This project follows a modular architecture with clear separation of concerns:

### JavaScript Structure

```
js/
├── app.js                     # Main application entry point and orchestrator
├── data.js                    # Static data (services, products, articles)
└── modules/
    ├── AccessibilityManager.js # Handles all accessibility features
    ├── NavigationManager.js    # Manages responsive navigation
    ├── ContentManager.js       # Renders dynamic content
    └── FormManager.js          # Handles contact form validation and submission
```

### CSS Structure

```
css/
├── variables.css              # CSS custom properties and design tokens
├── styles-clean.css          # Base styles, layout, and typography
├── components.css            # Reusable UI components (cards, buttons, forms)
├── accessibility.css         # Accessibility panel and floating button
└── helpers.css               # Utility classes
```

## 🚀 Features

### Accessibility First
- **Floating accessibility button** - Always visible in viewport corner
- **Comprehensive accessibility panel** - Font size, contrast, animations, RTL support
- **Keyboard navigation** - Full keyboard support with proper focus management
- **Screen reader friendly** - Semantic HTML and ARIA labels
- **Color contrast options** - Multiple high-contrast themes

### Responsive Design
- **Mobile-first approach** - Optimized for all device sizes
- **Progressive enhancement** - Works without JavaScript
- **Touch-friendly** - Optimized for touch interfaces

### Performance
- **Vanilla JavaScript** - No framework overhead
- **Modular loading** - ES6 modules for efficient bundling
- **Optimized assets** - Compressed images and efficient CSS

## 🛠️ Development

### Prerequisites
- Node.js (for development server)
- Modern web browser with ES6 module support

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LisaCohenSite
   ```

2. **Start the development server**
   ```bash
   node server.js
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Project Structure

```
/
├── index.html              # Main HTML file
├── server.js              # Static file server for development
├── README.md              # This file
├── css/                   # Stylesheets (modular)
├── js/                    # JavaScript (modular)
└── assets/               # Images and other static assets
```

## 📚 Module Documentation

### SiteManager (app.js)
The main application controller that coordinates all managers and handles initialization.

**Responsibilities:**
- Initialize all managers in correct order
- Set up global error handling
- Manage application lifecycle

### AccessibilityManager
Handles all accessibility features including the floating button and accessibility panel.

**Features:**
- Font size adjustment (50% to 200%)
- Color contrast options (5 different themes)
- Animation toggle
- RTL (Right-to-Left) text direction
- Settings persistence in localStorage
- Keyboard navigation support

### NavigationManager
Manages responsive navigation behavior.

**Features:**
- Mobile hamburger menu
- Smooth scrolling to sections
- Active section highlighting
- Keyboard navigation

### ContentManager
Renders dynamic content from data.js.

**Responsibilities:**
- Render service cards
- Render product cards
- Render article lists
- Update dynamic content (year, etc.)

### FormManager
Handles contact form validation and submission.

**Features:**
- Real-time validation
- Accessible error messages
- Form submission handling
- User feedback

## 🎨 CSS Architecture

### Design System
The CSS follows a systematic approach using CSS custom properties:

```css
/* Design tokens in variables.css */
:root {
  --purple-700: #5b2b83;
  --purple-500: #8a4ccc;
  --space-1: 0.5rem;
  --space-2: 0.75rem;
  /* ... */
}
```

### Component-Based Styling
Each component is self-contained with clear naming conventions:

```css
/* Example from components.css */
.card {
  background: var(--surface);
  border: 1px solid var(--purple-200);
  border-radius: var(--radius);
  /* ... */
}
```

## 🔧 Configuration

### Environment Variables
The server supports the following environment variables:

- `PORT` - Server port (default: 8000)
- `HOST` - Server host (default: localhost)

### Accessibility Settings
Settings are automatically saved to localStorage with the key `a11y-settings-v1`.

## 🧪 Testing

### Manual Testing Checklist
- [ ] Accessibility button appears in correct corner
- [ ] Accessibility panel opens/closes correctly
- [ ] All accessibility options work as expected
- [ ] Navigation works on mobile and desktop
- [ ] Form validation provides clear feedback
- [ ] Keyboard navigation works throughout site
- [ ] RTL mode works correctly

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🚀 Deployment

This is a static website that can be deployed to any static hosting service:

1. **GitHub Pages** - Push to `gh-pages` branch
2. **Netlify** - Connect repository for automatic deployments
3. **Vercel** - Import project for instant deployment
4. **Traditional hosting** - Upload files via FTP

## 🤝 Contributing

1. Follow the modular architecture
2. Maintain accessibility standards
3. Use semantic HTML
4. Follow CSS naming conventions
5. Test on multiple devices and browsers

## 📝 License

This project is proprietary to Lisa Cohen Physical Therapy & Health Center.

## 📞 Support

For technical support or questions about this website, please contact the development team.
