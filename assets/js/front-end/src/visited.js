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
	if ( 'undefined' !== typeof wp_user_viewed_items_settings.domain ) {
		var cookie_args = {
			secure: true,
			domain: wp_user_viewed_items_settings.domain
		};
		if ( 'undefined' !== typeof wp_user_viewed_items_settings.cookie_expires ) {
			cookie_args.expires = wp_user_viewed_items_settings.cookie_expires;
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
	if ( items_read_number < viewed_urls.length && 'popup' === action_to_perform ) {
		console.log( 'load the popup' );
		jQuery( document ).on( 'pumInit', '#popmake-300090', function () { // we would have to save this popup id as a plugin setting
		    PUM.open( 300090 ); // we would have to save this popup id as a plugin setting
		});
	}
}