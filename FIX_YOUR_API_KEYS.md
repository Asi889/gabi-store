# Fix Your WooCommerce API Keys - Based on Your Screenshot

## What I See in Your WooCommerce Settings

You have **2 API keys**:

1. **"next js 222"**
   - User: homestore
   - Permissions: **Read** ✅ (This is correct!)

2. **"Next.js Frontend"**
   - User: homestore  
   - Permissions: **Read/Write** ❌ (This can cause issues!)

## The Problem

You're probably using the **"Next.js Frontend"** key in your `.env.local` file, which has **Read/Write** permissions. While this should work, sometimes WooCommerce is stricter with Read/Write keys.

## Solution: Use the "Read" Key

### Option 1: Use the "next js 222" Key (Easiest)

1. In WordPress Admin, go to **WooCommerce → Settings → Advanced → REST API**
2. Find the **"next js 222"** key
3. Click on it to view the details
4. **Copy the Consumer Key and Consumer Secret** (you should be able to see them, or regenerate if needed)
5. Update your `.env.local` file with these keys
6. Restart Next.js dev server

### Option 2: Delete and Create Fresh (Recommended)

Since you have two keys and might be confused which one to use:

1. **Delete BOTH keys** (click trash icon on each)
2. **Create ONE new key**:
   - Description: "Next.js Frontend"
   - User: **homestore** (make sure this user is Administrator - see below)
   - Permissions: **Read** (NOT Read/Write!)
3. **Copy both keys immediately**
4. Update `.env.local`
5. Restart Next.js

## Important: Verify "homestore" User is Administrator

The user "homestore" must be an **Administrator**. To check:

1. Go to **Users → All Users** in WordPress admin
2. Find the user "homestore"
3. Check the "Role" column - it MUST say **Administrator**

**If it doesn't say Administrator:**
1. Click "Edit" on the user
2. Change "Role" dropdown to **Administrator**
3. Click "Update User"
4. Then delete your API keys and create new ones

## Quick Steps Right Now

1. **Check if "homestore" is Administrator:**
   - Go to **Users → All Users**
   - Find "homestore"
   - Verify Role = **Administrator**

2. **If homestore is Administrator:**
   - Delete the **"Next.js Frontend"** key (the one with Read/Write)
   - Use the **"next js 222"** key (the one with Read)
   - Or delete both and create one fresh key with Read permissions

3. **Update .env.local:**
   ```env
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
   NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here
   ```

4. **Restart Next.js:**
   - Stop (Ctrl+C)
   - Start: `npm run dev`

5. **Test:**
   ```bash
   node test-woocommerce-keys.js
   ```

## Why This Matters

- **Read permissions**: Perfect for fetching products (what you need)
- **Read/Write permissions**: Can cause authentication issues in some cases
- **Administrator user**: Required for WooCommerce REST API to work properly

The "cannot_view" error you're getting suggests either:
- The user isn't Administrator, OR
- There's an issue with Read/Write permissions

Let's fix both to be sure!

