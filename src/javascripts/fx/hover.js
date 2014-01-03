//
// DESKTOP TRANSITION: HOVER
// -------------------------
var pine_fx_hover = {
  onSwitch: function(switchCondition){
    if (switchCondition) {
      // Add 'mouse' listeners and disable 'click.submenu'
      $(document)
        .on({'mouseenter': $.proxy(Pine.Submenu.toggle, this), 'mouseleave': $.proxy(Pine.Submenu.toggle, this)}, this.SUBMENU)
        .off('click')
        // .off('click.pine.submenu')
    }
    else {
      // Add 'click.submenu' listeners and disable 'mouse'"
      $(document)
        .off('mouseenter')
        .off('mouseleave')
        .on('click', this.SUBMENU + ' > a', $.proxy(Pine.Submenu.toggle, this))
    }
  },
  onToggle: function(isActive){}
};

Pine.Navbar.registerTransition('fx-hover', pine_fx_hover);

