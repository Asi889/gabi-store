# Try Shop Manager Role Instead

## The Issue

Even though "homestore" is an Administrator, WooCommerce might require specific WooCommerce capabilities that aren't being granted properly.

## Solution: Try Shop Manager Role

Shop Manager role has all WooCommerce capabilities by default and is often more reliable for REST API access.

### Step 1: Change User Role

1. Go to: **Users → All Users**
2. Click **Edit** on "homestore" user
3. Find the **Role** dropdown
4. Change from **Administrator** to **Shop Manager**
5. Click **Update User**

### Step 2: Delete Old API Key

1. Go to: **WooCommerce → Settings → Advanced → REST API**
2. Delete your current API key

### Step 3: Create New API Key

1. Click **Add Key**
2. Fill in:
   - Description: "Next.js Frontend"
   - User: **homestore** (now Shop Manager)
   - Permissions: **Read**
3. Click **Generate API Key**
4. **Copy both keys immediately**

### Step 4: Test in Browser

Test the new key:
```
http://real-estate-store.local/wp-json/wc/v3/products?consumer_key=NEW_KEY&consumer_secret=NEW_SECRET
```

**If this works:**
- ✅ The issue was with Administrator role
- Update `.env.local` with new keys
- Restart Next.js

**If this still doesn't work:**
- There's a deeper WooCommerce configuration issue
- See alternative solutions below

## Alternative: Check User Capabilities

If Shop Manager doesn't work, the user might be missing capabilities:

1. Go to: **Users → All Users**
2. Edit "homestore"
3. Scroll down - are there any capability checkboxes?
4. Make sure all are checked

## Why Shop Manager Might Work

Shop Manager role has:
- All WooCommerce capabilities
- Product management permissions
- REST API access permissions
- Sometimes works better than Administrator for API access

Administrator has all WordPress capabilities but might be missing some WooCommerce-specific ones in certain setups.

## If Shop Manager Works

You can either:
1. Keep user as Shop Manager (recommended for API access)
2. Or add WooCommerce capabilities to Administrator role manually

Try Shop Manager first - it's the quickest test!

