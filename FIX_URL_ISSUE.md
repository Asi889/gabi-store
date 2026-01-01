# Fix: "Site Not Found" Error

## The Problem

You're getting a "Site Not Found" error from Local by Flywheel because your `.env.local` file is using `http://127.0.0.1` instead of your Local site's domain.

## The Solution

Update your `.env.local` file to use your Local by Flywheel site's `.local` domain.

### Step 1: Find Your Local Site Domain

1. Open **Local by Flywheel**
2. Look at your site - the domain should be something like:
   - `real-estate-store.local`
   - `yoursite.local`
   - etc.

### Step 2: Update .env.local

Open your `.env.local` file in the Next.js project root and update it:

**❌ WRONG:**
```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://127.0.0.1/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_SITE_URL=http://127.0.0.1
```

**✅ CORRECT:**
```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://real-estate-store.local/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_SITE_URL=http://real-estate-store.local
```

**Replace `real-estate-store.local` with YOUR actual Local site domain!**

### Step 3: Restart Next.js

1. Stop your Next.js dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Visit: `http://localhost:3000/products`

## Why This Happens

Local by Flywheel uses custom `.local` domains (like `real-estate-store.local`) that are managed by its router. Using `127.0.0.1` or `localhost` won't work because Local's router doesn't recognize those as valid sites.

## Verify It Works

After updating, you should see in the console:
- ✅ The URL should show `http://real-estate-store.local` (or your domain)
- ✅ No more "Site Not Found" errors
- ✅ Products should load (if WooCommerce is set up correctly)

