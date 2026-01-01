# After Generating Your API Key - Next Steps

## ✅ Your Settings Look Perfect!

From your screenshot, I can see:
- ✅ User: **homestore** (Administrator)
- ✅ Permissions: **Read**

## Step 1: Generate and Copy Keys

1. Click **"Generate API key"** button
2. **IMMEDIATELY copy both keys** - you can only see them once!

You'll see:
- **Consumer Key**: Starts with `ck_` (long string, ~43 characters)
- **Consumer Secret**: Starts with `cs_` (long string, ~43 characters)

**⚠️ CRITICAL: Copy the ENTIRE key from start to finish!**

## Step 2: Test the Keys in Browser First

Before updating .env.local, test if they work:

1. Open a new browser tab
2. Visit (replace with your actual keys):
   ```
   http://real-estate-store.local/wp-json/wc/v3/products?consumer_key=YOUR_FULL_KEY&consumer_secret=YOUR_FULL_SECRET
   ```

**If you see JSON data with products:**
- ✅ Keys are correct!
- Proceed to Step 3

**If you see an error:**
- ❌ Keys might be wrong
- Check that you copied the entire key
- Try generating again

## Step 3: Update .env.local

1. Open `.env.local` in your project root
2. Find these lines:
   ```env
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_old_key_here
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_old_secret_here
   ```
3. Replace with your NEW keys:
   ```env
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_paste_your_new_key_here
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_paste_your_new_secret_here
   ```
4. **Save the file**

**Important:**
- No quotes around values
- No spaces before or after `=`
- One key per line
- Make sure you copied the ENTIRE key (all ~43 characters)

## Step 4: Verify the Keys Match

After updating, verify the last 8 characters match:

```bash
node -e "const fs = require('fs'); const env = fs.readFileSync('.env.local', 'utf8'); const keyMatch = env.match(/NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=(ck_[^\s]+)/); if (keyMatch) console.log('Key in .env.local ends with:', keyMatch[1].substring(keyMatch[1].length - 8));"
```

Then check in WordPress - the last 8 characters should match what you see in the API keys table.

## Step 5: RESTART Next.js

**CRITICAL:** You MUST restart after changing .env.local!

1. **Stop** Next.js server (Ctrl+C in terminal)
2. **Wait 2 seconds**
3. **Start** again: `npm run dev`

## Step 6: Test

1. Visit: `http://localhost:3000/products`
2. Check the console - you should see:
   - ✅ `Successfully fetched X products from WooCommerce API`
   - No more 401 errors!

Or run the test script:
```bash
node test-woocommerce-keys.js
```

You should see:
```
✅ SUCCESS! Found X product(s)
```

## Quick Checklist

- [ ] Generated API key with:
  - [ ] User: homestore (Administrator) ✅
  - [ ] Permissions: Read ✅
- [ ] Copied ENTIRE Consumer Key (all ~43 characters)
- [ ] Copied ENTIRE Consumer Secret (all ~43 characters)
- [ ] Tested keys in browser URL (should show JSON)
- [ ] Updated `.env.local` with new keys
- [ ] Verified no extra spaces or quotes in .env.local
- [ ] **RESTARTED Next.js dev server** (stopped and started)
- [ ] Tested products page - should show products!

## If Still Not Working

If you still get 401 errors after all this:

1. **Double-check** the keys work in browser URL
2. **Verify** you restarted Next.js (not just refreshed browser)
3. **Check** .env.local has correct format (no quotes, no spaces)
4. **Run** `node test-woocommerce-keys.js` and share the output

The keys should work now since you have:
- ✅ Administrator user
- ✅ Read permissions
- ✅ Fresh keys

Good luck! 🚀

