//
// DESKTOP TRANSITION: HOVER
// -------------------------
var pine_fx_hover = {

  // Method: onSwitch is executed when change of view on navbar occurs
  // -------------
  onSwitch: function(switchCondition){
    if (switchCondition) {
      // Add 'mouse' listeners and disable 'click.submenu'
      $(document)
        .on('mouseenter.pine', this.SUBMENU, { isActive: false }, $.proxy(Pine.Submenu.toggle, this))
        .on('mouseleave.pine', this.SUBMENU, { isActive: true }, $.proxy(Pine.Submenu.toggle, this))
        .off('click.pine')
    }
    else {
      // Add 'click.submenu' listeners and disable 'mouse'"
      $(document)
        .off('mouseenter.pine')
        .off('mouseleave.pine')
        .on('click.pine', this.SUBMENU + ' > a', $.proxy(Pine.Submenu.toggle, this))
    }
  },

  // Method: beforeToggle handles effects and any manipulation before 'toogle'
  // -------------
  beforeToggle: function(isActive){}
};

Pine.Navbar.registerTransition('fx-hover', pine_fx_hover);

