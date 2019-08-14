<?php
/*
Plugin Name: WP User Viewed Items
Description: This plugin stores what items a user has viewed on a cookie.
Version: 0.0.1
Author: MinnPost
Author URI: https://code.minnpost.com
Text Domain: wp-user-viewed-items
License: GPL2+
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * The full path to the main file of this plugin
 *
 * This can later be passed to functions such as
 * plugin_dir_path(), plugins_url() and plugin_basename()
 * to retrieve information about plugin paths
 *
 * @since 0.0.1
 * @var string
 */
define( 'WP_USER_VIEWED_ITEMS_FILE', __FILE__ );

/**
 * The plugin's current version
 *
 * @since 0.0.1
 * @var string
 */
define( 'WP_USER_VIEWED_ITEMS_VERSION', '0.0.1' );

// Load the autoloader.
require_once( 'lib/autoloader.php' );

/**
 * Retrieve the instance of the main plugin class
 *
 * @since 0.0.1
 * @return WP_User_Viewed_Items
 */
function wp_user_viewed_items() {
	static $plugin;

	if ( is_null( $plugin ) ) {
		$plugin = new WP_User_Viewed_Items( WP_USER_VIEWED_ITEMS_VERSION, __FILE__ );
	}

	return $plugin;
}

wp_user_viewed_items()->init();
