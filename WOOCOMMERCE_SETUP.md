# WooCommerce REST API Setup Guide

## Problem: Getting 404 Error

If you're getting a 404 error when trying to fetch products, it usually means one of these issues:

1. **WooCommerce is not installed/activated**
2. **WooCommerce REST API is not enabled**
3. **API keys are incorrect or missing**
4. **SSL certificate issues (if using HTTPS)**

## Step 1: Verify WooCommerce is Installed

1. Go to your WordPress admin: `http://real-estate-store.local/wp-admin`
2. Check **Plugins → Installed Plugins**
3. Make sure **WooCommerce** is installed and **activated**

## Step 2: Enable WooCommerce REST API

1. Go to **WooCommerce → Settings → Advanced → REST API**
2. Click **Add Key**
3. Fill in:
   - **Description**: "Next.js Frontend"
   - **User**: Select your admin user
   - **Permissions**: **Read** (you only need read access for products)
4. Click **Generate API Key**
5. **Copy both the Consumer Key and Consumer Secret** - you'll need these!

## Step 3: Add API Keys to Your .env.local File

1. Open your `.env.local` file in the Next.js project root
2. Add these lines (replace with your actual keys):

```env
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here
```

3. **Important**: 
   - Don't use quotes around the values
   - Make sure there are no spaces
   - The keys should start with `ck_` and `cs_`

## Step 4: Test the API Endpoint

Before testing in Next.js, verify the endpoint works directly:

1. Open your browser
2. Visit (replace with your actual keys):
   ```
   http://real-estate-store.local/wp-json/wc/v3/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET
   ```
   
   Or if using HTTPS:
   ```
   https://real-estate-store.local/wp-json/wc/v3/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET
   ```

3. You should see JSON data with your products
4. If you see an error, check the error message:
   - **404**: WooCommerce not installed or REST API not enabled
   - **401**: Wrong API keys
   - **SSL Error**: Certificate issue (see Step 5)

## Step 5: Fix SSL Certificate Issues (HTTPS Only)

If you're using HTTPS and getting SSL certificate errors:

### Option A: Use HTTP for Local Development (Recommended)

Change your `.env.local` back to HTTP:
```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://real-estate-store.local/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_SITE_URL=http://real-estate-store.local
```

### Option B: Accept Self-Signed Certificates (Development Only)

If you must use HTTPS, you can temporarily disable SSL verification:

1. Create or edit `.env.local`:
```env
NODE_TLS_REJECT_UNAUTHORIZED=0
```

**⚠️ WARNING**: Only use this for local development! Never use this in production.

2. Restart your Next.js dev server

## Step 6: Verify Your Environment Variables

Make sure your `.env.local` file has all the required variables:

```env
# WordPress URLs
NEXT_PUBLIC_WORDPRESS_API_URL=http://real-estate-store.local/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_SITE_URL=http://real-estate-store.local

# WooCommerce API Keys
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here
```

## Step 7: Restart Next.js Dev Server

After making changes to `.env.local`:

1. Stop your Next.js server (Ctrl+C)
2. Start it again: `npm run dev`
3. Visit: `http://localhost:3000/products`

## Troubleshooting

### Still Getting 404?

1. **Check WooCommerce is activated**: WordPress Admin → Plugins
2. **Verify REST API is enabled**: WooCommerce → Settings → Advanced → REST API
3. **Test the endpoint directly** in your browser (see Step 4)
4. **Check the console logs** - the updated code will show you exactly which URL it's trying

### Getting 401 Unauthorized?

1. **Double-check your API keys** - make sure they're correct
2. **Verify the keys have Read permissions**
3. **Make sure there are no extra spaces** in your `.env.local` file
4. **Regenerate the keys** if needed

### Getting SSL/Certificate Errors?

1. **Switch to HTTP** for local development (easiest solution)
2. Or add `NODE_TLS_REJECT_UNAUTHORIZED=0` to `.env.local` (development only!)

### Products Page Shows "No products found"?

1. **Make sure you have products** in WooCommerce
2. Go to **WooCommerce → Products** in WordPress admin
3. Create at least one product and make sure it's **Published**
4. Check the console logs - they'll show how many products were fetched

## Quick Checklist

- [ ] WooCommerce plugin is installed and activated
- [ ] REST API key is created with Read permissions
- [ ] API keys are added to `.env.local`
- [ ] `.env.local` has correct WordPress URLs
- [ ] Tested the API endpoint directly in browser
- [ ] Restarted Next.js dev server after changing `.env.local`
- [ ] Checked console logs for detailed error messages

## Need More Help?

Check the console logs - the updated code provides detailed error messages that will help identify the exact issue!

