# Match Your API Keys - Quick Guide

## Your Current Setup

From your screenshots, I can see:

1. ✅ **"homestore" user IS Administrator** - This is correct!
2. You have **2 API keys**:
   - **"next js 222"** - Consumer key ends in: `***a91d834` - Permissions: **Read** ✅
   - **"Next.js Frontend"** - Consumer key ends in: `***fac393c` - Permissions: **Read/Write** ❌

## Which Key Should You Use?

**Use the "next js 222" key** - it has **Read** permissions which is what you need.

## How to Get the Full Keys

Since you can only see the last 8 characters in WordPress, you need to either:

### Option 1: View the Key (if possible)
1. Click on the **"next js 222"** key in the table
2. If it shows the full key, copy it
3. If not, you'll need to regenerate (see Option 2)

### Option 2: Regenerate the Key (Recommended)

Since you can't see the full keys, let's create a fresh one:

1. **Delete BOTH existing keys** (click trash icon on each)
2. **Create ONE new key**:
   - Description: "Next.js Frontend"
   - User: **homestore** (Administrator - confirmed ✅)
   - Permissions: **Read** (NOT Read/Write!)
3. Click **"Generate API Key"**
4. **Copy BOTH keys immediately** (you can only see them once!)

## Update .env.local

After getting the keys, update your `.env.local`:

```env
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_paste_full_key_here
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_paste_full_secret_here
```

**Important:**
- Use the **"next js 222"** key (ends in `a91d834`) OR your new key
- Make sure it has **Read** permissions
- Copy the ENTIRE key (all ~43 characters)

## Verify Which Key You're Using

After updating, run:
```bash
node test-woocommerce-keys.js
```

This will show you which key you're using and test it.

## Quick Test

To verify your keys work, test directly in browser:

1. Get your full Consumer Key and Secret
2. Visit (replace with your actual keys):
   ```
   http://real-estate-store.local/wp-json/wc/v3/products?consumer_key=YOUR_FULL_KEY&consumer_secret=YOUR_FULL_SECRET
   ```

If this works in the browser, the keys are correct and the issue is elsewhere.
If this doesn't work, the keys are wrong or need to be regenerated.

