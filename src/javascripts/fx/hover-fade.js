//
// DESKTOP TRANSITION: HOVER FADE
// -------------------------
Pine.registerTransition('fx-hover-fade', {

  onSwitch: function(switchCondition){
    if (switchCondition) {
      // Add 'mouse' listeners and disable 'click.submenu'
      $(document)
        .on('mouseenter.pine.submenu, mouseleave.pine.submenu', this.options.submenu, this, this.Submenu.hover)
        .on('mouseenter.pine.submenu, mouseleave.pine.submenu', this.options.toggle, this, this.Submenu.toggle)
        .off('click.pine.submenu')
    }
    else {
      // Add 'click.submenu' listeners and disable 'mouse'"
      $(document)
        .off('mouseenter.pine.submenu, mouseleave.pine.submenu')
        .on('click.pine.submenu', this.options.toggle, this, this.Submenu.toggle)

    }
  },

  onToggle: function(isActive){}
});