(function ($) { "use strict";

  var Nav = $.fn.nav.Module || {};

  // ADD-ON definition
  Nav.registerTransition('nav-behave-right-to-left', {

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

        $(document).on('click.submenu', '.back', this, this.Submenu.toggle)

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

    onToggle: function(isActive){
      var $this = $(this),
          $parentLists = $this.parents('ul'),
          level = isActive ? $parentLists.length - 2 : $parentLists.length;

      $parentLists.last().css('left', (-100 * level) + '%')
    }
  });

  // ADD-ON definition
  Nav.registerTransition('nav-hover', {
    onSwitch: function(switchCondition){
      if (switchCondition) {
        // Add 'mouse' listeners and disable 'click.submenu'
        $(document)
          .on('mouseenter.submenu, mouseleave.submenu', this.options.submenu, this, this.Submenu.hover)
          .on('mouseenter.submenu, mouseleave.submenu', this.options.toggle, this, this.Submenu.toggle)
          .off('click.submenu')
      }
      else {
        // Add 'click.submenu' listeners and disable 'mouse'"
        $(document)
          .off('mouseenter.submenu, mouseleave.submenu')
          .on('click.submenu', this.options.toggle, this, this.Submenu.toggle)

      }
    },

    onToggle: function(params){
      // delay when hiding
      // setTimeout(function(){ console.log("delayed") },1000)
    }
  });

})(jQuery);