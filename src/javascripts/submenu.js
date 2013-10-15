//
// Submenu: Navigation behavior
// --------------------------------

+function ($) { "use strict";

  // SUBMENU CLASS DEFINITION
  // ------------------------
  var Submenu = function () {}

  // SUBMENU METHODS
  // ------------------------
  Submenu.prototype.hover = function (e) {
    var $submenu = $(this).find('> ul')

    if (e.type == 'mouseenter') {
      $submenu.addClass('is-hover')
    }
    else {
      $submenu.removeClass('is-hover')
      $(this).removeClass('is-open')
    }

    // $('> a', this).trigger($.Event('toggle.submenu'))
  }


  Submenu.prototype.toggle = function (e) {
    // console.log("Toggle submenu: " + e.type)
    var $this = $(this)
    var $parent  = $this.parent().closest('li')
    var isActive  = $parent.hasClass('is-open')
    var originalEvent = e
    var currentEffect = e.data.currentEffect.onToggle
// debugger
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
  }

    // Submenu.prototype.keydown = function (e) {
  //   // Handle only arrow keys, esc and tab
  //   if (!/(38|40|27|9)/.test(e.keyCode)) return

  //   var $this = $(this)
  //   // e.preventDefault()
  //   e.stopPropagation()

  //   // if ($this.is('.disabled, :disabled')) return

  //   var $parent  = $this.parent()
  //   var isActive = $parent.hasClass('is-open')

  //   // if (!isActive || (isActive && e.keyCode == 27)) {
  //   //   if (e.which == 27) $parent.find(toggle).focus()
  //   //   return $this.click()
  //   // }

  //   var $items = $('[role=navigation] li:visible a', $parent)

  //   if (!$items.length) return

  //   var index = $items.index($items.filter(':focus'))

  //   if (e.keyCode == 38 && index > 0)                 index--                        // up
  //   if ((e.keyCode == 40 || e.keyCode == 9) && index < $items.length - 1) index++                        // down
  //   if (!~index)                                      index=0

  //   $items.eq(index).focus()
  // }


  // TODO: handle keyboard better
  // ---------------------
  // .on('keydown.submenu', toggle, Submenu.prototype.keydown)


  $.fn.submenu = Submenu

}(jQuery);
