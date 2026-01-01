# Headless Store Frontend

A Next.js frontend application that connects to a WordPress headless CMS backend.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- WordPress site running (Local by Flywheel, XAMPP, or any WordPress installation)
- The "Headless Store Base" theme activated in WordPress

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory with your WordPress site URLs:
   ```env
   NEXT_PUBLIC_WORDPRESS_API_URL=http://your-wordpress-site.local/wp-json/wp/v2
   NEXT_PUBLIC_WORDPRESS_SITE_URL=http://your-wordpress-site.local
   ```
   
   **Common WordPress URL formats:**
   - Local by Flywheel / LocalWP: `http://yoursite.local`
   - XAMPP / MAMP: `http://localhost/wordpress` or `http://localhost:8080/wordpress`
   - Production: `https://yourdomain.com`
   
   **Important:** Make sure to replace `your-wordpress-site.local` with your actual WordPress site URL!

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
headless-store-frontend/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── products/          # Products page
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Home page
│   └── not-found.tsx      # 404 page
├── components/            # React components
│   ├── Header.tsx         # Site header/navigation
│   └── Footer.tsx         # Site footer
├── lib/                   # Utility functions
│   └── wordpress.ts       # WordPress REST API client
└── public/                # Static assets
```

## 🔧 WordPress Setup

### 1. Verify WordPress REST API is Accessible

Before connecting, test that your WordPress REST API is working:

1. Open your browser and navigate to: `http://your-wordpress-site.local/wp-json/wp/v2/pages`
2. You should see JSON data. If you see an error, the REST API might be disabled or blocked.

**Common issues:**
- If you see a 404, make sure your WordPress URL is correct
- If you see CORS errors, you may need to install a CORS plugin or configure CORS in your WordPress theme
- Some security plugins block the REST API - check your security plugin settings

### 2. Activate the Theme

1. Go to your WordPress admin panel
2. Navigate to **Appearance > Themes**
3. Activate the **"Headless Store Base"** theme (or any theme - the REST API works with any theme)

### 2. Create Pages

Create the following pages in WordPress:

1. **Home Page**
   - Slug: `home`
   - Template: Select "Home Page" template
   - Add your content

2. **About Page**
   - Slug: `about`
   - Template: Select "About Page" template
   - Add your content

3. **Contact Page**
   - Slug: `contact`
   - Template: Select "Contact Page" template
   - Add your content

4. **Products Page**
   - Slug: `products`
   - Template: Select "Products Page" template
   - Add your content

### 3. (Optional) Install WooCommerce

If you want to use WooCommerce:

1. Install and activate WooCommerce plugin
2. Create products in WordPress
3. Products will automatically appear on the `/products` page

## 🎨 Customization

### Styling

This project uses Tailwind CSS. Modify styles in:
- `app/globals.css` - Global styles
- Component files - Inline Tailwind classes

### Adding New Pages

1. Create a new page in WordPress with your desired slug
2. Create a new folder in `app/` with the same slug
3. Add a `page.tsx` file that fetches and displays the page content

Example:
```typescript
// app/custom-page/page.tsx
import { getPageBySlug } from "@/lib/wordpress";

export default async function CustomPage() {
  const page = await getPageBySlug("custom-page");
  // ... render page
}
```

## 📡 API Endpoints

The WordPress theme provides these REST API endpoints:

- `GET /wp-json/wp/v2/pages` - All pages
- `GET /wp-json/wp/v2/pages?slug={slug}` - Single page by slug
- `GET /wp-json/wp/v2/posts` - All posts
- `GET /wp-json/headless-store/v1/site-info` - Site information
- `GET /wp-json/wc/v3/products` - WooCommerce products (if active)

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Make sure to set your production WordPress URLs in your deployment platform:
- Vercel: Add environment variables in project settings
- Netlify: Add in site settings
- Other platforms: Follow their environment variable documentation

## 🔒 CORS Configuration

The WordPress theme includes CORS headers for development. For production:

1. Edit `app/public/wp-content/themes/headless-store-base/functions.php`
2. Update the `$allowed_origins` array with your production frontend URL

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)

## 🆘 Troubleshooting

### Images not loading

- Check that your WordPress site URL is correct in `.env.local`
- Verify image URLs are accessible
- Check Next.js image configuration in `next.config.ts`

### CORS errors

- Make sure your frontend URL is in the allowed origins list in `functions.php`
- Check that the WordPress theme is activated

### Pages not found

- Verify page slugs match exactly (case-sensitive)
- Check that pages are published in WordPress
- Ensure the REST API is accessible: `http://your-site.local/wp-json/wp/v2/pages`

## 📝 License

This project is open source and available under the MIT License.
