# Deep Diagnosis: 401 Error Even in Browser

## The Problem

Even testing directly in the browser with the API keys, you're getting:
```json
{
  "code": "woocommerce_rest_cannot_view",
  "message": "Sorry, you cannot list resources."
}
```

This means WooCommerce is rejecting the keys, even though:
- ✅ User is Administrator
- ✅ Keys have Read permissions
- ✅ Store is Live

## Possible Causes

### 1. WooCommerce User Capabilities Issue

The "homestore" user might be Administrator but missing WooCommerce-specific capabilities.

**Check:**
1. Go to: **Users → All Users**
2. Click **Edit** on "homestore"
3. Scroll down and check if there are any WooCommerce-specific role settings
4. Make sure the user has full Administrator capabilities

### 2. API Key Not Actually Saved Correctly

The key might not have been saved with the right permissions.

**Verify:**
1. Go to: **WooCommerce → Settings → Advanced → REST API**
2. Click on your API key to view details
3. Check:
   - User: Should be "homestore"
   - Permissions: Should be "Read"
   - Status: Should be "Active"

### 3. WooCommerce REST API Disabled

The REST API might be disabled in WooCommerce settings.

**Check:**
1. Go to: **WooCommerce → Settings → Advanced → Legacy API**
2. Make sure "Enable the legacy REST API" is checked (if available)
3. Or check: **WooCommerce → Settings → Advanced → REST API**
4. Make sure REST API is enabled

### 4. Plugin Conflict

A security or other plugin might be blocking the REST API.

**Test:**
1. Go to: **Plugins → Installed Plugins**
2. Temporarily deactivate ALL plugins except WooCommerce
3. Test the browser URL again
4. If it works, reactivate plugins one by one to find the culprit

### 5. WordPress REST API Disabled

WordPress REST API might be disabled.

**Test:**
Visit: `http://real-estate-store.local/wp-json/`

You should see JSON with available endpoints. If you get an error, REST API is disabled.

### 6. User Needs WooCommerce Manager Role

Some WooCommerce setups require a "Shop Manager" role instead of Administrator.

**Try:**
1. Go to: **Users → All Users**
2. Edit "homestore" user
3. Change role to **Shop Manager** (if available)
4. Create a new API key with Shop Manager user
5. Test again

## Quick Fixes to Try

### Fix 1: Verify Key Permissions Again

1. Go to: **WooCommerce → Settings → Advanced → REST API**
2. **Delete** your current key
3. **Create a NEW key** with:
   - User: **homestore** (Administrator)
   - Permissions: **Read**
4. Copy keys immediately
5. Update `.env.local`
6. Test in browser again

### Fix 2: Check WooCommerce Status

1. Go to: **WooCommerce → Status → Tools**
2. Look for any errors
3. Check "REST API" section
4. See if there are any warnings

### Fix 3: Test with Different User

1. Create a NEW WordPress user with **Administrator** role
2. Create API key with that user
3. Test if it works
4. If it works, there's something wrong with "homestore" user

### Fix 4: Check WordPress REST API

Test if WordPress REST API works at all:
```
http://real-estate-store.local/wp-json/wp/v2/pages
```

If this works, WordPress REST API is fine.
If this doesn't work, REST API is disabled.

## Most Likely Issue

Given that everything looks correct but still getting 401, the most likely issues are:

1. **WooCommerce-specific user capabilities missing**
2. **Plugin blocking REST API** (security plugin, etc.)
3. **API key not actually saved with correct permissions**

Try Fix 1 first (delete and recreate the key), then Fix 4 (test WordPress REST API), then Fix 3 (test with different user).

