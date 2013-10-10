/**
* app.js v0.0.1
*/
//
// Submenu: Navigation behavior
// --------------------------------


+function ($, Modernizr) { "use strict";

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



  // NAVBAR CLASS DEFINITION
  // ------------------------
  var Navbar = function (element, options) {
    this.options = $.extend({}, Navbar.DEFAULTS, options)
    this.$element = $(element)
    this.isDesktop = !Modernizr.touch && Modernizr.mq(this.options.mqCondition)

    // init submenus
    $(element).find('li').has('ul').addClass('has-submenu')

    // setup API
    $(window).on('load resize', $.proxy(this.api, this))
  }

  Navbar.DEFAULTS = {
    mqCondition:  '(min-width: 600px)',
    toggle:       '.has-submenu > a',
    submenu:      '.has-submenu'
  }


  Navbar.prototype.api = function (e) {
    var mobileCond = !Modernizr.touch && Modernizr.mq(this.options.mqCondition)
    var isLoad = e.type && (e.type == 'load')

    // Load or Using XOR to handle the switch, it fires only when it is needed
    if (isLoad || (( this.options.isDesktop || mobileCond ) && !( this.options.isDesktop && mobileCond ))) {
      this.options.isDesktop = mobileCond // current view

      if(!Modernizr.touch && Modernizr.mq(this.options.mqCondition)) {
        // console.log("Add 'mouse' listeners and disable 'click.submenu'")
        $(document)
          .on('mouseenter.submenu, mouseleave.submenu', this.options.submenu, Submenu.prototype.hover)
          .on('mouseenter.submenu, mouseleave.submenu', this.options.toggle, Submenu.prototype.toggle)
          .off('click.submenu')
      }
      else {
        // console.log("Add 'click.submenu' listeners and disable 'mouse'")
        $(document)
          .off('mouseenter.submenu, mouseleave.submenu')
          .on('click.submenu', this.options.toggle, Submenu.prototype.toggle)
      }
    }
  }

  Navbar.prototype.keydown = function (e) {
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

  // NAVBAR PLUGIN DEFINITION
  // --------------------------

  var old = $.fn.navbar

  $.fn.navbar = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('navbar')
      var options = typeof option == 'object' && option

      if (!data) $this.data('navbar', (data = new Navbar(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.navbar.Constructor = Navbar

  // NAVBAR NO CONFLICT
  // --------------------

  $.fn.navbar.noConflict = function () {
    $.fn.navbar = old
    return this
  }

  // INITIALIZE NAVBAR
  // ----------------------
  $('[role=navigation]').navbar()


  // TODO: handle keyboard better
  // ---------------------
  $(document)
    .on('focus.submenu', '.nav-horizontal a', Navbar.prototype.keydown)
    // .on('keydown.submenu', toggle, Submenu.prototype.keydown)



}(window.jQuery, window.Modernizr);

(function($){

  // TODO: Our magnificent code

})(jQuery);