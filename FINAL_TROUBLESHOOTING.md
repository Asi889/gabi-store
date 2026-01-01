# Final Troubleshooting: 401 Error Persists

## What We Know

✅ WordPress REST API works (tested)
✅ User is Administrator
✅ Keys have Read permissions  
✅ Store is Live
✅ Keys are correctly formatted
❌ WooCommerce REST API returns 401

## Most Likely Causes

### 1. Plugin Blocking REST API

A security or other plugin might be blocking WooCommerce REST API specifically.

**Test:**
1. Go to: **Plugins → Installed Plugins**
2. **Temporarily deactivate ALL plugins except WooCommerce**
3. Test the browser URL again:
   ```
   http://real-estate-store.local/wp-json/wc/v3/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET
   ```
4. If it works, reactivate plugins one by one to find the culprit

**Common culprits:**
- Wordfence Security
- iThemes Security
- Sucuri Security
- Any "Coming Soon" or "Maintenance Mode" plugins
- REST API blocking plugins

### 2. WooCommerce REST API Not Fully Enabled

**Check:**
1. Go to: **WooCommerce → Settings → Advanced → Legacy API**
2. Make sure "Enable the legacy REST API" is checked (if this option exists)
3. Go to: **WooCommerce → Status → Tools**
4. Look for "REST API" section
5. Check for any errors or warnings

### 3. API Key Not Actually Saved in Database

The key might appear in the UI but not be saved correctly.

**Fix:**
1. **Delete the current key completely**
2. **Create a brand new key** with:
   - User: homestore (Administrator)
   - Permissions: Read
3. **Copy keys immediately**
4. **Test in browser BEFORE updating .env.local**

### 4. User Missing WooCommerce Capabilities

Even though user is Administrator, they might be missing WooCommerce-specific capabilities.

**Check:**
1. Go to: **Users → All Users**
2. Edit "homestore" user
3. Scroll down - are there any WooCommerce-specific role settings?
4. Make sure user has all capabilities

**Alternative:**
1. Create a NEW WordPress user with Administrator role
2. Create API key with that NEW user
3. Test if it works
4. If it works, there's something wrong with "homestore" user

### 5. WooCommerce Version Issue

Older WooCommerce versions might have REST API issues.

**Check:**
1. Go to: **WooCommerce → Status**
2. Check WooCommerce version
3. Make sure it's up to date

## Step-by-Step Fix (Try in Order)

### Step 1: Test with Plugins Disabled

1. Deactivate ALL plugins except WooCommerce
2. Test browser URL
3. If it works → plugin conflict
4. If it doesn't work → continue to Step 2

### Step 2: Create Fresh Key with Different User

1. Create NEW WordPress user: "testadmin" with Administrator role
2. Create API key with "testadmin" user, Read permissions
3. Test in browser
4. If it works → issue with "homestore" user
5. If it doesn't work → continue to Step 3

### Step 3: Check WooCommerce Status

1. Go to: **WooCommerce → Status → Tools**
2. Look for REST API errors
3. Check WooCommerce version
4. Update if needed

### Step 4: Check for .htaccess Rules

Some security configurations block REST API in `.htaccess`.

1. Check if there's a `.htaccess` file blocking REST API
2. Look for rules blocking `/wp-json/` paths

## Quick Test: Try WooCommerce v2 API

Sometimes v3 has issues but v2 works:

```
http://real-estate-store.local/wp-json/wc/v2/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET
```

If v2 works but v3 doesn't, it's a WooCommerce version or configuration issue.

## Nuclear Option: Reinstall WooCommerce

If nothing works:

1. **Backup your site first!**
2. Deactivate WooCommerce
3. Delete WooCommerce plugin
4. Reinstall WooCommerce
5. Reactivate
6. Create new API key
7. Test

## What to Share for Further Help

If none of the above works, share:

1. WooCommerce version (WooCommerce → Status)
2. WordPress version
3. List of active plugins
4. Output of: `node test-woocommerce-keys.js`
5. Whether v2 API works: `http://real-estate-store.local/wp-json/wc/v2/products?consumer_key=...&consumer_secret=...`

