<?php

/**
 * The main plugin class
 *
 * @package WP_User_Viewed_Items
 */
class WP_User_Viewed_Items {

	/**
	 * The version number for this release of the plugin.
	 * This will later be used for upgrades and enqueuing files
	 *
	 * This should be set to the 'Plugin Version' value defined
	 * in the plugin header.
	 *
	 * @var string A PHP-standardized version number string
	 */
	public $version;

	/**
	 * Filesystem path to the main plugin file
	 * @var string
	 */
	public $file;

	/**
	 * Prefix for plugin options
	 * @var string
	 */
	public $option_prefix;

	/**
	 * Plugin slug
	 * @var string
	 */
	public $slug;

	/**
	* @var object
	* Front end interface
	*/
	public $front_end;

	/**
	* @var object
	* Administrative interface
	*/
	public $admin;

	/**
	 * Class constructor
	 *
	 * @param string $version The current plugin version
	 * @param string $file The main plugin file
	 */
	public function __construct( $version, $file ) {
		$this->version       = $version;
		$this->file          = $file;
		$this->option_prefix = 'wp_user_viewed_items_';
		$this->slug          = 'wp-user-viewed-items';

		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );

	}

	public function init() {
		// front end features
		$this->front_end = new WP_User_Viewed_Items_Front_End();
		// Admin features
		$this->admin = new WP_User_Viewed_Items_Admin();
	}

	/**
	 * Load up the localization file if we're using WordPress in a different language.
	 *
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'wp-user-viewed-items', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	/**
	 * Sanitize a string of HTML classes
	 *
	 */
	public function sanitize_html_classes( $classes, $sep = ' ' ) {
		$return = '';
		if ( ! is_array( $classes ) ) {
			$classes = explode( $sep, $classes );
		}
		if ( ! empty( $classes ) ) {
			foreach ( $classes as $class ) {
				$return .= sanitize_html_class( $class ) . ' ';
			}
		}
		return $return;
	}

}
