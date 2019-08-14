<?php
/**
 * The plugin class that creates front end functionality for responding to user viewed items
 *
 * @package WP_User_Viewed_Items
 */

class WP_User_Viewed_Items_Front_End {

	public $option_prefix;
	public $version;
	public $slug;
	public $file;

	/**
	* Constructor which sets up admin pages
	*/
	public function __construct() {

		$this->option_prefix = wp_user_viewed_items()->option_prefix;
		$this->version       = wp_user_viewed_items()->version;
		$this->slug          = wp_user_viewed_items()->slug;
		$this->plugin_file   = wp_user_viewed_items()->file;

		$this->add_actions();

	}

	/**
	* Create the action hooks to create the admin page(s)
	*
	*/
	private function add_actions() {
		if ( ! is_admin() ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'scripts_and_styles' ) );
		}

	}

	/**
	* Front end styles. Load the CSS and/or JavaScript
	*
	* @return void
	*/
	public function scripts_and_styles() {
		wp_enqueue_script( $this->slug . '-front-end', plugins_url( $this->slug . '/assets/js/' . $this->slug . '-front-end.min.js', dirname( $this->plugin_file ) ), array( 'jquery' ), filemtime( plugin_dir_path( $this->plugin_file ) . '/assets/js/' . $this->slug . '-front-end.min.js' ), true );

		$settings = array();

		// items read threshold
		$items_read_number = get_option( $this->option_prefix . 'items_read_number', '' );
		if ( '' !== $items_read_number ) {
			$items_read_number             = filter_var( $items_read_number, FILTER_VALIDATE_INT );
			$settings['items_read_number'] = $items_read_number;
		}

		// action to perform
		$action_to_perform = filter_var( get_option( $this->option_prefix . 'action_to_perform', '' ), FILTER_SANITIZE_STRING );
		if ( '' !== $action_to_perform ) {
			$settings['action_to_perform'] = $action_to_perform;
		}

		// cookie domain
		$cookie_domain             = site_url();
		$settings['cookie_domain'] = $cookie_domain;

		wp_localize_script( $this->slug . '-front-end', 'wp_user_viewed_items_settings', $settings );
	}

}
