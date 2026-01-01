# Check WooCommerce Store Visibility Settings

## The Problem

If your WooCommerce store is set to "Coming Soon" or has restricted visibility, the REST API might be blocked even with correct API keys.

## How to Check and Fix

### Step 1: Check Store Visibility

1. Go to WordPress Admin: `http://real-estate-store.local/wp-admin`
2. Navigate to: **WooCommerce → Settings → Advanced → Site visibility**
3. Check the settings:

**Should be set to:**
- ✅ "Allow search engines to index this site" (if you want it public)
- ✅ Or at minimum, the store should not be in "Coming Soon" mode

### Step 2: Check WordPress Site Visibility

1. Go to: **Settings → Reading**
2. Check "Site visibility" section
3. Make sure it's NOT set to:
   - ❌ "Discourage search engines from indexing this site" (unless you want that)
   - ❌ "Coming Soon" mode

### Step 3: Check WooCommerce Store Status

1. Go to: **WooCommerce → Settings → General**
2. Look for any "Store Status" or "Coming Soon" settings
3. Make sure the store is **active/live**

### Step 4: Check for "Coming Soon" Plugins

Some plugins put the site in "Coming Soon" mode:

1. Go to: **Plugins → Installed Plugins**
2. Look for plugins like:
   - "Coming Soon Page"
   - "Maintenance Mode"
   - "Under Construction"
   - Any plugin that might block public access
3. **Temporarily deactivate** them to test

### Step 5: Test REST API Directly

Even if the store is in "Coming Soon" mode, the REST API should still work with proper authentication. But let's test:

1. Open browser
2. Visit (with your actual keys):
   ```
   http://real-estate-store.local/wp-json/wc/v3/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET
   ```

**If this works:**
- Store visibility is fine
- Issue is elsewhere

**If this doesn't work:**
- Store visibility might be blocking it
- Or there's another issue

## Quick Fix: Disable Coming Soon Mode

If you find "Coming Soon" is enabled:

1. **WooCommerce → Settings → Advanced → Site visibility**
   - Make sure it's not blocking the API

2. **Settings → Reading**
   - Make sure site is not in maintenance mode

3. **Plugins**
   - Temporarily disable any "Coming Soon" plugins

4. **Test again** after making changes

## Alternative: Check WooCommerce Status

1. Go to: **WooCommerce → Status → Tools**
2. Look for any errors or warnings
3. Check if REST API is enabled

## Most Likely Issue

If the store is in "Coming Soon" mode, it might:
- Block public REST API access
- Require additional authentication
- Have different API endpoints

But with proper API keys and Administrator user, it should still work. Let's verify the settings!

