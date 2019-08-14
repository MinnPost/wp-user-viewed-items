var previously_viewed_urls = Cookies.getJSON( 'viewed_urls' );
var viewed_urls = [];
var current_url = window.location.pathname;
if ( 'undefined' !== typeof previously_viewed_urls ) {
	viewed_urls = previously_viewed_urls;
}
if ( viewed_urls.indexOf( current_url ) == -1 ) {
	viewed_urls.push( window.location.pathname );
}
if ( 'undefined' !== typeof wp_user_viewed_items_settings ) {
	if ( 'undefined' !== typeof wp_user_viewed_items_settings.cookie_domain ) {
		var cookie_args = {
			domain: wp_user_viewed_items_settings.cookie_domain
		};
		if ( 'undefined' !== typeof wp_user_viewed_items_settings.cookie_secure ) {
			cookie_args.secure = wp_user_viewed_items_settings.cookie_secure;
		} else {
			cookie_args.secure = false;
		}
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
	if ( 'undefined' !== typeof wp_user_viewed_items_settings.items_read_number ) {
		var items_read_number = wp_user_viewed_items_settings.items_read_number;
	}
	if ( 'undefined' !== typeof wp_user_viewed_items_settings.action_to_perform ) {
		var action_to_perform = wp_user_viewed_items_settings.action_to_perform;
	}
	if ( 'undefined' !== typeof wp_user_viewed_items_settings.popup_to_load ) {
		var popup_to_load = wp_user_viewed_items_settings.popup_to_load;
	}
	if ( items_read_number < viewed_urls.length && 'popup' === action_to_perform && 'undefined' !== typeof popup_to_load ) {
		jQuery( document ).on( 'pumInit', '#popmake-' + popup_to_load, function () { // we would have to save this popup id as a plugin setting
		    PUM.open( popup_to_load ); // we would have to save this popup id as a plugin setting
		});
	}
}