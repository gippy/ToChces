app.factory('cropPubSub', [
  function() {
    return function() {
      var events;
      events = {};
      this.on = function(names, handler) {
        names.split(' ').forEach(function(name) {
          if (!events[name]) {
            events[name] = [];
          }
          events[name].push(handler);
        });
        return this;
      };
      this.trigger = function(name, args) {
        angular.forEach(events[name], function(handler) {
          handler.call(null, args);
        });
        return this;
      };
    };
  }
]);
