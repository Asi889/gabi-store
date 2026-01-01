# WooCommerce-Specific 401 Fix

## Since You Have No Other Plugins

The issue must be in WooCommerce itself or WordPress core settings.

## Step 1: Verify WooCommerce Status

1. Go to: **WooCommerce → Status**
2. Check:
   - WooCommerce version
   - Any errors or warnings
   - REST API status

## Step 2: Check WooCommerce REST API Settings

1. Go to: **WooCommerce → Settings → Advanced → REST API**
2. Look for any settings that might block API access
3. Check if there's a "Enable REST API" toggle (some versions have this)

## Step 3: Verify the API Key is Actually Active

1. In **WooCommerce → Settings → Advanced → REST API**
2. Click on your API key to view it
3. Make sure it shows:
   - Status: **Active** (not Revoked or Inactive)
   - User: **homestore**
   - Permissions: **Read**

## Step 4: Try Creating Key with Shop Manager Role

Sometimes Administrator role has issues. Try:

1. Go to: **Users → All Users**
2. Edit "homestore" user
3. Change role to **Shop Manager** (if available)
4. Create NEW API key with Shop Manager user
5. Test in browser

## Step 5: Check WordPress Permalink Settings

Sometimes permalink issues affect REST API:

1. Go to: **Settings → Permalinks**
2. Make sure it's NOT set to "Plain"
3. Select any other option (Post name, etc.)
4. Click **Save Changes**
5. Test API again

## Step 6: Check if WooCommerce REST API Endpoint Exists

Test if the endpoint is even available:

Visit in browser:
```
http://real-estate-store.local/wp-json/wc/v3/
```

You should see JSON with available routes. If you get 404, WooCommerce REST API isn't registered.

## Step 7: Verify User Capabilities

The "homestore" user might be missing specific WooCommerce capabilities.

**Check via Database or WP-CLI:**
- User should have `manage_woocommerce` capability
- User should have `read` capability

**Or test with different user:**
1. Create brand new user: "apiuser" with Administrator role
2. Create API key with "apiuser"
3. Test - if it works, "homestore" user has an issue

## Step 8: Check WooCommerce Database

The API key might not be saved correctly. Try:

1. Delete the key completely
2. Clear any WordPress cache
3. Create brand new key
4. Test immediately in browser (before updating .env.local)

## Most Likely Issue

Given everything else is correct, the most likely issues are:

1. **API key not actually saved in database** - Delete and recreate
2. **User missing WooCommerce capabilities** - Try Shop Manager role or different user
3. **Permalink settings** - Make sure not set to "Plain"
4. **WooCommerce version bug** - Update WooCommerce

## Quick Test: Try Shop Manager

1. Change "homestore" to Shop Manager role
2. Create new API key
3. Test in browser
4. If it works, there's a capability issue with Administrator role

