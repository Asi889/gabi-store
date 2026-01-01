/**
 * Quick script to check your environment variables
 * Run: node check-env.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

console.log('🔍 Checking environment configuration...\n');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file NOT FOUND!');
  console.log('\n📝 Creating .env.local file with correct values...\n');
  
  const envContent = `# WordPress URLs - UPDATE THESE WITH YOUR ACTUAL LOCAL SITE DOMAIN
NEXT_PUBLIC_WORDPRESS_API_URL=http://real-estate-store.local/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_SITE_URL=http://real-estate-store.local

# WooCommerce API Keys - Get these from WooCommerce → Settings → Advanced → REST API
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file!');
  console.log('⚠️  IMPORTANT: Update the values above with your actual:');
  console.log('   1. Local site domain (replace real-estate-store.local with yours)');
  console.log('   2. WooCommerce API keys\n');
} else {
  console.log('✅ .env.local file exists\n');
  
  // Read and check the file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  console.log('📋 Current .env.local contents:\n');
  
  let hasIssues = false;
  const requiredVars = {
    'NEXT_PUBLIC_WORDPRESS_API_URL': false,
    'NEXT_PUBLIC_WORDPRESS_SITE_URL': false,
    'NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY': false,
    'NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET': false,
  };
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Skip comments and empty lines
    if (trimmed.startsWith('#') || trimmed === '') {
      console.log(`   ${line}`);
      return;
    }
    
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=');
    
    if (requiredVars.hasOwnProperty(key)) {
      requiredVars[key] = true;
    }
    
    // Check for common issues
    if (key === 'NEXT_PUBLIC_WORDPRESS_SITE_URL') {
      if (value.includes('127.0.0.1') || value.includes('localhost')) {
        console.log(`   ❌ ${key}=${value}`);
        console.log(`      ⚠️  WRONG! Should use .local domain (e.g., http://real-estate-store.local)`);
        hasIssues = true;
      } else if (value.includes('.local')) {
        console.log(`   ✅ ${key}=${value}`);
      } else {
        console.log(`   ⚠️  ${key}=${value}`);
        console.log(`      Check if this is correct for Local by Flywheel`);
      }
    } else if (key === 'NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY' || key === 'NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET') {
      if (value.includes('your_key') || value.includes('your_secret') || value === '') {
        console.log(`   ⚠️  ${key}=${value || '(empty)'}`);
        console.log(`      ⚠️  NOT SET! Add your WooCommerce API keys`);
        hasIssues = true;
      } else {
        console.log(`   ✅ ${key}=${value.substring(0, 10)}... (hidden)`);
      }
    } else {
      console.log(`   ${line}`);
    }
  });
  
  console.log('\n📊 Status Check:\n');
  
  Object.entries(requiredVars).forEach(([key, found]) => {
    if (found) {
      console.log(`   ✅ ${key}`);
    } else {
      console.log(`   ❌ ${key} - MISSING!`);
      hasIssues = true;
    }
  });
  
  if (hasIssues) {
    console.log('\n⚠️  ISSUES FOUND! Please fix the issues above.');
    console.log('   After fixing, restart your Next.js dev server.\n');
  } else {
    console.log('\n✅ All environment variables look good!');
    console.log('   If you\'re still having issues, make sure you restarted the dev server after making changes.\n');
  }
}

console.log('💡 Tip: Environment variables starting with NEXT_PUBLIC_ are available in the browser.');
console.log('   Make sure to restart your Next.js dev server after changing .env.local\n');

