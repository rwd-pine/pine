/**
* pine.js v0.0.1
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
// PineJS: Submenu
// ====================================

// ## Pine-submenu.js
// Submodule handles behavior of each submenu in the navigation bar. Its basis purpose is to handle 'hover' and 'toggle'.

/**
  Global Pine object
**/
var Pine = window.Pine || {}

/**
  Provides dropdown submenus for Responsive navigation module.
**/
Pine.Submenu = (function($, window, undefined) { "use strict";

  var version = '0.0.1',

  // Timer delays hiding of the submenu. It improves usability.
  timer = null,

  Submenu = {};

  // Method: Hover
  // -------------
  // Event handler for hover. When user enters the menu, timeout is cleared and
  // class 'is-hover' is added. Otherwise a 300ms timeout is set and the menu is closed.
  Submenu.hover = function (e) {
    var $this = $(this)
    var $submenu = $this.find('> ul')

    if (e.type == 'mouseenter') {
      $submenu.addClass('is-hover')
      clearTimeout(timer)
    }
    else {
      /* Delay hiding of the menu, usability thing */
      timer = setTimeout(function(){
        $submenu.removeClass('is-hover')
        $this.removeClass('is-open')
      },300)
    }
  };

  // Method: Toggle
  // -------------
  // Event handler for toggle.
  Submenu.toggle = function (e) {
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

}(window.Zepto || window.jQuery, window));


//
// PineJS: Responsive navigation widget
// ====================================

// PineJS is very simple and flexible responsive navigation. Its purpose is
// to simplify implementation of the navigation in your projects.

// ## BASIC USAGE

// ```javascript
//   $('[role=navigation]').pine()
// ```
//
// ## CONFIGURATION
// ```javascript
//   $('[role=navigation]').pine({
//     transitionMobile:   'fx-toggle',
//     transitionDesktop:  'fx-hover-fade'
//   })```
//
// ### Defaults
// ```javascript
//   Navbar.defaults = {
//     jsBreakpoint:       '600px',
//     transitionMobile:   'fx-toggle',
//     transitionDesktop:  'fx-hover-fade'
//   }```
//
// Available transitions out of the box:
// 1. Mobile
//   - **Toggle** - simple show and hide of the child list
//   - **Right to Left** - each level of navigation slides in from the right
//   - **Left to Right** - inverted direction, for Arabic and other languages
// 2. Desktop
//   - **Toggle** - menus are toggled by click
//   - **Hover** - menus are toggled on hover
//   - **Hover with fade in/out** - extension to 'hover' transition, animation is added

/**
  Global Pine object
**/
var Pine = window.Pine || {}

/**
  Navbar module provides base for the responsive navigation widget.
**/
Pine.Navbar = (function ($, window, undefined) { "use strict";

  var version = '0.0.1',

  Navbar = {};

  /**
    Stores the state of the current view. Either true for large displays or false for small ones.
  **/
  Navbar.isLargeDisplay = null;

  /**
    Root element.
  **/
  Navbar.element = null;

  /**
    Default configuration for the module.
  **/
  Navbar.DEFAULTS = {
    jsBreakpoint:       '600px',
    transitionSmallDisplay: 'fx-right-to-left',
    transitionLargeDisplay: 'fx-hover-fade'
  };

  Navbar.NAVBAR_TOGGLE =  '[data-pine=toggle]';
  Navbar.SUBMENU =        '.has-submenu';

  /**
    Navigation options which override defaults
  **/
  Navbar.options = null;

  /**
    List of all available transitions. Transitions are loaded as plugins via registerTransition().
  **/
  Navbar.transitions = {};

  /**
    Applied transition, which depends on the current view (dektop or mobile)
  **/
  Navbar.activeTransition = {};

  /**
    Initialize all properties and sets up event listeners
  **/
  Navbar.init = function(element, options) {
    this.options = $.extend({}, this.DEFAULTS, options)
    this.element = $(element)

    /* Initialize view and set active transtition */
    this.isLargeDisplay = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches
    this.isLargeDisplay ? this.setActiveTransition(this.options.transitionLargeDisplay) : this.setActiveTransition(this.options.transitionSmallDisplay)

    /* Mark navbar */
    this.element.find('ul:first').addClass('pine-navbar')
    /* Mark all submenus */
    this.element.find('li').has('ul').addClass('has-submenu')
    this.element.find('a').on('focus.pine', this.focus)
    /* TODO refactor: Add master class */
    this.isLargeDisplay ? this.element.addClass('pine-large') : this.element.addClass('pine-large')

    /* Default behavior, submenu is triggered on click */
    $(document).on('click.pine.submenu', this.SUBMENU + ' > a', this, Pine.Submenu.toggle)
    $(document).on('click.pine.trigger', this.NAVBAR_TOGGLE, this, Pine.Navbar.toggle)

    /* Setup API with all listeners */
    $(window).on('load resize', $.proxy(this.api, this))
  };

  /**
    Navigation module API method handles switch between views.
  **/
  Navbar.api = function (e) {
    var media = this.checkMedia(e)

    /* Check if there is actual change of media */
    if(media === null) return false

    /* Perform transition when leaving view */
    if(this.activeTransition && typeof this.activeTransition.onSwitch === 'function') {
      this.activeTransition.onSwitch.call(this, false)
    }

    /* Perform all operations to switch between views */
    this.switchView(media)

    /* Perform transition after entering view */
    if(this.activeTransition && typeof this.activeTransition.onSwitch === 'function') {
      this.activeTransition.onSwitch.call(this, true)
    }
  };

  /**
    Checks current view if it satisfies switch condition. If no switch occurs, it returns null.
  **/
  Navbar.checkMedia = function (e) {
    var condition = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches
    var isLoad = e.type && (e.type == 'load')

    /* Check first load or switch beetween views (mobile XOR desktop), it sets isLargeDisplay value only when it is needed */
    if (isLoad || (( this.isLargeDisplay || condition ) && !( this.isLargeDisplay && condition ))) {
      return this.isLargeDisplay = condition
    }

    return null
  };


  /**
    Switches active transition when leaving one view and entering another.
  **/
  Navbar.switchView = function (isLargeDisplay) {
    var t = this.getTransitionName(isLargeDisplay)
    var c = this.getNavbarClass(isLargeDisplay)

    this.element
      .removeClass(this.getTransitionName(!isLargeDisplay))
      .addClass(t)

    // TODO refactor
    this.element
      .removeClass(this.getNavbarClass(!isLargeDisplay))
      .addClass(c)

    this.setActiveTransition(t)
  };

  // TODO: abstrahovat eventy, nemusi to byt mousenter
  /**
    Event handler which is fired after keyboard input (tab).
  **/
  Navbar.focus = function (e) {
    /* Check if the focused element is part of some Submenu */
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
  Navbar.setActiveTransition = function (name) {
    this.activeTransition = this.transitions[name] || false
  };

  /**
    Getter for transition.
  **/
  Navbar.getTransitionName = function (isLargeDisplay) {
    return isLargeDisplay ? this.options.transitionLargeDisplay : this.options.transitionSmallDisplay
  };

  /**
    Getter for classname.
  **/
  Navbar.getNavbarClass = function (isLargeDisplay) {
    return isLargeDisplay ? 'pine-large' : 'pine-small'
  };

  /**
    Adds new transition to the collection.
  **/
  Navbar.registerTransition = function (name, obj) {
    this.transitions[name] = obj
  };

  /**
    Toggles menu in mobile view
  **/
  Navbar.toggle = function (e) {
    e.preventDefault();

    $(this).toggleClass('is-active')
    $(document).find($(this).attr('href')).toggleClass('is-visible')
  };

  return Navbar;

}(window.Zepto || window.jQuery, window));

//
// DESKTOP TRANSITION: HOVER
// -------------------------
var pine_fx_hover = {
  onSwitch: function(switchCondition){
    if (switchCondition) {
      // Add 'mouse' listeners and disable 'click.submenu'
      $(document)
        .on('mouseenter.pine.submenu, mouseleave.pine.submenu', this.SUBMENU, this, Pine.Submenu.hover)
        .on('mouseenter.pine.submenu, mouseleave.pine.submenu', this.SUBMENU + ' > a', this, Pine.Submenu.toggle)
        .off('click.pine.submenu')
    }
    else {
      // Add 'click.submenu' listeners and disable 'mouse'"
      $(document)
        .off('mouseenter.pine.submenu, mouseleave.pine.submenu')
        .on('click.pine.submenu', this.SUBMENU + ' > a', this, Pine.Submenu.toggle)

    }
  },
  onToggle: function(isActive){}
};

Pine.Navbar.registerTransition('fx-hover', pine_fx_hover);


//
// DESKTOP TRANSITION: HOVER FADE
// -------------------------
Pine.Navbar.registerTransition('fx-hover-fade', $.extend({}, pine_fx_hover));
//
// MOBILE TRANSITION: RIGHT TO LEFT
// -------------------------
Pine.Navbar.registerTransition('fx-right-to-left', {

  onSwitch: function(condition){
    var $element = this.element
    var $submenu = $element.find('li').has('ul')

    var resizeSubmenu = function (){
      $('.fx-right-to-left ul').css('width', $(window).width())
    }

    if(condition) {
      // Enter mobile view
      $submenu.each(function(){
        $(this).find('> ul')
          .prepend($('<li class="pine-back"><a href="#">' + $(this).find('> a').text() + '</a></li>'))
      })

      $(document).on('click.pine.submenu', '.pine-back', this, Pine.Submenu.toggle)

      $element.find('ul').css('width', $(window).width())
      $(window).on('resize', resizeSubmenu)
    }
    else {
      // Leave mobile view
      $element.find('ul').removeAttr('style')
      $submenu.find('li.pine-back').remove()
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



// NAVBAR PLUGIN DEFINITION
// --------------------------

(function ($, Pine, undefined) { "use strict";

  var old = $.fn.pine

  $.fn.pine = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('pine')
      var options = $.extend({}, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('pine', (data = Pine.Navbar.init(this, options)))
      /*  if (typeof option == 'string') data[option]() */
    })
  }

  $.fn.pine.Module = Pine.Navbar

  // NAVBAR NO CONFLICT
  // --------------------

  $.fn.pine.noConflict = function () {
    $.fn.pine = old
    return this
  }

  // APPLY TO STANDARD PINE ELEMENTS
  // ===================================
  $('[data-pine=navbar]').pine()


}(jQuery, Pine));