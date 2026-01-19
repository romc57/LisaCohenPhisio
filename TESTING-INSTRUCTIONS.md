# Testing Instructions - GitHub Pages Fix

## What Was Fixed

### Critical Bug Fixed ✅
**Location:** `js/basepath.js` line 27

**The Problem:**
```javascript
// BEFORE (BROKEN):
return (window.__BASE_PATH__ ? window.__BASE_PATH__ + '/' : '/') + path;
//                                                        ^^^
//                                        This '/' was the problem!
```

When running on **localhost** (no base path):
- `buildURL('partials/header.html')` returned `'/partials/header.html'`
- Absolute path `/partials/header.html` doesn't work with relative file serving
- Result: **Partials failed to load → No menu, no images**

**The Fix:**
```javascript
// AFTER (FIXED):
return (window.__BASE_PATH__ ? window.__BASE_PATH__ + '/' : '') + path;
//                                                        ^^
//                                        Empty string now!
```

Now on **localhost**:
- `buildURL('partials/header.html')` returns `'partials/header.html'` ✅
- Relative path works correctly
- Partials load → Menu visible, images load ✅

On **GitHub Pages**:
- `buildURL('partials/header.html')` returns `'/LisaCohenPhisio/partials/header.html'` ✅
- Absolute path with base works correctly

---

## How to Test

### Option 1: Quick Test (Localhost)

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Open in your browser:**
   ```
   http://localhost:8000/
   ```

3. **Verify the following:**
   - [ ] Header with logo and navigation menu **IS VISIBLE** at top
   - [ ] All images load (hero image, slideshow images)
   - [ ] Navigation links work (About, Services, Products, Articles, Contact)
   - [ ] Footer appears at bottom
   - [ ] Accessibility button (floating button) visible in bottom-right corner
   - [ ] No errors in browser console (F12 → Console tab)

### Option 2: Debug Test Page

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Open the test page:**
   ```
   http://localhost:8000/test-site.html
   ```

3. **Run all tests:**
   - Click "Run buildURL Tests" - should show relative paths
   - Click "Fetch Partials" - all should succeed with ✅
   - Click "Test Image Paths" - images should show ✅ Loaded
   - Click "Open Main Site" - should open working site

4. **Check the console output:**
   ```javascript
   Base path: (empty)  // ✅ Correct for localhost
   buildURL test: partials/header.html  // ✅ Relative path
   ```

### Option 3: GitHub Pages Test

1. **Wait 2-5 minutes** after push for GitHub Pages to deploy

2. **Visit GitHub Pages URL:**
   ```
   https://romc57.github.io/LisaCohenPhisio/
   ```

3. **Verify the same checklist as Option 1**

4. **Check console (should show):**
   ```javascript
   Base path: /LisaCohenPhisio  // ✅ Correct for GitHub Pages
   buildURL test: /LisaCohenPhisio/partials/header.html  // ✅ Absolute path
   ```

5. **Test navigation:**
   - Click "About" → URL should be `...github.io/LisaCohenPhisio/about.html`
   - Click "Services" → URL should be `...github.io/LisaCohenPhisio/services.html`
   - All links should work, no 404 errors

---

## Troubleshooting

### Issue: Menu Still Not Visible

**Check browser console (F12):**

1. **If you see errors like:**
   ```
   Failed to load resource: net::ERR_FILE_NOT_FOUND partials/header.html
   ```
   - The fix didn't apply
   - Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Clear browser cache

2. **If you see errors like:**
   ```
   Fetch failed: 404 Not Found
   ```
   - Server issue or wrong URL
   - Verify server is running: `npm start`
   - Check you're on correct URL

3. **If console shows:**
   ```
   Include failed partials/header.html
   ```
   - Partial file might be missing
   - Check `partials/` folder exists with header.html, footer.html, etc.

### Issue: Images Not Loading

**Check:**
1. Browser console for 404 errors on image files
2. `images/` folder exists with required images:
   - `images/slide1.jpg`
   - `images/slide2.jpg`
   - `images/slide3.jpg`
   - `images/slide4.jpg`
   - `images/logo.avif` (or fallback images)
   - `images/lisa-cohen.avif`

3. Image paths in HTML are relative (no leading `/`)

### Issue: Works on Localhost but NOT on GitHub Pages

**Possible causes:**

1. **GitHub Pages not enabled:**
   - Go to repository Settings → Pages
   - Enable Pages for branch `claude/review-ui-ux-notes-6NEba`

2. **Wrong branch deployed:**
   - Verify GitHub Pages is set to correct branch
   - Check branch name matches exactly: `claude/review-ui-ux-notes-6NEba`

3. **Repository name mismatch:**
   - Check `js/basepath.js` line 1: `const REPO = 'LisaCohenPhisio';`
   - Must match actual repository name EXACTLY (case-sensitive)
   - If repo name is different, update this line

4. **Deployment still in progress:**
   - Wait 5 minutes after push
   - Check GitHub Actions tab for deployment status

### Issue: Works on GitHub Pages but NOT on Localhost

**This shouldn't happen with the fix, but if it does:**

1. **Check `__BASE_PATH__` in console:**
   ```javascript
   console.log(window.__BASE_PATH__);
   // Should be empty string on localhost
   ```

2. **If not empty on localhost:**
   - Clear browser cache
   - Hard refresh
   - Check you're accessing `localhost:8000` not `127.0.0.1:8000` or other

---

## Expected Behavior Summary

### On Localhost (http://localhost:8000/)
```javascript
window.__BASE_PATH__ = ""  // Empty string
buildURL('partials/header.html') = "partials/header.html"  // Relative
buildURL('images/logo.avif') = "images/logo.avif"  // Relative
buildURL('about.html') = "about.html"  // Relative
```

### On GitHub Pages (https://romc57.github.io/LisaCohenPhisio/)
```javascript
window.__BASE_PATH__ = "/LisaCohenPhisio"
buildURL('partials/header.html') = "/LisaCohenPhisio/partials/header.html"  // Absolute
buildURL('images/logo.avif') = "/LisaCohenPhisio/images/logo.avif"  // Absolute
buildURL('about.html') = "/LisaCohenPhisio/about.html"  // Absolute
```

---

## Visual Checklist

When the site is working correctly, you should see:

### Header Section (Top of Page)
```
┌────────────────────────────────────────────────────┐
│ [LOGO] Lisa Cohen Physical Therapy & Health Center │
│                                                     │
│     About | Orthopedic Insoles | Services | ...   │
└────────────────────────────────────────────────────┘
```

### Hero Section
```
┌────────────────────────────────────────────────────┐
│  [IMAGE]     Expert Physical Therapy, Orthotics    │
│              & Whole‑Person Care                    │
│                                                     │
│              Personalized, evidence‑based...        │
│                                                     │
│  [Book an Appointment] [Learn about Insoles]      │
└────────────────────────────────────────────────────┘
```

### Slideshow Section
```
┌────────────────────────────────────────────────────┐
│                                                     │
│           [◄]   [SLIDESHOW IMAGE]   [►]           │
│                                                     │
│                    ○ ○ ○ ○                        │
└────────────────────────────────────────────────────┘
```

### Bottom Right Corner
```
                                            ┌─────┐
                                            │  👤  │ ← Accessibility
                                            │     │    Button
                                            └─────┘
```

If you see all of the above, **the site is working correctly!** ✅

---

## Files That Were Changed

1. **js/basepath.js** (line 27)
   - Fixed buildURL() to return relative paths on localhost

2. **test-site.html** (new file)
   - Debug test page to verify all functionality

3. **TESTING-INSTRUCTIONS.md** (this file)
   - Complete testing guide

---

## Next Steps After Testing

Once you confirm the site works on both localhost AND GitHub Pages:

1. **Review the UI/UX recommendations:**
   - Open `UX-UI-REVIEW.md`
   - Prioritize improvements from Phase 1

2. **Consider implementing:**
   - Hebrew language switcher (critical for Israeli market)
   - Floating booking CTA button
   - Patient testimonials section
   - Insurance information

3. **Optional: Remove test file**
   ```bash
   git rm test-site.html
   git commit -m "Remove debug test page"
   git push
   ```

---

## Support

If you still have issues after following this guide:

1. **Check all files are present:**
   ```bash
   ls -la partials/  # Should show header.html, footer.html, a11y.html
   ls -la images/    # Should show slide1.jpg, slide2.jpg, etc.
   ls -la js/        # Should show basepath.js, app.js, data.js, etc.
   ```

2. **Verify git status:**
   ```bash
   git status  # Should be clean or show only expected changes
   git log -1  # Should show the latest commit
   ```

3. **Check server logs:**
   - Look at terminal where `npm start` is running
   - Should show successful file requests, not 404s

4. **Browser developer tools:**
   - F12 → Console: Look for errors
   - F12 → Network: Check which files failed to load
   - F12 → Elements: Verify header/footer HTML is in DOM

---

**Status:** ✅ Bug fixed and ready for testing
**Last Updated:** 2026-01-19
**Branch:** claude/review-ui-ux-notes-6NEba
