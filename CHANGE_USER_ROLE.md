# How to Change User Role

## The Problem

You can't change your own user's role while logged in as that user. You need to either:
1. Log in as a different Administrator, OR
2. Create a new Administrator user first

## Solution 1: Create a New Administrator User (Easiest)

### Step 1: Create New Admin User

1. While logged in as "homestore", go to: **Users → Add New**
2. Fill in:
   - Username: `admin` (or any name)
   - Email: your email
   - Password: create a strong password
   - Role: **Administrator**
3. Click **Add New User**

### Step 2: Log Out and Log In as New User

1. Log out of WordPress (top right corner)
2. Log in with your NEW Administrator user
3. Now you can edit "homestore" user

### Step 3: Change "homestore" Role

1. Go to: **Users → All Users**
2. Click **Edit** on "homestore"
3. Change Role to **Shop Manager**
4. Click **Update User**

### Step 4: Create New API Key

1. Go to: **WooCommerce → Settings → Advanced → REST API**
2. Delete old key
3. Create new key with "homestore" (now Shop Manager)
4. Copy keys and test

## Solution 2: Use WP-CLI (If Available)

If you have WP-CLI access in Local by Flywheel:

1. Open terminal in Local
2. Navigate to your site
3. Run:
   ```bash
   wp user set-role homestore shop_manager
   ```

## Solution 3: Direct Database Edit (Advanced)

If you have database access:

1. Open phpMyAdmin or database tool
2. Go to `wp_users` table
3. Find "homestore" user ID
4. Go to `wp_usermeta` table
5. Find rows where `user_id` = homestore's ID
6. Find `wp_capabilities` meta_key
7. Change value to: `a:1:{s:13:"shop_manager";b:1;}`

**⚠️ Only do this if you know what you're doing!**

## Quickest Solution

**Create a new Administrator user, log in as that user, then change "homestore" to Shop Manager.**

This is the safest and easiest way!

