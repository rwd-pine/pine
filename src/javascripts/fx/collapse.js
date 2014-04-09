//
// MOBILE TRANSITION: COLLAPSE
// -------------------------
Pine.Navbar.registerTransition('fx-collapse', {

  // Method: onSwitch is executed when change of view on navbar occurs
  // -------------
  onSwitch: function(condition){
    var $this = $(this),
        viewportHeight = $(window).height();;
    debugger
    $this.css({ 'max-height' : viewportHeight })
  },

  // Method: beforeToggle handles effects and any manipulation before 'toogle'
  // -------------
  beforeToggle: function(isActive){
    var $this = $(this),
        $submenu = $this.siblings('ul'),
        submenuHeight = '0px';

    if(!isActive) {
      // If it is not active, calculate the right height
      $submenuItems = $submenu.find('> li')
      submenuHeight = $submenuItems.length * $submenuItems.first().height()
    }
    else {
      // If it is active, set max-height to actual height
      $submenu.css({ 'max-height' : $submenu.height() })
    }

    $submenu.animate({
      'max-height': submenuHeight
    }, 300, 'linear', function(){
      $submenu.css({ 'max-height' : submenuHeight * 100})
    }) //'ease-in-out' can be added later (needs to be compatible with jQuery)

  }

});


