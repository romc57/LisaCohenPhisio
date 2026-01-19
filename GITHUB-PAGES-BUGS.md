# GitHub Pages Deployment Bugs

## Issues Identified

### 🔴 CRITICAL BUG #1: Partial Files Not Loading
**Location:** `js/app.js` lines 281-310 (`processPartials()` function)

**Problem:**
```javascript
// Current code (line 290)
tasks.push(fetch(path)
```

The `fetch(path)` uses relative paths like `"partials/header.html"` but doesn't account for GitHub Pages base path.

**What happens:**
- Local: `fetch("partials/header.html")` ✅ Works
- GitHub Pages: `fetch("partials/header.html")` ❌ Fetches from `romc57.github.io/partials/header.html` instead of `romc57.github.io/LisaCohenPhisio/partials/header.html`

**Result:** Header, footer, a11y panel, and contact section don't load on GitHub Pages

**Fix:**
```javascript
// Line 290 should be:
const fullPath = window.buildURL ? window.buildURL(path) : path;
tasks.push(fetch(fullPath)
```

---

### 🔴 CRITICAL BUG #2: Navigation Links Broken
**Location:** `partials/header.html` lines 15-19

**Problem:**
All navigation links use relative paths without base path:
```html
<li><a href="about.html">About</a></li>
<li><a href="products.html">Orthopedic Insoles</a></li>
<li><a href="services.html">Services</a></li>
```

**What happens:**
- Local: `about.html` → `http://localhost:8000/about.html` ✅
- GitHub Pages: `about.html` → `romc57.github.io/about.html` ❌ (404)
- Should be: `romc57.github.io/LisaCohenPhisio/about.html`

**Same issue in:**
- `partials/footer.html` (if it has links)
- `partials/contact.html` (if it has links)

---

### 🔴 CRITICAL BUG #3: Image Paths in Partials
**Location:** `partials/header.html` lines 5-7

**Problem:**
```html
<source srcset="images/logo.avif" type="image/avif" />
<img src="images/slide1.jpg" alt="..." />
```

Images use relative paths without base path.

**Result:** Logo and images in header don't load on GitHub Pages

---

### 🟡 MODERATE BUG #4: CSS/JS Paths in HTML Files
**Location:** All HTML files (index.html, about.html, etc.)

**Problem:**
```html
<link rel="stylesheet" href="css/variables.css" />
<script src="js/basepath.js"></script>
```

These relative paths work locally but may fail on GitHub Pages project sites.

**Why it might work:** GitHub Pages serves files from the repository root, so `css/variables.css` becomes `/LisaCohenPhisio/css/variables.css` automatically for direct file requests. However, this is inconsistent with how fetches work.

---

### 🟡 MODERATE BUG #5: basepath.js Not Applied to Existing Links
**Location:** `js/basepath.js`

**Current behavior:** The script sets `window.__BASE_PATH__` and provides `buildURL()` helper, but:
- Doesn't automatically fix existing links in the HTML
- Only adds "active" class to navigation (lines 31-42)
- Requires manual use of `buildURL()` in JavaScript code

**What's needed:** Automatic URL rewriting on page load

---

## Root Cause Analysis

The site was designed for:
1. **Local development** with `server.js` serving files from root
2. **Custom domain deployment** where site is at domain root

But **GitHub Pages project sites** serve from a subdirectory:
- ❌ Not: `yourdomain.com/about.html`
- ✅ But: `username.github.io/RepoName/about.html`

The `basepath.js` file was added to handle this, but:
1. It's not being used by the `processPartials()` function
2. It's not being used in the partial HTML files
3. It's not automatically rewriting URLs

---

## Testing Checklist

To verify these bugs on GitHub Pages:

1. **Open browser console** on GitHub Pages deployment
2. **Check for fetch errors:**
   ```
   Failed to load resource: net::ERR_FAILED partials/header.html
   Failed to load resource: net::ERR_FAILED partials/footer.html
   Failed to load resource: net::ERR_FAILED partials/a11y.html
   ```
3. **Check DOM:**
   - Header missing (nav not visible)
   - Footer missing
   - Accessibility button missing
4. **Click navigation links:**
   - All links return 404
5. **Check images:**
   - Logo in header not loading
   - May see broken image icons

---

## Recommended Fixes

### Fix #1: Update processPartials() in app.js

**Current (lines 281-310):**
```javascript
async processPartials() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT, null, false);
  const tasks = [];
  while (walker.nextNode()) {
    const comment = walker.currentNode;
    const match = comment.nodeValue && comment.nodeValue.match(/#include\s+file=\"([^\"]+)\"/);
    if (match) {
      const path = match[1];
      tasks.push(fetch(path)  // ❌ BUG HERE
```

**Fixed:**
```javascript
async processPartials() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT, null, false);
  const tasks = [];
  while (walker.nextNode()) {
    const comment = walker.currentNode;
    const match = comment.nodeValue && comment.nodeValue.match(/#include\s+file=\"([^\"]+)\"/);
    if (match) {
      const path = match[1];
      // Use buildURL to add base path for GitHub Pages
      const fullPath = (window.buildURL && window.__BASE_PATH__)
        ? window.buildURL(path)
        : path;
      tasks.push(fetch(fullPath)  // ✅ FIXED
```

---

### Fix #2: Update Links in Partials

**Option A: Use JavaScript to fix on load** (Recommended)
Add to `basepath.js` after line 28:

```javascript
// Fix all internal links to use base path
window.addEventListener('DOMContentLoaded', () => {
  const basePath = window.__BASE_PATH__ || '';
  if (!basePath) return; // No need to fix if no base path

  // Fix all internal links
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    // Only fix relative links (not external, not anchors, not absolute)
    if (href &&
        !href.startsWith('http') &&
        !href.startsWith('//') &&
        !href.startsWith('#') &&
        !href.startsWith(basePath)) {
      a.setAttribute('href', buildURL(href));
    }
  });

  // Fix all images
  document.querySelectorAll('img[src], source[srcset]').forEach(el => {
    if (el.tagName === 'IMG') {
      const src = el.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('//') && !src.startsWith(basePath)) {
        el.setAttribute('src', buildURL(src));
      }
    } else if (el.tagName === 'SOURCE') {
      const srcset = el.getAttribute('srcset');
      if (srcset && !srcset.startsWith('http') && !srcset.startsWith('//')) {
        // Handle srcset format: "path1.jpg 1x, path2.jpg 2x"
        const fixed = srcset.split(',').map(s => {
          const parts = s.trim().split(' ');
          if (parts[0] && !parts[0].startsWith('http') && !parts[0].startsWith(basePath)) {
            parts[0] = buildURL(parts[0]);
          }
          return parts.join(' ');
        }).join(', ');
        el.setAttribute('srcset', fixed);
      }
    }
  });

  // Existing active link code...
  const path = location.pathname.split('/').pop();
  // ... rest of existing code
});
```

**Option B: Hardcode base path in partials** (Not recommended - less flexible)
Update all links manually:
```html
<!-- Would need to update for each deployment -->
<li><a href="/LisaCohenPhisio/about.html">About</a></li>
```

---

### Fix #3: Update HTML Files (Optional)

For maximum compatibility, update resource links in HTML files:

```html
<!-- Current -->
<script src="js/basepath.js"></script>
<link rel="stylesheet" href="css/variables.css" />

<!-- Better (but basepath.js needs to run first) -->
<script>
  // Inline minimal base path detection before loading anything
  (function() {
    const REPO = 'LisaCohenPhisio';
    const host = location.hostname;
    const parts = location.pathname.split('/').filter(Boolean);
    const isGitHub = host.endsWith('.github.io');
    const isProjectPath = isGitHub && parts[0] === REPO;
    window.__BASE_PATH__ = isProjectPath ? '/' + REPO : '';
  })();
</script>
<script src="js/basepath.js"></script>
<link rel="stylesheet" href="css/variables.css" />
```

However, this is likely not necessary since static resources are served correctly by GitHub Pages.

---

## Priority Implementation Order

### Immediate (Must Fix for Site to Work):
1. ✅ Fix processPartials() to use buildURL() - **CRITICAL**
2. ✅ Add URL rewriting to basepath.js - **CRITICAL**

### High Priority (Prevents navigation issues):
3. Test all navigation after fixes
4. Verify images load correctly
5. Test on actual GitHub Pages deployment

### Nice to Have:
6. Add error handling for failed partial loads
7. Add loading indicators while partials load
8. Consider build step to inline partials (eliminate runtime loading)

---

## Alternative Solution: Build Step

Instead of runtime partial loading, use a build tool:

**Option 1: Simple Node.js script**
```javascript
// build.js - Run before deploying
const fs = require('fs');
const path = require('path');

function processIncludes(html) {
  return html.replace(/<!--#include file="([^"]+)" -->/g, (match, file) => {
    try {
      return fs.readFileSync(file, 'utf8');
    } catch (err) {
      console.error(`Failed to include ${file}:`, err);
      return match;
    }
  });
}

// Process all HTML files
['index.html', 'about.html', 'services.html', 'products.html', 'articles.html'].forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const processed = processIncludes(html);
  fs.writeFileSync(`dist/${file}`, processed);
});
```

**Pros:**
- No runtime fetch() calls
- Faster page load
- Works without JavaScript
- No CORS issues

**Cons:**
- Requires build step before deploy
- Need to update deployment process

---

## Testing After Fixes

### Local Testing:
1. Test with dev server: `npm start`
2. Test by opening HTML directly: `file:///path/to/index.html`

### GitHub Pages Testing:
1. Push to branch
2. Enable GitHub Pages for the branch
3. Visit `https://romc57.github.io/LisaCohenPhisio/`
4. Check:
   - ✅ Header visible
   - ✅ Footer visible
   - ✅ Accessibility button visible
   - ✅ All navigation links work
   - ✅ All images load
   - ✅ Contact form visible
   - ✅ Console has no errors

### Test Navigation:
- Click "About" → Should go to `.../LisaCohenPhisio/about.html`
- Click "Services" → Should go to `.../LisaCohenPhisio/services.html`
- Click "Products" → Should go to `.../LisaCohenPhisio/products.html`
- Click logo → Should go to `.../LisaCohenPhisio/index.html`

---

## Long-term Recommendations

1. **Use a build tool** (Vite, Parcel, or custom script) to:
   - Inline partials at build time
   - Handle base paths automatically
   - Minify CSS/JS
   - Optimize images

2. **Consider SSG** (Static Site Generator):
   - 11ty (Eleventy) - Minimal, flexible
   - Astro - Modern, fast
   - Hugo - Very fast builds

3. **Or move to SPA framework** if more interactivity needed:
   - Keep vanilla JS for performance
   - But use proper bundler (Vite) for path handling

4. **Test in both environments**:
   - Local development (localhost)
   - GitHub Pages (project site)
   - Custom domain (if planned)

---

## Deployment Checklist

Before deploying to GitHub Pages:
- [ ] Run local server and test all pages
- [ ] Check browser console for errors
- [ ] Test all navigation links
- [ ] Verify all images load
- [ ] Test accessibility features
- [ ] Test on mobile viewport
- [ ] Apply fixes #1 and #2 above
- [ ] Push to GitHub
- [ ] Test on actual GitHub Pages URL
- [ ] Re-verify all functionality

---

**Last Updated:** 2026-01-18
**Status:** Bugs identified, fixes documented, awaiting implementation
