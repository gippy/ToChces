var app;

app = angular.module('ToChcete', ['ngTagsInput']);

app.factory('cropArea', [
  'cropCanvas', function(CropCanvas) {
    var CropArea;
    CropArea = function(ctx, events) {
      this._ctx = ctx;
      this._events = events;
      this._minSize = 80;
      this._cropCanvas = new CropCanvas(ctx);
      this._image = new Image;
      this._x = 0;
      this._y = 0;
      this._size = 200;
    };

    /* GETTERS/SETTERS */
    CropArea.prototype.getImage = function() {
      return this._image;
    };
    CropArea.prototype.setImage = function(image) {
      this._image = image;
    };
    CropArea.prototype.getX = function() {
      return this._x;
    };
    CropArea.prototype.setX = function(x) {
      this._x = x;
      this._dontDragOutside();
    };
    CropArea.prototype.getY = function() {
      return this._y;
    };
    CropArea.prototype.setY = function(y) {
      this._y = y;
      this._dontDragOutside();
    };
    CropArea.prototype.getSize = function() {
      return this._size;
    };
    CropArea.prototype.setSize = function(size) {
      this._size = Math.max(this._minSize, size);
      this._dontDragOutside();
    };
    CropArea.prototype.getMinSize = function() {
      return this._minSize;
    };
    CropArea.prototype.setMinSize = function(size) {
      this._minSize = size;
      this._size = Math.max(this._minSize, this._size);
      this._dontDragOutside();
    };

    /* FUNCTIONS */
    CropArea.prototype._dontDragOutside = function() {
      var h, w;
      h = this._ctx.canvas.height;
      w = this._ctx.canvas.width;
      if (this._size > w) {
        this._size = w;
      }
      if (this._size > h) {
        this._size = h;
      }
      if (this._x < this._size / 2) {
        this._x = this._size / 2;
      }
      if (this._x > w - (this._size / 2)) {
        this._x = w - (this._size / 2);
      }
      if (this._y < this._size / 2) {
        this._y = this._size / 2;
      }
      if (this._y > h - (this._size / 2)) {
        this._y = h - (this._size / 2);
      }
    };
    CropArea.prototype._drawArea = function() {};
    CropArea.prototype.draw = function() {
      this._cropCanvas.drawCropArea(this._image, [this._x, this._y], this._size, this._drawArea, this._drawImage);
    };
    CropArea.prototype.drawResultImage = function() {};
    CropArea.prototype.processMouseMove = function() {};
    CropArea.prototype.processMouseDown = function() {};
    CropArea.prototype.processMouseUp = function() {};
    return CropArea;
  }
]);

app.factory('cropCanvas', [
  function() {
    var colors, shapeArrowE, shapeArrowN, shapeArrowNE, shapeArrowNW, shapeArrowS, shapeArrowSE, shapeArrowSW, shapeArrowW;
    shapeArrowNW = [[-0.5, -2], [-3, -4.5], [-0.5, -7], [-7, -7], [-7, -0.5], [-4.5, -3], [-2, -0.5]];
    shapeArrowNE = [[0.5, -2], [3, -4.5], [0.5, -7], [7, -7], [7, -0.5], [4.5, -3], [2, -0.5]];
    shapeArrowSW = [[-0.5, 2], [-3, 4.5], [-0.5, 7], [-7, 7], [-7, 0.5], [-4.5, 3], [-2, 0.5]];
    shapeArrowSE = [[0.5, 2], [3, 4.5], [0.5, 7], [7, 7], [7, 0.5], [4.5, 3], [2, 0.5]];
    shapeArrowN = [[-1.5, -2.5], [-1.5, -6], [-5, -6], [0, -11], [5, -6], [1.5, -6], [1.5, -2.5]];
    shapeArrowW = [[-2.5, -1.5], [-6, -1.5], [-6, -5], [-11, 0], [-6, 5], [-6, 1.5], [-2.5, 1.5]];
    shapeArrowS = [[-1.5, 2.5], [-1.5, 6], [-5, 6], [0, 11], [5, 6], [1.5, 6], [1.5, 2.5]];
    shapeArrowE = [[2.5, -1.5], [6, -1.5], [6, -5], [11, 0], [6, 5], [6, 1.5], [2.5, 1.5]];
    colors = {
      areaOutline: '#fff',
      resizeBoxStroke: '#fff',
      resizeBoxFill: '#444',
      resizeBoxArrowFill: '#fff',
      resizeCircleStroke: '#fff',
      resizeCircleFill: '#444',
      moveIconFill: '#fff'
    };
    return function(ctx) {

      /* Base functions */
      var calcPoint, drawFilledPolygon;
      calcPoint = function(point, offset, scale) {
        return [scale * point[0] + offset[0], scale * point[1] + offset[1]];
      };
      drawFilledPolygon = function(shape, fillStyle, centerCoords, scale) {
        var p, pc, pc0;
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        pc = void 0;
        pc0 = calcPoint(shape[0], centerCoords, scale);
        ctx.moveTo(pc0[0], pc0[1]);
        for (p in shape) {
          if (p > 0) {
            pc = calcPoint(shape[p], centerCoords, scale);
            ctx.lineTo(pc[0], pc[1]);
          }
        }
        ctx.lineTo(pc0[0], pc0[1]);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      };

      /* Icons */
      this.drawIconMove = function(centerCoords, scale) {
        drawFilledPolygon(shapeArrowN, colors.moveIconFill, centerCoords, scale);
        drawFilledPolygon(shapeArrowW, colors.moveIconFill, centerCoords, scale);
        drawFilledPolygon(shapeArrowS, colors.moveIconFill, centerCoords, scale);
        drawFilledPolygon(shapeArrowE, colors.moveIconFill, centerCoords, scale);
      };
      this.drawIconResizeCircle = function(centerCoords, circleRadius, scale) {
        var scaledCircleRadius;
        scaledCircleRadius = circleRadius * scale;
        ctx.save();
        ctx.strokeStyle = colors.resizeCircleStroke;
        ctx.lineWidth = 2;
        ctx.fillStyle = colors.resizeCircleFill;
        ctx.beginPath();
        ctx.arc(centerCoords[0], centerCoords[1], scaledCircleRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      };
      this.drawIconResizeBoxBase = function(centerCoords, boxSize, scale) {
        var scaledBoxSize;
        scaledBoxSize = boxSize * scale;
        ctx.save();
        ctx.strokeStyle = colors.resizeBoxStroke;
        ctx.lineWidth = 2;
        ctx.fillStyle = colors.resizeBoxFill;
        ctx.fillRect(centerCoords[0] - (scaledBoxSize / 2), centerCoords[1] - (scaledBoxSize / 2), scaledBoxSize, scaledBoxSize);
        ctx.strokeRect(centerCoords[0] - (scaledBoxSize / 2), centerCoords[1] - (scaledBoxSize / 2), scaledBoxSize, scaledBoxSize);
        ctx.restore();
      };
      this.drawIconResizeBoxNESW = function(centerCoords, boxSize, scale) {
        this.drawIconResizeBoxBase(centerCoords, boxSize, scale);
        drawFilledPolygon(shapeArrowNE, colors.resizeBoxArrowFill, centerCoords, scale);
        drawFilledPolygon(shapeArrowSW, colors.resizeBoxArrowFill, centerCoords, scale);
      };
      this.drawIconResizeBoxNWSE = function(centerCoords, boxSize, scale) {
        this.drawIconResizeBoxBase(centerCoords, boxSize, scale);
        drawFilledPolygon(shapeArrowNW, colors.resizeBoxArrowFill, centerCoords, scale);
        drawFilledPolygon(shapeArrowSE, colors.resizeBoxArrowFill, centerCoords, scale);
      };

      /* Crop Area */
      this.drawCropArea = function(image, centerCoords, size, fnDrawClipPath, fnDrawImage) {
        ctx.save();
        ctx.strokeStyle = colors.areaOutline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        fnDrawClipPath(ctx, centerCoords, size);
        ctx.stroke();
        ctx.clip();
        if (size > 0) {
          fnDrawImage(ctx, image, centerCoords, size);
        }
        ctx.beginPath();
        fnDrawClipPath(ctx, centerCoords, size);
        ctx.stroke();
        ctx.clip();
        ctx.restore();
      };
    };
  }
]);

app.controller('BodyController', [
  '$scope', '$http', function($scope, $http) {
    $scope.navigationController = null;
    $scope.pageController = null;
    $scope.modalController = null;
    $scope.categories = [];
    $scope.isModalVisible = function() {
      return $scope.modalController && $scope.modalController.isVisible();
    };
    $scope.showModal = function(type) {
      if ($scope.modalController) {
        return $scope.modalController.open(type);
      }
    };
    $scope.hasActiveCategory = function() {
      var category, i, len, ref;
      if (!$scope.categories.length) {
        return false;
      }
      ref = $scope.categories;
      for (i = 0, len = ref.length; i < len; i++) {
        category = ref[i];
        if (category.is_active) {
          return true;
        }
      }
      return false;
    };
    $scope.deselectCategories = function() {
      var category, i, len, ref, results;
      if ($scope.hasActiveCategory) {
        ref = $scope.categories;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          category = ref[i];
          results.push(category.is_active = false);
        }
        return results;
      }
    };
    $scope.saveCategories = function() {
      var categories, category, i, len, ref;
      categories = [];
      ref = $scope.categories;
      for (i = 0, len = ref.length; i < len; i++) {
        category = ref[i];
        if (category.is_active) {
          categories.push(category.id);
        }
      }
      return window.location = '/categories/save?ids=' + categories.join(',');
    };
    return $http.get('/categories').success(function(categories) {
      return $scope.categories = categories;
    });
  }
]);

app.controller('NavigationController', [
  '$scope', function($scope) {
    $scope.showCategories = function() {
      return $scope.$parent.showModal('categories');
    };
    $scope.showSignIn = function() {
      return $scope.$parent.showModal('login');
    };
    $scope.showRegister = function() {
      return $scope.$parent.showModal('register');
    };
    $scope.showProfile = function() {
      return $scope.$parent.showModal('profile');
    };
    $scope.scrollClass = '';
    $scope.scrollChanged = function() {
      return $scope.scrollClass = $scope.scrollClass ? '' : 'scrolling';
    };
    return $scope.$parent.navigationController = $scope;
  }
]);

app.controller('PageController', [
  '$scope', '$http', function($scope, $http) {
    return $scope.$parent.pageController = $scope;
  }
]);

app.controller('ModalController', [
  '$scope', '$http', '$sce', function($scope, $http, $sce) {
    var getModal;
    $scope.visible = false;
    $scope.content = '';
    $scope.type = '';
    $scope.url = '';
    $scope.login = {
      email: '',
      password: '',
      submit: function() {
        if (!$scope.login.password.$invalid && !$scope.login.email.$invalid) {
          return $http.post('/auth/login', {
            email: $scope.login.email,
            password: $scope.login.password
          }).success(function(data) {
            return alert(data.success);
          }).error(function(data) {
            var error;
            error = data && data.error ? data.error : 'Přihlášení se nepodařilo, zkuste to prosím znovu';
            return alert(error);
          });
        }
      }
    };
    $scope.register = {
      email: '',
      name: '',
      password: '',
      confirmation: '',
      submit: function() {
        var emailValid, nameValid, passwordValid;
        emailValid = !$scope.register.email.$invalid;
        nameValid = !$scope.register.name.$invalid;
        passwordValid = !$scope.register.password.$invalid && $scope.register.password === $scope.register.confirmation;
        if (emailValid && nameValid && passwordValid) {
          return $http.post('/auth/register', {
            name: $scope.register.name,
            email: $scope.register.email,
            password: $scope.register.password,
            confirmation: $scope.register.confirmation
          }).success(function(data) {
            return alert(data.success);
          }).error(function(data) {
            return alert(data.error);
          });
        }
      }
    };
    getModal = function(type, cb) {
      $scope.url = '/modal/' + type;
      return cb();
    };
    $scope.isVisible = function() {
      return $scope.visible;
    };
    $scope.close = function() {
      return $scope.visible = false;
    };
    $scope.open = function(type) {
      if ($scope.visible) {
        $scope.close();
      }
      return getModal(type, function() {
        $scope.type = type;
        return $scope.visible = true;
      });
    };
    return $scope.$parent.modalController = $scope;
  }
]);

app.controller('AddProductController', [
  '$scope', '$http', '$sce', function($scope, $http, $sce) {
    $scope.url = '';
    $scope.product = {
      name: '',
      images: '',
      tags: [],
      categories: [],
      finalSrc: ''
    };
    $scope.croppFinished = false;
    $scope.finishCropping = function() {
      $scope.croppFinished = true;
      return $scope.product.finalSrc = $scope.product.croppedImage;
    };
    $scope.sizeAndType = function(image) {
      var modifier, ratio;
      if (image.type === 'hidden') {
        return 1000;
      }
      modifier = image.contentType === "image/png" ? 100 : 1;
      ratio = image.ratio ? image.ratio : 1;
      return ratio * modifier;
    };
    $scope.getImage = function(image) {
      $scope.product.selectedImage = image;
      $scope.product.croppedImage = '';
      return $http.get('/products/getImage?url=' + encodeURIComponent(image.src)).success(function(data) {
        return $scope.product.selectedImage.ourSrc = data.src;
      });
    };
    $scope.getProduct = function() {
      return $http.get('/products/getInfo?url=' + encodeURIComponent($scope.url)).success(function(data) {
        $scope.product = {
          name: data.title,
          images: data.images
        };
        $scope.product.tags = [];
        return $scope.product.categories = [];
      });
    };
    return $scope.submit = function() {
      var categories, category, i, j, k, len, len1, len2, product, ref, ref1, ref2, tag, value;
      product = {
        name: $scope.product.name,
        vendor: $scope.product.vendor,
        price: $scope.product.price,
        url: $scope.url,
        image: $scope.product.finalSrc,
        layout: $scope.product.selectedImage.type,
        tags: []
      };
      categories = {};
      ref = $scope.$parent.categories;
      for (i = 0, len = ref.length; i < len; i++) {
        category = ref[i];
        categories[category.id] = category;
      }
      ref1 = $scope.product.categories;
      for (category = j = 0, len1 = ref1.length; j < len1; category = ++j) {
        value = ref1[category];
        if (value) {
          product.tags.push(categories[category].name);
        }
      }
      ref2 = $scope.product.tags;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        tag = ref2[k];
        product.tags.push(tag.text);
      }
      return $http.post('/add', product).success(function(data) {
        return window.location = data.path;
      });
    };
  }
]);

app.controller('ProductsController', [
  '$scope', '$http', '$sce', function($scope, $http) {
    var dataUrl, page;
    $scope.products = [];
    page = 0;
    dataUrl = '/products';
    $scope.getNextPage = function() {
      var query;
      query = window.location.search.substring(1);
      return $http.get(dataUrl + (page ? '?page=' + page : '?') + query).success(function(data) {
        return $scope.products = $scope.products.concat(data.products);
      });
    };
    $scope.init = function() {
      var isUser, path;
      path = window.location.pathname;
      isUser = path.indexOf('user') !== -1 || path.indexOf('profile') !== -1;
      if (isUser) {
        dataUrl = path + '/products';
      }
      return $scope.getNextPage();
    };
    $scope.getClasses = function(product) {
      var classes;
      classes = [];
      if (product.liked) {
        classes.push('liked');
      }
      if (product.owned) {
        classes.push('owned');
      }
      classes.push(product.layout);
      return classes.join(' ');
    };
    $scope.iWantThis = function(product, $event) {
      return $http.get('/product/' + product.id + '/like').success(function() {
        return product.liked = true;
      });
    };
    $scope.iDontWantThis = function(product, $event) {
      return $http.get('/product/' + product.id + '/dislike').success(function() {
        return product.liked = product.owned = true;
      });
    };
    $scope.iHaveThis = function(product, $event) {
      return $http.get('/product/' + product.id + '/own').success(function() {
        return product.owned = product.liked = true;
      });
    };
    $scope.iDontHaveThis = function(product, $event) {
      return $http.get('/product/' + product.id + '/disown').success(function() {
        return product.owned = false;
      });
    };
    return $scope.init();
  }
]);

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

app.service('cropEXIF', [
  function() {
    var ExifTags, GPSTags, IptcFieldMap, StringValues, TiffTags, addEvent, base64ToArrayBuffer, debug, findEXIFinJPEG, findIPTCinJPEG, getImageData, getStringFromDB, imageHasData, objectURLToBlob, readEXIFData, readIPTCData, readTagValue, readTags;
    debug = false;
    ExifTags = this.Tags = {
      0x9000: 'ExifVersion',
      0xA000: 'FlashpixVersion',
      0xA001: 'ColorSpace',
      0xA002: 'PixelXDimension',
      0xA003: 'PixelYDimension',
      0x9101: 'ComponentsConfiguration',
      0x9102: 'CompressedBitsPerPixel',
      0x927C: 'MakerNote',
      0x9286: 'UserComment',
      0xA004: 'RelatedSoundFile',
      0x9003: 'DateTimeOriginal',
      0x9004: 'DateTimeDigitized',
      0x9290: 'SubsecTime',
      0x9291: 'SubsecTimeOriginal',
      0x9292: 'SubsecTimeDigitized',
      0x829A: 'ExposureTime',
      0x829D: 'FNumber',
      0x8822: 'ExposureProgram',
      0x8824: 'SpectralSensitivity',
      0x8827: 'ISOSpeedRatings',
      0x8828: 'OECF',
      0x9201: 'ShutterSpeedValue',
      0x9202: 'ApertureValue',
      0x9203: 'BrightnessValue',
      0x9204: 'ExposureBias',
      0x9205: 'MaxApertureValue',
      0x9206: 'SubjectDistance',
      0x9207: 'MeteringMode',
      0x9208: 'LightSource',
      0x9209: 'Flash',
      0x9214: 'SubjectArea',
      0x920A: 'FocalLength',
      0xA20B: 'FlashEnergy',
      0xA20C: 'SpatialFrequencyResponse',
      0xA20E: 'FocalPlaneXResolution',
      0xA20F: 'FocalPlaneYResolution',
      0xA210: 'FocalPlaneResolutionUnit',
      0xA214: 'SubjectLocation',
      0xA215: 'ExposureIndex',
      0xA217: 'SensingMethod',
      0xA300: 'FileSource',
      0xA301: 'SceneType',
      0xA302: 'CFAPattern',
      0xA401: 'CustomRendered',
      0xA402: 'ExposureMode',
      0xA403: 'WhiteBalance',
      0xA404: 'DigitalZoomRation',
      0xA405: 'FocalLengthIn35mmFilm',
      0xA406: 'SceneCaptureType',
      0xA407: 'GainControl',
      0xA408: 'Contrast',
      0xA409: 'Saturation',
      0xA40A: 'Sharpness',
      0xA40B: 'DeviceSettingDescription',
      0xA40C: 'SubjectDistanceRange',
      0xA005: 'InteroperabilityIFDPointer',
      0xA420: 'ImageUniqueID'
    };
    TiffTags = this.TiffTags = {
      0x0100: 'ImageWidth',
      0x0101: 'ImageHeight',
      0x8769: 'ExifIFDPointer',
      0x8825: 'GPSInfoIFDPointer',
      0xA005: 'InteroperabilityIFDPointer',
      0x0102: 'BitsPerSample',
      0x0103: 'Compression',
      0x0106: 'PhotometricInterpretation',
      0x0112: 'Orientation',
      0x0115: 'SamplesPerPixel',
      0x011C: 'PlanarConfiguration',
      0x0212: 'YCbCrSubSampling',
      0x0213: 'YCbCrPositioning',
      0x011A: 'XResolution',
      0x011B: 'YResolution',
      0x0128: 'ResolutionUnit',
      0x0111: 'StripOffsets',
      0x0116: 'RowsPerStrip',
      0x0117: 'StripByteCounts',
      0x0201: 'JPEGInterchangeFormat',
      0x0202: 'JPEGInterchangeFormatLength',
      0x012D: 'TransferFunction',
      0x013E: 'WhitePoint',
      0x013F: 'PrimaryChromaticities',
      0x0211: 'YCbCrCoefficients',
      0x0214: 'ReferenceBlackWhite',
      0x0132: 'DateTime',
      0x010E: 'ImageDescription',
      0x010F: 'Make',
      0x0110: 'Model',
      0x0131: 'Software',
      0x013B: 'Artist',
      0x8298: 'Copyright'
    };
    GPSTags = this.GPSTags = {
      0x0000: 'GPSVersionID',
      0x0001: 'GPSLatitudeRef',
      0x0002: 'GPSLatitude',
      0x0003: 'GPSLongitudeRef',
      0x0004: 'GPSLongitude',
      0x0005: 'GPSAltitudeRef',
      0x0006: 'GPSAltitude',
      0x0007: 'GPSTimeStamp',
      0x0008: 'GPSSatellites',
      0x0009: 'GPSStatus',
      0x000A: 'GPSMeasureMode',
      0x000B: 'GPSDOP',
      0x000C: 'GPSSpeedRef',
      0x000D: 'GPSSpeed',
      0x000E: 'GPSTrackRef',
      0x000F: 'GPSTrack',
      0x0010: 'GPSImgDirectionRef',
      0x0011: 'GPSImgDirection',
      0x0012: 'GPSMapDatum',
      0x0013: 'GPSDestLatitudeRef',
      0x0014: 'GPSDestLatitude',
      0x0015: 'GPSDestLongitudeRef',
      0x0016: 'GPSDestLongitude',
      0x0017: 'GPSDestBearingRef',
      0x0018: 'GPSDestBearing',
      0x0019: 'GPSDestDistanceRef',
      0x001A: 'GPSDestDistance',
      0x001B: 'GPSProcessingMethod',
      0x001C: 'GPSAreaInformation',
      0x001D: 'GPSDateStamp',
      0x001E: 'GPSDifferential'
    };
    StringValues = this.StringValues = {
      ExposureProgram: {
        0: 'Not defined',
        1: 'Manual',
        2: 'Normal program',
        3: 'Aperture priority',
        4: 'Shutter priority',
        5: 'Creative program',
        6: 'Action program',
        7: 'Portrait mode',
        8: 'Landscape mode'
      },
      MeteringMode: {
        0: 'Unknown',
        1: 'Average',
        2: 'CenterWeightedAverage',
        3: 'Spot',
        4: 'MultiSpot',
        5: 'Pattern',
        6: 'Partial',
        255: 'Other'
      },
      LightSource: {
        0: 'Unknown',
        1: 'Daylight',
        2: 'Fluorescent',
        3: 'Tungsten (incandescent light)',
        4: 'Flash',
        9: 'Fine weather',
        10: 'Cloudy weather',
        11: 'Shade',
        12: 'Daylight fluorescent (D 5700 - 7100K)',
        13: 'Day white fluorescent (N 4600 - 5400K)',
        14: 'Cool white fluorescent (W 3900 - 4500K)',
        15: 'White fluorescent (WW 3200 - 3700K)',
        17: 'Standard light A',
        18: 'Standard light B',
        19: 'Standard light C',
        20: 'D55',
        21: 'D65',
        22: 'D75',
        23: 'D50',
        24: 'ISO studio tungsten',
        255: 'Other'
      },
      Flash: {
        0x0000: 'Flash did not fire',
        0x0001: 'Flash fired',
        0x0005: 'Strobe return light not detected',
        0x0007: 'Strobe return light detected',
        0x0009: 'Flash fired, compulsory flash mode',
        0x000D: 'Flash fired, compulsory flash mode, return light not detected',
        0x000F: 'Flash fired, compulsory flash mode, return light detected',
        0x0010: 'Flash did not fire, compulsory flash mode',
        0x0018: 'Flash did not fire, auto mode',
        0x0019: 'Flash fired, auto mode',
        0x001D: 'Flash fired, auto mode, return light not detected',
        0x001F: 'Flash fired, auto mode, return light detected',
        0x0020: 'No flash function',
        0x0041: 'Flash fired, red-eye reduction mode',
        0x0045: 'Flash fired, red-eye reduction mode, return light not detected',
        0x0047: 'Flash fired, red-eye reduction mode, return light detected',
        0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',
        0x004D: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
        0x004F: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
        0x0059: 'Flash fired, auto mode, red-eye reduction mode',
        0x005D: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
        0x005F: 'Flash fired, auto mode, return light detected, red-eye reduction mode'
      },
      SensingMethod: {
        1: 'Not defined',
        2: 'One-chip color area sensor',
        3: 'Two-chip color area sensor',
        4: 'Three-chip color area sensor',
        5: 'Color sequential area sensor',
        7: 'Trilinear sensor',
        8: 'Color sequential linear sensor'
      },
      SceneCaptureType: {
        0: 'Standard',
        1: 'Landscape',
        2: 'Portrait',
        3: 'Night scene'
      },
      SceneType: {
        1: 'Directly photographed'
      },
      CustomRendered: {
        0: 'Normal process',
        1: 'Custom process'
      },
      WhiteBalance: {
        0: 'Auto white balance',
        1: 'Manual white balance'
      },
      GainControl: {
        0: 'None',
        1: 'Low gain up',
        2: 'High gain up',
        3: 'Low gain down',
        4: 'High gain down'
      },
      Contrast: {
        0: 'Normal',
        1: 'Soft',
        2: 'Hard'
      },
      Saturation: {
        0: 'Normal',
        1: 'Low saturation',
        2: 'High saturation'
      },
      Sharpness: {
        0: 'Normal',
        1: 'Soft',
        2: 'Hard'
      },
      SubjectDistanceRange: {
        0: 'Unknown',
        1: 'Macro',
        2: 'Close view',
        3: 'Distant view'
      },
      FileSource: {
        3: 'DSC'
      },
      Components: {
        0: '',
        1: 'Y',
        2: 'Cb',
        3: 'Cr',
        4: 'R',
        5: 'G',
        6: 'B'
      }
    };
    IptcFieldMap = {
      0x78: 'caption',
      0x6E: 'credit',
      0x19: 'keywords',
      0x37: 'dateCreated',
      0x50: 'byline',
      0x55: 'bylineTitle',
      0x7A: 'captionWriter',
      0x69: 'headline',
      0x74: 'copyright',
      0x0F: 'category'
    };
    addEvent = function(element, event, handler) {
      if (element.addEventListener) {
        element.addEventListener(event, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent('on' + event, handler);
      }
    };
    imageHasData = function(img) {
      return !!img.exifdata;
    };
    base64ToArrayBuffer = function(base64, contentType) {
      var binary, buffer, i, len, view;
      contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || '';
      base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
      binary = atob(base64);
      len = binary.length;
      buffer = new ArrayBuffer(len);
      view = new Uint8Array(buffer);
      i = 0;
      while (i < len) {
        view[i] = binary.charCodeAt(i);
        i++;
      }
      return buffer;
    };
    objectURLToBlob = function(url, callback) {
      var http;
      http = new XMLHttpRequest;
      http.open('GET', url, true);
      http.responseType = 'blob';
      http.onload = function(e) {
        if (this.status === 200 || this.status === 0) {
          callback(this.response);
        }
      };
      http.send();
    };
    getImageData = function(img, callback) {
      var arrayBuffer, fileReader, handleBinaryFile, http;
      handleBinaryFile = function(binFile) {
        var data, iptcdata;
        data = findEXIFinJPEG(binFile);
        iptcdata = findIPTCinJPEG(binFile);
        img.exifdata = data || {};
        img.iptcdata = iptcdata || {};
        if (callback) {
          callback.call(img);
        }
      };
      if (img.src) {
        if (/^data\:/i.test(img.src)) {
          arrayBuffer = base64ToArrayBuffer(img.src);
          handleBinaryFile(arrayBuffer);
        } else if (/^blob\:/i.test(img.src)) {
          fileReader = new FileReader;
          fileReader.onload = function(e) {
            handleBinaryFile(e.target.result);
          };
          objectURLToBlob(img.src, function(blob) {
            fileReader.readAsArrayBuffer(blob);
          });
        } else {
          http = new XMLHttpRequest;
          http.onload = function() {
            var fileReader;
            if (this.status === 200 || this.status === 0) {
              handleBinaryFile(http.response);
            } else {
              throw 'Could not load image';
            }
            http = null;
          };
          http.open('GET', img.src, true);
          http.responseType = 'arraybuffer';
          http.send(null);
        }
      } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
        fileReader = new FileReader;
        fileReader.onload = function(e) {
          if (debug) {
            console.log('Got file of length ' + e.target.result.byteLength);
          }
          handleBinaryFile(e.target.result);
        };
        fileReader.readAsArrayBuffer(img);
      }
    };
    findEXIFinJPEG = function(file) {
      var dataView, length, marker, offset;
      dataView = new DataView(file);
      if (debug) {
        console.log('Got file of length ' + file.byteLength);
      }
      if (dataView.getUint8(0) !== 0xFF || dataView.getUint8(1) !== 0xD8) {
        if (debug) {
          console.log('Not a valid JPEG');
        }
        return false;
      }
      offset = 2;
      length = file.byteLength;
      marker = void 0;
      while (offset < length) {
        if (dataView.getUint8(offset) !== 0xFF) {
          if (debug) {
            console.log('Not a valid marker at offset ' + offset + ', found: ' + dataView.getUint8(offset));
          }
          return false;
        }
        marker = dataView.getUint8(offset + 1);
        if (debug) {
          console.log(marker);
        }
        if (marker === 225) {
          if (debug) {
            console.log('Found 0xFFE1 marker');
          }
          return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);
        } else {
          offset += 2 + dataView.getUint16(offset + 2);
        }
      }
    };
    findIPTCinJPEG = function(file) {
      var dataView, isFieldSegmentStart, length, nameHeaderLength, offset, sectionLength, startOffset;
      dataView = new DataView(file);
      if (debug) {
        console.log('Got file of length ' + file.byteLength);
      }
      if (dataView.getUint8(0) !== 0xFF || dataView.getUint8(1) !== 0xD8) {
        if (debug) {
          console.log('Not a valid JPEG');
        }
        return false;
      }
      offset = 2;
      length = file.byteLength;
      isFieldSegmentStart = function(dataView, offset) {
        return dataView.getUint8(offset) === 0x38 && dataView.getUint8(offset + 1) === 0x42 && dataView.getUint8(offset + 2) === 0x49 && dataView.getUint8(offset + 3) === 0x4D && dataView.getUint8(offset + 4) === 0x04 && dataView.getUint8(offset + 5) === 0x04;
      };
      while (offset < length) {
        if (isFieldSegmentStart(dataView, offset)) {
          nameHeaderLength = dataView.getUint8(offset + 7);
          if (nameHeaderLength % 2 !== 0) {
            nameHeaderLength += 1;
          }
          if (nameHeaderLength === 0) {
            nameHeaderLength = 4;
          }
          startOffset = offset + 8 + nameHeaderLength;
          sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);
          return readIPTCData(file, startOffset, sectionLength);
          break;
        }
        offset++;
      }
    };
    readIPTCData = function(file, startOffset, sectionLength) {
      var data, dataSize, dataView, fieldName, fieldValue, segmentSize, segmentStartPos, segmentType;
      dataView = new DataView(file);
      data = {};
      fieldValue = void 0;
      fieldName = void 0;
      dataSize = void 0;
      segmentType = void 0;
      segmentSize = void 0;
      segmentStartPos = startOffset;
      while (segmentStartPos < startOffset + sectionLength) {
        if (dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos + 1) === 0x02) {
          segmentType = dataView.getUint8(segmentStartPos + 2);
          if (segmentType in IptcFieldMap) {
            dataSize = dataView.getInt16(segmentStartPos + 3);
            segmentSize = dataSize + 5;
            fieldName = IptcFieldMap[segmentType];
            fieldValue = getStringFromDB(dataView, segmentStartPos + 5, dataSize);
            if (data.hasOwnProperty(fieldName)) {
              if (data[fieldName] instanceof Array) {
                data[fieldName].push(fieldValue);
              } else {
                data[fieldName] = [data[fieldName], fieldValue];
              }
            } else {
              data[fieldName] = fieldValue;
            }
          }
        }
        segmentStartPos++;
      }
      return data;
    };
    readTags = function(file, tiffStart, dirStart, strings, bigEnd) {
      var entries, entryOffset, i, tag, tags;
      entries = file.getUint16(dirStart, !bigEnd);
      tags = {};
      entryOffset = void 0;
      tag = void 0;
      i = void 0;
      i = 0;
      while (i < entries) {
        entryOffset = dirStart + i * 12 + 2;
        tag = strings[file.getUint16(entryOffset, !bigEnd)];
        if (!tag && debug) {
          console.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd));
        }
        tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        i++;
      }
      return tags;
    };
    readTagValue = function(file, entryOffset, tiffStart, dirStart, bigEnd) {
      var denominator, n, numValues, numerator, offset, type, val, vals, valueOffset;
      type = file.getUint16(entryOffset + 2, !bigEnd);
      numValues = file.getUint32(entryOffset + 4, !bigEnd);
      valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart;
      offset = void 0;
      vals = void 0;
      val = void 0;
      n = void 0;
      numerator = void 0;
      denominator = void 0;
      switch (type) {
        case 1:
        case 7:
          if (numValues === 1) {
            return file.getUint8(entryOffset + 8, !bigEnd);
          } else {
            offset = numValues > 4 ? valueOffset : entryOffset + 8;
            vals = [];
            n = 0;
            while (n < numValues) {
              vals[n] = file.getUint8(offset + n);
              n++;
            }
            return vals;
          }
          break;
        case 2:
          offset = numValues > 4 ? valueOffset : entryOffset + 8;
          return getStringFromDB(file, offset, numValues - 1);
        case 3:
          if (numValues === 1) {
            return file.getUint16(entryOffset + 8, !bigEnd);
          } else {
            offset = numValues > 2 ? valueOffset : entryOffset + 8;
            vals = [];
            n = 0;
            while (n < numValues) {
              vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
              n++;
            }
            return vals;
          }
          break;
        case 4:
          if (numValues === 1) {
            return file.getUint32(entryOffset + 8, !bigEnd);
          } else {
            vals = [];
            n = 0;
            while (n < numValues) {
              vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
              n++;
            }
            return vals;
          }
          break;
        case 5:
          if (numValues === 1) {
            numerator = file.getUint32(valueOffset, !bigEnd);
            denominator = file.getUint32(valueOffset + 4, !bigEnd);
            val = new Number(numerator / denominator);
            val.numerator = numerator;
            val.denominator = denominator;
            return val;
          } else {
            vals = [];
            n = 0;
            while (n < numValues) {
              numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
              denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
              vals[n] = new Number(numerator / denominator);
              vals[n].numerator = numerator;
              vals[n].denominator = denominator;
              n++;
            }
            return vals;
          }
          break;
        case 9:
          if (numValues === 1) {
            return file.getInt32(entryOffset + 8, !bigEnd);
          } else {
            vals = [];
            n = 0;
            while (n < numValues) {
              vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
              n++;
            }
            return vals;
          }
          break;
        case 10:
          if (numValues === 1) {
            return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
          } else {
            vals = [];
            n = 0;
            while (n < numValues) {
              vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
              n++;
            }
            return vals;
          }
      }
    };
    getStringFromDB = function(buffer, start, length) {
      var n, outstr;
      outstr = '';
      n = start;
      while (n < start + length) {
        outstr += String.fromCharCode(buffer.getUint8(n));
        n++;
      }
      return outstr;
    };
    readEXIFData = function(file, start) {
      var bigEnd, exifData, firstIFDOffset, gpsData, tag, tags, tiffOffset;
      if (getStringFromDB(file, start, 4) !== 'Exif') {
        if (debug) {
          console.log('Not valid EXIF data! ' + getStringFromDB(file, start, 4));
        }
        return false;
      }
      bigEnd = void 0;
      tags = void 0;
      tag = void 0;
      exifData = void 0;
      gpsData = void 0;
      tiffOffset = start + 6;
      if (file.getUint16(tiffOffset) === 0x4949) {
        bigEnd = false;
      } else if (file.getUint16(tiffOffset) === 0x4D4D) {
        bigEnd = true;
      } else {
        if (debug) {
          console.log('Not valid TIFF data! (no 0x4949 or 0x4D4D)');
        }
        return false;
      }
      if (file.getUint16(tiffOffset + 2, !bigEnd) !== 0x002A) {
        if (debug) {
          console.log('Not valid TIFF data! (no 0x002A)');
        }
        return false;
      }
      firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);
      if (firstIFDOffset < 0x00000008) {
        if (debug) {
          console.log('Not valid TIFF data! (First offset less than 8)', file.getUint32(tiffOffset + 4, !bigEnd));
        }
        return false;
      }
      tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);
      if (tags.ExifIFDPointer) {
        exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
        for (tag in exifData) {
          tag = tag;
          switch (tag) {
            case 'LightSource':
            case 'Flash':
            case 'MeteringMode':
            case 'ExposureProgram':
            case 'SensingMethod':
            case 'SceneCaptureType':
            case 'SceneType':
            case 'CustomRendered':
            case 'WhiteBalance':
            case 'GainControl':
            case 'Contrast':
            case 'Saturation':
            case 'Sharpness':
            case 'SubjectDistanceRange':
            case 'FileSource':
              exifData[tag] = StringValues[tag][exifData[tag]];
              break;
            case 'ExifVersion':
            case 'FlashpixVersion':
              exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
              break;
            case 'ComponentsConfiguration':
              exifData[tag] = StringValues.Components[exifData[tag][0]] + StringValues.Components[exifData[tag][1]] + StringValues.Components[exifData[tag][2]] + StringValues.Components[exifData[tag][3]];
          }
          tags[tag] = exifData[tag];
        }
      }
      if (tags.GPSInfoIFDPointer) {
        gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
        for (tag in gpsData) {
          tag = tag;
          switch (tag) {
            case 'GPSVersionID':
              gpsData[tag] = gpsData[tag][0] + '.' + gpsData[tag][1] + '.' + gpsData[tag][2] + '.' + gpsData[tag][3];
          }
          tags[tag] = gpsData[tag];
        }
      }
      return tags;
    };
    this.getData = function(img, callback) {
      if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) {
        return false;
      }
      if (!imageHasData(img)) {
        getImageData(img, callback);
      } else {
        if (callback) {
          callback.call(img);
        }
      }
      return true;
    };
    this.getTag = function(img, tag) {
      if (!imageHasData(img)) {
        return;
      }
      return img.exifdata[tag];
    };
    this.getAllTags = function(img) {
      var a, data, tags;
      if (!imageHasData(img)) {
        return {};
      }
      a = void 0;
      data = img.exifdata;
      tags = {};
      for (a in data) {
        a = a;
        if (data.hasOwnProperty(a)) {
          tags[a] = data[a];
        }
      }
      return tags;
    };
    this.pretty = function(img) {
      var a, data, strPretty;
      if (!imageHasData(img)) {
        return '';
      }
      a = void 0;
      data = img.exifdata;
      strPretty = '';
      for (a in data) {
        a = a;
        if (data.hasOwnProperty(a)) {
          if (typeof data[a] === 'object') {
            if (data[a] instanceof Number) {
              strPretty += a + ' : ' + data[a] + ' [' + data[a].numerator + '/' + data[a].denominator + ']\r\n';
            } else {
              strPretty += a + ' : [' + data[a].length + ' values]\r\n';
            }
          } else {
            strPretty += a + ' : ' + data[a] + '\r\n';
          }
        }
      }
      return strPretty;
    };
    this.readFromBinaryFile = function(file) {
      return findEXIFinJPEG(file);
    };
  }
]);

app.factory('cropHost', [
  '$document', 'cropAreaPortrait', 'cropAreaSquare', 'cropAreaLandscape', 'cropEXIF', function($document, CropAreaPortrait, CropAreaSquare, CropAreaLandscape, cropEXIF) {

    /* STATIC FUNCTIONS */
    var getElementOffset;
    getElementOffset = function(elem) {
      var body, box, clientLeft, clientTop, docElem, left, scrollLeft, scrollTop, top;
      box = elem.getBoundingClientRect();
      body = document.body;
      docElem = document.documentElement;
      scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
      clientTop = docElem.clientTop || body.clientTop || 0;
      clientLeft = docElem.clientLeft || body.clientLeft || 0;
      top = box.top + scrollTop - clientTop;
      left = box.left + scrollLeft - clientLeft;
      return {
        top: Math.round(top),
        left: Math.round(left)
      };
    };
    return function(elCanvas, opts, events) {

      /* PRIVATE VARIABLES */
      var ctx, drawScene, getChangedTouches, image, maxCanvasDims, minCanvasDims, onMouseDown, onMouseMove, onMouseUp, resImgFormat, resImgQuality, resImgSize, resetCropHost, theArea;
      ctx = null;
      image = null;
      theArea = null;
      minCanvasDims = [286, 286];
      maxCanvasDims = [589, 589];
      resImgSize = 200;
      resImgFormat = 'image/png';
      resImgQuality = null;
      resetCropHost = function() {
        var canvasDims, imageDims, imageRatio;
        if (image !== null) {
          theArea.setImage(image);
          imageDims = [image.width, image.height];
          imageRatio = image.width / image.height;
          canvasDims = imageDims;
          if (canvasDims[0] > maxCanvasDims[0]) {
            canvasDims[0] = maxCanvasDims[0];
            canvasDims[1] = canvasDims[0] / imageRatio;
          } else if (canvasDims[0] < minCanvasDims[0]) {
            canvasDims[0] = minCanvasDims[0];
            canvasDims[1] = canvasDims[0] / imageRatio;
          }
          if (canvasDims[1] > maxCanvasDims[1]) {
            canvasDims[1] = maxCanvasDims[1];
            canvasDims[0] = canvasDims[1] * imageRatio;
          } else if (canvasDims[1] < minCanvasDims[1]) {
            canvasDims[1] = minCanvasDims[1];
            canvasDims[0] = canvasDims[1] * imageRatio;
          }
          elCanvas.prop('width', canvasDims[0]).prop('height', canvasDims[1]).css({
            'margin-left': -canvasDims[0] / 2 + 'px',
            'margin-top': -canvasDims[1] / 2 + 'px'
          });
          theArea.setX(ctx.canvas.width / 2);
          theArea.setY(ctx.canvas.height / 2);
          theArea.setSize(Math.min(200, ctx.canvas.width / 2, ctx.canvas.height / 2));
        } else {
          elCanvas.prop('width', 0).prop('height', 0).css({
            'margin-top': 0
          });
        }
        drawScene();
      };

      /**
      			 * Returns event.changedTouches directly if event is a TouchEvent.
      			 * If event is a jQuery event, return changedTouches of event.originalEvent
       */
      getChangedTouches = function(event) {
        if (angular.isDefined(event.changedTouches)) {
          return event.changedTouches;
        } else {
          return event.originalEvent.changedTouches;
        }
      };
      onMouseMove = function(e) {
        var offset, pageX, pageY;
        if (image !== null) {
          offset = getElementOffset(ctx.canvas);
          pageX = void 0;
          pageY = void 0;
          if (e.type === 'touchmove') {
            pageX = getChangedTouches(e)[0].pageX;
            pageY = getChangedTouches(e)[0].pageY;
          } else {
            pageX = e.pageX;
            pageY = e.pageY;
          }
          theArea.processMouseMove(pageX - offset.left, pageY - offset.top);
          drawScene();
        }
      };
      onMouseDown = function(e) {
        var offset, pageX, pageY;
        e.preventDefault();
        e.stopPropagation();
        if (image !== null) {
          offset = getElementOffset(ctx.canvas);
          pageX = void 0;
          pageY = void 0;
          if (e.type === 'touchstart') {
            pageX = getChangedTouches(e)[0].pageX;
            pageY = getChangedTouches(e)[0].pageY;
          } else {
            pageX = e.pageX;
            pageY = e.pageY;
          }
          theArea.processMouseDown(pageX - offset.left, pageY - offset.top);
          drawScene();
        }
      };
      onMouseUp = function(e) {
        var offset, pageX, pageY;
        if (image !== null) {
          offset = getElementOffset(ctx.canvas);
          pageX = void 0;
          pageY = void 0;
          if (e.type === 'touchend') {
            pageX = getChangedTouches(e)[0].pageX;
            pageY = getChangedTouches(e)[0].pageY;
          } else {
            pageX = e.pageX;
            pageY = e.pageY;
          }
          theArea.processMouseUp(pageX - offset.left, pageY - offset.top);
          drawScene();
        }
      };

      /* PRIVATE FUNCTIONS */
      drawScene = function() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (image !== null) {
          ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.save();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.restore();
          theArea.draw();
        }
      };
      this.getResultImageDataURI = function() {
        var temp_canvas, temp_ctx;
        temp_ctx = void 0;
        temp_canvas = void 0;
        temp_canvas = angular.element('<canvas></canvas>')[0];
        temp_ctx = temp_canvas.getContext('2d');
        if (image !== null) {
          theArea.drawResultImage(ctx, temp_ctx, temp_canvas, image, resImgSize);
        }
        if (resImgQuality !== null) {
          return temp_canvas.toDataURL(resImgFormat, resImgQuality);
        }
        return temp_canvas.toDataURL(resImgFormat);
      };
      this.setNewImageSource = function(imageSource) {
        var newImage;
        image = null;
        resetCropHost();
        events.trigger('image-updated');
        if (!!imageSource) {
          newImage = new Image;
          if (imageSource.substring(0, 4).toLowerCase() === 'http') {
            newImage.crossOrigin = 'anonymous';
          }
          newImage.onload = function() {
            events.trigger('load-done');
            cropEXIF.getData(newImage, function() {
              var ctx;
              var canvas, ch, cw, cx, cy, deg, orientation;
              orientation = cropEXIF.getTag(newImage, 'Orientation');
              if ([3, 6, 8].indexOf(orientation) > -1) {
                canvas = document.createElement('canvas');
                ctx = canvas.getContext('2d');
                cw = newImage.width;
                ch = newImage.height;
                cx = 0;
                cy = 0;
                deg = 0;
                switch (orientation) {
                  case 3:
                    cx = -newImage.width;
                    cy = -newImage.height;
                    deg = 180;
                    break;
                  case 6:
                    cw = newImage.height;
                    ch = newImage.width;
                    cy = -newImage.height;
                    deg = 90;
                    break;
                  case 8:
                    cw = newImage.height;
                    ch = newImage.width;
                    cx = -newImage.width;
                    deg = 270;
                }
                canvas.width = cw;
                canvas.height = ch;
                ctx.rotate(deg * Math.PI / 180);
                ctx.drawImage(newImage, cx, cy);
                image = new Image;
                image.src = canvas.toDataURL('image/png');
              } else {
                image = newImage;
              }
              resetCropHost();
              events.trigger('image-updated');
            });
          };
          newImage.onerror = function() {
            events.trigger('load-error');
          };
          events.trigger('load-start');
          newImage.src = imageSource;
        }
      };
      this.setMaxDimensions = function(width, height) {
        var canvasDims, curHeight, curWidth, imageDims, imageRatio, ratioMin, ratioNewCurHeight, ratioNewCurWidth;
        maxCanvasDims = [width, height];
        if (image !== null) {
          curWidth = ctx.canvas.width;
          curHeight = ctx.canvas.height;
          imageDims = [image.width, image.height];
          imageRatio = image.width / image.height;
          canvasDims = imageDims;
          if (canvasDims[0] > maxCanvasDims[0]) {
            canvasDims[0] = maxCanvasDims[0];
            canvasDims[1] = canvasDims[0] / imageRatio;
          } else if (canvasDims[0] < minCanvasDims[0]) {
            canvasDims[0] = minCanvasDims[0];
            canvasDims[1] = canvasDims[0] / imageRatio;
          }
          if (canvasDims[1] > maxCanvasDims[1]) {
            canvasDims[1] = maxCanvasDims[1];
            canvasDims[0] = canvasDims[1] * imageRatio;
          } else if (canvasDims[1] < minCanvasDims[1]) {
            canvasDims[1] = minCanvasDims[1];
            canvasDims[0] = canvasDims[1] * imageRatio;
          }
          elCanvas.prop('width', canvasDims[0]).prop('height', canvasDims[1]).css({
            'margin-left': -canvasDims[0] / 2 + 'px',
            'margin-top': -canvasDims[1] / 2 + 'px'
          });
          ratioNewCurWidth = ctx.canvas.width / curWidth;
          ratioNewCurHeight = ctx.canvas.height / curHeight;
          ratioMin = Math.min(ratioNewCurWidth, ratioNewCurHeight);
          theArea.setX(theArea.getX() * ratioNewCurWidth);
          theArea.setY(theArea.getY() * ratioNewCurHeight);
          theArea.setSize(theArea.getSize() * ratioMin);
        } else {
          elCanvas.prop('width', 0).prop('height', 0).css({
            'margin-top': 0
          });
        }
        drawScene();
      };
      this.setAreaMinSize = function(size) {
        size = parseInt(size, 10);
        if (!isNaN(size)) {
          theArea.setMinSize(size);
          drawScene();
        }
      };
      this.setResultImageSize = function(size) {
        size = parseInt(size, 10);
        if (!isNaN(size)) {
          resImgSize = size;
        }
      };
      this.setResultImageFormat = function(format) {
        resImgFormat = format;
      };
      this.setResultImageQuality = function(quality) {
        quality = parseFloat(quality);
        if (!isNaN(quality) && quality >= 0 && quality <= 1) {
          resImgQuality = quality;
        }
      };
      this.setAreaType = function(type) {
        var AreaClass, curMinSize, curSize, curX, curY;
        console.log(type);
        curSize = theArea.getSize();
        curMinSize = theArea.getMinSize();
        curX = theArea.getX();
        curY = theArea.getY();
        AreaClass = CropAreaSquare;
        if (type === 'portrait') {
          AreaClass = CropAreaPortrait;
        } else if (type === 'landscape') {
          AreaClass = CropAreaLandscape;
        }
        theArea = new AreaClass(ctx, events);
        theArea.setMinSize(curMinSize);
        theArea.setSize(curSize);
        theArea.setX(curX);
        theArea.setY(curY);
        if (image !== null) {
          theArea.setImage(image);
        }
        drawScene();
      };

      /* Life Cycle begins */
      ctx = elCanvas[0].getContext('2d');
      theArea = new CropAreaSquare(ctx, events);
      $document.on('mousemove', onMouseMove);
      elCanvas.on('mousedown', onMouseDown);
      $document.on('mouseup', onMouseUp);
      $document.on('touchmove', onMouseMove);
      elCanvas.on('touchstart', onMouseDown);
      $document.on('touchend', onMouseUp);
      this.destroy = function() {
        $document.off('mousemove', onMouseMove);
        elCanvas.off('mousedown', onMouseDown);
        $document.off('mouseup', onMouseMove);
        $document.off('touchmove', onMouseMove);
        elCanvas.off('touchstart', onMouseDown);
        $document.off('touchend', onMouseMove);
        elCanvas.remove();
      };
    };
  }
]);

app.factory('cropAreaLandscape', [
  'cropArea', function(CropArea) {
    var CropAreaLandscape;
    CropAreaLandscape = function() {
      CropArea.apply(this, arguments);
      this._resizeCtrlBaseRadius = 10;
      this._resizeCtrlNormalRatio = 0.75;
      this._resizeCtrlHoverRatio = 1;
      this._iconMoveNormalRatio = 0.9;
      this._iconMoveHoverRatio = 1.2;
      this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlNormalRatio;
      this._resizeCtrlHoverVerticalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio;
      this._resizeCtrlHoverHorizontalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio * 2;
      this._posDragStartX = 0;
      this._posDragStartY = 0;
      this._posResizeStartX = 0;
      this._posResizeStartY = 0;
      this._posResizeStartSize = 0;
      this._resizeCtrlIsHover = -1;
      this._areaIsHover = false;
      this._resizeCtrlIsDragging = -1;
      this._areaIsDragging = false;
    };
    CropAreaLandscape.prototype = new CropArea;
    CropAreaLandscape.prototype._calcCorners = function() {
      var hSize, vSize;
      hSize = this._size;
      vSize = this._size / 2;
      return [[this._x - hSize, this._y - vSize], [this._x + hSize, this._y - vSize], [this._x - hSize, this._y + vSize], [this._x + hSize, this._y + vSize]];
    };
    CropAreaLandscape.prototype._calcDimensions = function() {
      var hSize, vSize;
      hSize = this._size;
      vSize = this._size / 2;
      return {
        left: this._x - hSize,
        top: this._y - vSize,
        right: this._x + hSize,
        bottom: this._y + vSize
      };
    };
    CropAreaLandscape.prototype._isCoordWithinArea = function(coord) {
      var dimensions;
      dimensions = this._calcDimensions();
      return coord[0] >= dimensions.left && coord[0] <= dimensions.right && coord[1] >= dimensions.top && coord[1] <= dimensions.bottom;
    };
    CropAreaLandscape.prototype._isCoordWithinResizeCtrl = function(coord) {
      var i, len, res, resizeIconCenterCoords, resizeIconsCenterCoords;
      resizeIconsCenterCoords = this._calcCorners();
      res = -1;
      i = 0;
      len = resizeIconsCenterCoords.length;
      while (i < len) {
        resizeIconCenterCoords = resizeIconsCenterCoords[i];
        if (coord[0] > resizeIconCenterCoords[0] - this._resizeCtrlHoverHorizontalRadius && coord[0] < resizeIconCenterCoords[0] + this._resizeCtrlHoverHorizontalRadius && coord[1] > resizeIconCenterCoords[1] - this._resizeCtrlHoverVerticalRadius && coord[1] < resizeIconCenterCoords[1] + this._resizeCtrlHoverVerticalRadius) {
          res = i;
          break;
        }
        i++;
      }
      return res;
    };
    CropAreaLandscape.prototype._drawArea = function(ctx, centerCoords, size) {
      var hSize, vSize;
      hSize = size;
      vSize = size / 2;
      ctx.rect(centerCoords[0] - hSize, centerCoords[1] - vSize, size * 2, size);
    };
    CropAreaLandscape.prototype._drawImage = function(ctx, image, centerCoords, size) {
      var xLeft, xRatio, yRatio, yTop;
      xRatio = image.width / ctx.canvas.width;
      yRatio = image.height / ctx.canvas.height;
      xLeft = centerCoords[0] - size;
      yTop = centerCoords[1] - (size / 2);
      return ctx.drawImage(image, xLeft * xRatio, yTop * yRatio, size * xRatio * 2, size * yRatio, xLeft, yTop, size * 2, size);
    };
    CropAreaLandscape.prototype.drawResultImage = function(ctx, draw_ctx, canvas, image, resultSize) {
      var cropHeight, cropWidth, cropX, cropY, resultHeight, resultWidth, xRatio, yRatio;
      xRatio = image.width / ctx.canvas.width;
      yRatio = image.height / ctx.canvas.height;
      cropX = (this.getX() - this.getSize()) * xRatio;
      cropY = (this.getY() - (this.getSize() / 2)) * yRatio;
      cropWidth = this.getSize() * xRatio * 2;
      cropHeight = this.getSize() * yRatio;
      resultWidth = resultSize * 2;
      resultHeight = resultSize;
      canvas.width = resultWidth;
      canvas.height = resultHeight;
      return draw_ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, resultWidth, resultHeight);
    };
    CropAreaLandscape.prototype.draw = function() {
      var i, len, resizeIconCenterCoords, resizeIconsCenterCoords;
      CropArea.prototype.draw.apply(this, arguments);
      this._cropCanvas.drawIconMove([this._x, this._y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio);
      resizeIconsCenterCoords = this._calcCorners();
      i = 0;
      len = resizeIconsCenterCoords.length;
      while (i < len) {
        resizeIconCenterCoords = resizeIconsCenterCoords[i];
        this._cropCanvas.drawIconResizeCircle(resizeIconCenterCoords, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover === i ? this._resizeCtrlHoverRatio : this._resizeCtrlNormalRatio);
        i++;
      }
    };
    CropAreaLandscape.prototype.processMouseMove = function(mouseCurX, mouseCurY) {
      var cursor, hoveredResizeBox, iFR, iFX, iFY, posModifier, res, wasSize, xMulti, yMulti;
      cursor = 'default';
      res = false;
      this._resizeCtrlIsHover = -1;
      this._areaIsHover = false;
      if (this._areaIsDragging) {
        this._x = mouseCurX - this._posDragStartX;
        this._y = mouseCurY - this._posDragStartY;
        this._areaIsHover = true;
        cursor = 'move';
        res = true;
        this._events.trigger('area-move');
      } else if (this._resizeCtrlIsDragging > -1) {
        xMulti = void 0;
        yMulti = void 0;
        switch (this._resizeCtrlIsDragging) {
          case 0:
            xMulti = -1;
            yMulti = -1;
            cursor = 'nwse-resize';
            break;
          case 1:
            xMulti = 1;
            yMulti = -0.5;
            cursor = 'nesw-resize';
            break;
          case 2:
            xMulti = -1;
            yMulti = 0.5;
            cursor = 'nesw-resize';
            break;
          case 3:
            xMulti = 1;
            yMulti = 0.5;
            cursor = 'nwse-resize';
        }
        iFX = (mouseCurX - this._posResizeStartX) * xMulti;
        iFY = (mouseCurY - this._posResizeStartY) * yMulti;
        iFR = void 0;
        if (iFX > iFY) {
          iFR = this._posResizeStartSize + iFY;
        } else {
          iFR = this._posResizeStartSize + iFX;
        }
        wasSize = this._size;
        this._size = Math.max(this._minSize, iFR);
        posModifier = (this._size - wasSize) / 2;
        this._x += posModifier * xMulti;
        this._y += posModifier * yMulti;
        this._resizeCtrlIsHover = this._resizeCtrlIsDragging;
        res = true;
        this._events.trigger('area-resize');
      } else {
        hoveredResizeBox = this._isCoordWithinResizeCtrl([mouseCurX, mouseCurY]);
        if (hoveredResizeBox > -1) {
          switch (hoveredResizeBox) {
            case 0:
              cursor = 'nwse-resize';
              break;
            case 1:
              cursor = 'nesw-resize';
              break;
            case 2:
              cursor = 'nesw-resize';
              break;
            case 3:
              cursor = 'nwse-resize';
          }
          this._areaIsHover = false;
          this._resizeCtrlIsHover = hoveredResizeBox;
          res = true;
        } else if (this._isCoordWithinArea([mouseCurX, mouseCurY])) {
          cursor = 'move';
          this._areaIsHover = true;
          res = true;
        }
      }
      this._dontDragOutside();
      angular.element(this._ctx.canvas).css({
        'cursor': cursor
      });
      return res;
    };
    CropAreaLandscape.prototype.processMouseDown = function(mouseDownX, mouseDownY) {
      var isWithinResizeCtrl;
      isWithinResizeCtrl = this._isCoordWithinResizeCtrl([mouseDownX, mouseDownY]);
      if (isWithinResizeCtrl > -1) {
        this._areaIsDragging = false;
        this._areaIsHover = false;
        this._resizeCtrlIsDragging = isWithinResizeCtrl;
        this._resizeCtrlIsHover = isWithinResizeCtrl;
        this._posResizeStartX = mouseDownX;
        this._posResizeStartY = mouseDownY;
        this._posResizeStartSize = this._size;
        this._events.trigger('area-resize-start');
      } else if (this._isCoordWithinArea([mouseDownX, mouseDownY])) {
        this._areaIsDragging = true;
        this._areaIsHover = true;
        this._resizeCtrlIsDragging = -1;
        this._resizeCtrlIsHover = -1;
        this._posDragStartX = mouseDownX - this._x;
        this._posDragStartY = mouseDownY - this._y;
        this._events.trigger('area-move-start');
      }
    };
    CropAreaLandscape.prototype.processMouseUp = function() {
      if (this._areaIsDragging) {
        this._areaIsDragging = false;
        this._events.trigger('area-move-end');
      }
      if (this._resizeCtrlIsDragging > -1) {
        this._resizeCtrlIsDragging = -1;
        this._events.trigger('area-resize-end');
      }
      this._areaIsHover = false;
      this._resizeCtrlIsHover = -1;
      this._posDragStartX = 0;
      this._posDragStartY = 0;
    };
    CropAreaLandscape.prototype._dontDragOutside = function() {
      var h, hSize, vSize, w;
      h = this._ctx.canvas.height;
      w = this._ctx.canvas.width;
      hSize = this._size * 2;
      vSize = this._size;
      if (hSize > w) {
        this._size = w / 2;
      }
      if (vSize > h) {
        this._size = h;
      }
      if (this._x < this._size) {
        this._x = this._size;
      }
      if (this._x > w - this._size) {
        this._x = w - this._size;
      }
      if (this._y < this._size / 2) {
        this._y = this._size / 2;
      }
      if (this._y > h - (this._size / 2)) {
        this._y = h - (this._size / 2);
      }
    };
    return CropAreaLandscape;
  }
]);

app.factory('cropAreaPortrait', [
  'cropArea', function(CropArea) {
    var CropAreaPortrait;
    CropAreaPortrait = function() {
      CropArea.apply(this, arguments);
      this._resizeCtrlBaseRadius = 10;
      this._resizeCtrlNormalRatio = 0.75;
      this._resizeCtrlHoverRatio = 1;
      this._iconMoveNormalRatio = 0.9;
      this._iconMoveHoverRatio = 1.2;
      this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlNormalRatio;
      this._resizeCtrlHoverVerticalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio * 2;
      this._resizeCtrlHoverHorizontalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio;
      this._posDragStartX = 0;
      this._posDragStartY = 0;
      this._posResizeStartX = 0;
      this._posResizeStartY = 0;
      this._posResizeStartSize = 0;
      this._resizeCtrlIsHover = -1;
      this._areaIsHover = false;
      this._resizeCtrlIsDragging = -1;
      this._areaIsDragging = false;
    };
    CropAreaPortrait.prototype = new CropArea;
    CropAreaPortrait.prototype._calcCorners = function() {
      var hSize, vSize;
      hSize = this._size / 2;
      vSize = this._size;
      return [[this._x - hSize, this._y - vSize], [this._x + hSize, this._y - vSize], [this._x - hSize, this._y + vSize], [this._x + hSize, this._y + vSize]];
    };
    CropAreaPortrait.prototype._calcDimensions = function() {
      var hSize, vSize;
      hSize = this._size / 2;
      vSize = this._size;
      return {
        left: this._x - hSize,
        top: this._y - vSize,
        right: this._x + hSize,
        bottom: this._y + vSize
      };
    };
    CropAreaPortrait.prototype._isCoordWithinArea = function(coord) {
      var dimensions;
      dimensions = this._calcDimensions();
      return coord[0] >= dimensions.left && coord[0] <= dimensions.right && coord[1] >= dimensions.top && coord[1] <= dimensions.bottom;
    };
    CropAreaPortrait.prototype._isCoordWithinResizeCtrl = function(coord) {
      var i, len, res, resizeIconCenterCoords, resizeIconsCenterCoords;
      resizeIconsCenterCoords = this._calcCorners();
      res = -1;
      i = 0;
      len = resizeIconsCenterCoords.length;
      while (i < len) {
        resizeIconCenterCoords = resizeIconsCenterCoords[i];
        if (coord[0] > resizeIconCenterCoords[0] - this._resizeCtrlHoverHorizontalRadius && coord[0] < resizeIconCenterCoords[0] + this._resizeCtrlHoverHorizontalRadius && coord[1] > resizeIconCenterCoords[1] - this._resizeCtrlHoverVerticalRadius && coord[1] < resizeIconCenterCoords[1] + this._resizeCtrlHoverVerticalRadius) {
          res = i;
          break;
        }
        i++;
      }
      return res;
    };
    CropAreaPortrait.prototype._drawArea = function(ctx, centerCoords, size) {
      var hSize, vSize;
      hSize = size / 2;
      vSize = size;
      ctx.rect(centerCoords[0] - hSize, centerCoords[1] - vSize, size, size * 2);
    };
    CropAreaPortrait.prototype._drawImage = function(ctx, image, centerCoords, size) {
      var xLeft, xRatio, yRatio, yTop;
      xRatio = image.width / ctx.canvas.width;
      yRatio = image.height / ctx.canvas.height;
      xLeft = centerCoords[0] - (size / 2);
      yTop = centerCoords[1] - size;
      return ctx.drawImage(image, xLeft * xRatio, yTop * yRatio, size * xRatio, size * yRatio * 2, xLeft, yTop, size, size * 2);
    };
    CropAreaPortrait.prototype.draw = function() {
      var i, len, resizeIconCenterCoords, resizeIconsCenterCoords;
      CropArea.prototype.draw.apply(this, arguments);
      this._cropCanvas.drawIconMove([this._x, this._y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio);
      resizeIconsCenterCoords = this._calcCorners();
      i = 0;
      len = resizeIconsCenterCoords.length;
      while (i < len) {
        resizeIconCenterCoords = resizeIconsCenterCoords[i];
        this._cropCanvas.drawIconResizeCircle(resizeIconCenterCoords, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover === i ? this._resizeCtrlHoverRatio : this._resizeCtrlNormalRatio);
        i++;
      }
    };
    CropAreaPortrait.prototype.drawResultImage = function(ctx, draw_ctx, canvas, image, resultSize) {
      var cropHeight, cropWidth, cropX, cropY, resultHeight, resultWidth, xRatio, yRatio;
      xRatio = image.width / ctx.canvas.width;
      yRatio = image.height / ctx.canvas.height;
      cropX = (this.getX() - (this.getSize() / 2)) * xRatio;
      cropY = (this.getY() - this.getSize()) * yRatio;
      cropWidth = this.getSize() * xRatio;
      cropHeight = this.getSize() * yRatio * 2;
      resultWidth = resultSize;
      resultHeight = resultSize * 2;
      canvas.width = resultWidth;
      canvas.height = resultHeight;
      console.log('draw image', cropX, cropY, cropWidth, cropHeight, resultWidth, resultHeight);
      return draw_ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, resultWidth, resultHeight);
    };
    CropAreaPortrait.prototype.processMouseMove = function(mouseCurX, mouseCurY) {
      var cursor, hoveredResizeBox, iFR, iFX, iFY, posModifier, res, wasSize, xMulti, yMulti;
      cursor = 'default';
      res = false;
      this._resizeCtrlIsHover = -1;
      this._areaIsHover = false;
      if (this._areaIsDragging) {
        this._x = mouseCurX - this._posDragStartX;
        this._y = mouseCurY - this._posDragStartY;
        this._areaIsHover = true;
        cursor = 'move';
        res = true;
        this._events.trigger('area-move');
      } else if (this._resizeCtrlIsDragging > -1) {
        xMulti = void 0;
        yMulti = void 0;
        switch (this._resizeCtrlIsDragging) {
          case 0:
            xMulti = -1;
            yMulti = -0.5;
            cursor = 'nwse-resize';
            break;
          case 1:
            xMulti = 1;
            yMulti = -0.5;
            cursor = 'nesw-resize';
            break;
          case 2:
            xMulti = -1;
            yMulti = 0.5;
            cursor = 'nesw-resize';
            break;
          case 3:
            xMulti = 1;
            yMulti = 0.5;
            cursor = 'nwse-resize';
        }
        iFX = (mouseCurX - this._posResizeStartX) * xMulti;
        iFY = (mouseCurY - this._posResizeStartY) * yMulti;
        iFR = void 0;
        if (iFX > iFY) {
          iFR = this._posResizeStartSize + iFY;
        } else {
          iFR = this._posResizeStartSize + iFX;
        }
        wasSize = this._size;
        this._size = Math.max(this._minSize, iFR);
        posModifier = (this._size - wasSize) / 2;
        this._x += posModifier * xMulti;
        this._y += posModifier * yMulti;
        this._resizeCtrlIsHover = this._resizeCtrlIsDragging;
        res = true;
        this._events.trigger('area-resize');
      } else {
        hoveredResizeBox = this._isCoordWithinResizeCtrl([mouseCurX, mouseCurY]);
        if (hoveredResizeBox > -1) {
          switch (hoveredResizeBox) {
            case 0:
              cursor = 'nwse-resize';
              break;
            case 1:
              cursor = 'nesw-resize';
              break;
            case 2:
              cursor = 'nesw-resize';
              break;
            case 3:
              cursor = 'nwse-resize';
          }
          this._areaIsHover = false;
          this._resizeCtrlIsHover = hoveredResizeBox;
          res = true;
        } else if (this._isCoordWithinArea([mouseCurX, mouseCurY])) {
          cursor = 'move';
          this._areaIsHover = true;
          res = true;
        }
      }
      this._dontDragOutside();
      angular.element(this._ctx.canvas).css({
        'cursor': cursor
      });
      return res;
    };
    CropAreaPortrait.prototype.processMouseDown = function(mouseDownX, mouseDownY) {
      var isWithinResizeCtrl;
      isWithinResizeCtrl = this._isCoordWithinResizeCtrl([mouseDownX, mouseDownY]);
      if (isWithinResizeCtrl > -1) {
        this._areaIsDragging = false;
        this._areaIsHover = false;
        this._resizeCtrlIsDragging = isWithinResizeCtrl;
        this._resizeCtrlIsHover = isWithinResizeCtrl;
        this._posResizeStartX = mouseDownX;
        this._posResizeStartY = mouseDownY;
        this._posResizeStartSize = this._size;
        this._events.trigger('area-resize-start');
      } else if (this._isCoordWithinArea([mouseDownX, mouseDownY])) {
        this._areaIsDragging = true;
        this._areaIsHover = true;
        this._resizeCtrlIsDragging = -1;
        this._resizeCtrlIsHover = -1;
        this._posDragStartX = mouseDownX - this._x;
        this._posDragStartY = mouseDownY - this._y;
        this._events.trigger('area-move-start');
      }
    };
    CropAreaPortrait.prototype.processMouseUp = function() {
      if (this._areaIsDragging) {
        this._areaIsDragging = false;
        this._events.trigger('area-move-end');
      }
      if (this._resizeCtrlIsDragging > -1) {
        this._resizeCtrlIsDragging = -1;
        this._events.trigger('area-resize-end');
      }
      this._areaIsHover = false;
      this._resizeCtrlIsHover = -1;
      this._posDragStartX = 0;
      this._posDragStartY = 0;
    };
    CropAreaPortrait.prototype._dontDragOutside = function() {
      var h, hSize, vSize, w;
      h = this._ctx.canvas.height;
      w = this._ctx.canvas.width;
      hSize = this._size;
      vSize = this._size * 2;
      if (hSize > w) {
        this._size = w;
      }
      if (vSize > h) {
        this._size = h / 2;
      }
      if (this._x < this._size / 2) {
        this._x = this._size / 2;
      }
      if (this._x > w - this._size / 2) {
        this._x = w - this._size / 2;
      }
      if (this._y < this._size) {
        this._y = this._size;
      }
      if (this._y > h - this._size) {
        this._y = h - this._size;
      }
    };
    return CropAreaPortrait;
  }
]);

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

app.factory('cropAreaSquare', [
  'cropArea', function(CropArea) {
    var CropAreaSquare;
    CropAreaSquare = function() {
      CropArea.apply(this, arguments);
      this._resizeCtrlBaseRadius = 10;
      this._resizeCtrlNormalRatio = 0.75;
      this._resizeCtrlHoverRatio = 1;
      this._iconMoveNormalRatio = 0.9;
      this._iconMoveHoverRatio = 1.2;
      this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlNormalRatio;
      this._resizeCtrlHoverRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio;
      this._posDragStartX = 0;
      this._posDragStartY = 0;
      this._posResizeStartX = 0;
      this._posResizeStartY = 0;
      this._posResizeStartSize = 0;
      this._resizeCtrlIsHover = -1;
      this._areaIsHover = false;
      this._resizeCtrlIsDragging = -1;
      this._areaIsDragging = false;
    };
    CropAreaSquare.prototype = new CropArea;
    CropAreaSquare.prototype._calcSquareCorners = function() {
      var hSize;
      hSize = this._size / 2;
      return [[this._x - hSize, this._y - hSize], [this._x + hSize, this._y - hSize], [this._x - hSize, this._y + hSize], [this._x + hSize, this._y + hSize]];
    };
    CropAreaSquare.prototype._calcSquareDimensions = function() {
      var hSize;
      hSize = this._size / 2;
      return {
        left: this._x - hSize,
        top: this._y - hSize,
        right: this._x + hSize,
        bottom: this._y + hSize
      };
    };
    CropAreaSquare.prototype._isCoordWithinArea = function(coord) {
      var squareDimensions;
      squareDimensions = this._calcSquareDimensions();
      return coord[0] >= squareDimensions.left && coord[0] <= squareDimensions.right && coord[1] >= squareDimensions.top && coord[1] <= squareDimensions.bottom;
    };
    CropAreaSquare.prototype._isCoordWithinResizeCtrl = function(coord) {
      var i, len, res, resizeIconCenterCoords, resizeIconsCenterCoords;
      resizeIconsCenterCoords = this._calcSquareCorners();
      res = -1;
      i = 0;
      len = resizeIconsCenterCoords.length;
      while (i < len) {
        resizeIconCenterCoords = resizeIconsCenterCoords[i];
        if (coord[0] > resizeIconCenterCoords[0] - this._resizeCtrlHoverRadius && coord[0] < resizeIconCenterCoords[0] + this._resizeCtrlHoverRadius && coord[1] > resizeIconCenterCoords[1] - this._resizeCtrlHoverRadius && coord[1] < resizeIconCenterCoords[1] + this._resizeCtrlHoverRadius) {
          res = i;
          break;
        }
        i++;
      }
      return res;
    };
    CropAreaSquare.prototype._drawArea = function(ctx, centerCoords, size) {
      var hSize;
      hSize = size / 2;
      ctx.rect(centerCoords[0] - hSize, centerCoords[1] - hSize, size, size);
    };
    CropAreaSquare.prototype._drawImage = function(ctx, image, centerCoords, size) {
      var xLeft, xRatio, yRatio, yTop;
      xRatio = image.width / ctx.canvas.width;
      yRatio = image.height / ctx.canvas.height;
      xLeft = centerCoords[0] - (size / 2);
      yTop = centerCoords[1] - (size / 2);
      return ctx.drawImage(image, xLeft * xRatio, yTop * yRatio, size * xRatio, size * yRatio, xLeft, yTop, size, size);
    };
    CropAreaSquare.prototype.draw = function() {
      var i, len, resizeIconCenterCoords, resizeIconsCenterCoords;
      CropArea.prototype.draw.apply(this, arguments);
      this._cropCanvas.drawIconMove([this._x, this._y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio);
      resizeIconsCenterCoords = this._calcSquareCorners();
      i = 0;
      len = resizeIconsCenterCoords.length;
      while (i < len) {
        resizeIconCenterCoords = resizeIconsCenterCoords[i];
        this._cropCanvas.drawIconResizeCircle(resizeIconCenterCoords, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover === i ? this._resizeCtrlHoverRatio : this._resizeCtrlNormalRatio);
        i++;
      }
    };
    CropAreaSquare.prototype.drawResultImage = function(ctx, draw_ctx, canvas, image, resultSize) {
      var cropHeight, cropWidth, cropX, cropY, resultHeight, resultWidth, xRatio, yRatio;
      xRatio = image.width / ctx.canvas.width;
      yRatio = image.height / ctx.canvas.height;
      cropX = (this.getX() - (this.getSize() / 2)) * xRatio;
      cropY = (this.getY() - this.getSize() / 2) * yRatio;
      cropWidth = this.getSize() * xRatio;
      cropHeight = this.getSize() * yRatio;
      resultWidth = resultSize;
      resultHeight = resultSize;
      canvas.width = resultWidth;
      canvas.height = resultHeight;
      return draw_ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, resultWidth, resultHeight);
    };
    CropAreaSquare.prototype.processMouseMove = function(mouseCurX, mouseCurY) {
      var cursor, hoveredResizeBox, iFR, iFX, iFY, posModifier, res, wasSize, xMulti, yMulti;
      cursor = 'default';
      res = false;
      this._resizeCtrlIsHover = -1;
      this._areaIsHover = false;
      if (this._areaIsDragging) {
        this._x = mouseCurX - this._posDragStartX;
        this._y = mouseCurY - this._posDragStartY;
        this._areaIsHover = true;
        cursor = 'move';
        res = true;
        this._events.trigger('area-move');
      } else if (this._resizeCtrlIsDragging > -1) {
        xMulti = void 0;
        yMulti = void 0;
        switch (this._resizeCtrlIsDragging) {
          case 0:
            xMulti = -1;
            yMulti = -1;
            cursor = 'nwse-resize';
            break;
          case 1:
            xMulti = 1;
            yMulti = -1;
            cursor = 'nesw-resize';
            break;
          case 2:
            xMulti = -1;
            yMulti = 1;
            cursor = 'nesw-resize';
            break;
          case 3:
            xMulti = 1;
            yMulti = 1;
            cursor = 'nwse-resize';
        }
        iFX = (mouseCurX - this._posResizeStartX) * xMulti;
        iFY = (mouseCurY - this._posResizeStartY) * yMulti;
        iFR = void 0;
        if (iFX > iFY) {
          iFR = this._posResizeStartSize + iFY;
        } else {
          iFR = this._posResizeStartSize + iFX;
        }
        wasSize = this._size;
        this._size = Math.max(this._minSize, iFR);
        posModifier = (this._size - wasSize) / 2;
        this._x += posModifier * xMulti;
        this._y += posModifier * yMulti;
        this._resizeCtrlIsHover = this._resizeCtrlIsDragging;
        res = true;
        this._events.trigger('area-resize');
      } else {
        hoveredResizeBox = this._isCoordWithinResizeCtrl([mouseCurX, mouseCurY]);
        if (hoveredResizeBox > -1) {
          switch (hoveredResizeBox) {
            case 0:
              cursor = 'nwse-resize';
              break;
            case 1:
              cursor = 'nesw-resize';
              break;
            case 2:
              cursor = 'nesw-resize';
              break;
            case 3:
              cursor = 'nwse-resize';
          }
          this._areaIsHover = false;
          this._resizeCtrlIsHover = hoveredResizeBox;
          res = true;
        } else if (this._isCoordWithinArea([mouseCurX, mouseCurY])) {
          cursor = 'move';
          this._areaIsHover = true;
          res = true;
        }
      }
      this._dontDragOutside();
      angular.element(this._ctx.canvas).css({
        'cursor': cursor
      });
      return res;
    };
    CropAreaSquare.prototype.processMouseDown = function(mouseDownX, mouseDownY) {
      var isWithinResizeCtrl;
      isWithinResizeCtrl = this._isCoordWithinResizeCtrl([mouseDownX, mouseDownY]);
      if (isWithinResizeCtrl > -1) {
        this._areaIsDragging = false;
        this._areaIsHover = false;
        this._resizeCtrlIsDragging = isWithinResizeCtrl;
        this._resizeCtrlIsHover = isWithinResizeCtrl;
        this._posResizeStartX = mouseDownX;
        this._posResizeStartY = mouseDownY;
        this._posResizeStartSize = this._size;
        this._events.trigger('area-resize-start');
      } else if (this._isCoordWithinArea([mouseDownX, mouseDownY])) {
        this._areaIsDragging = true;
        this._areaIsHover = true;
        this._resizeCtrlIsDragging = -1;
        this._resizeCtrlIsHover = -1;
        this._posDragStartX = mouseDownX - this._x;
        this._posDragStartY = mouseDownY - this._y;
        this._events.trigger('area-move-start');
      }
    };
    CropAreaSquare.prototype.processMouseUp = function() {
      if (this._areaIsDragging) {
        this._areaIsDragging = false;
        this._events.trigger('area-move-end');
      }
      if (this._resizeCtrlIsDragging > -1) {
        this._resizeCtrlIsDragging = -1;
        this._events.trigger('area-resize-end');
      }
      this._areaIsHover = false;
      this._resizeCtrlIsHover = -1;
      this._posDragStartX = 0;
      this._posDragStartY = 0;
    };
    return CropAreaSquare;
  }
]);
