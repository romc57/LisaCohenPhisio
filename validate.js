#!/usr/bin/env node

/**
 * Validation script for Lisa Cohen PT Website
 * Checks for common issues and validates the modular structure
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Lisa Cohen PT Website...\n');

// Check for required files
const requiredFiles = [
  'index.html',
  'server.js',
  'package.json',
  'README.md',
  'css/variables.css',
  'css/styles-clean.css',
  'css/components.css',
  'css/accessibility.css',
  'css/helpers.css',
  'js/app.js',
  'js/data.js',
  'js/modules/AccessibilityManager.js',
  'js/modules/NavigationManager.js',
  'js/modules/ContentManager.js',
  'js/modules/FormManager.js'
];

console.log('📁 Checking required files...');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    missingFiles.push(file);
  }
});

// Check for legacy files that should be removed
const legacyFiles = [
  'js/main.js',
  'js/modules/accessibility.js',
  'js/modules/form.js',
  'js/modules/components.js',
  'css/styles.css'
];

console.log('\n🗑️  Checking for legacy files...');
let foundLegacyFiles = [];

legacyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`⚠️  ${file} - SHOULD BE REMOVED`);
    foundLegacyFiles.push(file);
  } else {
    console.log(`✅ ${file} - correctly removed`);
  }
});

// Check HTML for correct CSS and JS imports
console.log('\n📄 Checking HTML imports...');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const requiredCSSImports = [
  'css/variables.css',
  'css/styles-clean.css',
  'css/components.css',
  'css/accessibility.css',
  'css/helpers.css'
];

const requiredJSImports = [
  'js/app.js'
];

const legacyCSSImports = [
  'css/styles.css'
];

requiredCSSImports.forEach(css => {
  if (indexHtml.includes(css)) {
    console.log(`✅ CSS: ${css}`);
  } else {
    console.log(`❌ CSS: ${css} - MISSING FROM HTML`);
  }
});

requiredJSImports.forEach(js => {
  if (indexHtml.includes(js)) {
    console.log(`✅ JS: ${js}`);
  } else {
    console.log(`❌ JS: ${js} - MISSING FROM HTML`);
  }
});

legacyCSSImports.forEach(css => {
  if (indexHtml.includes(css)) {
    console.log(`⚠️  CSS: ${css} - LEGACY IMPORT FOUND`);
  } else {
    console.log(`✅ CSS: ${css} - legacy import correctly removed`);
  }
});

// Summary
console.log('\n📊 Validation Summary');
console.log('=====================');

if (missingFiles.length === 0) {
  console.log('✅ All required files present');
} else {
  console.log(`❌ ${missingFiles.length} missing files:`, missingFiles);
}

if (foundLegacyFiles.length === 0) {
  console.log('✅ No legacy files found');
} else {
  console.log(`⚠️  ${foundLegacyFiles.length} legacy files to remove:`, foundLegacyFiles);
}

console.log('\n🎉 Validation complete!');

if (missingFiles.length === 0 && foundLegacyFiles.length === 0) {
  console.log('🏆 Project structure is clean and modular!');
  process.exit(0);
} else {
  console.log('🔧 Some issues found - please review above');
  process.exit(1);
}
