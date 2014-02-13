//
// DESKTOP TRANSITION: HOVER
// -------------------------
var pine_fx_hover = {
  onSwitch: function(switchCondition){
    if (switchCondition) {
      // Add 'mouse' listeners and disable 'click.submenu'
      $(document)
        .on({'mouseenter.pine': $.proxy(Pine.Submenu.toggle, this), 'mouseleave.pine': $.proxy(Pine.Submenu.toggle, this)}, this.SUBMENU)
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
  onToggle: function(isActive){}
};

Pine.Navbar.registerTransition('fx-hover', pine_fx_hover);

