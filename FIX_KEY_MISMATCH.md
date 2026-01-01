# Fix: Your API Key Doesn't Match!

## The Problem

Your `.env.local` file has a key ending in `da91d834`, but:
- "next js 222" key ends in `a91d834` (missing the 'd')
- "Next.js Frontend" key ends in `fac393c` (completely different)

**Your .env.local key doesn't match either of your WordPress keys!**

## Solution: Regenerate and Match

### Step 1: Delete ALL Keys

1. Go to: **WooCommerce → Settings → Advanced → REST API**
2. **Delete BOTH keys**:
   - Delete "next js 222"
   - Delete "Next.js Frontend"
3. This ensures no confusion

### Step 2: Create ONE New Key

1. Click **"Add Key"**
2. Fill in:
   ```
   Description: Next.js Frontend
   User: homestore (Administrator - confirmed ✅)
   Permissions: Read (NOT Read/Write!)
   ```
3. Click **"Generate API Key"**

### Step 3: Copy Keys IMMEDIATELY

⚠️ **You can only see them once!**

- **Consumer Key**: Copy the ENTIRE key (starts with `ck_`, ~43 characters)
- **Consumer Secret**: Copy the ENTIRE secret (starts with `cs_`, ~43 characters)

**Write them down or copy to a text file first!**

### Step 4: Update .env.local

1. Open `.env.local` in your project
2. Find these lines:
   ```env
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_...
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_...
   ```
3. Replace with your NEW keys:
   ```env
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_paste_new_key_here
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_paste_new_secret_here
   ```
4. **Save the file**

### Step 5: Verify the Match

After updating, run:
```bash
node -e "const fs = require('fs'); const env = fs.readFileSync('.env.local', 'utf8'); const keyMatch = env.match(/NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=(ck_[^\s]+)/); if (keyMatch) console.log('Key ends with:', keyMatch[1].substring(keyMatch[1].length - 8));"
```

Then check in WordPress - the last 8 characters should match!

### Step 6: RESTART Next.js

1. **Stop** the server (Ctrl+C)
2. **Start** again: `npm run dev`

### Step 7: Test

```bash
node test-woocommerce-keys.js
```

You should now see: ✅ SUCCESS!

## Why This Happened

You probably:
- Copied an old key that was deleted
- Or copied the key incorrectly (missing/extra characters)
- Or the key in .env.local is from a different WordPress site

## Prevention

After creating a new key:
1. **Test it immediately** in browser:
   ```
   http://real-estate-store.local/wp-json/wc/v3/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET
   ```
2. If it works in browser, then update .env.local
3. This way you know the keys are correct before using them in Next.js

