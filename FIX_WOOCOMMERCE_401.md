# Fix: WooCommerce 401 Authentication Error

## The Error
```
❌ WooCommerce API Error (v3): 401
code: 'woocommerce_rest_cannot_view'
message: 'Sorry, you cannot list resources.'
```

## What This Means
The API keys are being sent, but WooCommerce is rejecting them because:
- The keys don't have **Read** permissions, OR
- The user associated with the keys doesn't have proper capabilities, OR
- The keys are incorrect

## Step-by-Step Fix

### Step 1: Delete the Old API Key

1. Go to WordPress Admin: `http://real-estate-store.local/wp-admin`
2. Navigate to: **WooCommerce → Settings → Advanced → REST API**
3. Find your existing API key (the one you're currently using)
4. **Delete it** (click the trash icon)

### Step 2: Create a New API Key

1. In the same page, click **Add Key**
2. Fill in the form:
   - **Description**: `Next.js Frontend` (or any name you want)
   - **User**: Select your **Administrator** user (important!)
   - **Permissions**: Select **Read** (NOT Write or Read/Write)
3. Click **Generate API Key**

### Step 3: Copy the Keys IMMEDIATELY

⚠️ **IMPORTANT**: You can only see the keys once! Copy them now:

- **Consumer Key**: Starts with `ck_` (e.g., `ck_abc123...`)
- **Consumer Secret**: Starts with `cs_` (e.g., `cs_def456...`)

### Step 4: Update .env.local

Open your `.env.local` file and update:

```env
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_your_new_key_here
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_your_new_secret_here
```

**Important:**
- Don't use quotes around the values
- No spaces before or after the `=`
- Make sure the keys start with `ck_` and `cs_`

### Step 5: Verify the User Has Proper Permissions

The user you selected for the API key must be an **Administrator**. To check:

1. Go to **Users → All Users**
2. Find the user you used for the API key
3. Make sure their role is **Administrator**

If not:
1. Edit the user
2. Change role to **Administrator**
3. Save

### Step 6: Restart Next.js

**CRITICAL**: You MUST restart your Next.js dev server:

1. Stop the server (Ctrl+C in terminal)
2. Start it again: `npm run dev`

### Step 7: Test

1. Visit: `http://localhost:3000/products`
2. Check the console - you should see:
   - ✅ `Successfully fetched X products from WooCommerce API`
   - No more 401 errors

## Common Mistakes

### ❌ Wrong: Using Write or Read/Write permissions
- You only need **Read** permissions to fetch products
- Write permissions can cause issues

### ❌ Wrong: Using a non-Administrator user
- The user must be an Administrator
- Subscriber, Editor, or Author roles won't work

### ❌ Wrong: Not restarting the dev server
- Next.js caches environment variables
- Always restart after changing `.env.local`

### ❌ Wrong: Copying keys incorrectly
- Make sure you copy the ENTIRE key (they're long!)
- No extra spaces or line breaks
- Keys should start with `ck_` and `cs_`

## Still Not Working?

### Test the API Key Directly

1. Open your browser
2. Visit (replace with your actual keys):
   ```
   http://real-estate-store.local/wp-json/wc/v3/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET
   ```

**If this works in the browser:**
- The keys are correct
- The issue is in Next.js
- Try restarting the dev server again

**If this doesn't work in the browser:**
- The keys are wrong or don't have permissions
- Go back to Step 1 and create new keys

### Check WooCommerce is Active

1. Go to **Plugins → Installed Plugins**
2. Make sure **WooCommerce** is installed and **activated**

### Check for Security Plugins

Some security plugins block REST API access:
- Wordfence
- iThemes Security
- Sucuri

Temporarily disable them to test, then whitelist the REST API endpoints.

## Verification Checklist

- [ ] Deleted old API key
- [ ] Created new API key with **Read** permissions
- [ ] Selected **Administrator** user
- [ ] Copied both keys correctly
- [ ] Updated `.env.local` with new keys
- [ ] Keys start with `ck_` and `cs_`
- [ ] No extra spaces in `.env.local`
- [ ] Restarted Next.js dev server
- [ ] Tested the API URL directly in browser
- [ ] WooCommerce plugin is activated

