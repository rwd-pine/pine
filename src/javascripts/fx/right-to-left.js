//
// MOBILE TRANSITION: RIGHT TO LEFT
// -------------------------
Nav.registerTransition('nav-behave-right-to-left', {

  onSwitch: function(condition){
    var $element = this.element
    var $submenu = $element.find('li').has('ul')

    var resizeSubmenu = function (){
      $('.nav-behave-right-to-left ul').css('width', $(window).width())
    }

    if(condition) {
      // Enter mobile view
      $submenu.each(function(){
        $(this).find('> ul')
          .prepend($('<li class="back"><a href="#">' + $(this).find('> a').text() + '</a></li>'))
      })

      $(document).on('click.submenu', '.back', this, this.Submenu.toggle)

      $element.find('ul').css('width', $(window).width())
      $(window).on('resize', resizeSubmenu)
    }
    else {
      // Leave mobile view
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


