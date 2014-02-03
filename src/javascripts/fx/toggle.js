//
// MOBILE TRANSITION: TOGGLE
// -------------------------
Pine.Navbar.registerTransition('fx-toggle', {

  // Method: onSwitch is executed when change of view on navbar occurs
  // -------------
  onSwitch: function(condition){
  },

  // Method: beforeToggle handles effects and any manipulation before 'toogle'
  // -------------
  beforeToggle: function(isActive){
    var $this = $(this),
        $submenu = $this.siblings('ul'),
        submenuHeight = '0px';

    if(!isActive) {
      var el = $submenu.clone().css({"max-height":"none"}).appendTo("body")
      submenuHeight = el.css("height")
      el.remove()
    }

    console.log(submenuHeight)
    $submenu.animate({
      'max-height': submenuHeight
    }, 300) //'ease-in-out' can be added later (needs to be compatible with jQuery)

  }

});


