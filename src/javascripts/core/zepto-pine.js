// NAVBAR PLUGIN DEFINITION
// --------------------------

(function ($, Pine, undefined) { "use strict";

  $.fn.pine = function (option) {
    $.each(this, function(index, item){
      var $this   = $(this)
      var options = $.extend({}, typeof option == 'object' && option)

      Pine.Navbar.init(this, options)
    })
  }

  // APPLY TO STANDARD PINE ELEMENTS
  // ===================================
  $('[data-pine=navbar]').pine()

}(Zepto, Pine));
