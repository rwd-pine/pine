//
// Submenu: Navigation behavior
// --------------------------------


+function ($) { "use strict";

  // SUBMENU CLASS DEFINITION
  // ------------------------

  // var backdrop = '.submenu-backdrop'
  var submenuClass = 'has-submenu'
  var toggle       = '.has-submenu > a'

  var Submenu = function (element) {
    $(element).on('click.submenu', this.toggle)
  }

  // SUBMENU METHODS
  // ------------------------
  Submenu.prototype.toggle = function (e) {
    var $this = $(this)

    // if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('is-open')

    clearMenus()

    if (!isActive) {
      // if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
      //   // if mobile we we use a backdrop because click events don't delegate
      //   $('<div class="submenu-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      // }

      $parent.trigger(e = $.Event('show.submenu'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('is-open')
        .trigger('shown.submenu')

      $this.focus()
    }

    return false
  }

  Submenu.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('is-open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    // $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('is-open')) return

      $parent.trigger(e = $.Event('hide.submenu')) // prepare to hide the menu
      if (e.isDefaultPrevented()) return
      $parent.removeClass('is-open').trigger('hidden.submenu') // menu is now hidden
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // SUBMENU PLUGIN DEFINITION
  // --------------------------

  var old = $.fn.submenu

  $.fn.submenu = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('submenu')

      if (!data) $this.data('submenu', (data = new Submenu(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.submenu.Constructor = Submenu


  // SUMBENU NO CONFLICT
  // --------------------

  $.fn.submenu.noConflict = function () {
    $.fn.submenu = old
    return this
  }


  // INITIALIZE MENU ITEM
  // ----------------------
  $('.nav-horizontal li').has('ul').addClass(submenuClass)

  // APPLY TO STANDARD SUBMENU ELEMENTS
  // ------------------------------------

  $(document)
    .on('click.submenu', clearMenus) // clear menus before doing anything
    .on('click.submenu', toggle, Submenu.prototype.toggle) // toggle the menu
  //   .on('keydown.submenu', toggle + ', [role=menu]' , Submenu.prototype.keydown) // handle keyboard input


}(window.jQuery);
