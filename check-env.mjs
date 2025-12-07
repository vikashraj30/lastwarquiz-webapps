/**
 * Check if .env.local is properly configured
 * Run: node check-env.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n' + '='.repeat(60));
console.log('  🔍 FIREBASE CONFIGURATION CHECKER');
console.log('='.repeat(60) + '\n');

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ ERROR: .env.local file NOT FOUND!\n');
  console.log('📝 You need to create .env.local file with Firebase credentials\n');
  console.log('📍 Location: ' + envPath + '\n');
  console.log('📖 See ENV-SETUP-INSTRUCTIONS.txt for detailed steps\n');
  console.log('🚀 Quick setup: run "create-env.bat" to create it interactively\n');
  process.exit(1);
}

console.log('✅ .env.local file found!\n');

const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const foundVars = {};
lines.forEach(line => {
  const [key, value] = line.split('=').map(s => s.trim());
  if (key && value) {
    foundVars[key] = value;
  }
});

console.log('Checking required variables:\n');

let allGood = true;
requiredVars.forEach(varName => {
  const value = foundVars[varName];
  if (!value) {
    console.log(`  ❌ ${varName}: MISSING`);
    allGood = false;
  } else if (value.includes('your-') || value.includes('-here')) {
    console.log(`  ⚠️  ${varName}: PLACEHOLDER (needs real value)`);
    allGood = false;
  } else {
    const preview = value.length > 30 ? value.substring(0, 30) + '...' : value;
    console.log(`  ✅ ${varName}: ${preview}`);
  }
});

console.log('\n' + '='.repeat(60));

if (allGood) {
  console.log('  ✅ ALL CHECKS PASSED!');
  console.log('  🚀 Your Firebase configuration is ready!');
  console.log('\n  Next steps:');
  console.log('  1. Make sure dev server is running: npm run dev');
  console.log('  2. Open: http://localhost:5174/');
  console.log('  3. Try signing in with Google');
} else {
  console.log('  ❌ CONFIGURATION INCOMPLETE');
  console.log('\n  Please fix the issues above:');
  console.log('  1. Replace placeholder values with real Firebase credentials');
  console.log('  2. Get credentials from: https://console.firebase.google.com/');
  console.log('  3. Run this script again to verify: node check-env.mjs');
}

console.log('='.repeat(60) + '\n');

