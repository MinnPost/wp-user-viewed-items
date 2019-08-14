var $ = window.jQuery;

function showActionOptions(field, action) {
	if ( action == 'popup' ) {
		$( '.wp_user_viewed_items_popup_to_load' ).show();
	} else {
		$( '.wp_user_viewed_items_popup_to_load' ).hide();
	}
}

// handle the radio button
$(document).on('click', 'input[name="wp_user_viewed_items_action_to_perform[]"]', function() {
	var action = $(this).val();
	showActionOptions($(this), action);
});

// on load, check for selected actions
$(document).ready(function() {
	var fieldname = 'input[name="wp_user_viewed_items_action_to_perform[]"]';
	if ( $(fieldname).length) {
		var field = $(fieldname);
		var action = $(fieldname + ':checked').val();
		showActionOptions(field, action);
	}
});
