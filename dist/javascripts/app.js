/**
* app.js v0.0.1
*/
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */

window.matchMedia = window.matchMedia || (function( doc, undefined ) {

  "use strict";

  var bool,
      docElem = doc.documentElement,
      refNode = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement( "body" ),
      div = doc.createElement( "div" );

  div.id = "mq-test-1";
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  return function(q){

    div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

    docElem.insertBefore( fakeBody, refNode );
    bool = div.offsetWidth === 42;
    docElem.removeChild( fakeBody );

    return {
      matches: bool,
      media: q
    };

  };

}( document ));



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

      @event Submenu.toggle
    **/
    Submenu.toggle = function (e) {
      // console.log("Toggle submenu: " + e.type)

      var $this = $(this),
          $parent  = $this.parent().closest('li'),
          isActive  = $parent.hasClass('is-open'),
          event = e,
          transition = e.data.transition && e.data.transition.onToggle;

      // Handle if the event was fired by link
      if (!isActive) {
        // if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        //   // if mobile we we use a backdrop because click events don't delegate
        //   $('<div class="submenu-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
        // }

        // Execute special pre-show hook
        if (transition && typeof transition === 'function') transition.call(this, { show: isActive } );

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
        if (transition && typeof transition === 'function') transition.call(this, { show: isActive } );

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
      transitionDesktop:    null,
      transitionMobile:      null
    };

    /**
      Nav options that override defaults

      @attribute Nav.options
      @type jQuery Element
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
      Applied effect, which depends on current view (dektop or mobile)

      @attribute Nav.transition
      @type Object
    **/
    Nav.transition = {};

    /**
      Initialize all properties of Nav Module and setup listeners

      @method Nav.init
    **/
    Nav.init = function(element, options) {
      this.options = $.extend({}, this.defaults, options);
      this.element = $(element);
      isDesktop = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches;


      this.transition = isDesktop ? this.setTransition[this.options.transitionDesktop] : this.setTransition[this.options.transitionMobile]

      // init submenus
      this.element.find('li').has('ul').addClass('has-submenu')
      this.element.find('a').on('focus.nav', this.focus)

      // setup API
      $(window).on('load resize', $.proxy(this.api, this))
    };

    /**
      Navigation module API method assigns appropriate listeners based on conditions.

      @method Nav.api
    **/
    Nav.api = function (e) {
      var media = this.checkMedia(e)

      if(media === null) return false // check if there is a change of media

      // Perform transition when leaving view
      if(this.transition && typeof this.transition.onSwitch === 'function') {
        this.transition.onSwitch.call(this, false)
      }

      if (media) {
        // Add 'mouse' listeners and disable 'click.submenu'
        $(document)
          .on('mouseenter.submenu, mouseleave.submenu', this.options.submenu, this, this.Submenu.hover)
          .on('mouseenter.submenu, mouseleave.submenu', this.options.toggle, this, this.Submenu.toggle)
          .off('click.submenu')
      }
      else {
        // Add 'click.submenu' listeners and disable 'mouse'"
        $(document)
          .off('mouseenter.submenu, mouseleave.submenu')
          .on('click.submenu', this.options.toggle, this, this.Submenu.toggle)

      }

      // Perform all operations to switch between views
      this.switchView(media)

      // Perform transition after entering view
      if(this.transition && typeof this.transition.onSwitch === 'function') {
        this.transition.onSwitch.call(this, true)
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

      // Load or Using XOR to handle the switch, it fires only when it is needed
      if (isLoad || (( isDesktop || condition ) && !( isDesktop && condition ))) {
        return isDesktop = condition // current view
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
      Setter for transitions. New transitions is added to transitions collection.

      @event Nav.registerTransition
      @param {String}   name  Transition name
      @param {Object}   obj   Transition definition
    **/
    Nav.setTransition = function (name) {
      this.transition = this.transitions[name] || false
    };

    /**
      Getter for transitions.

      @method Nav.getTransition
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
      this.transitions[name] = obj // save add-on
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

(function ($) { "use strict";

  var Nav = $.fn.nav.Module || {};

  // ADD-ON definition
  Nav.registerTransition('nav-behave-right-to-left', {

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

        $(document).on('click.submenu', '.back', this, this.Submenu.toggle)

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

      // TODO: simplify
      if(params.show) {

        var $parentLists = $this.parents('ul')
        $parentLists.last().css('left', (-100 * ($parentLists.length - 2)) + '%')
      }
      else {
        var $parentLists = $this.parents('ul')
        $parentLists.last().css('left', (-100 * $parentLists.length) + '%')
      }
    }


  })

  // ADD-ON definition
  Nav.registerTransition('hover', {
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

})(jQuery);
(function($){

  // NAV DEFAULT INITIALIZATION
  // --------------------
  $('[role=navigation]').nav({
    transitionMobile: 'nav-behave-right-to-left'
  })

})(jQuery);