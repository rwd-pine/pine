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

+function ($) { "use strict";

  // SUBMENU CLASS DEFINITION
  // ------------------------
  var Submenu = function () {}

  // SUBMENU METHODS
  // ------------------------
  Submenu.prototype.hover = function (e) {
    var $submenu = $(this).find('> ul')

    if (e.type == 'mouseenter') {
      $submenu.addClass('is-hover')
    }
    else {
      $submenu.removeClass('is-hover')
      $(this).removeClass('is-open')
    }

    // $('> a', this).trigger($.Event('toggle.submenu'))
  }


  Submenu.prototype.toggle = function (e) {
    // console.log("Toggle submenu: " + e.type)
    var $this = $(this)
    var $parent  = $this.parent().closest('li')
    var isActive  = $parent.hasClass('is-open')
    var originalEvent = e
    var currentEffect = e.data.currentEffect.onToggle
// debugger
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
  }

    // Submenu.prototype.keydown = function (e) {
  //   // Handle only arrow keys, esc and tab
  //   if (!/(38|40|27|9)/.test(e.keyCode)) return

  //   var $this = $(this)
  //   // e.preventDefault()
  //   e.stopPropagation()

  //   // if ($this.is('.disabled, :disabled')) return

  //   var $parent  = $this.parent()
  //   var isActive = $parent.hasClass('is-open')

  //   // if (!isActive || (isActive && e.keyCode == 27)) {
  //   //   if (e.which == 27) $parent.find(toggle).focus()
  //   //   return $this.click()
  //   // }

  //   var $items = $('[role=navigation] li:visible a', $parent)

  //   if (!$items.length) return

  //   var index = $items.index($items.filter(':focus'))

  //   if (e.keyCode == 38 && index > 0)                 index--                        // up
  //   if ((e.keyCode == 40 || e.keyCode == 9) && index < $items.length - 1) index++                        // down
  //   if (!~index)                                      index=0

  //   $items.eq(index).focus()
  // }


  // TODO: handle keyboard better
  // ---------------------
  // .on('keydown.submenu', toggle, Submenu.prototype.keydown)


  $.fn.submenu = Submenu

}(jQuery);

//
// Navbar: Navigation behavior
// --------------------------------

(function ($, window) { "use strict";

  //
  // NAVBAR MODULE DEFINITION
  // ------------------------

  var Navbar = (function() {

    var version = '0.1.0',
    isDesktop = null,

    Navbar = {};

    Navbar.element = null;
    Navbar.options = null;

    Navbar.currentEffect = null;

    Navbar.effects = {};

    Navbar.submenu = $.fn.submenu;

    Navbar.defaults = {
      jsBreakpoint:     '600px',
      toggle:           '.has-submenu > a',
      submenu:          '.has-submenu',
      behaviorNoTouch:  'hover',
      effectDesktop:    'hover',
      effectTouch:      'nav-behave-right-to-left'
    };


    Navbar.init = function(element, options) {
      this.options = $.extend({}, this.defaults, options);
      this.element = $(element);
      isDesktop = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches;

      this.options.currentEffect = isDesktop ? this.effects[this.options.effectDesktop] : this.effects[this.options.effectTouch]

      // init submenus
      this.element.find('li').has('ul').addClass('has-submenu')
      this.element.find('a').on('focus.navbar', this.focus)

      // setup API
      $(window).on('load resize', $.proxy(this.api, this))
    };

    Navbar.checkMedia = function (e) {
      var mobileCond = window.matchMedia('(min-width: ' + this.options.jsBreakpoint + ')').matches
      var isLoad = e.type && (e.type == 'load')

      // Load or Using XOR to handle the switch, it fires only when it is needed
      if (isLoad || (( isDesktop || mobileCond ) && !( isDesktop && mobileCond ))) {
        return isDesktop = mobileCond // current view
      }

      return null
    };

    Navbar.api = function (e) {
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
          .on('mouseenter.submenu, mouseleave.submenu', this.options.submenu, this.options, this.submenu.prototype.hover)
          .on('mouseenter.submenu, mouseleave.submenu', this.options.toggle, this.options, this.submenu.prototype.toggle)
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
          .on('click.submenu', this.options.toggle, this.options, this.submenu.prototype.toggle)
      }

      if(typeof this.options.currentEffect.onSwitch === 'function')
        this.options.currentEffect.onSwitch.call(this, true)
      // this.switchDOM()


    };

    Navbar.focus = function (e) {
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

    Navbar.registerEffect = function (name, obj) {
      this.effects[name] = obj // save add-on
    };

    return Navbar;

  })();


  // ADD-ON definition
  Navbar.registerEffect('nav-behave-right-to-left', {

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

        $(document).on('click.submenu', '.back', this.options, this.submenu.prototype.toggle)

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
  Navbar.registerEffect('hover', {
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

  // NAVBAR PLUGIN DEFINITION
  // --------------------------

  var old = $.fn.navbar

  $.fn.navbar = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('navbar')
      var options = $.extend({}, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('navbar', (data = Navbar.init(this, options)))
      // if (typeof option == 'string') data[option]()
    })
  }

  $.fn.navbar.Constructor = Navbar

  // NAVBAR NO CONFLICT
  // --------------------

  $.fn.navbar.noConflict = function () {
    $.fn.navbar = old
    return this
  }






  // NAVBAR DEFAULT INITIALIZATION
  // --------------------
  $('[role=navigation]').navbar()

})(jQuery, window);

(function($){

  // TODO: Our magnificent code

})(jQuery);