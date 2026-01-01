# Carbon Fields REST API Setup

## Problem
Carbon Fields data is not being exposed in the WordPress REST API by default. The `meta` object in the REST API response only contains basic WordPress meta fields, not Carbon Fields.

## Solution
You need to expose Carbon Fields in your WordPress backend by adding code to your theme's `functions.php` file.

## Step 1: Add Code to WordPress Theme

Open your WordPress theme's `functions.php` file (usually located at):
```
wp-content/themes/your-theme-name/functions.php
```

Add the following code to expose Carbon Fields in the REST API:

```php
/**
 * Expose Carbon Fields in WordPress REST API
 */
add_filter('rest_prepare_page', 'expose_carbon_fields_in_rest_api', 10, 3);
add_filter('rest_prepare_post', 'expose_carbon_fields_in_rest_api', 10, 3);

function expose_carbon_fields_in_rest_api($response, $post, $request) {
    // Get all post meta (including Carbon Fields)
    $meta = get_post_meta($post->ID);
    
    // Carbon Fields are stored with various prefixes
    // Common patterns: _field_name, CarbonFieldsFieldName, etc.
    $carbon_fields = array();
    
    foreach ($meta as $key => $value) {
        // Include all meta fields that might be Carbon Fields
        // Carbon Fields often start with underscore or "CarbonFields"
        if (
            strpos($key, '_') === 0 || 
            strpos($key, 'CarbonFields') === 0 ||
            strpos($key, 'carbon_fields') === 0
        ) {
            // Get the actual value (meta returns arrays)
            $carbon_fields[$key] = is_array($value) && count($value) === 1 
                ? $value[0] 
                : $value;
        }
    }
    
    // Add carbon_fields to the REST API response
    $response->data['carbon_fields'] = $carbon_fields;
    
    return $response;
}
```

## Step 2: Alternative - Custom REST API Endpoint (Recommended)

For better control and performance, you can create a custom endpoint:

```php
/**
 * Register custom REST API endpoint for Carbon Fields
 */
add_action('rest_api_init', function () {
    register_rest_route('headless-store/v1', '/page/(?P<id>\d+)/carbon-fields', array(
        'methods' => 'GET',
        'callback' => 'get_page_carbon_fields',
        'permission_callback' => '__return_true', // Make it public, or add auth if needed
    ));
});

function get_page_carbon_fields($request) {
    $page_id = $request['id'];
    $meta = get_post_meta($page_id);
    
    $carbon_fields = array();
    foreach ($meta as $key => $value) {
        if (
            strpos($key, '_') === 0 || 
            strpos($key, 'CarbonFields') === 0 ||
            strpos($key, 'carbon_fields') === 0
        ) {
            $carbon_fields[$key] = is_array($value) && count($value) === 1 
                ? $value[0] 
                : $value;
        }
    }
    
    return $carbon_fields;
}
```

## Step 3: Verify It Works

After adding the code:

1. **Clear any caching** (if you're using a caching plugin)
2. **Test the REST API** by visiting:
   ```
   http://your-site.local/wp-json/wp/v2/pages?slug=home
   ```
   You should now see a `carbon_fields` object in the response.

3. **Or test the custom endpoint** (if you used the custom endpoint approach):
   ```
   http://your-site.local/wp-json/headless-store/v1/page/5/carbon-fields
   ```
   (Replace `5` with your actual page ID)

## Step 4: Check Field Names

Carbon Fields might store data with different field name formats. Common patterns:
- `CarbonFieldsHeroBGImage`
- `_hero_bg_image`
- `hero_bg_image`
- `carbon_fields_hero_bg_image`

The frontend code will automatically try to map these to standardized names like `hero_bg_image`.

## Troubleshooting

### Still not seeing Carbon Fields?

1. **Check if Carbon Fields plugin is active** - Make sure the Carbon Fields plugin is installed and activated
2. **Verify field names** - Check your WordPress database or use a plugin like "Custom Fields Suite" to see the actual meta keys
3. **Check permissions** - Make sure the REST API endpoint is accessible (not blocked by security plugins)
4. **Clear cache** - Clear WordPress cache, browser cache, and Next.js cache

### Finding the exact field name:

You can check the exact field name in your WordPress database:
1. Go to phpMyAdmin or your database tool
2. Look in the `wp_postmeta` table
3. Filter by `post_id` = your page ID
4. Look for `meta_key` values that match your Carbon Fields

Or add this temporary code to see all meta keys:

```php
add_action('rest_api_init', function() {
    register_rest_route('headless-store/v1', '/debug-page/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $meta = get_post_meta($request['id']);
            return $meta;
        },
        'permission_callback' => '__return_true',
    ));
});
```

Then visit: `http://your-site.local/wp-json/headless-store/v1/debug-page/5`

