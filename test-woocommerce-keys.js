/**
 * Test WooCommerce API keys directly
 * Run: node test-woocommerce-keys.js
 */

const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    }
  });
}

const WORDPRESS_SITE_URL = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'http://real-estate-store.local';
const CONSUMER_KEY = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

console.log('🔍 Testing WooCommerce API Keys...\n');

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
  console.log('❌ API keys not found in .env.local');
  process.exit(1);
}

console.log('📋 Key Information:');
console.log(`   Consumer Key: ${CONSUMER_KEY.substring(0, 10)}... (length: ${CONSUMER_KEY.length})`);
console.log(`   Consumer Secret: ${CONSUMER_SECRET.substring(0, 10)}... (length: ${CONSUMER_SECRET.length})`);
console.log(`   Key starts with: ${CONSUMER_KEY.startsWith('ck_') ? '✅ ck_' : '❌ (should start with ck_)'}`);
console.log(`   Secret starts with: ${CONSUMER_SECRET.startsWith('cs_') ? '✅ cs_' : '❌ (should start with cs_)'}`);
console.log('');

// Test 1: Query String Method
async function testQueryString() {
  console.log('1️⃣ Testing Query String Method...');
  const url = `${WORDPRESS_SITE_URL}/wp-json/wc/v3/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=1`;
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    if (response.ok) {
      const products = JSON.parse(text);
      console.log(`   ✅ SUCCESS! Found ${products.length} product(s)`);
      return true;
    } else {
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text.substring(0, 200) };
      }
      
      console.log(`   ❌ FAILED: ${response.status} ${response.statusText}`);
      console.log(`   Error: ${JSON.stringify(errorData, null, 2)}`);
      
      if (errorData.code === 'woocommerce_rest_cannot_view') {
        console.log('\n   🔴 DIAGNOSIS: "cannot_view" error means:');
        console.log('      - The API key exists but doesn\'t have Read permissions, OR');
        console.log('      - The user associated with the key doesn\'t have proper capabilities');
        console.log('\n   💡 SOLUTION:');
        console.log('      1. Go to WooCommerce → Settings → Advanced → REST API');
        console.log('      2. Check the API key permissions (must be "Read")');
        console.log('      3. Check which user is associated with the key');
        console.log('      4. Make sure that user is an Administrator');
        console.log('      5. If not, delete the key and create a new one with an Admin user');
      }
      
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

// Test 2: Basic Auth Method
async function testBasicAuth() {
  console.log('\n2️⃣ Testing Basic Auth Method...');
  const url = `${WORDPRESS_SITE_URL}/wp-json/wc/v3/products?per_page=1`;
  const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      }
    });
    
    const text = await response.text();
    
    if (response.ok) {
      const products = JSON.parse(text);
      console.log(`   ✅ SUCCESS! Found ${products.length} product(s)`);
      return true;
    } else {
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text.substring(0, 200) };
      }
      
      console.log(`   ❌ FAILED: ${response.status} ${response.statusText}`);
      console.log(`   Error: ${JSON.stringify(errorData, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

// Test 3: Check if WooCommerce REST API is enabled
async function testWooCommerceAPIExists() {
  console.log('\n3️⃣ Checking if WooCommerce REST API is available...');
  
  try {
    // Try to access the root WooCommerce endpoint
    const response = await fetch(`${WORDPRESS_SITE_URL}/wp-json/wc/v3/`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ WooCommerce REST API is available`);
      console.log(`   Routes: ${Object.keys(data.routes || {}).length} available`);
      return true;
    } else if (response.status === 404) {
      console.log(`   ❌ WooCommerce REST API not found (404)`);
      console.log(`   💡 Make sure WooCommerce plugin is installed and activated`);
      return false;
    } else {
      console.log(`   ⚠️  Unexpected response: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

// Run all tests
(async () => {
  const apiExists = await testWooCommerceAPIExists();
  
  if (apiExists) {
    const queryStringOk = await testQueryString();
    const basicAuthOk = await testBasicAuth();
    
    console.log('\n📊 Summary:');
    console.log(`   WooCommerce API Available: ${apiExists ? '✅' : '❌'}`);
    console.log(`   Query String Auth: ${queryStringOk ? '✅' : '❌'}`);
    console.log(`   Basic Auth: ${basicAuthOk ? '✅' : '❌'}`);
    
    if (!queryStringOk && !basicAuthOk) {
      console.log('\n🔴 Both authentication methods failed!');
      console.log('   This means the API keys are incorrect or don\'t have proper permissions.');
      console.log('\n   Next Steps:');
      console.log('   1. Go to WordPress Admin → WooCommerce → Settings → Advanced → REST API');
      console.log('   2. Look at your API keys list');
      console.log('   3. Check the "User" column - make sure it\'s an Administrator');
      console.log('   4. Check the "Permissions" column - make sure it says "Read"');
      console.log('   5. If either is wrong, delete the key and create a new one');
      console.log('   6. Make sure to copy the ENTIRE key (they\'re long!)');
    }
  }
})();

