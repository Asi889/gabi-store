<?php
/**
 * Quick script to verify user capabilities
 * Add this to your WordPress theme's functions.php temporarily, or run via WP-CLI
 * 
 * This will help us check if the "homestore" user has proper capabilities
 */

// Add this to functions.php temporarily, then check the page
add_action('admin_notices', function() {
    if (current_user_can('manage_options')) {
        $user = get_user_by('login', 'homestore');
        if ($user) {
            echo '<div class="notice notice-info"><p>';
            echo '<strong>User "homestore" Check:</strong><br>';
            echo 'User ID: ' . $user->ID . '<br>';
            echo 'User Role: ' . implode(', ', $user->roles) . '<br>';
            echo 'Is Administrator: ' . (user_can($user->ID, 'manage_options') ? 'YES ✅' : 'NO ❌') . '<br>';
            echo 'Can manage WooCommerce: ' . (user_can($user->ID, 'manage_woocommerce') ? 'YES ✅' : 'NO ❌') . '<br>';
            echo '</p></div>';
        } else {
            echo '<div class="notice notice-error"><p>User "homestore" not found!</p></div>';
        }
    }
});

