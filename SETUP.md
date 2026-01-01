# Quick Setup Guide: Connecting Next.js to WordPress

This guide will help you connect your Next.js frontend to your WordPress backend.

## Step 1: Find Your WordPress Site URL

First, you need to know your WordPress site URL. Here are common scenarios:

### Local Development:
- **Local by Flywheel / LocalWP**: Usually `http://yoursite.local`
- **XAMPP**: Usually `http://localhost/wordpress` or `http://localhost:8080/wordpress`
- **MAMP**: Usually `http://localhost:8888/wordpress`
- **Docker**: Check your docker-compose.yml or container settings

### Production:
- Your live WordPress site URL, e.g., `https://yourdomain.com`

## Step 2: Test WordPress REST API

Before connecting, verify your WordPress REST API is accessible:

1. Open your browser
2. Navigate to: `YOUR_WORDPRESS_URL/wp-json/wp/v2/pages`
   - Example: `http://yoursite.local/wp-json/wp/v2/pages`
3. You should see JSON data. If you see an error, troubleshoot:

   **404 Error:**
   - Check that your WordPress URL is correct
   - Make sure WordPress is installed and running
   
   **CORS Error:**
   - Install a CORS plugin like "REST API - Filter Fields and Remove CORS"
   - Or add CORS headers in your WordPress theme's `functions.php`
   
   **403/401 Error:**
   - Some security plugins block REST API
   - Check your security plugin settings (Wordfence, iThemes Security, etc.)
   - Temporarily disable to test

## Step 3: Create Environment File

1. In your Next.js project root, create a file named `.env.local`
2. Add the following content (replace with your actual WordPress URL):

```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://yoursite.local/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_SITE_URL=http://yoursite.local
```

**Important Notes:**
- Replace `yoursite.local` with your actual WordPress URL
- Don't include a trailing slash
- For HTTPS sites, use `https://` instead of `http://`
- The `NEXT_PUBLIC_` prefix makes these variables available in the browser

## Step 4: Update Next.js Image Configuration (if needed)

If your WordPress site uses a different domain, you may need to update `next.config.ts`:

1. Open `next.config.ts`
2. Add your WordPress domain to the `remotePatterns` array if it's not already there

Example:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-wordpress-domain.com',
    },
  ],
}
```

## Step 5: Create Pages in WordPress

Your Next.js app expects pages with specific slugs. Create these in WordPress:

1. **Home Page**
   - Go to Pages > Add New
   - Title: "Home" (or anything)
   - Slug: `home` (set in Permalink settings)
   - Publish

2. **About Page**
   - Slug: `about`
   - Publish

3. **Contact Page**
   - Slug: `contact`
   - Publish

4. **Products Page** (optional, for WooCommerce)
   - Slug: `products`
   - Publish

**To set the slug:**
- Edit the page
- Click "Edit" next to the permalink
- Change the slug to match (e.g., "home", "about", etc.)

## Step 6: Test the Connection

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000` in your browser

3. You should see:
   - If pages exist: Your WordPress page content
   - If pages don't exist: A welcome message with setup instructions

## Troubleshooting

### "Failed to fetch" errors in console:
- Check that your WordPress URL in `.env.local` is correct
- Verify WordPress REST API is accessible (Step 2)
- Check browser console for CORS errors
- Make sure both servers are running

### Pages not showing:
- Verify page slugs match exactly (case-sensitive)
- Check that pages are published (not draft)
- Test the API directly: `YOUR_WORDPRESS_URL/wp-json/wp/v2/pages?slug=home`

### Images not loading:
- Check `next.config.ts` includes your WordPress domain
- Verify image URLs are accessible
- Check browser console for image errors

### Environment variables not working:
- Make sure the file is named `.env.local` (not `.env`)
- Restart your Next.js dev server after changing `.env.local`
- Variables must start with `NEXT_PUBLIC_` to be available in the browser

## Next Steps

Once connected, you can:
- Create more pages in WordPress and add corresponding routes in Next.js
- Install WooCommerce and add products
- Customize the styling in your Next.js components
- Add more WordPress data (posts, categories, etc.)

## Need Help?

- Check the main README.md for more details
- WordPress REST API docs: https://developer.wordpress.org/rest-api/
- Next.js docs: https://nextjs.org/docs

