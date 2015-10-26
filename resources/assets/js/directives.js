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
          if (w > h && (w < 200 || (h * ratio) < 200)) {
            viewValue.type = 'hidden';
          } else if (h > w && (h < 200 || (w * ratio) < 200)) {
            viewValue.type = 'hidden';
          } else if (w === h && w < 200) {
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

app.directive('scrollOver', function($window, $document) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var bottomLimit, boxesLimit, handler, lastCurrPosition, lastPosition, menuLimit, windowElement;
      windowElement = angular.element($window);
      lastPosition = null;
      lastCurrPosition = null;
      menuLimit = 50;
      boxesLimit = 300;
      bottomLimit = 50;
      handler = function() {
        var currPosition, limit, position;
        position = windowElement.scrollTop();
        if (position >= menuLimit && lastPosition < menuLimit) {
          scope.$broadcast('reachedMenuLimit', {
            type: "over",
            position: position
          });
        } else if (position < menuLimit && lastPosition >= menuLimit) {
          scope.$broadcast('reachedMenuLimit', {
            type: "under",
            position: position
          });
        }
        if (position >= boxesLimit && lastPosition < boxesLimit) {
          scope.$broadcast('reachedBoxesLimit', {
            type: "over",
            position: position
          });
        } else if (position < boxesLimit && lastPosition >= boxesLimit) {
          scope.$broadcast('reachedBoxesLimit', {
            type: "under",
            position: position
          });
        }
        lastPosition = position;
        currPosition = position + windowElement.height();
        limit = $document.height() - bottomLimit;
        if (currPosition > limit && lastCurrPosition <= limit) {
          scope.$broadcast("scrolledToBottom", {});
        }
        return lastCurrPosition = currPosition;
      };
      windowElement.on('scroll', scope.$apply.bind(scope, handler));
      return handler();
    }
  };
});

app.directive('fileField', function() {
  return {
    scope: true,
    link: function(scope, element, attrs) {
      return element.bind('change', function(event) {
        var files;
        files = event.target.files;
        if (files.length) {
          return scope.$emit("fileSelected", {
            files: files
          });
        }
      });
    }
  };
});

app.directive('drag', function() {
  return {
    scope: {
      topScope: "="
    },
    require: 'ngModel',
    link: function(scope, element, attrs, model) {
      element.attr('draggable', true);
      element.bind('dragstart', function(event) {
        event.originalEvent.dataTransfer.effectAllowed = "link";
        return scope.topScope.dragModel = model;
      });
      return element.bind('dragend', function() {
        if (!scope.topScope.droping) {
          return scope.topScope.dragModel = null;
        }
      });
    }
  };
});

app.directive('drop', function() {
  return {
    scope: {
      topScope: "="
    },
    require: 'ngModel',
    link: function(scope, element, attrs, model) {
      element.attr('draggable', true);
      element.bind('dragover', function(event) {
        return event.preventDefault();
      });
      element.bind('dragenter', function(event) {
        event.preventDefault();
        event.originalEvent.dataTransfer.dropEffect = "link";
        return scope.topScope.dropModel = model;
      });
      element.bind('dragleave', function() {
        return scope.topScope.dropModel = null;
      });
      return element.bind('drop', function() {
        scope.topScope.droping = true;
        scope.topScope.drop(scope.topScope.dragModel.$viewValue, scope.topScope.dropModel.$viewValue);
        scope.topScope.dragModel = null;
        scope.topScope.dropModel = null;
        return scope.topScope.droping = false;
      });
    }
  };
});
