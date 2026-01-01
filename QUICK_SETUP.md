# Quick Setup: Expose Carbon Fields in WordPress REST API

## The Problem
Your Carbon Fields are set up in WordPress admin, but they're not appearing in the REST API response. This is because WordPress doesn't expose custom meta fields by default.

## The Solution (3 Simple Steps)

### Step 1: Find Your Theme's functions.php File

1. Open your WordPress site files (via FTP, File Manager, or Local by Flywheel's file browser)
2. Navigate to: `wp-content/themes/your-theme-name/`
3. Open the file `functions.php`

**If you're using Local by Flywheel:**
- Right-click your site → "Open Site Shell" or "Open Site"
- Navigate to: `app/public/wp-content/themes/your-theme-name/functions.php`

### Step 2: Add the Code

1. Open `wordpress-functions-code.php` in this project folder
2. Copy ALL the code from that file
3. Paste it at the END of your theme's `functions.php` file
4. Save the file

### Step 3: Test It

1. **Clear any WordPress cache** (if you have caching plugins)
2. **Test the debug endpoint** in your browser:
   ```
   http://real-estate-store.local/wp-json/headless-store/v1/debug-page/5
   ```
   This will show you ALL meta fields for page ID 5. Look for fields related to your "Background Image" and "Main Title"

3. **Test the main API endpoint**:
   ```
   http://real-estate-store.local/wp-json/wp/v2/pages?slug=home
   ```
   You should now see a `carbon_fields` object in the JSON response

4. **Refresh your Next.js app** - the image should now appear!

## Troubleshooting

### Still not working?

1. **Check the debug endpoint** - Visit the debug URL above to see what meta keys actually exist
2. **Verify your theme is active** - Make sure you're editing the ACTIVE theme's functions.php
3. **Check for PHP errors** - Look at your WordPress error logs
4. **Clear all caches** - WordPress cache, browser cache, Next.js cache

### Need Help Finding Your Theme?

1. Go to WordPress Admin → Appearance → Themes
2. The active theme is the one that says "Active"
3. That's the theme whose `functions.php` you need to edit

## What This Code Does

- **Exposes Carbon Fields** in the WordPress REST API response
- **Creates a debug endpoint** so you can see all meta fields
- **Creates a custom endpoint** for Carbon Fields specifically

The frontend code will automatically map field names like `CarbonFieldsHeroBGImage` or `_hero_bg_image` to `hero_bg_image`.

