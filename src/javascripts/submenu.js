//
// Submenu: Navigation behavior
// --------------------------------


+function ($) { "use strict";

  // SUBMENU CLASS DEFINITION
  // ------------------------

  // var backdrop = '.submenu-backdrop'
  var toggle = '.has-submenu > a'

  var Submenu = function (element) {
    // Add event listeners
    $(element).on('mouseenter.submenu, mouseleave.submenu', this.hover)
    $(element).find('> a')
      .on('mouseenter.submenu, mouseleave.submenu', this.toggle)
  }

  // SUBMENU METHODS
  // ------------------------
  Submenu.prototype.hover = function (e) {
    var $submenu = $(this).find('> ul')

    $submenu.toggleClass('is-hovered')
    if (!$submenu.hasClass('is-hovered')) $(this).removeClass('is-open')
  }

  Submenu.prototype.toggle = function (e) {
    var $this = $(this)
    var $parent  = $this.parent()
    var isActive  = $parent.hasClass('is-open')
    var originalEvent = e

    // Handle if the event was fired by link
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

  Submenu.prototype.focus = function (e) {
    // Check if the focused element is part of some Submenu
    var $this = $(this)
    var $parent  = $this.parent()

    if ($parent.hasClass('has-submenu') && !$parent.hasClass('is-open')) {
      $this.trigger($.Event('mouseenter'))
    }

    var openedMenus = $('.is-open')

    if(openedMenus.length == 0) return

    openedMenus.filter(function(i){
      return $(this).find($this).length === 0
    }).removeClass('is-open')
  }


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
  $('.has-submenu').submenu()

  $(document)
    // .on('keydown.submenu', toggle, Submenu.prototype.keydown)
    .on('focus.submenu', '.nav-horizontal a', Submenu.prototype.focus)

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
