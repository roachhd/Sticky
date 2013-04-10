/*
	Sticky v2.1 by Andy Matthews
	http://twitter.com/commadelimited

	forked from Sticky by Daniel Raftery
	http://twitter.com/ThrivingKings
*/
(function ($) {

	$.sticky = $.fn.sticky = function (note, options, callback) {

		window.console.log(options);

		// allow options to be ignored, and callback to be second argument
		if (typeof options === 'function') callback = options;

		// generate unique ID based on the hash of the note.
		var hashCode = function(str){
				var hash = 0,
					i = 0,
					c = '',
					len = str.length;
				if (len === 0) return hash;
				for (i = 0; i < len; i++) {
					c = str.charCodeAt(i);
					hash = ((hash<<5)-hash) + c;
					hash &= hash;
				}
				return 's'+Math.abs(hash);
			},
			o = {
				position: 'top-right', // top-left, top-right, bottom-left, or bottom-right
				speed: 'fast', // animations: fast, slow, or integer
				allowdupes: true, // true or false
				autoclose: 5000,  // delay in milliseconds. Set to 0 to remain open.
				classList: '' // arbitrary list of classes. Suggestions: success, warning, important, or info. Defaults to ''.
			},
			uniqID = hashCode(note), // a relatively unique ID
			display = true,
			duplicate = false,
			tmpl = '<div class="sticky border-POS CLASSLIST" id="ID"><span class="sticky-close"></span><div class="sticky-note">NOTE</div></div>';

		// merge default and incoming options
		if (options) $.extend(o, options);

		// Handling duplicate notes and IDs
		$('.sticky').each(function () {
			if ($(this).attr('id') === hashCode(note)) {
				duplicate = true;
				if (!o.allowdupes) {
					display = false;
				}
			}
			if ($(this).attr('id') === uniqID) uniqID = hashCode(note);
		});

		// Make sure the sticky queue exists
		if (!$('.sticky-queue').length) {
			$('body').append('<div class="sticky-queue ' + o.position + '">');
		}

		// Can it be displayed?
		if (display) {
			// Building and inserting sticky note
			$('.sticky-queue').prepend(
				tmpl
					.replace('POS', o.position)
					.replace('ID', uniqID)
					.replace('NOTE', note)
					.replace('CLASSLIST', o.classList)
			).find('#' + uniqID)
			.slideDown(o.speed, function(){
				display = true;
				// Callback function?
				if (callback && typeof callback === 'function') {
					callback({
						'id': uniqID,
						'duplicate': duplicate,
						'displayed': display
					});
				}
			});

		}

		// Listeners
		$('.sticky').ready(function () {
			// If 'autoclose' is enabled, set a timer to close the sticky
			if (o.autoclose) {
				$('#' + uniqID).delay(o.autoclose).fadeOut(o.speed, function(){
					// remove element from DOM
					$(this).remove();
				});
			}
		});

		// Closing a sticky
		$('.sticky-close').on('click', function () {
			window.console.log('what what?');
			$('#' + $(this).parent().attr('id')).dequeue().fadeOut(o.speed, function(){
				// remove element from DOM
				$(this).remove();
			});
		});

	};
})(jQuery);