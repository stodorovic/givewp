/* globals jQuery, Give */
( function( $ ) {
	const templateOptions = window.sequoiaTemplateOptions;
	const $container = $( '.give-embed-form' );
	const $advanceButton = $( '.advance-btn', $container );
	const $backButton = $( '.back-btn' );
	const $navigatorTitle = $( '.give-form-navigator .title' );

	const navigator = {
		currentStep: 0,
		animating: false,
		goToStep: ( step ) => {
			if ( steps[ step ].showErrors === true ) {
				$( '.give_error, .give_warning, .give_success' ).show();
			} else {
				$( '.give_error, .give_warning, .give_success' ).hide();
			}

			$( '.step-tracker' ).removeClass( 'current' );
			$( '.step-tracker[data-step="' + step + '"]' ).addClass( 'current' );

			if ( templateOptions.introduction.enabled === 'disabled' ) {
				step = step > 0 ? step : 1;
				if ( step === 1 ) {
					$( '.give-form-navigator', $container ).hide();
				} else {
					$( '.give-form-navigator', $container ).show();
				}
			} else if ( step === 0 ) {
				$( '.give-form-navigator', $container ).hide();
			} else {
				$( '.give-form-navigator', $container ).show();
			}
			$advanceButton.html( steps[ step ].label + '<i class="fas fa-chevron-right"></i>' );
			$navigatorTitle.text( steps[ step ].title );

			const hide = steps.map( ( obj, index ) => {
				if ( index === step || index === navigator.currentStep ) {
					return null;
				}
				return obj.selector;
			} );
			const hideSelector = hide.filter( Boolean ).join( ', ' );

			$( hideSelector ).hide();

			$( steps[ navigator.currentStep ].selector ).removeClass( 'slide-in-right' ).addClass( 'slide-out-left' );
			$( steps[ step ].selector ).show().removeClass( 'slide-out-left' ).addClass( 'slide-in-right' );

			const stepHeight = $( steps[ step ].selector ).height();

			if ( step === steps.length - 1 ) {
				$advanceButton.hide();
				$( '.form-footer' ).css( 'margin-top', `${ stepHeight }px` );
				$advanceButton.css( 'margin-top', '' );
			} else {
				$advanceButton.show();
				$advanceButton.css( 'margin-top', `${ stepHeight }px` );
				$( '.form-footer' ).css( 'margin-top', '' );
			}

			steps[ step ].setup();
			navigator.currentStep = step;
		},
		back: () => {
			const prevStep = navigator.currentStep !== 0 ? navigator.currentStep - 1 : 0;
			navigator.goToStep( prevStep );
			navigator.currentStep = prevStep;
		},
		forward: () => {
			const nextStep = navigator.currentStep !== null ? navigator.currentStep + 1 : 1;
			navigator.goToStep( nextStep );
			navigator.currentStep = nextStep;
		},
	};

	const steps = [
		{
			id: 'introduction',
			title: null,
			selector: '.give-section.introduction, .give-section.income-stats, .give-section.progress-bar',
			label: templateOptions.introduction.donate_label,
			showErrors: false,
			setup: () => {

			},
		},
		{
			id: 'choose-amount',
			title: templateOptions.payment_amount.header_label,
			selector: '.give-section.choose-amount',
			label: templateOptions.payment_amount.next_label,
			showErrors: false,
			setup: () => {
				$( '.give-donation-level-btn' ).each( function() {
					const hasTooltip = $( this ).attr( 'has-tooltip' );
					if ( hasTooltip ) {
						return;
					}

					const value = $( this ).attr( 'value' );
					const text = $( this ).text();
					if ( value !== 'custom' ) {
						const wrap = `<span class="give-tooltip hint--top hint--bounce" style="width: 100%" aria-label="${ text }" rel="tooltip"></span>`;
						const symbol = $( '.give-currency-symbol' ).text();
						const position = $( '.give-currency-symbol' ).hasClass( 'give-currency-position-before' ) ? 'before' : 'after';
						const html = position === 'before' ? `<div class="currency">${ symbol }</div>${ value }` : `${ value }<div class="currency">${ symbol }</div>`;
						$( this ).html( html );
						$( this ).wrap( wrap );
						$( this ).attr( 'has-tooltip', true );
					}
				} );
				$( '.give-total-wrap', $container ).addClass( 'give-flex' );
				$( '.give-donation-levels-wrap', $container ).addClass( 'give-grid' );
			},
		},
		{
			id: 'payment',
			title: templateOptions.payment_information.header_label,
			label: templateOptions.payment_information.checkout_label,
			selector: '.give-section.payment',
			showErrors: true,
			setup: () => {
				$( '.give-label' ).html( '' );
				$( 'label[for=give-first]' ).html( '<i class="fas fa-user"></i>' );
				$( 'label[for=give-email]' ).html( '<i class="fas fa-envelope"></i>' );
			},
		},
	];

	const styles = {
		setup: () => {
			// Setup custom styles stylesheet
			const sheet = ( function() {
				// Create the <style> tag
				const style = document.createElement( 'style' );

				// WebKit hack :(
				style.appendChild( document.createTextNode( '' ) );

				// Add the <style> element to the page
				document.head.appendChild( style );

				return style.sheet;
			}() );

			const primaryColor = templateOptions.introduction.primary_color ? templateOptions.introduction.primary_color : '#28C77B';

			// Insert rules to custom stylesheet
			sheet.insertRule( `.seperator {
				background: ${ primaryColor }!important;
			}` );
			sheet.insertRule( `.give-btn {
				border: 2px solid ${ primaryColor }!important;
				background: ${ primaryColor }!important;
			}` );
			sheet.insertRule( `.give-btn:hover {
				background: ${ primaryColor }!important;
			}` );
			sheet.insertRule( `.give-donation-level-btn {
				border: 2px solid ${ primaryColor }!important;
			}` );
			sheet.insertRule( `.give-donation-level-btn.give-default-level {
				color: ${ primaryColor }!important; background: #fff!important;
				transition: background 0.2s ease, color 0.2s ease;
			}` );
			sheet.insertRule( `.give-donation-level-btn.give-default-level:hover {
				color: ${ primaryColor }!important; background: #fff!important;
			}` );
		},
	};

	styles.setup();
	navigator.goToStep( 0 );
	$advanceButton.on( 'click', function( e ) {
		e.preventDefault();
		navigator.forward();
		if ( 'parentIFrame' in window ) {
			window.parentIFrame.scrollToOffset( 0, 0 );
		}
	} );
	$backButton.on( 'click', function( e ) {
		e.preventDefault();
		navigator.back();
	} );
	$( '.step-tracker' ).on( 'click', function( e ) {
		e.preventDefault();
		navigator.goToStep( parseInt( $( e.target ).attr( 'data-step' ) ) );
	} );

	// Move payment information section when document load.
	moveFieldsUnderPaymentGateway( true );

	// Move payment information section when gateway updated.
	$( document ).on( 'give_gateway_loaded', function() {
		moveFieldsUnderPaymentGateway( true );
	} );
	$( document ).on( 'Give:onPreGatewayLoad', function() {
		moveFieldsUnderPaymentGateway( false );
	} );

	// Refresh payment information section.
	$( document ).on( 'give_gateway_loaded', refreshPaymentInformationSection );

	/**
	 * Move form field under payment gateway
	 * @since 2.7.0
	 * @param {boolean} $refresh Flag to remove or add form fields to selected payment gateway.
	 */
	function moveFieldsUnderPaymentGateway( $refresh = false ) {
		// This function will run only for embed donation form.
		if ( 1 !== parseInt( jQuery( 'div.give-embed-form' ).length ) ) {
			return;
		}

		if ( ! $refresh ) {
			const element = jQuery( 'li.give_purchase_form_wrap-clone' );
			element.slideUp( 'slow', function() {
				element.remove();
			} );

			return;
		}

		new Promise( function( res ) {
			const fields = jQuery( '#give_purchase_form_wrap > *' ).not( '.give-donation-submit' );
			let showFields = false;

			jQuery( '.give-gateway-option-selected' ).after( '<li class="give_purchase_form_wrap-clone" style="display: none"></li>' );

			jQuery.each( fields, function( index, $item ) {
				$item = jQuery( $item );
				jQuery( '.give_purchase_form_wrap-clone' ).append( $item.clone() );

				showFields = ! showFields ? !! $item.html().trim() : showFields;

				$item.remove();
			} );

			if ( ! showFields ) {
				jQuery( '.give_purchase_form_wrap-clone' ).remove();
			}

			return res( showFields );
		} ).then( function( showFields ) {
			$( '.give-label' ).html( '' );
			$( 'label[for=give-first]' ).html( '<i class="fas fa-user"></i>' );
			$( 'label[for=give-email]' ).html( '<i class="fas fa-envelope"></i>' );
			$( 'label[for=billing_country]' ).html( '<i class="fas fa-globe-americas"></i>' );

			// eslint-disable-next-line no-unused-expressions
			showFields && jQuery( '.give_purchase_form_wrap-clone' ).slideDown( 'slow' );
		} );
	}

	/**
	 * Refresh payment information section
	 *
	 * @since 2.7.0
	 * @param {boolean} ev Event object
	 * @param {object} response Response object
	 * @param {number} formID Form ID
	 */
	function refreshPaymentInformationSection( ev, response, formID ) {
		const $form = $( `#${ formID }` );

		// This function will run only for embed donation form.
		// Show payment information section fields.
		if ( $form.parent().hasClass( 'give-embed-form' ) ) {
			const data = {
				action: 'give_cancel_login',
				form_id: $form.find( '[name="give-form-id"]' ).val(),
			};

			// AJAX get the payment fields.
			$.post( Give.fn.getGlobalVar( 'ajaxurl' ), data, function( postResponse ) {
				$form.find( '[id^=give-checkout-login-register]' ).replaceWith( $.parseJSON( postResponse.fields ) );
				$form.find( '[id^=give-checkout-login-register]' ).css( { display: 'block' } );
				$form.find( '.give-submit-button-wrap' ).show();
			} ).done( function() {
				// Trigger float-labels
				window.give_fl_trigger();
			} );
		}
	}
}( jQuery ) );
