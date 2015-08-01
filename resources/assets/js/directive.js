app.directive('imgCrop', [
  '$timeout', 'cropHost', 'cropPubSub', function($timeout, CropHost, CropPubSub) {
    return {
      restrict: 'A',
      scope: {
        image: '=',
        resultImage: '=',
        changeOnFly: '=',
        areaType: '@',
        areaMinSize: '=',
        resultImageSize: '=',
        resultImageFormat: '@',
        resultImageQuality: '=',
        onChange: '&',
        onLoadBegin: '&',
        onLoadDone: '&',
        onLoadError: '&'
      },
      template: '<canvas></canvas>',
      controller: [
        '$scope', function($scope) {
          $scope.events = new CropPubSub;
        }
      ],
      link: function(scope, element) {
        var cropHost, events, fnSafeApply, storedResultImage, updateResultImage;
        events = scope.events;
        cropHost = new CropHost(element.find('canvas'), {}, events);
        storedResultImage = void 0;
        updateResultImage = function(scope) {
          var resultImage;
          resultImage = cropHost.getResultImageDataURI();
          if (storedResultImage !== resultImage) {
            storedResultImage = resultImage;
            if (angular.isDefined(scope.resultImage)) {
              scope.resultImage = resultImage;
            }
            return scope.onChange({
              $dataURI: scope.resultImage
            });
          }
        };
        fnSafeApply = function(fn) {
          return function() {
            return $timeout(function() {
              return scope.$apply(function(scope) {
                return fn(scope);
              });
            });
          };
        };
        events.on('load-start', fnSafeApply(function(scope) {
          scope.onLoadBegin({});
        })).on('load-done', fnSafeApply(function(scope) {
          scope.onLoadDone({});
        })).on('load-error', fnSafeApply(function(scope) {
          scope.onLoadError({});
        })).on('area-move area-resize', fnSafeApply(function(scope) {
          if (!!scope.changeOnFly) {
            updateResultImage(scope);
          }
        })).on('area-move-end area-resize-end image-updated', fnSafeApply(function(scope) {
          updateResultImage(scope);
        }));
        scope.$watch('image', function() {
          console.log(scope.image);
          cropHost.setNewImageSource(scope.image);
        });
        scope.$watch('areaType', function() {
          cropHost.setAreaType(scope.areaType);
          updateResultImage(scope);
        });
        scope.$watch('areaMinSize', function() {
          cropHost.setAreaMinSize(scope.areaMinSize);
          updateResultImage(scope);
        });
        scope.$watch('resultImageSize', function() {
          cropHost.setResultImageSize(scope.resultImageSize);
          updateResultImage(scope);
        });
        scope.$watch('resultImageFormat', function() {
          cropHost.setResultImageFormat(scope.resultImageFormat);
          updateResultImage(scope);
        });
        scope.$watch('resultImageQuality', function() {
          cropHost.setResultImageQuality(scope.resultImageQuality);
          updateResultImage(scope);
        });
        scope.$watch((function() {
          return [element[0].clientWidth, element[0].clientHeight];
        }), (function(value) {
          cropHost.setMaxDimensions(value[0], value[1]);
          updateResultImage(scope);
        }), true);
        scope.$on('$destroy', function() {
          cropHost.destroy();
        });
      }
    };
  }
]);
