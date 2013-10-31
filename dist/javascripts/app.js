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

(function ($, undefined) { "use strict";

  /**
    Provides dropdown submenus for Responsive navigation module.
  **/
  var Submenu = (function() {

    var version = '0.0.1',

    // Timer for delayed hiding of submenu
    timer = null,

    Submenu = {};

    /**
      Event handler for hover.
    **/
    Submenu.hover = function (e) {
      var $this = $(this)
      var $submenu = $this.find('> ul')

      if (e.type == 'mouseenter') {
        $submenu.addClass('is-hover')
        clearTimeout(timer)
      }
      else {
        // Delay hiding of the menu, usability thing
        timer = setTimeout(function(){
          $submenu.removeClass('is-hover')
          $this.removeClass('is-open')
        },300)
      }

      // $('> a', this).trigger($.Event('toggle.submenu'))
    };

    /**
      Event handler for toggle.
    **/
    Submenu.toggle = function (e) {
      // console.log("Toggle submenu: " + e.type)

      var $this = $(this),
          $parent  = $this.parent().closest('li'),
          isActive  = $parent.hasClass('is-open'),
          event = e,
          transition = e.data.activeTransition && e.data.activeTransition.onToggle;

      // default click behavior needs to close menus clearMenus()

      // Handle if the event was fired by link
      if (!isActive) {
        // if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        //   // if mobile we we use a backdrop because click events don't delegate
        //   $('<div class="submenu-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
        // }

        // Execute special pre-show hook
        if (transition && typeof transition === 'function') transition.call(this, isActive);

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
        if (transition && typeof transition === 'function') transition.call(this, isActive);

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
      this.options = $.extend({}, this.defaults, options);
      this.element = $(element);
      this.isDesktop = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches;

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

(function ($) { "use strict";

  var Nav = $.fn.nav.Module;

  // MOBILE TRANSITION: RIGHT TO LEFT
  // -------------------------
  Nav.registerTransition('nav-behave-right-to-left', {

    onSwitch: function(condition){
      var $element = this.element
      var $submenu = $element.find('li').has('ul')

      var resizeSubmenu = function (){
        $('.nav-behave-right-to-left ul').css('width', $(window).width())
      }

      if(condition) {
        // Enter mobile view
        $submenu.each(function(){
          $(this).find('> ul')
            .prepend($('<li class="back"><a href="#">' + $(this).find('> a').text() + '</a></li>'))
        })

        $(document).on('click.submenu', '.back', this, this.Submenu.toggle)

        $element.find('ul').css('width', $(window).width())
        $(window).on('resize', resizeSubmenu)
      }
      else {
        // Leave mobile view
        $element.find('ul').removeAttr('style')
        $submenu.find('li.back').remove()
        $(window).off('resize', resizeSubmenu)
      }
    },

    onToggle: function(isActive){
      var $this = $(this),
          $parentLists = $this.parents('ul'),
          level = isActive ? $parentLists.length - 2 : $parentLists.length;

      $parentLists.last().css('left', (-100 * level) + '%')
    }
  });

  // DESKTOP TRANSITION: HOVER FADE
  // -------------------------
  Nav.registerTransition('nav-hover-fade', {

    onSwitch: function(switchCondition){
      if (switchCondition) {
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
    },

    onToggle: function(isActive){}
  });

  // DESKTOP TRANSITION: HOVER
  // -------------------------
  Nav.registerTransition('nav-hover', {
    onSwitch: function(switchCondition){
      if (switchCondition) {
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
    },

    onToggle: function(isActive){}
  });

})(jQuery);
(function($){

  // NAV DEFAULT INITIALIZATION
  // --------------------
  $('[role=navigation]').nav({
    transitionMobile: 'nav-behave-right-to-left',
    transitionDesktop: 'nav-hover-fade'
  })

})(jQuery);