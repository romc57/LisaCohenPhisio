# Development Guide

## Quick Start

```bash
# Start development server
npm start

# Validate project structure
npm run validate
```

## Code Organization

### Manager Pattern
Each major functionality is encapsulated in a Manager class:

- **SiteManager** (`app.js`) - Orchestrates all other managers
- **AccessibilityManager** - Handles accessibility features
- **NavigationManager** - Manages navigation behavior  
- **ContentManager** - Renders dynamic content
- **FormManager** - Handles form validation and submission

### CSS Architecture

```
variables.css      → Design tokens (colors, spacing, etc.)
styles-clean.css   → Base styles and layout
components.css     → Reusable UI components
accessibility.css  → Accessibility-specific styles
helpers.css        → Utility classes
```

## Best Practices

### JavaScript
- Use ES6 modules for clean imports/exports
- Implement defensive programming (null checks, error handling)
- Follow the single responsibility principle
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### CSS
- Use CSS custom properties for consistency
- Follow BEM-like naming conventions
- Keep component styles self-contained
- Use semantic class names

### Accessibility
- Always include proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios
- Provide text alternatives for images

## File Structure Rules

### Never Edit These Legacy Files
- `js/main.js` - REMOVED
- `js/modules/accessibility.js` - REMOVED  
- `js/modules/form.js` - REMOVED
- `js/modules/components.js` - REMOVED
- `css/styles.css` - REMOVED

### Always Edit These Modular Files
- `js/app.js` - Main application controller
- `js/modules/*Manager.js` - Individual manager classes
- `css/styles-clean.css` - Base styles
- `css/components.css` - Component styles
- `css/accessibility.css` - Accessibility styles

## Development Workflow

1. **Before Making Changes**
   ```bash
   npm run validate
   ```

2. **After Making Changes**
   ```bash
   npm run validate
   npm start  # Test locally
   ```

3. **Testing Checklist**
   - [ ] Site loads without JavaScript errors
   - [ ] Accessibility button appears and functions
   - [ ] Navigation works on mobile/desktop
   - [ ] Form validation works
   - [ ] All sections render correctly

## Common Issues

### Module Import Errors
- Ensure all imports use correct relative paths
- Check that exported class names match imports
- Verify ES6 module syntax is correct

### CSS Issues
- Check that all CSS custom properties are defined in `variables.css`
- Ensure class names match between CSS and JavaScript
- Verify CSS file load order in `index.html`

### Accessibility Issues
- Test keyboard navigation (Tab, Enter, Escape)
- Check color contrast with accessibility panel
- Verify ARIA labels are present and correct

## Debugging

### JavaScript Console Errors
Most errors will show the manager that failed to initialize:
```
❌ AccessibilityManager initialization failed: [error]
```

### CSS Not Loading
Check browser developer tools Network tab for 404 errors on CSS files.

### Accessibility Panel Not Working
1. Check browser console for JavaScript errors
2. Verify `AccessibilityManager.js` loaded correctly
3. Check that DOM elements exist before initialization

## Performance Tips

### CSS
- Use CSS custom properties instead of repeated values
- Minimize selector specificity
- Use efficient selectors

### JavaScript
- Initialize managers only once
- Use event delegation for dynamic content
- Clean up event listeners on page unload

### Images
- Optimize image sizes
- Use appropriate image formats
- Implement lazy loading for non-critical images
