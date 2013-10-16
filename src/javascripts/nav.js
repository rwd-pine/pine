//
// Nav: Navigation behavior
// --------------------------------

(function ($, window) { "use strict";

  var Submenu = $.fn.submenu.Module || {};

  /**
    Provides the base for Responsive navigation module.

    @module Nav
  **/
  var Nav = (function() {

    var version = '0.0.1',
    isDesktop = null,

    Nav = {};

    // Submodule reference
    Nav.Submenu = Submenu;

    /**
      Root element.

      @property Nav.element
      @type jQuery Element
      @default null
    **/
    Nav.element = null;

    /**
      Default configuration for navigation module.

      @attribute Nav.defaults
      @readOnly
      @type boolean
    **/
    Nav.defaults = {
      jsBreakpoint:     '600px',
      toggle:           '.has-submenu > a',
      submenu:          '.has-submenu',
      behaviorNoTouch:  'hover',
      effectDesktop:    'hover',
      effectTouch:      'nav-behave-right-to-left'
    };

    /**
      Nav options that override defaults

      @attribute Nav.options
      @type jQuery Element
      @default null
    **/
    Nav.options = null;

    /**
      Applied effect, which depends on current view (dektop or mobile)

      @attribute Nav.currentEffect
      @type Object
      @default null
    **/
    Nav.currentEffect = null;

    /**
      List of all available effects. Effects are loaded as plugins.

      @attribute Nav.effects
      @type Object
    **/
    Nav.effects = {};

    /**
      Initialize all properties of Nav Module and setup listeners

      @method Nav.init
    **/
    Nav.init = function(element, options) {
      this.options = $.extend({}, this.defaults, options);
      this.element = $(element);
      isDesktop = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches;

      this.options.currentEffect = isDesktop ? this.effects[this.options.effectDesktop] : this.effects[this.options.effectTouch]

      // init submenus
      this.element.find('li').has('ul').addClass('has-submenu')
      this.element.find('a').on('focus.nav', this.focus)

      // setup API
      $(window).on('load resize', $.proxy(this.api, this))
    };

    /**
      Checks current view if it satisfies switch condition. If no switch occured, it returns null.

      @method Nav.checkMedia
      @return Boolean or null
    **/
    Nav.checkMedia = function (e) {
      var mobileCond = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches
      var isLoad = e.type && (e.type == 'load')

      // Load or Using XOR to handle the switch, it fires only when it is needed
      if (isLoad || (( isDesktop || mobileCond ) && !( isDesktop && mobileCond ))) {
        return isDesktop = mobileCond // current view
      }

      return null
    };

    /**
      Navigation module API method assigns appropriate listeners based on conditions.

      @method Nav.api
    **/
    Nav.api = function (e) {
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
          .on('mouseenter.submenu, mouseleave.submenu', this.options.submenu, this.options, this.Submenu.hover)
          .on('mouseenter.submenu, mouseleave.submenu', this.options.toggle, this.options, this.Submenu.toggle)
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
          .on('click.submenu', this.options.toggle, this.options, this.Submenu.toggle)

      }

      if(typeof this.options.currentEffect.onSwitch === 'function')
        this.options.currentEffect.onSwitch.call(this, true)
      // this.switchDOM()


    };

    /**
      Event handler which is fired after keyboard input (tab).

      @event Nav.focus
      @param {Object} Event Object
    **/
    Nav.focus = function (e) {
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

    /**
      Setter for effects. New effects is added to effects collection.

      @event Nav.registerEffect
      @param {String}   name  Effect name
      @param {Object}   obj   Effect definition
    **/
    Nav.registerEffect = function (name, obj) {
      this.effects[name] = obj // save add-on
    };

    return Nav;

  })();


  // NAVBAR PLUGIN DEFINITION
  // --------------------------

  var old = $.fn.nav

  $.fn.nav = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('nav')
      var options = $.extend({}, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('nav', (data = Nav.init(this, options)))
      // if (typeof option == 'string') data[option]()
    })
  }

  $.fn.nav.Module = Nav

  // NAVBAR NO CONFLICT
  // --------------------

  $.fn.nav.noConflict = function () {
    $.fn.nav = old
    return this
  }

})(jQuery, window);
