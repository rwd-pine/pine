
var Pine = window.Pine || {}

Pine.Transitions = (function(){
  var Transitions = {};

  /**
    List of all available transitions. Transitions are loaded as plugins.
  **/
  Transitions.collection = {};

  /**
    Adds new transition to the collection.
  **/
  Transitions.registerTransition = function (name, obj) {
    this.collection[name] = obj
  };

  return Transitions;
});