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
    var $menu = $(e.currentTarget).closest('.pine-has-subnav'),
        transition = this.activeTransition && this.activeTransition.beforeToggle,
        isActive = $menu.hasClass('pine-level-open');

    e.preventDefault()
    // e.stopPropagation()

    // Execute special pre-show hook
    if (transition && typeof transition === 'function') transition.call(e.currentTarget, isActive);

    if(!isActive) {
      // if ('ontouchstart' in document.documentElement && !$menu.closest('.pine').length) {
      //   // if mobile we use a backdrop because click events don't delegate
      //   $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      // }

      $menu.trigger(e = $.Event('show')) /* show.submenu */
      $menu.addClass('pine-level-open').trigger('shown') /* shown.submenu */

      $.log('Event: show')
    }
    else {
      $menu.trigger(e = $.Event('hide')) /* hide.submenu */
      $menu.removeClass('pine-level-open').trigger('hidden') /* hidden.submenu */

      $.log('Event: hide')
    }
  }

  return Submenu;

}(window.jQuery, window));

