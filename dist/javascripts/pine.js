/**
* pine.js v0.0.1
*/
//
// JS or no JS, that is the question
// Adapted from Modernizr (http://modernizr.com/)
// -----------------------------------

(function(document, undefined){
  // Remove 'no-js' class and replace it with 'js'
  doc = document.documentElement;
  doc.className = doc.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') + ' js';

}(this.document));
//
// LOGGER
// Very simple javascript logging plugin
// ------------------------------------

(function($) {
  $.log = function(message) {
    if (window.log && window.console && window.console.log)
      console.log(message)
  }
}(window.jQuery || window.Zepto));
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */

window.matchMq = (function(doc, undefined){

  var docElem  = doc.documentElement,
      refNode  = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement('body'),
      div      = doc.createElement('div');

  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  var mqRun = function ( mq ) {
    div.innerHTML = '&shy;<style media="' + mq + '"> #mq-test-1 { width: 42px; }</style>';
    docElem.insertBefore( fakeBody, refNode );
    bool = div.offsetWidth === 42;
    docElem.removeChild( fakeBody );

    return { matches: bool, media: mq };
  },

  getEmValue = function () {
    var ret,
        body = docElem.body,
        fakeUsed = false;

    div.style.cssText = "position:absolute;font-size:1em;width:1em";

    if( !body ) {
      body = fakeUsed = doc.createElement( "body" );
      body.style.background = "none";
    }

    body.appendChild( div );

    docElem.insertBefore( body, docElem.firstChild );

    if( fakeUsed ) {
      docElem.removeChild( body );
    } else {
      body.removeChild( div );
    }

    //also update eminpx before returning
    ret = eminpx = parseFloat( div.offsetWidth );

    return ret;
  },

  //cached container for 1em value, populated the first time it's needed
  eminpx,

  // verify that we have support for a simple media query
  mqSupport = mqRun( '(min-width: 0px)' ).matches;

  return function ( mq ) {
    if( mqSupport ) {
      return mqRun( mq );
    } else {
      var min = mq.match( /\(min\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/ ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
          max = mq.match( /\(max\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/ ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
          minnull = min === null,
          maxnull = max === null,
          currWidth = doc.body.offsetWidth,
          em = 'em';

      if( !!min ) { min = parseFloat( min ) * ( min.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 ); }
      if( !!max ) { max = parseFloat( max ) * ( max.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 ); }

      bool = ( !minnull || !maxnull ) && ( minnull || currWidth >= min ) && ( maxnull || currWidth <= max );

      return { matches: bool, media: mq };
    }
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

  // Method: Event handler that shows submenus
  // -------------
  Submenu.toggle = function (e) {
    var $menu = $(e.currentTarget).closest('.pine-has-subnav'),
        transition = this.activeTransition && this.activeTransition.beforeToggle,
        isActive = $menu.hasClass('pine-level-open');

    e.preventDefault()
    // e.stopPropagation()

    // Execute special pre-show hook
    if (transition && typeof transition === 'function') transition.call(e.currentTarget, isActive);

    if(!isActive) {
      // if ('ontouchstart' in document.documentElement && !$menu.closest('.pine').length) {
      //   // if mobile we use a backdrop because click events don't delegate
      //   $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      // }

      $menu.trigger(e = $.Event('show')) /* show.submenu */
      $menu.addClass('pine-level-open').trigger('shown') /* shown.submenu */

      $.log('Event: show')
    }
    else {
      $menu.trigger(e = $.Event('hide')) /* hide.submenu */
      $menu.removeClass('pine-level-open').trigger('hidden') /* hidden.submenu */

      $.log('Event: hide')
    }
  }

  return Submenu;

}(window.jQuery, window));


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
  Navbar.SUBMENU =        '.pine-has-subnav';

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
    this.isLargeDisplay = window.matchMq('(min-width: ' + this.options.largeDisplayStart + ')').matches
    this.isLargeDisplay ? this.setActiveTransition(this.options.fxLargeDisplay) : this.setActiveTransition(this.options.fxSmallDisplay)

    /* Mark all submenus */
    this.element.find('li').has('ul').addClass('pine-has-subnav')
    // this.element.find('li').has('[class*="pine-level-"]').addClass('pine-has-subnav')
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
    var condition = window.matchMq('(min-width: ' + this.options.largeDisplayStart + ')').matches
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

    if ($parent.hasClass('pine-has-subnav') && !$parent.hasClass('pine-level-open')) {
      $this.trigger($.Event('mouseover'))
    }

    var openedMenus = $('.pine-level-open')

    if(openedMenus.length == 0) return

    openedMenus.filter(function(i){
      return $(this).find($this).length === 0
    }).removeClass('pine-level-open')
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
    $(this.SUBMENU).removeClass('pine-level-open')
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

//
// DESKTOP TRANSITION: HOVER
// -------------------------
var pine_fx_hover = {
  onSwitch: function(switchCondition){
    if (switchCondition) {
      // Add 'mouse' listeners and disable 'click.submenu'
      $(document)
        .on({'mouseenter.pine': $.proxy(Pine.Submenu.toggle, this), 'mouseleave.pine': $.proxy(Pine.Submenu.toggle, this)}, this.SUBMENU)
        .off('click.pine')
    }
    else {
      // Add 'click.submenu' listeners and disable 'mouse'"
      $(document)
        .off('mouseenter.pine')
        .off('mouseleave.pine')
        .on('click.pine', this.SUBMENU + ' > a', $.proxy(Pine.Submenu.toggle, this))
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

  // Method: onSwitch is executed when change of view on navbar occurs
  // -------------
  onSwitch: function(condition){
    var $element = this.element
    var $submenu = $element.find('li').has('ul')

    var resizeSubmenu = function (){
      $('.fx-right-to-left ul').css('width', $(window).width())
    }

    // Enter small display view
    if(condition) {
      // Add back buttons to each submenu
      $submenu.each(function(){
        $(this).find('ul').first()
          .prepend($('<li class="pine-back"><a href="#">' + $(this).find('a').first().text() + '</a></li>'))
      })

      // Attach listeners to the back buttons
      $(document).on('click.pine', '.pine-back', $.proxy(Pine.Submenu.toggle, this))

      // Set correct width for all lists (width of the viewport)
      $element.find('ul').css('width', $(window).width())

      // Setup listeners, some browsers do not trigger resize when changing orientation
      // More details: http://www.quirksmode.org/blog/archives/2013/11/orientationchan.html
      $(window).on({'resize': resizeSubmenu, 'orientationchange': resizeSubmenu})

      $.log('ENTER small view')
    }

    // Leave small display view
    else {
      $element.find('ul').removeAttr('style')
      $submenu.find('li.pine-back').remove()
      $(window).off('resize', resizeSubmenu)

      $.log('LEAVE small view')
    }
  },

  // Method: beforeToggle handles effects and any manipulation before 'toogle'
  // -------------
  beforeToggle: function(isActive){
    var $this = $(this),
        $parentLists = $this.parents('ul'),
        level = isActive ? $parentLists.length - 2 : $parentLists.length;

    // Pan left or right depending on isActive and target level
    // $parentLists.last().css('left', (-100 * level) + '%')
    $parentLists.last().animate({
      left: (-100 * level) + '%'
    }, 300) //'ease-out' TODO: add jQuery plugin for easing

  }
});



// NAVBAR PLUGIN DEFINITION
// --------------------------

// Execute only if jQuery is present
window.jQuery && (function ($, Pine, undefined) { "use strict";

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

}(window.jQuery, Pine));

(function ($, undefined) { "use strict";

  // APPLY TO STANDARD PINE ELEMENTS
  // ===================================
  $('[data-pine=navbar]').pine()

}(window.Zepto || window.jQuery));
