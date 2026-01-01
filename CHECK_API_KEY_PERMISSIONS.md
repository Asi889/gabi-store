# How to Check and Fix WooCommerce API Key Permissions

## The Problem
Your API keys are being rejected with "cannot_view" error. This means the keys exist but don't have proper permissions.

## Step-by-Step: Check Your API Key

### Step 1: Go to WooCommerce REST API Settings

1. Open WordPress Admin: `http://real-estate-store.local/wp-admin`
2. Navigate to: **WooCommerce → Settings → Advanced → REST API**
3. You'll see a table with your API keys

### Step 2: Check the Table Columns

Look at your API key in the table. You should see these columns:

| Description | User | Permissions | Last Access |
|------------|------|-------------|-------------|
| Next.js Frontend | **???** | **???** | ... |

### Step 3: Verify the User Column

**The "User" column MUST show an Administrator user.**

- ✅ **CORRECT**: Shows your admin username (e.g., "admin", "homestore")
- ❌ **WRONG**: Shows a non-admin user (e.g., "Editor", "Author", "Subscriber")

**If the user is NOT an Administrator:**
1. Click the **trash icon** to delete the key
2. Click **Add Key** to create a new one
3. In the "User" dropdown, **select your Administrator user**
4. Set Permissions to **Read**
5. Generate and copy the keys

### Step 4: Verify the Permissions Column

**The "Permissions" column MUST say "Read".**

- ✅ **CORRECT**: Shows "Read"
- ❌ **WRONG**: Shows "Write" or "Read/Write"

**If permissions are wrong:**
1. Delete the key
2. Create a new one with **Read** permissions only

## Quick Fix: Create a New Key (Recommended)

Since you're having issues, let's start fresh:

### 1. Delete All Existing Keys

1. Go to **WooCommerce → Settings → Advanced → REST API**
2. Delete ALL existing API keys (click trash icon on each)
3. This ensures no conflicts

### 2. Create a New Key

1. Click **Add Key** button
2. Fill in:
   ```
   Description: Next.js Frontend
   User: [Select your ADMINISTRATOR user from dropdown]
   Permissions: Read [IMPORTANT: Select "Read" not "Write" or "Read/Write"]
   ```
3. Click **Generate API Key**

### 3. Copy the Keys IMMEDIATELY

⚠️ **You can only see them once!**

- **Consumer Key**: Starts with `ck_` (long string, ~43 characters)
- **Consumer Secret**: Starts with `cs_` (long string, ~43 characters)

**Copy the ENTIRE key** - don't miss any characters!

### 4. Update .env.local

Open `.env.local` and update:

```env
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_paste_entire_key_here
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_paste_entire_secret_here
```

**Important:**
- No quotes around the values
- No spaces
- Copy the ENTIRE key (all ~43 characters)

### 5. Verify the User is Administrator

1. Go to **Users → All Users**
2. Find the user you selected for the API key
3. Check the "Role" column
4. It MUST say **Administrator**

**If it doesn't:**
1. Click "Edit" on the user
2. Change "Role" to **Administrator**
3. Click "Update User"

### 6. Restart Next.js

1. Stop dev server (Ctrl+C)
2. Start again: `npm run dev`

### 7. Test

Run the diagnostic script:
```bash
node test-woocommerce-keys.js
```

You should see:
```
✅ SUCCESS! Found X product(s)
```

## Common Mistakes

### ❌ Wrong: Using a non-Administrator user
- The user MUST be an Administrator
- Editor, Author, or Subscriber won't work

### ❌ Wrong: Using Write or Read/Write permissions
- You only need **Read** permissions to fetch products
- Write permissions can cause authentication issues

### ❌ Wrong: Not copying the entire key
- API keys are long (~43 characters)
- Missing even one character will cause 401 errors
- Copy the ENTIRE key from start to finish

### ❌ Wrong: Not restarting Next.js
- Environment variables are cached
- Always restart after changing `.env.local`

## Still Not Working?

### Test the Key Directly in Browser

1. Open your browser
2. Visit (replace with your actual keys):
   ```
   http://real-estate-store.local/wp-json/wc/v3/products?consumer_key=YOUR_KEY&consumer_secret=YOUR_SECRET
   ```

**If this works in browser:**
- Keys are correct
- Issue is in Next.js
- Try restarting dev server again

**If this doesn't work in browser:**
- Keys are wrong or permissions are wrong
- Go back and create new keys with Administrator user and Read permissions

### Check for Security Plugins

Some plugins block REST API:
- Wordfence
- iThemes Security
- Sucuri Security

Temporarily disable them to test, then whitelist REST API endpoints.

## Verification Checklist

- [ ] Deleted old API keys
- [ ] Created new API key
- [ ] Selected **Administrator** user
- [ ] Set permissions to **Read** (not Write)
- [ ] Copied ENTIRE keys (all ~43 characters)
- [ ] Updated `.env.local` with new keys
- [ ] Verified user is Administrator in Users list
- [ ] Restarted Next.js dev server
- [ ] Tested with `node test-woocommerce-keys.js`
- [ ] Tested URL directly in browser

