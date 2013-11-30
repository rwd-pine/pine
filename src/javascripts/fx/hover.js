//
// DESKTOP TRANSITION: HOVER
// -------------------------
var pine_fx_hover = {
  onSwitch: function(switchCondition){
    if (switchCondition) {
      // Add 'mouse' listeners and disable 'click.submenu'
      $(document)
        .on('mouseenter.pine.submenu, mouseleave.pine.submenu', this.SUBMENU, this, Pine.Submenu.hover)
        .on('mouseenter.pine.submenu, mouseleave.pine.submenu', this.SUBMENU + ' > a', this, Pine.Submenu.toggle)
        .off('click.pine.submenu')
    }
    else {
      // Add 'click.submenu' listeners and disable 'mouse'"
      $(document)
        .off('mouseenter.pine.submenu, mouseleave.pine.submenu')
        .on('click.pine.submenu', this.SUBMENU + ' > a', this, Pine.Submenu.toggle)

    }
  },
  onToggle: function(isActive){}
};

Pine.Navbar.registerTransition('fx-hover', pine_fx_hover);

