/**
 * Test connection to WordPress and WooCommerce APIs
 * Run: node test-connection.js
 */

// Load .env.local file manually (Node.js doesn't auto-load it like Next.js does)
const fs = require('fs');
const path = require('path');

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
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://real-estate-store.local/wp-json/wp/v2';
const CONSUMER_KEY = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

console.log('🧪 Testing WordPress & WooCommerce Connections...\n');
console.log('Using URLs:');
console.log(`   WordPress Site: ${WORDPRESS_SITE_URL}`);
console.log(`   WordPress API: ${WORDPRESS_API_URL}\n`);

// Test 1: WordPress REST API
async function testWordPressAPI() {
  console.log('1️⃣ Testing WordPress REST API...');
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/pages?per_page=1`);
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ WordPress API is accessible!`);
      console.log(`   ✅ Found ${data.length} page(s)`);
      return true;
    } else {
      console.log(`   ❌ WordPress API returned: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error connecting to WordPress API: ${error.message}`);
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log(`   💡 The domain "${WORDPRESS_SITE_URL}" cannot be resolved.`);
      console.log(`   💡 Make sure your Local site is running and the domain is correct.`);
    }
    return false;
  }
}

// Test 2: WooCommerce REST API
async function testWooCommerceAPI() {
  console.log('\n2️⃣ Testing WooCommerce REST API...');
  
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.log('   ⚠️  WooCommerce API keys not found in environment');
    console.log('   💡 Make sure NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY and NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET are set');
    return false;
  }
  
  const apiVersions = ['v3', 'v2'];
  
  for (const version of apiVersions) {
    try {
      const apiUrl = `${WORDPRESS_SITE_URL}/wp-json/wc/${version}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=1`;
      console.log(`   Trying WooCommerce API ${version}...`);
      
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const products = await response.json();
        console.log(`   ✅ WooCommerce API ${version} is accessible!`);
        console.log(`   ✅ Found ${products.length} product(s)`);
        return true;
      } else if (response.status === 404) {
        console.log(`   ⚠️  WooCommerce API ${version} returned 404 (endpoint not found)`);
        if (version === 'v3') {
          console.log(`   💡 Trying v2...`);
          continue;
        }
      } else {
        const errorText = await response.text();
        console.log(`   ❌ WooCommerce API ${version} returned: ${response.status}`);
        try {
          const errorData = JSON.parse(errorText);
          console.log(`   Error: ${JSON.stringify(errorData)}`);
        } catch {
          console.log(`   Error: ${errorText.substring(0, 200)}`);
        }
        
        if (response.status === 401) {
          console.log(`   💡 Authentication failed. Check your API keys.`);
        }
        return false;
      }
    } catch (error) {
      console.log(`   ❌ Error connecting to WooCommerce API ${version}: ${error.message}`);
      if (version === 'v3') continue;
      return false;
    }
  }
  
  return false;
}

// Run tests
(async () => {
  const wpOk = await testWordPressAPI();
  const wcOk = await testWooCommerceAPI();
  
  console.log('\n📊 Summary:');
  console.log(`   WordPress API: ${wpOk ? '✅ Working' : '❌ Not Working'}`);
  console.log(`   WooCommerce API: ${wcOk ? '✅ Working' : '❌ Not Working'}`);
  
  if (!wpOk || !wcOk) {
    console.log('\n💡 Troubleshooting Tips:');
    if (!wpOk) {
      console.log('   - Make sure your Local site is running');
      console.log('   - Verify the domain in .env.local matches your Local site domain');
      console.log('   - Try accessing the URL directly in your browser');
    }
    if (!wcOk) {
      console.log('   - Make sure WooCommerce is installed and activated');
      console.log('   - Verify API keys in WooCommerce → Settings → Advanced → REST API');
      console.log('   - Check that the API keys have Read permissions');
    }
    console.log('   - Restart your Next.js dev server after changing .env.local');
  } else {
    console.log('\n✅ All connections working! Your Next.js app should be able to fetch data.');
  }
})();

