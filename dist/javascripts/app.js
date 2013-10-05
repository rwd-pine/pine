/**
* app.js v0.0.1
*/
//
// Submenu: Navigation behavior
// --------------------------------


+function ($) { "use strict";

  // SUBMENU CLASS DEFINITION
  // ------------------------

  // var backdrop = '.submenu-backdrop'
  var submenu      = '.has-submenu'
  var toggle       = '.has-submenu > a'

  var Submenu = function (element) {
    // $(element).on('click.submenu', this.toggle)
  }

  // SUBMENU METHODS
  // ------------------------

  Submenu.prototype.toggleMenu = function (e) {
    $(this).find('> ul').toggleClass('is-hovered')

    if (!$(this).find('> ul').hasClass('is-hovered')) $(this).removeClass('is-open')
  }

  Submenu.prototype.toggle = function (e) {
    var $this = $(this)

    var $parent  = $this.parent()
    var isActive = $parent.hasClass('is-open')

    if (!isActive) {
      // if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
      //   // if mobile we we use a backdrop because click events don't delegate
      //   $('<div class="submenu-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      // }

      $parent.trigger(e = $.Event('show.submenu'))
      if (e.isDefaultPrevented()) return

      // add hover to child submenu
      $parent.find('> ul').addClass('is-hovered')

      $parent
        .addClass('is-open')
        .trigger('shown.submenu')

      $this.focus()
    }
    else {
      // If submenu is hovered then return
      if ($parent.find('> ul').hasClass('is-hovered')) return

      $parent.trigger(e = $.Event('hide.submenu'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('is-open').trigger('hidden.submenu')
    }

    return false
  }

  // Submenu.prototype.keydown = function (e) {
  //   if (!/(38|40|27)/.test(e.keyCode)) return

  //   var $this = $(this)

  //   e.preventDefault()
  //   e.stopPropagation()

  //   if ($this.is('.disabled, :disabled')) return

  //   var $parent  = getParent($this)
  //   var isActive = $parent.hasClass('is-open')

  //   if (!isActive || (isActive && e.keyCode == 27)) {
  //     if (e.which == 27) $parent.find(toggle).focus()
  //     return $this.click()
  //   }

  //   var $items = $('[role=menu] li:not(.divider):visible a', $parent)

  //   if (!$items.length) return

  //   var index = $items.index($items.filter(':focus'))

  //   if (e.keyCode == 38 && index > 0)                 index--                        // up
  //   if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
  //   if (!~index)                                      index=0

  //   $items.eq(index).focus()
  // }


  // SUBMENU PLUGIN DEFINITION
  // --------------------------

  var old = $.fn.submenu

  $.fn.submenu = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('submenu')

      if (!data) $this.data('submenu', (data = new Submenu(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.submenu.Constructor = Submenu


  // SUMBENU NO CONFLICT
  // --------------------

  $.fn.submenu.noConflict = function () {
    $.fn.submenu = old
    return this
  }


  // INITIALIZE MENU ITEM
  // ----------------------
  $('.nav-horizontal li').has('ul').addClass('has-submenu')

  // APPLY TO STANDARD SUBMENU ELEMENTS
  // ------------------------------------

  $(submenu)
    .on('mouseenter.submenu, mouseleave.submenu', Submenu.prototype.toggleMenu) // clear menus before doing anything

  $(toggle)
    .on('mouseenter.submenu, mouseleave.submenu', Submenu.prototype.toggle) // toggle the menu

    // .on('click.submenu', toggle, Submenu.prototype.toggle) // toggle the menu
  //   .on('keydown.submenu', toggle + ', [role=menu]' , Submenu.prototype.keydown) // handle keyboard input

   // NAVBAR: Menu handler
  // Adds hover funcionality for desktops and removes it for touch devices
  // -------------------------------
  // var hoverable = function() {
  //   var elements = $(toggle); // all toggle elements

  //   if(!Modernizr.touch && Modernizr.mq('(min-width: 600px)')) {
  //     elements.off('click.submenu.enable').on('click.submenu.disable', function(e){ return false; })
  //     elements.trigger('click.submenu.disable');
  //   }
  //   else {
  //     elements.off('click.submenu.disable').on('click.submenu.enable', function(e){ return true; })
  //     elements.trigger('click.submenu.enable');
  //   }
  // };

  // // Init
  // $(window).resize(hoverable);
  // hoverable();


}(window.jQuery);

(function($){

  // TODO: Our magnificent code

})(jQuery);