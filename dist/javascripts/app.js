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

      @event Submenu.hover
    **/
    Submenu.toggle = function (e) {
      // console.log("Toggle submenu: " + e.type)

      var $this = $(this)
      var $parent  = $this.parent().closest('li')
      var isActive  = $parent.hasClass('is-open')
      var originalEvent = e
      var currentEffect = e.data.currentEffect.onToggle

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

(function ($) { "use strict";

  var Nav = $.fn.nav.Module || {};

  // ADD-ON definition
  Nav.registerEffect('nav-behave-right-to-left', {

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

        $(document).on('click.submenu', '.back', this.options, Nav.Submenu.toggle)

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
  Nav.registerEffect('hover', {
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
  $('[role=navigation]').nav()

})(jQuery);