var previously_viewed_urls = Cookies.getJSON( 'viewed_urls' );
var viewed_urls = [];
var current_url = window.location.pathname;
// make a list of previously viewed urls
if ( 'undefined' !== typeof previously_viewed_urls ) {
	viewed_urls = previously_viewed_urls;
}
// and add the current url to it if it's not the same
if ( viewed_urls.indexOf( current_url ) == -1 ) {
	viewed_urls.push( window.location.pathname );
}

// get settings from the plugin
if ( 'undefined' !== typeof wp_user_viewed_items_settings ) {
	// we require a cookie domain to make a cookie
	if ( 'undefined' !== typeof wp_user_viewed_items_settings.cookie_domain ) {
		var cookie_args = {
			domain: wp_user_viewed_items_settings.cookie_domain
		};
		// secure is optional
		if ( 'undefined' !== typeof wp_user_viewed_items_settings.cookie_secure ) {
			cookie_args.secure = wp_user_viewed_items_settings.cookie_secure;
		} else {
			cookie_args.secure = false;
		}
		// if the cookie has an expiration, use it. otherwise, use 30.
		if ( 'undefined' !== typeof wp_user_viewed_items_settings.cookie_expires ) {
			cookie_args.expires = parseInt( wp_user_viewed_items_settings.cookie_expires, 10 );
		} else {
			cookie_args.expires = 30;
		}
		Cookies.set(
			'viewed_urls',
			viewed_urls,
			cookie_args
		);
	}
	// how many items does a user need to have visited?
	if ( 'undefined' !== typeof wp_user_viewed_items_settings.items_read_number ) {
		var items_read_number = wp_user_viewed_items_settings.items_read_number;
	}
	// what action gets performed if they have done those visits?
	if ( 'undefined' !== typeof wp_user_viewed_items_settings.action_to_perform ) {
		var action_to_perform = wp_user_viewed_items_settings.action_to_perform;
	}
	// if it's a popup, what popup is supposed to load?
	if ( 'undefined' !== typeof wp_user_viewed_items_settings.popup_to_load ) {
		var popup_to_load = wp_user_viewed_items_settings.popup_to_load;
	}
	// if all those criteria match, load the popup
	if ( items_read_number < viewed_urls.length && 'popup' === action_to_perform && 'undefined' !== typeof popup_to_load ) {
		jQuery( document ).on( 'pumInit', '#popmake-' + popup_to_load, function () {
		    PUM.open( popup_to_load );
		});
	}
}