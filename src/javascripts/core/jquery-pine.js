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
