//
// PineJS: Submenu
// ====================================

// ## Pine-submenu.js
// Submodule handles behavior of each submenu in the navigation bar. Its basis purpose is to handle 'hover' and 'toggle'.

/**
  Global Pine object
**/
var Pine = window.Pine || {}

/**
  Provides dropdown submenus for Responsive navigation module.
**/
Pine.Submenu = (function($, window, undefined) { "use strict";

  var version = '0.0.1',

  // Timer delays hiding of the submenu. It improves usability.
  timer = null,

  Submenu = {};

  // Method: Event handler that shows submenus
  // -------------
  Submenu.toggle = function (e) {
    var $menu = $(e.currentTarget).closest('.has-submenu'),
        transition = this.activeTransition && this.activeTransition.onToggle,
        isActive = $menu.hasClass('is-open');

    // Execute special pre-show hook
    if (transition && typeof transition === 'function') transition.call(e.currentTarget, isActive);

    if(!isActive) {
      $menu.trigger(e = $.Event('show')) /* show.submenu */
      $menu.addClass('is-open').trigger('shown') /* shown.submenu */

      $.log('Event: show')
    }
    else {
      $menu.trigger(e = $.Event('hide')) /* hide.submenu */
      $menu.removeClass('is-open').trigger('hidden') /* hidden.submenu */

      $.log('Event: hide')
    }
  }

  return Submenu;

}(window.Zepto || window.jQuery, window));

