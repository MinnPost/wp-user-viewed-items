var previously_viewed_urls = Cookies.getJSON( 'viewed_urls' );
var viewed_urls = [];
var current_url = window.location.pathname;
if ( 'undefined' !== typeof previously_viewed_urls ) {
	viewed_urls = previously_viewed_urls;
}
if ( viewed_urls.indexOf( current_url ) == -1 ) {
	viewed_urls.push( window.location.pathname );
}
Cookies.set(
	'viewed_urls',
	viewed_urls,
	{
		secure: true,
		domain: 'minnpost-wordpress.test' // can be passed here via the plugin parameters
		//expires: 30 // can be passed here via the plugin parameters
	}
);

if ( 5 < viewed_urls.length ) {
	console.log( 'load the popup' );
	jQuery( document ).on( 'pumInit', '#popmake-300090', function () { // we would have to save this popup id as a plugin setting
	    PUM.open( 300090 ); // we would have to save this popup id as a plugin setting
	});
}