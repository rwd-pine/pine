//
// Navbar: Navigation behavior
// --------------------------------

(function ($, window) { "use strict";

  //
  // NAVBAR MODULE DEFINITION
  // ------------------------

  var Navbar = (function() {

    var version = '0.1.0',
    isDesktop = null,

    Navbar = {};

    Navbar.element = null;
    Navbar.options = null;

    Navbar.currentEffect = null;

    Navbar.effects = {};

    Navbar.submenu = $.fn.submenu;

    Navbar.defaults = {
      jsBreakpoint:     '600px',
      toggle:           '.has-submenu > a',
      submenu:          '.has-submenu',
      behaviorNoTouch:  'hover',
      effectDesktop:    'hover',
      effectTouch:      'nav-behave-right-to-left'
    };


    Navbar.init = function(element, options) {
      this.options = $.extend({}, this.defaults, options);
      this.element = $(element);
      isDesktop = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches;

      this.options.currentEffect = isDesktop ? this.effects[this.options.effectDesktop] : this.effects[this.options.effectTouch]

      // init submenus
      this.element.find('li').has('ul').addClass('has-submenu')
      this.element.find('a').on('focus.navbar', this.focus)

      // setup API
      $(window).on('load resize', $.proxy(this.api, this))
    };

    Navbar.checkMedia = function (e) {
      var mobileCond = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches
      var isLoad = e.type && (e.type == 'load')

      // Load or Using XOR to handle the switch, it fires only when it is needed
      if (isLoad || (( isDesktop || mobileCond ) && !( isDesktop && mobileCond ))) {
        return isDesktop = mobileCond // current view
      }

      return null
    };

    Navbar.api = function (e) {
      var media = this.checkMedia(e)
      if(media === null) return false // check if there is a change of media
        // console.log("call api")
      if(typeof this.options.currentEffect.onSwitch === 'function')
        this.options.currentEffect.onSwitch.call(this, false)

      if (media) {

        this.options.currentEffect = this.effects[this.options.effectDesktop]
        this.element.removeClass(this.options.effectTouch)
        this.element.addClass(this.options.effectDesktop)
        // console.log("Add 'mouse' listeners and disable 'click.submenu'")
        $(document)
          .on('mouseenter.submenu, mouseleave.submenu', this.options.submenu, this.options, this.submenu.prototype.hover)
          .on('mouseenter.submenu, mouseleave.submenu', this.options.toggle, this.options, this.submenu.prototype.toggle)
          .off('click.submenu')
      }
      else {
        this.options.currentEffect = this.effects[this.options.effectTouch]
        this.element.removeClass(this.options.effectDesktop)
        this.element.addClass(this.options.effectTouch)
        // console.log(this.options.currentEffect)
        // console.log("Add 'click.submenu' listeners and disable 'mouse'")
        $(document)
          .off('mouseenter.submenu, mouseleave.submenu')
          .on('click.submenu', this.options.toggle, this.options, this.submenu.prototype.toggle)
      }

      if(typeof this.options.currentEffect.onSwitch === 'function')
        this.options.currentEffect.onSwitch.call(this, true)
      // this.switchDOM()


    };

    Navbar.focus = function (e) {
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
    };

    Navbar.registerEffect = function (name, obj) {
      this.effects[name] = obj // save add-on
    };

    return Navbar;

  })();


  // ADD-ON definition
  Navbar.registerEffect('nav-behave-right-to-left', {

    onSwitch: function(condition){
      var $element = this.element
      var $submenu = $element.find('li').has('ul')

      var resizeSubmenu = function (){
        $('.nav-behave-right-to-left ul').css('width', $(window).width())
      }

      if(condition) {
        // console.log("enter mobile")
        $submenu.each(function(){
          $(this).find('> ul')
            .prepend($('<li class="back"><a href="#">' + $(this).find('> a').text() + '</a></li>'))
        })

        $element.find('ul').css('width', $(window).width())
        $(window).on('resize', resizeSubmenu)
      }
      else {
        // console.log("leave mobile")
        $element.find('ul').removeAttr('style')
        $submenu.find('li.back').remove()
        $(window).off('resize', resizeSubmenu)
      }

    },

    onToggle: function(params){
      var $this = $(this)

      if(params.show) {
        var $parentLists = $this.parents('ul')
        $parentLists.last().css('left', ($parentLists.length * 100) + '%')
      }
      else {
        var $parentLists = $this.parents('ul')
        $parentLists.last().css('left', (-100 * $parentLists.length) + '%')
      }
    }


  })

  // ADD-ON definition
  Navbar.registerEffect('hover', {
    onSwitch: function(condition){
      if(condition) {
        // console.log("enter desktop")
      }
      else {
        // console.log("leave desktop")
      }
    },

    onToggle: function(params){}
  })

  // NAVBAR PLUGIN DEFINITION
  // --------------------------

  var old = $.fn.navbar

  $.fn.navbar = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('navbar')
      var options = $.extend({}, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('navbar', (data = Navbar.init(this, options)))
      // if (typeof option == 'string') data[option]()
    })
  }

  $.fn.navbar.Constructor = Navbar

  // NAVBAR NO CONFLICT
  // --------------------

  $.fn.navbar.noConflict = function () {
    $.fn.navbar = old
    return this
  }






  // NAVBAR DEFAULT INITIALIZATION
  // --------------------
  $('[role=navigation]').navbar()

})(jQuery, window);
