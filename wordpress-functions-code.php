<?php
/**
 * COPY THIS CODE TO YOUR WORDPRESS THEME'S functions.php FILE
 * 
 * Location: wp-content/themes/your-theme-name/functions.php
 * 
 * Add this code at the end of the file (before the closing ?> tag if there is one)
 */

/**
 * Expose ALL Carbon Fields in WordPress REST API
 * This will make Carbon Fields available in the REST API response
 */
add_filter('rest_prepare_page', 'expose_carbon_fields_in_rest_api', 10, 3);
add_filter('rest_prepare_post', 'expose_carbon_fields_in_rest_api', 10, 3);

function expose_carbon_fields_in_rest_api($response, $post, $request) {
    // Get all post meta (including Carbon Fields)
    $meta = get_post_meta($post->ID);
    
    // Carbon Fields are stored with various prefixes
    $carbon_fields = array();
    
    foreach ($meta as $key => $value) {
        // Include all meta fields that might be Carbon Fields
        // Carbon Fields often start with underscore or contain "carbon"
        if (
            strpos($key, '_') === 0 || 
            strpos($key, 'CarbonFields') === 0 ||
            strpos($key, 'carbon_fields') === 0 ||
            strpos($key, 'carbon') !== false
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

/**
 * DEBUG ENDPOINT - Use this to see ALL meta fields for a page
 * Visit: http://your-site.local/wp-json/headless-store/v1/debug-page/5
 * (Replace 5 with your page ID)
 * 
 * You can remove this after you've identified your field names
 */
add_action('rest_api_init', function() {
    register_rest_route('headless-store/v1', '/debug-page/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $page_id = $request['id'];
            $meta = get_post_meta($page_id);
            return array(
                'page_id' => $page_id,
                'all_meta_keys' => array_keys($meta),
                'all_meta' => $meta
            );
        },
        'permission_callback' => '__return_true',
    ));
});

/**
 * CUSTOM CARBON FIELDS ENDPOINT (Optional but recommended)
 * This provides a dedicated endpoint for Carbon Fields
 * Visit: http://your-site.local/wp-json/headless-store/v1/page/5/carbon-fields
 */
add_action('rest_api_init', function () {
    register_rest_route('headless-store/v1', '/page/(?P<id>\d+)/carbon-fields', array(
        'methods' => 'GET',
        'callback' => 'get_page_carbon_fields',
        'permission_callback' => '__return_true',
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
            strpos($key, 'carbon_fields') === 0 ||
            strpos($key, 'carbon') !== false
        ) {
            $carbon_fields[$key] = is_array($value) && count($value) === 1 
                ? $value[0] 
                : $value;
        }
    }
    
    return $carbon_fields;
}

