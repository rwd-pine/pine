//
// JS or no JS, that is the question
// Adapted from Modernizr (http://modernizr.com/)
// -----------------------------------

(function(document, undefined){
  // Remove 'no-js' class and replace it with 'js'
  doc = document.documentElement;
  doc.className = doc.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') + ' js';

}(this.document));