/**
* pine.js v0.0.1
*/
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

window.matchMedia = window.matchMedia || (function(doc, undefined){

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

(function() {

  (function($) {
    return $.fn.hoover = function(options) {
      var el, enter, hovering, leave, reset, settings, timeout,
        _this = this;
      el = this;
      timeout = null;
      hovering = false;
      settings = {
        "in": 250,
        out: 150
      };
      if (options) $.extend(settings, options);
      enter = function() {
        el.trigger("hooverIn");
        reset();
        return hovering = true;
      };
      leave = function() {
        el.trigger("hooverOut");
        reset();
        return hovering = false;
      };
      reset = function() {
        if (timeout) clearTimeout(timeout);
        return timeout = null;
      };
      el.bind("mouseover", function() {
        if (hovering) {
          return reset();
        } else {
          if (!timeout) return timeout = setTimeout(enter, settings["in"]);
        }
      });
      el.bind("mouseout", function() {
        if (hovering) {
          if (timeout) reset();
          return timeout = setTimeout(leave, settings.out);
        } else {
          return reset();
        }
      });
      return this;
    };
  })(window.Zepto || window.jQuery);

}).call(this);

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
    var $menu = $(e.currentTarget).closest('.has-submenu'),
        transition = this.activeTransition && this.activeTransition.beforeToggle,
        isActive = $menu.hasClass('is-open');

    // e.preventDefault()
    // e.stopPropagation()

    // Execute special pre-show hook
    if (transition && typeof transition === 'function') transition.call(e.currentTarget, isActive);

    if(!isActive) {
      // if ('ontouchstart' in document.documentElement && !$menu.closest('.pine').length) {
      //   // if mobile we use a backdrop because click events don't delegate
      //   $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      // }

      $menu.trigger(e = $.Event('show')) /* show.submenu */
      $menu.addClass('is-open').trigger('shown') /* shown.submenu */

      $.log('Event: show')
    }
    else {
      $menu.trigger(e = $.Event('hide')) /* hide.submenu */
      $menu.removeClass('is-open').trigger('hidden') /* hidden.submenu */

      $.log('Event: hide')
    }
  }

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

    /* Mark navbar
       Note: Syntax ul:first cannot be used for Zepto
    */
    this.element.find('ul').first().addClass('pine-navbar')
    /* Mark all submenus */
    this.element.find('li').has('ul').addClass('has-submenu')
    this.element.find('a').on('focus', this.focus) /* focus.pine */
    /* TODO refactor: Add master class */
    this.isLargeDisplay ? this.element.addClass('pine-large') : this.element.addClass('pine-small')

    /* CLICK: Default behavior, submenu is triggered on click */
    // var eventType = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click'
    $(document).on('click', this.SUBMENU + ' > a', $.proxy(Pine.Submenu.toggle, Pine.Navbar))

    // Navbar toggle button
    $(this.NAVBAR_TOGGLE).on('click', Pine.Navbar.toggle)

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
    var newTransition = this.getTransitionName(isLargeDisplay)
    var origTransition = this.getTransitionName(!isLargeDisplay)
    var newClass = this.getNavbarClass(isLargeDisplay)
    var origClass = this.getNavbarClass(!isLargeDisplay)

    this.element
      .removeClass(origTransition)
      .addClass(newTransition)

    $.log('Transition: '+ newTransition)

    // TODO refactor
    this.element
      .removeClass(origClass)
      .addClass(newClass)

    this.setActiveTransition(newTransition)

    $.log('View: ' + newClass)

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
    $(document).find($(this).attr('href')).toggleClass('is-visible')

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
        .on({'mouseenter': $.proxy(Pine.Submenu.toggle, this), 'mouseleave': $.proxy(Pine.Submenu.toggle, this)}, this.SUBMENU)
        .off('click')
        // .off('click.pine.submenu')
    }
    else {
      // Add 'click.submenu' listeners and disable 'mouse'"
      $(document)
        .off('mouseenter')
        .off('mouseleave')
        .on('click', this.SUBMENU + ' > a', $.proxy(Pine.Submenu.toggle, this))
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
      $(document).on('click', '.pine-back', $.proxy(Pine.Submenu.toggle, this))

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
      translate: (-100 * level) + '%'
    }, 300, 'ease-out')

  }
});



//
// MOBILE TRANSITION: TOGGLE
// -------------------------
Pine.Navbar.registerTransition('fx-toggle', {

  // Method: onSwitch is executed when change of view on navbar occurs
  // -------------
  onSwitch: function(condition){
  },

  // Method: beforeToggle handles effects and any manipulation before 'toogle'
  // -------------
  beforeToggle: function(isActive){
    var $this = $(this),
        $submenu = $this.siblings('ul'),
        submenuHeight = '0px';

    if(!isActive) {
      var el = $submenu.clone().css({"max-height":"none"}).appendTo("body")
      submenuHeight = el.css("height")
      el.remove()
    }

    console.log(submenuHeight)
    $submenu.animate({
      'max-height': submenuHeight
    }, 300) //'ease-in-out' can be added later (needs to be compatible with jQuery)

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

}(jQuery, Pine));

// NAVBAR PLUGIN DEFINITION
// --------------------------

// Execute only if Zepto is present
window.Zepto && (function ($, Pine, undefined) { "use strict";

  $.fn.pine = function (option) {
    $.each(this, function(index, item){
      var $this   = $(this)
      var options = $.extend({}, typeof option == 'object' && option)

      Pine.Navbar.init(this, options)
    })
  }

}(Zepto, Pine));

(function ($, undefined) { "use strict";

  // APPLY TO STANDARD PINE ELEMENTS
  // ===================================
  $('[data-pine=navbar]').pine()

}(window.Zepto || window.jQuery));
