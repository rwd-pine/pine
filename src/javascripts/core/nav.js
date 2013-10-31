//
// Responsive navigation module
//
// --------------------------------

(function ($, window, undefined) { "use strict";

  /**
    Provides the base for Responsive navigation module.
  **/
  var Nav = (function() {

    var version = '0.0.1',

    Nav = {};

    /**
      Stores the state of current view
    **/
    Nav.isDesktop = null;

    /**
      References Submenu module.
    **/
    Nav.Submenu = $.fn.submenu.Module || {};

    /**
      Root navigation element.
    **/
    Nav.element = null;

    /**
      Default configuration for navigation module.
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
    **/
    Nav.options = null;

    /**
      List of all available transitions. Transitions are loaded as plugins.
    **/
    Nav.transitions = {};

    /**
      Applied transition, which depends on the current view (dektop or mobile)
    **/
    Nav.activeTransition = {};

    /**
      Initialize all properties of Nav Module and sets up event listeners
    **/
    Nav.init = function(element, options) {
      this.options = $.extend({}, this.defaults, options)
      this.element = $(element)
      this.isDesktop = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches

      // Set initial transition
      this.isDesktop ? this.setActiveTransition(this.options.transitionDesktop) : this.setActiveTransition(this.options.transitionMobile)

      // Initialize Submenus
      this.element.find('li').has('ul').addClass('has-submenu')
      this.element.find('a').on('focus.nav', this.focus)

      // Default behavior, submenu is triggered on click
      $(document).on('click.submenu', this.options.toggle, this, this.Submenu.toggle)

      // Setup listeners
      $(window).on('load resize', $.proxy(this.api, this))
    };

    /**
      Navigation module API method handles switch between views.
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
      Checks current view if it satisfies switch condition. If no switch occurs, it returns null.
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
      Switches active transition when leaving one view and entering another.
    **/
    Nav.switchView = function (isDesktop) {
      var t = this.getTransitionName(isDesktop)

      this.element
        .removeClass(this.getTransitionName(!isDesktop))
        .addClass(t)

      this.setActiveTransition(t)
    };

    // TODO: abstrahovat eventy, nemusi to byt mousenter
    /**
      Event handler which is fired after keyboard input (tab).
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
    **/
    Nav.setActiveTransition = function (name) {
      this.activeTransition = this.transitions[name] || false
    };

    /**
      Getter for transition.
    **/
    Nav.getTransitionName = function (isDesktop) {
      return isDesktop ? this.options.transitionDesktop : this.options.transitionMobile
    };

    /**
      Adds new transition to the collection.
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
