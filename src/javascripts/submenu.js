//
// Submenu: Navigation behavior
// --------------------------------


+function ($) { "use strict";

  // SUBMENU CLASS DEFINITION
  // ------------------------

  // var backdrop = '.dropdown-backdrop'
  // var toggle   = '[data-toggle=dropdown]'

  var Submenu = function (element) {
    // var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  // SUBMENU METHODS
  // ------------------------
  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

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
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
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
  $('.nav-horizontal li').each(function(){
    if ($(this).has('ul')) $(this).addClass('has-submenu')
  })

  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ------------------------------------

  // $(document)
    // .on('click.submenu', clearMenus) // clear menus before doing anything
    // .on('click.submenu', toggle, Dropdown.prototype.toggle) // toggle the menu
  //   .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown) // handle keyboard input


}(window.jQuery);
