/**
 * WordPress REST API Client
 * 
 * Utility functions to fetch data from WordPress REST API
 */

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/wp-json/wp/v2';
const WORDPRESS_SITE_URL = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'http://localhost';

export interface WordPressPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  featured_image_url?: string;
  carbon_fields?: Record<string, any>;
  _embedded?: any;
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<WordPressPage | null> {
  try {
    // We add a timestamp to the URL to bypass any browser caching during development
    const response = await fetch(
      `${WORDPRESS_API_URL}/pages?slug=${slug}&_embed&cb=${Date.now()}`,
      { cache: 'no-store' } // Disable cache for instant updates
    );

    if (!response.ok) return null;

    const pages: any[] = await response.json();
    if (pages.length === 0) return null;
    
    const page = pages[0];

    if (page._embedded?.['wp:featuredmedia']?.[0]) {
      page.featured_image_url = page._embedded['wp:featuredmedia'][0].source_url;
    }
    
    return page as WordPressPage;
  } catch (error) {
    console.error(`Error fetching page "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch Site Info
 */
export async function getSiteInfo() {
  try {
    const response = await fetch(`${WORDPRESS_SITE_URL}/wp-json/headless-store/v1/site-info`, { cache: 'no-store' });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Fetch Menu
 */
export async function getMenu() {
  try {
    const response = await fetch(`${WORDPRESS_SITE_URL}/wp-json/headless-store/v1/menu`, { cache: 'no-store' });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

/**
 * Fetch WooCommerce Products
 */
export async function getProducts(): Promise<any[]> {
  try {
    const consumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;
    
    if (!consumerKey || !consumerSecret) {
      console.error("❌ MISSING KEYS: Check your .env file for consumer_key and consumer_secret");
      return [];
    }
    
    const base = WORDPRESS_SITE_URL.replace(/\/$/, ""); 
    
    // Check if we are using Application Passwords (username + app password) 
    // or standard WooCommerce Keys (ck_ + cs_)
    const isAppPassword = !consumerKey.startsWith('ck_');
    
    let apiUrl = "";
    let headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (isAppPassword) {
      // Use Basic Auth for Application Passwords
      const auth = Buffer.from(`${consumerKey}:${consumerSecret.replace(/\s/g, '')}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
      apiUrl = `${base}/index.php?rest_route=/wc/v3/products&per_page=100`;
      console.log(`📡 Fetching products using Application Password...`);
    } else {
      // Use Query String for standard WooCommerce keys
      apiUrl = `${base}/index.php?rest_route=/wc/v3/products&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=100`;
      console.log(`📡 Fetching products using standard WooCommerce keys...`);
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: headers,
      cache: 'no-store' // Disable cache for instant updates
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ WooCommerce Error ${response.status}:`, errorText);
      
      if (response.status === 401) {
        console.error("💡 DIAGNOSIS: 401 Unauthorized usually means:");
        console.error("   1. User associated with the API key is not an Administrator.");
        console.error("   2. The API key permissions are not set to 'Read'.");
        console.error("   3. Your local server is blocking the request.");
      }
      
      // Secondary Fallback: Standard wp-json path
      console.log("🔄 Trying standard wp-json path as secondary fallback...");
      const standardUrl = `${base}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=100`;
      const standardResponse = await fetch(standardUrl, { next: { revalidate: 0 } });
      
      if (standardResponse.ok) {
        console.log("✅ Success using Standard path!");
        return await standardResponse.json();
      }
      
      return [];
    }

    const products = await response.json();
    console.log(`✅ Successfully fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error("❌ Network Connection Error:", error);
    return [];
  }
}

/**
 * Fetch a single product by slug or ID
 */
export async function getProductBySlug(slugOrId: string): Promise<any | null> {
  try {
    const consumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;
    const base = WORDPRESS_SITE_URL.replace(/\/$/, ""); 

    // 1. Try fetching by slug first
    const slugUrl = `${base}/index.php?rest_route=/wc/v3/products&slug=${slugOrId}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
    const response = await fetch(slugUrl, { cache: 'no-store' });
    
    if (response.ok) {
      const products = await response.json();
      if (products.length > 0) return products[0];
    }

    // 2. Fallback: Search all products (just in case)
    const allProducts = await getProducts();
    const found = allProducts.find((p: any) => 
      p.slug === slugOrId || 
      p.id.toString() === slugOrId
    );
    
    return found || null;
  } catch (error) {
    console.error(`Error fetching product "${slugOrId}":`, error);
    return null;
  }
}
