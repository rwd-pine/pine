//
// Submenu: Navigation behavior
// --------------------------------

(function ($) { "use strict";

  /**
    Provides dropdown submenus for Responsive navigation module.

    @module Nav
  **/
  var Submenu = (function() {

    var version = '0.0.1',

    Submenu = {};

    /**
      Event handler for hover.

      @event Submenu.hover
    **/
    Submenu.hover = function (e) {
      var $submenu = $(this).find('> ul')

      if (e.type == 'mouseenter') {
        $submenu.addClass('is-hover')
      }
      else {
        $submenu.removeClass('is-hover')
        $(this).removeClass('is-open')
      }

      // $('> a', this).trigger($.Event('toggle.submenu'))
    };

    /**
      Event handler for toggle.

      @event Submenu.hover
    **/
    Submenu.toggle = function (e) {
      // console.log("Toggle submenu: " + e.type)

      var $this = $(this)
      var $parent  = $this.parent().closest('li')
      var isActive  = $parent.hasClass('is-open')
      var originalEvent = e
      var currentEffect = e.data.currentEffect.onToggle

      // Handle if the event was fired by link
      if (!isActive) {
        // if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        //   // if mobile we we use a backdrop because click events don't delegate
        //   $('<div class="submenu-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
        // }

        // Execute special pre-show hook
        if (typeof currentEffect === 'function') currentEffect.call(this, { show: isActive } );

        $parent.trigger(e = $.Event('show.submenu'))
        if (e.isDefaultPrevented()) return

        // add hover to child submenu
        // console.log(originalEvent)
        if (originalEvent.type == 'mouseenter')
          $parent.find('> ul').addClass('is-hover')

        $parent
          .addClass('is-open')
          .trigger('shown.submenu')
      }
      else {

        // If submenu is hovered then return
        if ($parent.find('> ul').hasClass('is-hover')) return

        if (currentEffect) currentEffect.call(this, { show: isActive } );

        $parent.trigger(e = $.Event('hide.submenu'))
        if (e.isDefaultPrevented()) return
        $parent.removeClass('is-open').trigger('hidden.submenu')
      }

      return false
    };

    return Submenu;

  })();

  $.fn.submenu = {}
  $.fn.submenu.Module = Submenu

})(jQuery);
