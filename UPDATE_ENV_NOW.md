# ⚠️ URGENT: Update Your .env.local File

## The Problem
Your `.env.local` file was missing! I just created it, but you need to update it with your actual values.

## Step 1: Open .env.local

The file is located at:
```
C:\Users\asi88\Local Sites\headless-store-frontend\.env.local
```

## Step 2: Update These Values

Open the file and replace the placeholder values:

### 1. Find Your Local Site Domain

1. Open **Local by Flywheel**
2. Look at your site name - it should be something like:
   - `real-estate-store.local`
   - `yoursite.local`
   - etc.

### 2. Update the WordPress URLs

**Find this line:**
```env
NEXT_PUBLIC_WORDPRESS_SITE_URL=http://real-estate-store.local
```

**Replace `real-estate-store.local` with YOUR actual Local site domain!**

**Also update:**
```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://real-estate-store.local/wp-json/wp/v2
```
(Replace `real-estate-store.local` with your domain here too)

### 3. Get Your WooCommerce API Keys

1. Go to your WordPress admin: `http://YOUR-SITE.local/wp-admin`
2. Navigate to: **WooCommerce → Settings → Advanced → REST API**
3. Click **Add Key**
4. Fill in:
   - Description: "Next.js Frontend"
   - User: Your admin user
   - Permissions: **Read**
5. Click **Generate API Key**
6. **Copy both keys**

### 4. Update the API Keys in .env.local

**Find these lines:**
```env
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here
```

**Replace with your actual keys:**
```env
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_abc123xyz...
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_def456uvw...
```

## Step 3: Save the File

Save `.env.local` after making changes.

## Step 4: Restart Next.js

**IMPORTANT:** You MUST restart your Next.js dev server after changing `.env.local`:

1. Stop the server (Ctrl+C in the terminal)
2. Start it again: `npm run dev`

## Step 5: Verify It Works

After restarting, check the console. You should see:
- ✅ No more warnings about `127.0.0.1`
- ✅ The URL should show your `.local` domain
- ✅ Products should load (if WooCommerce is set up)

## Quick Checklist

- [ ] Opened `.env.local` file
- [ ] Updated `NEXT_PUBLIC_WORDPRESS_SITE_URL` with your `.local` domain
- [ ] Updated `NEXT_PUBLIC_WORDPRESS_API_URL` with your `.local` domain  
- [ ] Got WooCommerce API keys from WordPress admin
- [ ] Updated `NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY` with your key
- [ ] Updated `NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET` with your secret
- [ ] Saved the file
- [ ] **Restarted Next.js dev server**

## Still Having Issues?

Run this command to check your environment:
```bash
node check-env.js
```

This will show you exactly what's wrong with your `.env.local` file.

