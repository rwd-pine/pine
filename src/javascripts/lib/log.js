//
// LOGGER
// Very simple javascript logging plugin
// ------------------------------------

(function($) {
  $.log = function(message) {
    if (window.log && window.console && window.console.log)
      console.log(message)
  }
}(window.jQuery || window.Zepto));