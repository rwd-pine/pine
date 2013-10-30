//
// Nav: Navigation behavior
// --------------------------------

(function ($, window, undefined) { "use strict";

  /**
    Provides the base for Responsive navigation module.

    @module Nav
  **/
  var Nav = (function() {

    var version = '0.0.1',


    Nav = {};
    /**
      Stores the state of current view

      @property isDesktop
      @type Boolean
    **/
    Nav.isDesktop = null;

    /**
      References Submenu module.

      @submodule Nav.Submenu
    **/
    Nav.Submenu = $.fn.submenu.Module || {};

    /**
      Root navigation element.

      @property Nav.element
      @type jQuery Element
      @default null
    **/
    Nav.element = null;

    // TODO: mozna prepsat na privatni promennou

    /**
      Default configuration for navigation module.

      @attribute Nav.defaults
      @readOnly
      @type boolean
    **/
    Nav.defaults = {
      jsBreakpoint:       '600px',
      toggle:             '.has-submenu > a',
      submenu:            '.has-submenu',
      transitionDesktop:  'nav-hover',
      transitionMobile:   null
    };

    /**
      Navigation options that override defaults

      @attribute Nav.options
      @type Object
      @default null
    **/
    Nav.options = null;

    /**
      List of all available transitions. Transitions are loaded as plugins.

      @attribute Nav.transitions
      @type Object
    **/
    Nav.transitions = {};

    /**
      Applied transition, which depends on the current view (dektop or mobile)

      @attribute Nav.activeTransition
      @type Object
    **/
    Nav.activeTransition = {};

    /**
      Initialize all properties of Nav Module and sets up event listeners

      @method Nav.init
    **/
    Nav.init = function(element, options) {
      this.options = $.extend({}, this.defaults, options);
      this.element = $(element);
      this.isDesktop = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches;

      // Set initial transition
      this.isDesktop ? this.setTransition(this.options.transitionDesktop) : this.setTransition(this.options.transitionMobile)

      // Initialize Submenus
      this.element.find('li').has('ul').addClass('has-submenu')
      this.element.find('a').on('focus.nav', this.focus)

      // Default behavior, submenu is triggered on click
      $(document).on('click.submenu', this.options.toggle, this, this.Submenu.toggle)

      // setup API
      $(window).on('load resize', $.proxy(this.api, this))
    };

    /**
      Navigation module API method assigns appropriate listeners based on conditions.

      @method Nav.api
    **/
    Nav.api = function (e) {
      var media = this.checkMedia(e)

      if(media === null) return false // check if there is actual change of media

      // Perform transition when leaving view
      if(this.activeTransition && typeof this.activeTransition.onSwitch === 'function') {
        this.activeTransition.onSwitch.call(this, false)
      }

      // Perform all operations to switch between views
      this.switchView(media)

      // Perform transition after entering view
      if(this.activeTransition && typeof this.activeTransition.onSwitch === 'function') {
        this.activeTransition.onSwitch.call(this, true)
      }
    };

    /**
      Checks current view if it satisfies switch condition. If no switch occured, it returns null.

      @method Nav.checkMedia
      @return Boolean or null
    **/
    Nav.checkMedia = function (e) {
      var condition = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches
      var isLoad = e.type && (e.type == 'load')

      // Check first load or switch beetween views (mobile XOR desktop), it sets isDesktop value only when it is needed
      if (isLoad || (( this.isDesktop || condition ) && !( this.isDesktop && condition ))) {
        return this.isDesktop = condition
      }

      return null
    };


    /**
      TODO

      @method Nav.switchView
    **/
    Nav.switchView = function (isDesktop) {
      var t = this.getTransition(isDesktop)

      this.element
        .removeClass(this.getTransition(!isDesktop))
        .addClass(t)

      this.setTransition(t)
    };

    // TODO: abstrahovat eventy, nemusi to byt mousenter
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
      Setter for transitions. New transition is added to transitions collection.

      @event Nav.registerTransition
      @param {String}   name  Transition name
      @param {Object}   obj   Transition definition
    **/
    Nav.setTransition = function (name) {
      this.activeTransition = this.transitions[name] || false
    };

    /**
      Getter for transitions.

      @method Nav.getTransition
      @param {Boolean}   isDesktop
    **/
    Nav.getTransition = function (isDesktop) {
      return isDesktop ? this.options.transitionDesktop : this.options.transitionMobile
    };

    /**
      Setter for transitions. New transitions is added to transitions collection.

      @event Nav.registerTransition
      @param {String}   name  Transition name
      @param {Object}   obj   Transition definition
    **/
    Nav.registerTransition = function (name, obj) {
      this.transitions[name] = obj
    };

    return Nav;

  })();


  // NAV PLUGIN DEFINITION
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

  // NAV NO CONFLICT
  // --------------------

  $.fn.nav.noConflict = function () {
    $.fn.nav = old
    return this
  }

})(jQuery, window);
