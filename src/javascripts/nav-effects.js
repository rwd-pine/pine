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