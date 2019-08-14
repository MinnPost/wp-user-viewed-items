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

		// secure cookie
		$cookie_secure = filter_var( get_option( $this->option_prefix . 'cookie_secure', false ), FILTER_VALIDATE_BOOLEAN );
		if ( true === $cookie_secure ) {
			$settings['cookie_secure'] = true;
		} else {
			$settings['cookie_secure'] = false;
		}

		// expire days
		$expire_days = filter_var( get_option( $this->option_prefix . 'expire_days', '' ), FILTER_SANITIZE_NUMBER_INT );
		if ( '' !== $expire_days ) {
			$settings['cookie_expires'] = $expire_days;
		}

		// action to perform
		$action_to_perform = get_option( $this->option_prefix . 'action_to_perform', '' );
		if ( '' !== $action_to_perform ) {
			if ( is_array( $action_to_perform ) ) {
				$action_to_perform = filter_var( $action_to_perform[0], FILTER_SANITIZE_STRING );
			}
			$settings['action_to_perform'] = $action_to_perform;
		}

		// load a popup if applicable
		if ( class_exists( 'Popup_Maker' ) ) {
			$popup_to_load = get_option( $this->option_prefix . 'popup_to_load', '' );
			if ( '' !== $popup_to_load ) {
				if ( is_array( $popup_to_load ) ) {
					$popup_id     = filter_var( $popup_to_load[0], FILTER_SANITIZE_NUMBER_INT );
					$popup_status = get_post_status( $popup_id );
					if ( 'publish' === $popup_status ) {
						$popup_to_load             = $popup_id;
						$settings['popup_to_load'] = $popup_to_load;
					}
				}
			}
		}

		// cookie domain
		$cookie_domain             = site_url();
		$settings['cookie_domain'] = str_replace( 'https://', '', site_url() );

		wp_localize_script( $this->slug . '-front-end', 'wp_user_viewed_items_settings', $settings );
	}

}
