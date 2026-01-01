# Final Fix: WooCommerce 401 Error - Step by Step

## The Root Cause

The error "woocommerce_rest_cannot_view" means the **user** associated with your API key doesn't have the right **capabilities**, even if the API key has "Read" permissions.

## Critical Step: Verify "homestore" User is Administrator

### Step 1: Check User Role

1. Go to WordPress Admin: `http://real-estate-store.local/wp-admin`
2. Navigate to: **Users → All Users**
3. Find the user **"homestore"**
4. Look at the **"Role"** column

**It MUST say "Administrator"**

### Step 2: If NOT Administrator - Fix It

1. Click **"Edit"** on the "homestore" user
2. Scroll down to **"Role"** dropdown
3. Select **"Administrator"** from the dropdown
4. Click **"Update User"** button at the bottom

### Step 3: Delete ALL API Keys

1. Go to: **WooCommerce → Settings → Advanced → REST API**
2. **Delete BOTH keys** (click trash icon on each)
   - Delete "next js 222"
   - Delete "Next.js Frontend"
3. This ensures a fresh start

### Step 4: Create NEW API Key

1. Click **"Add Key"** button
2. Fill in the form:
   ```
   Description: Next.js Frontend
   User: homestore [Select from dropdown - MUST be Administrator now]
   Permissions: Read [Select "Read" - NOT Read/Write]
   ```
3. Click **"Generate API Key"**

### Step 5: Copy Keys IMMEDIATELY

⚠️ **You can only see them once!**

- **Consumer Key**: Starts with `ck_` (copy the ENTIRE key - all ~43 characters)
- **Consumer Secret**: Starts with `cs_` (copy the ENTIRE key - all ~43 characters)

**Double-check:**
- No spaces before or after
- Copy from the very first character to the very last
- Keys are long (~43 characters each)

### Step 6: Update .env.local

1. Open `.env.local` in your project root
2. Find these lines:
   ```env
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_old_key_here
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_old_secret_here
   ```
3. Replace with your NEW keys:
   ```env
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_paste_new_key_here
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_paste_new_secret_here
   ```
4. **Save the file**

**Important:**
- No quotes around values
- No spaces
- One key per line
- Make sure there are no extra spaces

### Step 7: Verify .env.local is Correct

Run this command to check:
```bash
node check-env.js
```

You should see:
- ✅ All variables are set
- ✅ Keys start with `ck_` and `cs_`

### Step 8: RESTART Next.js (Critical!)

1. **Stop** the Next.js server (Ctrl+C in terminal)
2. **Wait 2 seconds**
3. **Start** again: `npm run dev`

**You MUST restart after changing .env.local!**

### Step 9: Test

1. Visit: `http://localhost:3000/products`
2. Check the console - you should see:
   - ✅ `Successfully fetched X products from WooCommerce API`
   - No more 401 errors

Or run the test script:
```bash
node test-woocommerce-keys.js
```

## If Still Not Working

### Test the Key Directly in Browser

1. Open a new browser tab
2. Visit (replace with your actual NEW keys):
   ```
   http://real-estate-store.local/wp-json/wc/v3/products?consumer_key=YOUR_NEW_KEY&consumer_secret=YOUR_NEW_SECRET
   ```

**If this works in browser:**
- Keys are correct ✅
- Issue is in Next.js
- Try:
  - Clearing Next.js cache: Delete `.next` folder, then restart
  - Or: Hard refresh browser (Ctrl+Shift+R)

**If this doesn't work in browser:**
- Keys are wrong or user isn't Administrator ❌
- Go back to Step 1 and verify user role

### Check for WordPress/WooCommerce Issues

1. **WooCommerce Version**: Make sure WooCommerce is up to date
2. **WordPress Version**: Make sure WordPress is up to date
3. **Other Plugins**: Temporarily disable other plugins to test
4. **Theme**: Make sure you're using a compatible theme

### Alternative: Use WP-CLI to Check User

If you have WP-CLI access, run:
```bash
wp user get homestore --field=roles
```

This should return: `administrator`

If it returns something else, fix it:
```bash
wp user set-role homestore administrator
```

## Checklist

- [ ] Verified "homestore" user Role = **Administrator** in Users list
- [ ] Changed user role to Administrator if needed
- [ ] Deleted ALL old API keys
- [ ] Created NEW API key with:
  - [ ] User: homestore (Administrator)
  - [ ] Permissions: **Read** (not Read/Write)
- [ ] Copied ENTIRE keys (all ~43 characters each)
- [ ] Updated `.env.local` with new keys
- [ ] Verified `.env.local` has correct format (no quotes, no spaces)
- [ ] **RESTARTED Next.js dev server** (stopped and started again)
- [ ] Tested API key directly in browser
- [ ] Checked console for success message

## Most Common Mistakes

1. ❌ **Not checking if user is Administrator** - This is #1 cause!
2. ❌ **Not restarting Next.js** after changing .env.local
3. ❌ **Not copying entire key** - missing characters
4. ❌ **Using Read/Write instead of Read** permissions
5. ❌ **Extra spaces in .env.local** file

## Still Stuck?

If you've done ALL the steps above and it's still not working:

1. **Share the output** of: `node test-woocommerce-keys.js`
2. **Share the output** when you test the URL directly in browser
3. **Verify** the user role one more time in WordPress

The issue is almost certainly that "homestore" is not an Administrator. Check that first!

