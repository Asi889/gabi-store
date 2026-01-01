/**
 * Update .env.local with new WooCommerce API keys
 * Run: node update-keys.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

// Your new keys from the screenshot
const NEW_CONSUMER_KEY = 'ck_44538aa3ffd344dcfd973069f353a1dad4f388a8';
const NEW_CONSUMER_SECRET = 'cs_8b9c8ef2ac7b3dba8b48f64545e0d44c3e189773';

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  process.exit(1);
}

// Read current .env.local
let envContent = fs.readFileSync(envPath, 'utf8');

// Replace the WooCommerce keys
envContent = envContent.replace(
  /NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_[^\s]+/,
  `NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=${NEW_CONSUMER_KEY}`
);

envContent = envContent.replace(
  /NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_[^\s]+/,
  `NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=${NEW_CONSUMER_SECRET}`
);

// Write back
fs.writeFileSync(envPath, envContent);

console.log('✅ Updated .env.local with new API keys!');
console.log(`   Consumer Key: ${NEW_CONSUMER_KEY.substring(0, 10)}...`);
console.log(`   Consumer Secret: ${NEW_CONSUMER_SECRET.substring(0, 10)}...`);
console.log('\n⚠️  IMPORTANT: Restart your Next.js dev server now!');
console.log('   1. Stop the server (Ctrl+C)');
console.log('   2. Start again: npm run dev');
console.log('\nThen test with: node test-woocommerce-keys.js');

