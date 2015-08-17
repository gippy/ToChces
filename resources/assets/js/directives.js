app.directive('productImageOption', function() {
  return {
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope, elem, attr, model) {
      var loadSize;
      loadSize = function() {
        var h, img, ratio, viewValue, w;
        img = new Image();
        img.src = model.$viewValue.src;
        w = img.width;
        h = img.height;
        viewValue = model.$viewValue;
        viewValue.width = w;
        viewValue.height = h;
        ratio = viewValue.ratio = w > h ? w / h : h / w;
        if (h < w && ratio > 1.5 && w >= 584 && h >= 286) {
          viewValue.type = 'landscape';
        } else if (w < h && ratio > 1.5 && w >= 286 && h >= 584) {
          viewValue.type = 'portrait';
        } else {
          if (w > h && (w < 286 || (h * ratio) < 286)) {
            viewValue.type = 'hidden';
          } else if (h > w && (h < 286 || (w * ratio))) {
            viewValue.type = 'hidden';
          } else if (w === h && w < 286) {
            viewValue.type = 'hidden';
          } else {
            viewValue.type = 'square';
          }
        }
        viewValue["class"] = "product-image option " + viewValue.type;
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
