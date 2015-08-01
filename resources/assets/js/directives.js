app.directive('productImageOption', function() {
  return {
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope, elem, attr, model) {
      var loadSize;
      loadSize = function() {
        var h, ratio, viewValue, w, width;
        w = elem.width();
        h = elem.height();
        viewValue = model.$viewValue;
        viewValue.width = w;
        viewValue.height = h;
        if (h < w) {
          viewValue.type = 'landscape';
        } else if (w < h) {
          viewValue.type = 'portrait';
        } else {
          viewValue.type = 'square';
        }
        ratio = h / 286;
        width = w * ratio;
        viewValue["class"] = "product-image option";
        if (width < 286) {
          viewValue["class"] += ' ' + 'hidden';
        }
        return model.$setViewValue(viewValue);
      };
      if (elem.width()) {
        loadSize();
      } else {
        elem.on('load', loadSize);
      }
      return elem.bind('error', function() {
        var viewValue;
        viewValue = model.$viewValue;
        viewValue["class"] = "product-image hidden";
        return model.$setViewValue(viewValue);
      });
    }
  };
});

app.directive('scrollOver', function($window) {
  return {
    restrict: 'A',
    scope: {
      limit: '@',
      onChange: '&'
    },
    link: function(scope, element, attrs) {
      var handler, windowElement;
      scope.overScroll = false;
      windowElement = angular.element($window);
      handler = function() {
        var position;
        position = windowElement.scrollTop();
        if (scope.overScroll && position < scope.limit) {
          scope.overScroll = false;
          return scope.onChange();
        } else if (!scope.overScroll && position > scope.limit) {
          scope.overScroll = true;
          return scope.onChange();
        }
      };
      windowElement.on('scroll', scope.$apply.bind(scope, handler));
      return handler();
    }
  };
});
