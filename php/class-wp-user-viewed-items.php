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
		add_action( 'wp_enqueue_scripts', array( $this, 'scripts_and_styles' ) );
		// Admin features
		$this->admin = new WP_User_Viewed_Items_Admin();
	}

	/**
	* Front end styles. Load the CSS and/or JavaScript
	*
	* @return void
	*/
	public function scripts_and_styles() {
		wp_enqueue_script( $this->slug . '-front-end', plugins_url( $this->slug . '/assets/js/' . $this->slug . '-front-end.min.js', dirname( $this->file ) ), array( 'jquery' ), filemtime( plugin_dir_path( $this->file ) . '/assets/js/' . $this->slug . '-front-end.min.js' ), true );
	}

	/**
	 * Get the URL to the plugin admin menu
	 *
	 * @return string          The menu's URL
	 */
	public function get_menu_url() {
		$url = 'options-general.php?page=' . $this->slug;
		return admin_url( $url );
	}

	/**
	 * Load up the localization file if we're using WordPress in a different language.
	 *
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'wp-user-viewed-items', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

}
