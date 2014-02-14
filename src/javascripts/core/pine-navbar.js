//
// PineJS: Responsive navigation widget
// ====================================

// PineJS is very simple and flexible responsive navigation. Its purpose is
// to simplify implementation of the navigation in your projects.

// ## BASIC USAGE

// ```javascript
//   $('.pine').pine()
// ```
//
// ## CONFIGURATION
// ```javascript
//   $('.pine').pine({
//     fxSmallDisplay:   'fx-collapse',
//     fxLargeDisplay:   'fx-hover-fade'
//   })```
//
// ### Defaults
// ```javascript
//   Navbar.defaults = {
//     largeDisplayStart:  '600px',
//     fxSmallDisplay:     'fx-right-to-left',
//     fxLargeDisplay:     'fx-hover-fade'
//   }```
//
// Available effects out of the box:
// 1. Mobile
//   - **Collapse** - simple show and hide of the child list (with animation)
//   - **Right to Left** - each level of navigation slides in from the right
// 2. Desktop
//   - **Toggle** - menus are toggled on click
//   - **Hover** - menus are toggled on hover
//   - **Hover with fade in/out** - extension to 'hover' effect, animation is added

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
    largeDisplayStart:       '600px',
    fxSmallDisplay: 'fx-right-to-left',
    fxLargeDisplay: 'fx-hover-fade'
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
    this.isLargeDisplay = window.matchMedia('(min-width: ' + this.options.largeDisplayStart + ')').matches
    this.isLargeDisplay ? this.setActiveTransition(this.options.fxLargeDisplay) : this.setActiveTransition(this.options.fxSmallDisplay)

    /* Mark all submenus */
    this.element.find('li').has('[class*="pine-level-"]').addClass('has-submenu')
    this.element.find('a').on('focus', this.focus) /* focus.pine */

    /* CLICK: Default behavior, submenu is triggered on click */
    // var eventType = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click'
    $(document).on('click.pine', this.SUBMENU + ' > a', $.proxy(Pine.Submenu.toggle, Pine.Navbar))

    // Navbar toggle button
    $(this.NAVBAR_TOGGLE).on('click.pine', Pine.Navbar.toggle)

    /* Setup API with all listeners */
    $(window).on({
      'load': $.proxy(this.api, this),
      'resize': $.proxy(this.api, this)
    })
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
    var condition = window.matchMedia('(min-width: ' + this.options.largeDisplayStart + ')').matches
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
    var newTransition = this.getTransitionName(isLargeDisplay)
    var origTransition = this.getTransitionName(!isLargeDisplay)

    this.element
      .removeClass(origTransition)
      .addClass(newTransition)

    this.setActiveTransition(newTransition)
    $.log('Transition: '+ newTransition)

    this.resetNav()
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
      $this.trigger($.Event('mouseover'))
    }

    var openedMenus = $('.is-open')

    if(openedMenus.length == 0) return

    openedMenus.filter(function(i){
      return $(this).find($this).length === 0
    }).removeClass('is-open')
  };

  /**
    Toggles navigation bar in mobile view
  **/
  Navbar.toggle = function (e) {
    e.preventDefault();

    $(this).toggleClass('is-active')
    $(document).find($(this).attr('href')).toggleClass('pine-visible')

    $.log('Event: Toggle Navbar')
  };

  /**
    Resets navigation to default state.
  **/
  Navbar.resetNav = function () {
    $(this.SUBMENU).removeClass('is-open')
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
    return isLargeDisplay ? this.options.fxLargeDisplay : this.options.fxSmallDisplay
  };

  /**
    Adds new transition to the collection.
  **/
  Navbar.registerTransition = function (name, obj) {
    this.transitions[name] = obj
  };

  return Navbar;

}(window.jQuery, window));
