//
// Submenu: Navigation behavior
// --------------------------------

(function ($, undefined) { "use strict";

  /**
    Provides dropdown submenus for Responsive navigation module.

    @module Nav
  **/
  var Submenu = (function() {

    var version = '0.0.1',

    // Timer for delayed hiding of submenu
    timer = null,

    Submenu = {};

    /**
      Event handler for hover.

      @event Submenu.hover
    **/
    Submenu.hover = function (e) {
      var $this = $(this)
      var $submenu = $this.find('> ul')

      if (e.type == 'mouseenter') {
        $submenu.addClass('is-hover')
        clearTimeout(timer)
      }
      else {
        // Delay hiding of the menu, usability thing
        timer = setTimeout(function(){
          $submenu.removeClass('is-hover')
          $this.removeClass('is-open')
        },300)
      }

      // $('> a', this).trigger($.Event('toggle.submenu'))
    };

    /**
      Event handler for toggle.

      @event Submenu.toggle
    **/
    Submenu.toggle = function (e) {
      // console.log("Toggle submenu: " + e.type)

      var $this = $(this),
          $parent  = $this.parent().closest('li'),
          isActive  = $parent.hasClass('is-open'),
          event = e,
          transition = e.data.activeTransition && e.data.activeTransition.onToggle;

      // default click behavior needs to close menus clearMenus()

      // Handle if the event was fired by link
      if (!isActive) {
        // if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        //   // if mobile we we use a backdrop because click events don't delegate
        //   $('<div class="submenu-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
        // }

        // Execute special pre-show hook
        if (transition && typeof transition === 'function') transition.call(this, isActive);

        $parent.trigger(e = $.Event('show.submenu'))

        // add hover to child submenu
        // console.log(event)
        if (event.type == 'mouseenter') $parent.find('> ul').addClass('is-hover')

        $parent
          .addClass('is-open')
          .trigger('shown.submenu')
      }
      else {
        // If submenu is hovered then return
        if ($parent.find('> ul').hasClass('is-hover')) return

        // Execute special pre-hide hook
        if (transition && typeof transition === 'function') transition.call(this, isActive);

        $parent.trigger(e = $.Event('hide.submenu'))
        $parent.removeClass('is-open').trigger('hidden.submenu')
      }

      return false
    };

    return Submenu;

  })();

  $.fn.submenu = {}
  $.fn.submenu.Module = Submenu

})(jQuery);
