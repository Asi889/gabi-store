<?php
/**
 * FORCE WOOCOMMERCE CAPABILITIES
 * 
 * If you are still getting 401 "cannot list resources" errors,
 * add this code to the bottom of your WordPress theme's functions.php file.
 * 
 * After adding this, refresh your Next.js page once, then you can remove this code.
 */

add_action('init', function() {
    // 1. Get the admin user (replace 'homestore' if you used a different username)
    $user = get_user_by('login', 'homestore');
    
    if ($user) {
        // 2. Force Administrator and WooCommerce capabilities
        $user->add_role('administrator');
        $user->add_cap('manage_woocommerce');
        $user->add_cap('view_woocommerce_reports');
        
        // 3. Clear WooCommerce cached API keys
        delete_transient('wc_api_keys');
        
        error_log('✅ Capabilities forced for user: homestore');
    }
});

