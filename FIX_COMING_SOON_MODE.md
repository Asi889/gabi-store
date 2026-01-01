# Fix: Store is in "Coming Soon" Mode

## The Problem

Your WooCommerce store is set to **"Coming soon"** mode, which can block REST API access even with correct API keys!

## The Fix (2 Steps)

### Step 1: Change to "Live" Mode

1. On the **Site visibility** page you're currently viewing:
2. Select the **"Live"** radio button (instead of "Coming soon")
3. Click **"Save changes"** button at the bottom

### Step 2: Restart and Test

1. **Restart your Next.js dev server** (if it's running):
   - Stop it (Ctrl+C)
   - Start again: `npm run dev`

2. **Test the products page**:
   - Visit: `http://localhost:3000/products`
   - Products should now load!

## Why This Matters

"Coming soon" mode can:
- Block REST API endpoints
- Hide store pages from public access
- Prevent API authentication from working properly

Even though you have:
- ✅ Correct API keys
- ✅ Administrator user
- ✅ Read permissions

The "Coming soon" mode can still block the API!

## After Changing to Live

Once you change to "Live" and save:

1. The store will be visible to everyone
2. REST API will be accessible
3. Your Next.js app should be able to fetch products

## Quick Test

After changing to "Live" and restarting Next.js, run:
```bash
node test-woocommerce-keys.js
```

You should now see: ✅ SUCCESS!

## Note

If you want to keep the store in "Coming soon" mode for visitors but still allow API access, you might need to:
- Check WooCommerce settings for API exceptions
- Or temporarily set to "Live" while developing
- Or configure the "Coming soon" plugin to allow API access

But for now, **changing to "Live"** is the quickest fix!

