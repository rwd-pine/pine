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
      transform: 'translate(' + (-100 * level) + '%)'
    }, 300) //'ease-out' TODO: add jQuery plugin for easing

  }
});


