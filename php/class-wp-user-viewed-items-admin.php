<?php
/**
 * The plugin class that creates for the admin
 *
 * @package WP_User_Viewed_Items
 */

class WP_User_Viewed_Items_Admin {

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

		$this->tabs        = $this->get_admin_tabs();
		$this->default_tab = 'wp_user_viewed_items_settings';

		$this->add_actions();

	}

	/**
	* Create the action hooks to create the admin page(s)
	*
	*/
	private function add_actions() {
		if ( is_admin() ) {
			add_filter( 'plugin_action_links', array( $this, 'plugin_action_links' ), 10, 2 );
			add_action( 'admin_menu', array( $this, 'create_admin_menu' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts_and_styles' ) );
			add_action( 'admin_init', array( $this, 'admin_settings_form' ) );
		}

	}

	/**
	* Display a Settings link on the main Plugins page
	*
	* @param array $links
	* @param string $file
	* @return array $links
	* These are the links that go with this plugin's entry
	*/
	public function plugin_action_links( $links, $file ) {
		if ( plugin_basename( $this->plugin_file ) === $file ) {
			$settings = '<a href="' . get_admin_url() . 'options-general.php?page=' . $this->slug . '">' . __( 'Settings', 'wp-user-viewed-items' ) . '</a>';
			array_unshift( $links, $settings );
		}
		return $links;
	}

	/**
	* Default display for <input> fields
	*
	* @param array $args
	*/
	public function create_admin_menu() {
		add_options_page( __( 'WP User Viewed Items Settings', 'wp-user-viewed-items' ), __( 'WP User Viewed Settings', 'wp-user-viewed-items' ), 'manage_options', 'wp-user-viewed-items', array( $this, 'show_admin_page' ) );
	}

	/**
	* Admin styles. Load the CSS and/or JavaScript for the plugin's settings
	*
	* @return void
	*/
	public function admin_scripts_and_styles() {
		wp_enqueue_script( $this->slug . '-admin', plugins_url( $this->slug . '/assets/js/' . $this->slug . '-admin.min.js', dirname( $this->plugin_file ) ), array( 'jquery' ), filemtime( plugin_dir_path( $this->plugin_file ) . 'assets/js/' . $this->slug . '-admin.min.js' ), true );
		//wp_enqueue_style( $this->slug . '-admin', plugins_url( 'assets/css/admin.min.css', dirname( __FILE__ ) ), array(), $this->version, 'all' );
	}

	/**
	* Create WordPress admin options page tabs
	*
	* @return array $tabs
	*
	*/
	private function get_admin_tabs() {
		$tabs = array(
			'wp_user_viewed_items_settings' => __( 'Settings', 'wp-user-viewed-items' ),
			//'embed_ads_settings'    => 'Embed Ads Settings',
		); // this creates the tabs for the admin
		/*
		 * tabs to think about adding:
		*/
		return $tabs;
	}

	/**
	* Display the admin settings page
	*
	* @return void
	*/
	public function show_admin_page() {
		$get_data = filter_input_array( INPUT_GET, FILTER_SANITIZE_STRING );
		?>
		<div class="wrap">
			<h1><?php _e( get_admin_page_title() , 'wp-user-viewed-items' ); ?></h1>
			<?php
			$tabs = $this->tabs;
			$tab  = isset( $get_data['tab'] ) ? sanitize_key( $get_data['tab'] ) : $this->default_tab;
			$this->render_tabs( $tabs, $tab );

			switch ( $tab ) {
				default:
					require_once( plugin_dir_path( __FILE__ ) . '/../templates/admin/settings.php' );
					break;
			} // End switch().
			?>
		</div>
		<?php
	}

	/**
	* Render tabs for settings pages in admin
	* @param array $tabs
	* @param string $tab
	*/
	private function render_tabs( $tabs, $tab = '' ) {

		$get_data = filter_input_array( INPUT_GET, FILTER_SANITIZE_STRING );

		$current_tab = $tab;
		echo '<h2 class="nav-tab-wrapper">';
		foreach ( $tabs as $tab_key => $tab_caption ) {
			$active = $current_tab === $tab_key ? ' nav-tab-active' : '';
			echo sprintf(
				'<a class="nav-tab%1$s" href="%2$s">%3$s</a>',
				esc_attr( $active ),
				esc_url( '?page=' . $this->slug . '&tab=' . $tab_key ),
				esc_html( $tab_caption )
			);
		}
		echo '</h2>';

		if ( isset( $get_data['tab'] ) ) {
			$tab = sanitize_key( $get_data['tab'] );
		} else {
			$tab = '';
		}
	}

	/**
	* Register items for the settings api
	* @return void
	*
	*/
	public function admin_settings_form() {

		$get_data = filter_input_array( INPUT_GET, FILTER_SANITIZE_STRING );
		$page     = isset( $get_data['tab'] ) ? sanitize_key( $get_data['tab'] ) : 'wp_user_viewed_items_settings';
		$section  = isset( $get_data['tab'] ) ? sanitize_key( $get_data['tab'] ) : 'wp_user_viewed_items_settings';

		$input_callback_default    = array( $this, 'display_input_field' );
		$textarea_callback_default = array( $this, 'display_textarea' );
		$editor_callback_default   = array( $this, 'display_editor' );
		$input_checkboxes_default  = array( $this, 'display_checkboxes' );
		$input_radio_default       = array( $this, 'display_radio' );
		$input_select_default      = array( $this, 'display_select' );
		$link_default              = array( $this, 'display_link' );

		$all_field_callbacks = array(
			'text'       => $input_callback_default,
			'textarea'   => $textarea_callback_default,
			'editor'     => $editor_callback_default,
			'checkboxes' => $input_checkboxes_default,
			'radio'      => $input_radio_default,
			'select'     => $input_select_default,
			'link'       => $link_default,
		);

		$this->wp_user_viewed_items_settings( 'wp_user_viewed_items_settings', 'wp_user_viewed_items_settings', $all_field_callbacks );

	}

	/**
	* Fields for the Basic Settings tab
	* This runs add_settings_section once, as well as add_settings_field and register_setting methods for each option
	*
	* @param string $page
	* @param string $section
	* @param array $callbacks
	*/
	private function wp_user_viewed_items_settings( $page, $section, $callbacks ) {
		$tabs = $this->tabs;
		foreach ( $tabs as $key => $value ) {
			if ( $key === $page ) {
				$title = $value;
			}
		}
		add_settings_section( $page, $title, null, $page );

		$settings = array(
			'items_read_number' => array(
				'title'    => __( 'Number of read items', 'wp-user-viewed-items' ),
				'callback' => $callbacks['text'],
				'page'     => $page,
				'section'  => $section,
				'args'     => array(
					'type'     => 'text',
					'desc'     => __( 'The plugin will run the desired function when a user has read this many items.', 'wp-user-viewed-items' ),
					'constant' => '',
				),
			),
			'action_to_perform' => array(
				'title'    => __( 'Action to perform', 'wp-analytics-tracking-generator' ),
				'callback' => $callbacks['radio'],
				'page'     => $page,
				'section'  => $section,
				'args'     => array(
					'type'     => 'radio',
					'desc'     => __( 'The plugin will perform this action when the criteria above is met.', 'wp-user-viewed-items' ),
					'constant' => '',
					'items'    => $this->get_actions(),
				),
			),
			'expire_days'       => array(
				'title'    => __( 'Cookie expires after', 'wp-analytics-tracking-generator' ),
				'callback' => $callbacks['text'],
				'page'     => $page,
				'section'  => $section,
				'args'     => array(
					'type'     => 'text',
					'desc'     => __( 'The cookie will expire after this many days. The default is 30, if left blank.', 'wp-user-viewed-items' ),
					'constant' => '',
				),
			),
			'cookie_secure'     => array(
				'title'    => __( 'Secure cookie?', 'wp-analytics-tracking-generator' ),
				'callback' => $callbacks['text'],
				'page'     => $page,
				'section'  => $section,
				'args'     => array(
					'type'    => 'checkbox',
					'desc'    => __( 'Whether this cookie should require https (recommended).', 'arcads-dfp-acm-provider' ),
					'default' => '',
				),
			),
		);

		if ( class_exists( 'Popup_Maker' ) ) {
			$settings['popup_to_load'] = array(
				'title'    => __( 'Popup to load', 'wp-analytics-tracking-generator' ),
				'callback' => $callbacks['radio'],
				'page'     => $page,
				'section'  => $section,
				'args'     => array(
					'type'     => 'radio',
					'desc'     => __( 'Pick the popup for the plugin to load. If the selected popup is not currently published, it will not load until it is published.', 'wp-user-viewed-items' ),
					'constant' => '',
					'items'    => $this->get_popups(),
				),
			);
		}

		foreach ( $settings as $key => $attributes ) {
			$id       = $this->option_prefix . $key;
			$name     = $this->option_prefix . $key;
			$title    = $attributes['title'];
			$callback = $attributes['callback'];
			$page     = $attributes['page'];
			$section  = $attributes['section'];
			$class    = isset( $attributes['class'] ) ? $attributes['class'] : 'wp-analytics-generator-field ' . $id;
			$args     = array_merge(
				$attributes['args'],
				array(
					'title'     => $title,
					'id'        => $id,
					'label_for' => $id,
					'name'      => $name,
					'class'     => $class,
				)
			);

			// if there is a constant and it is defined, don't run a validate function if there is one
			if ( isset( $attributes['args']['constant'] ) && defined( $attributes['args']['constant'] ) ) {
				$validate = '';
			}

			add_settings_field( $id, $title, $callback, $page, $section, $args );
			register_setting( $section, $id );
		}
	}

	/**
	* Checkboxes for what actions this plugin can perform
	*
	* @return array $items
	*/
	private function get_actions() {
		$items = array();
		if ( class_exists( 'Popup_Maker' ) ) {
			$items[] = array(
				'id'    => 'popup',
				'value' => 'popup',
				'text'  => __( 'Popup Maker Popup', 'wp-user-viewed-items' ),
				'desc'  => '',
			);
		}
		return $items;
	}

	/**
	* Checkboxes for popups
	*
	* @return array $items
	*/
	private function get_popups() {
		$items = array();
		$args  = array(
			'post_type'   => 'popup',
			'post_status' => array(
				'pending',
				'draft',
				'future',
				'publish',
			),
		);
		$query = new WP_Query( $args );
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$items[] = array(
					'id'    => get_the_ID(),
					'value' => get_the_ID(),
					'text'  => get_the_title() . ' (' . get_post_status() . ')',
					'desc'  => '',
				);
			}
		}
		wp_reset_postdata();
		return $items;
	}

	/**
	* Default display for <input> fields
	*
	* @param array $args
	*/
	public function display_input_field( $args ) {
		$type    = $args['type'];
		$id      = $args['label_for'];
		$name    = $args['name'];
		$desc    = $args['desc'];
		$checked = '';

		$class = 'regular-text';

		if ( 'checkbox' === $type ) {
			$class = 'checkbox';
		}

		if ( isset( $args['class'] ) ) {
			$class = $args['class'];
		}

		if ( ! isset( $args['constant'] ) || ! defined( $args['constant'] ) ) {
			$value = esc_attr( get_option( $id, '' ) );
			if ( 'checkbox' === $type ) {
				$value = filter_var( get_option( $id, false ), FILTER_VALIDATE_BOOLEAN );
				if ( true === $value ) {
					$checked = 'checked ';
				}
				$value = 1;
			}
			if ( '' === $value && isset( $args['default'] ) && '' !== $args['default'] ) {
				$value = $args['default'];
			}

			echo sprintf(
				'<input type="%1$s" value="%2$s" name="%3$s" id="%4$s" class="%5$s"%6$s>',
				esc_attr( $type ),
				esc_attr( $value ),
				esc_attr( $name ),
				esc_attr( $id ),
				wp_user_viewed_items()->sanitize_html_classes( $class, esc_html( ' code' ) ),
				esc_html( $checked )
			);
			if ( '' !== $desc ) {
				echo sprintf(
					'<p class="description">%1$s</p>',
					esc_html( $desc )
				);
			}
		} else {
			echo sprintf(
				'<p><code>%1$s</code></p>',
				esc_html__( 'Defined in wp-config.php', 'wp-user-viewed-items' )
			);
		}
	}

	/**
	* Default display for <textarea> fields
	*
	* @param array $args
	*/
	public function display_textarea( $args ) {
		$id      = $args['id'];
		$name    = $args['name'];
		$desc    = $args['desc'];
		$checked = '';

		$class = 'regular-text';

		if ( ! isset( $args['constant'] ) || ! defined( $args['constant'] ) ) {
			$value = esc_attr( get_option( $id, '' ) );
			if ( '' === $value && isset( $args['default'] ) && '' !== $args['default'] ) {
				$value = $args['default'];
			}

			echo sprintf(
				'<textarea name="%1$s" id="%2$s" class="%3$s" rows="10">%4$s</textarea>',
				esc_attr( $name ),
				esc_attr( $id ),
				minnpost_form_processor_mailchimp()->sanitize_html_classes( $class . esc_html( ' code' ) ),
				esc_attr( $value )
			);
			if ( '' !== $desc ) {
				echo sprintf(
					'<p class="description">%1$s</p>',
					esc_html( $desc )
				);
			}
		} else {
			echo sprintf(
				'<p><code>%1$s</code></p>',
				esc_html__( 'Defined in wp-config.php', 'wp-user-viewed-items' )
			);
		}
	}

	/**
	* Display for a wysiwyg editir
	*
	* @param array $args
	*/
	public function display_editor( $args ) {
		$id      = $args['label_for'];
		$name    = $args['name'];
		$desc    = $args['desc'];
		$checked = '';

		$class = 'regular-text';

		if ( ! isset( $args['constant'] ) || ! defined( $args['constant'] ) ) {
			$value = wp_kses_post( get_option( $id, '' ) );
			if ( '' === $value && isset( $args['default'] ) && '' !== $args['default'] ) {
				$value = $args['default'];
			}

			$settings = array();
			if ( isset( $args['wpautop'] ) ) {
				$settings['wpautop'] = $args['wpautop'];
			}
			if ( isset( $args['media_buttons'] ) ) {
				$settings['media_buttons'] = $args['media_buttons'];
			}
			if ( isset( $args['default_editor'] ) ) {
				$settings['default_editor'] = $args['default_editor'];
			}
			if ( isset( $args['drag_drop_upload'] ) ) {
				$settings['drag_drop_upload'] = $args['drag_drop_upload'];
			}
			if ( isset( $args['name'] ) ) {
				$settings['textarea_name'] = $args['name'];
			}
			if ( isset( $args['rows'] ) ) {
				$settings['textarea_rows'] = $args['rows']; // default is 20
			}
			if ( isset( $args['tabindex'] ) ) {
				$settings['tabindex'] = $args['tabindex'];
			}
			if ( isset( $args['tabfocus_elements'] ) ) {
				$settings['tabfocus_elements'] = $args['tabfocus_elements'];
			}
			if ( isset( $args['editor_css'] ) ) {
				$settings['editor_css'] = $args['editor_css'];
			}
			if ( isset( $args['editor_class'] ) ) {
				$settings['editor_class'] = $args['editor_class'];
			}
			if ( isset( $args['teeny'] ) ) {
				$settings['teeny'] = $args['teeny'];
			}
			if ( isset( $args['dfw'] ) ) {
				$settings['dfw'] = $args['dfw'];
			}
			if ( isset( $args['tinymce'] ) ) {
				$settings['tinymce'] = $args['tinymce'];
			}
			if ( isset( $args['quicktags'] ) ) {
				$settings['quicktags'] = $args['quicktags'];
			}

			wp_editor( $value, $id, $settings );
			if ( '' !== $desc ) {
				echo sprintf(
					'<p class="description">%1$s</p>',
					esc_html( $desc )
				);
			}
		} else {
			echo sprintf(
				'<p><code>%1$s</code></p>',
				esc_html__( 'Defined in wp-config.php', 'wp-user-viewed-items' )
			);
		}
	}

	/**
	* Display for multiple checkboxes
	* Above method can handle a single checkbox as it is
	*
	* @param array $args
	*/
	public function display_checkboxes( $args ) {
		$type         = 'checkbox';
		$name         = $args['name'];
		$overall_desc = $args['desc'];
		$options      = get_option( $name, array() );
		$html         = '<div class="checkboxes">';
		foreach ( $args['items'] as $key => $value ) {
			$text        = $value['text'];
			$id          = $value['id'];
			$desc        = $value['desc'];
			$checked     = '';
			$field_value = isset( $value['value'] ) ? esc_attr( $value['value'] ) : esc_attr( $key );

			if ( is_array( $options ) && in_array( (string) $field_value, $options, true ) ) {
				$checked = 'checked';
			} elseif ( is_array( $options ) && empty( $options ) ) {
				if ( isset( $value['default'] ) && true === $value['default'] ) {
					$checked = 'checked';
				}
			}
			$html .= sprintf(
				'<div class="checkbox"><label><input type="%1$s" value="%2$s" name="%3$s[]" id="%4$s"%5$s>%6$s</label></div>',
				esc_attr( $type ),
				$field_value,
				esc_attr( $name ),
				esc_attr( $id ),
				esc_html( $checked ),
				esc_html( $text )
			);
			if ( '' !== $desc ) {
				$html .= sprintf(
					'<p class="description">%1$s</p>',
					esc_html( $desc )
				);
			}
		}
		if ( '' !== $overall_desc ) {
			$html .= sprintf(
				'<p class="description">%1$s</p>',
				esc_html( $overall_desc )
			);
		}
		$html .= '</div>';
		echo $html;
	}

	/**
	* Display for mulitple radio buttons
	*
	* @param array $args
	*/
	public function display_radio( $args ) {
		$type = 'radio';

		$name       = $args['name'];
		$group_desc = $args['desc'];
		$options    = get_option( $name, array() );

		foreach ( $args['items'] as $key => $value ) {
			$text = $value['text'];
			$id   = $value['id'];
			$desc = $value['desc'];
			if ( isset( $value['value'] ) ) {
				$item_value = $value['value'];
			} else {
				$item_value = $key;
			}
			$checked = '';
			if ( is_array( $options ) && in_array( (string) $item_value, $options, true ) ) {
				$checked = 'checked';
			} elseif ( is_array( $options ) && empty( $options ) ) {
				if ( isset( $value['default'] ) && true === $value['default'] ) {
					$checked = 'checked';
				}
			}

			$input_name = $name;

			echo sprintf(
				'<div class="radio"><label><input type="%1$s" value="%2$s" name="%3$s[]" id="%4$s"%5$s>%6$s</label></div>',
				esc_attr( $type ),
				esc_attr( $item_value ),
				esc_attr( $input_name ),
				esc_attr( $id ),
				esc_html( $checked ),
				esc_html( $text )
			);
			if ( '' !== $desc ) {
				echo sprintf(
					'<p class="description">%1$s</p>',
					esc_html( $desc )
				);
			}
		}

		if ( '' !== $group_desc ) {
			echo sprintf(
				'<p class="description">%1$s</p>',
				esc_html( $group_desc )
			);
		}

	}

	/**
	* Display for a dropdown
	*
	* @param array $args
	*/
	public function display_select( $args ) {
		$type = $args['type'];
		$id   = $args['label_for'];
		$name = $args['name'];
		$desc = $args['desc'];
		if ( ! isset( $args['constant'] ) || ! defined( $args['constant'] ) ) {
			$current_value = get_option( $name );

			echo sprintf(
				'<div class="select"><select id="%1$s" name="%2$s"><option value="">- Select one -</option>',
				esc_attr( $id ),
				esc_attr( $name )
			);

			foreach ( $args['items'] as $key => $value ) {
				$text     = $value['text'];
				$value    = $value['value'];
				$selected = '';
				if ( $key === $current_value || $value === $current_value ) {
					$selected = ' selected';
				}

				echo sprintf(
					'<option value="%1$s"%2$s>%3$s</option>',
					esc_attr( $value ),
					esc_attr( $selected ),
					esc_html( $text )
				);

			}
			echo '</select>';
			if ( '' !== $desc ) {
				echo sprintf(
					'<p class="description">%1$s</p>',
					esc_html( $desc )
				);
			}
			echo '</div>';
		} else {
			echo sprintf(
				'<p><code>%1$s</code></p>',
				esc_html__( 'Defined in wp-config.php', 'wp-user-viewed-items' )
			);
		}
	}

	/**
	* Default display for <a href> links
	*
	* @param array $args
	*/
	public function display_link( $args ) {
		$label = $args['label'];
		$desc  = $args['desc'];
		$url   = $args['url'];
		if ( isset( $args['link_class'] ) ) {
			echo sprintf(
				'<p><a class="%1$s" href="%2$s">%3$s</a></p>',
				esc_attr( $args['link_class'] ),
				esc_url( $url ),
				esc_html( $label )
			);
		} else {
			echo sprintf(
				'<p><a href="%1$s">%2$s</a></p>',
				esc_url( $url ),
				esc_html( $label )
			);
		}

		if ( '' !== $desc ) {
			echo sprintf(
				'<p class="description">%1$s</p>',
				esc_html( $desc )
			);
		}

	}

}
