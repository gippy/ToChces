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
  '$scope', 'anchorSmoothScroll', function($scope, anchorSmoothScroll) {
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
    $scope.showHome = function() {
      var isSinglePage, path;
      path = window.location.pathname;
      isSinglePage = path.indexOf('user') !== -1 || path.indexOf('profile') !== -1 || path.indexOf('product') !== -1 || path.indexOf('add') !== -1 || path.indexOf('settings') !== -1;
      if (!isSinglePage) {
        return anchorSmoothScroll();
      } else {
        return window.location.href = '/';
      }
    };
    $scope.$on("reachedMenuLimit", function(event, data) {
      if (data.type === "over") {
        return $scope.scrollClass = 'scrolling';
      } else {
        return $scope.scrollClass = '';
      }
    });
    $scope.scrollClass = '';
    return $scope.$parent.navigationController = $scope;
  }
]);

app.controller('PageController', [
  '$scope', '$http', function($scope, $http) {
    $scope.$parent.pageController = $scope;
    return $scope.draggableProducts = {
      drop: function(draggedItem, dropedItem) {
        return $scope.$broadcast("drop", {
          drag: draggedItem,
          drop: dropedItem
        });
      }
    };
  }
]);

app.controller('ModalController', [
  '$scope', '$http', '$sce', function($scope, $http, $sce) {
    var getModal;
    $scope.stack = [];
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
    $scope.box = {
      id: null,
      name: null,
      color: 'red',
      remove: false,
      removeContents: false,
      callback: null,
      confirmMessage: null,
      confirmCb: null,
      init: function(cb, box) {
        $scope.box.callback = cb;
        if (box) {
          $scope.box.id = box.id;
          $scope.box.name = box.name;
          $scope.box.color = box.color;
          return $scope.box.remove = $scope.box.removeContents = false;
        }
      },
      save: function() {
        if ($scope.box.remove) {
          $scope.box.confirmMessage = 'Opravdu chcete smazat tento seznam?';
          return $scope.box.confirmCb = function() {
            if ($scope.box.callback) {
              return $scope.box.callback($scope.box);
            }
          };
        } else if ($scope.box.removeContents) {
          $scope.box.confirmMessage = 'Opravdu chcete smazat obsah tohoto seznamu?';
          return $scope.box.confirmCb = function() {
            if ($scope.box.callback) {
              return $scope.box.callback($scope.box);
            }
          };
        } else if ($scope.box.callback) {
          return $scope.box.callback($scope.box);
        }
      },
      confirm: function() {
        $scope.box.confirmCb();
        return $scope.box.cleanConfirmation();
      },
      cleanConfirmation: function() {
        $scope.box.confirmMessage = null;
        return $scope.box.confirmCb = null;
      }
    };
    $scope.boxes = {
      boxes: null,
      callback: null,
      mergeCb: null,
      removeCb: null,
      removeContentsCb: null,
      confirmMessage: '',
      confirmCb: null,
      mergeFrom: null,
      mergeTo: null,
      init: function(cb, boxes) {
        $scope.boxes.callback = cb;
        return $scope.boxes.boxes = boxes;
      },
      showEdit: function(box) {
        $scope.box.init($scope.boxes.edit, box);
        return $scope.open('edit-box');
      },
      edit: function(box) {
        if (box.remove) {
          $scope.boxes.remove(box);
        } else {
          $http.post('/boxes/update', box).success(function(box) {
            var existingBox, i, key, len, position, ref;
            position = -1;
            ref = $scope.boxes.boxes;
            for (key = i = 0, len = ref.length; i < len; key = ++i) {
              existingBox = ref[key];
              if (box.id === existingBox.id) {
                position = key;
              }
            }
            if (position !== -1) {
              $scope.boxes.boxes[position].name = box.name;
              $scope.boxes.boxes[position].color = box.color;
            }
            if ($scope.boxes.callback) {
              return $scope.boxes.callback($scope.boxes.boxes);
            }
          });
        }
        if (box.removeContents) {
          $scope.boxes.removeContents(box);
        }
        return $scope.close();
      },
      merge: function(from, to) {
        return $scope.$apply(function() {
          $scope.boxes.confirmMessage = 'Opravdu chcete sloucit obsah z "' + from.name + '" do "' + to.name + '"?';
          $scope.boxes.mergeFrom = from;
          $scope.boxes.mergeTo = to;
          return $scope.boxes.confirmCb = function() {
            return $http.get('/boxes/merge?from=' + $scope.boxes.mergeFrom.id + '&to=' + $scope.boxes.mergeTo.id).success(function(data) {
              return window.location.reload();
            });
          };
        });
      },
      remove: function(box) {
        return $http.get('/boxes/remove?box=' + box.id).success(function() {
          return window.location.reload();
        });
      },
      removeLocalBox: function(box) {
        var i, item, key, len, position, ref;
        position = -1;
        ref = $scope.boxes;
        for (key = i = 0, len = ref.length; i < len; key = ++i) {
          item = ref[key];
          if (item.id === box.id) {
            position = key;
          }
        }
        if (position !== -1) {
          return $scope.boxes.splice(position, 1);
        }
      },
      removeContents: function(box) {
        return $http.get('/boxes/removeContents?box=' + box.id).success(function() {
          return window.location.reload();
        });
      },
      confirm: function() {
        $scope.boxes.confirmCb();
        return $scope.boxes.cleanConfirmation();
      },
      cleanConfirmation: function() {
        $scope.boxes.confirmMessage = '';
        return $scope.boxes.confirmCb = null;
      },
      drop: function(from, to) {
        return $scope.boxes.merge(from, to);
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
      $scope.stack.pop();
      if ($scope.stack.length) {
        return $scope.open($scope.stack.pop());
      } else {
        return $scope.visible = false;
      }
    };
    $scope.open = function(type) {
      $scope.stack.push(type);
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
    $scope.step = 1;
    $scope.url = '';
    $scope.product = {
      name: '',
      description: '',
      images: '',
      tags: [],
      categories: [],
      finalSrc: ''
    };
    $scope.croppFinished = false;
    $scope.customFile = null;
    $scope.validateFile = function(fileName) {
      var allowedExtensions, extension, fileExtension, i, len;
      allowedExtensions = ["jpg", 'jpeg', "png"];
      fileExtension = fileName.split('.').pop();
      for (i = 0, len = allowedExtensions.length; i < len; i++) {
        extension = allowedExtensions[i];
        if (extension === fileExtension) {
          return true;
        }
      }
      return false;
    };
    $scope.$on('fileSelected', function(event, args) {
      return $scope.$apply(function() {
        console.log(args.files);
        if ($scope.validateFile(args.files[0].name)) {
          $scope.customFile = args.files[0];
          return $scope.uploadFile();
        }
      });
    });
    $scope.uploadFile = function() {
      var file, formData;
      file = $scope.customFile;
      if (file) {
        formData = new FormData();
        formData.append('file', file);
        return $http.post('/product/saveTempImage', formData, {
          transformRequest: angular.identity,
          headers: {
            'Content-type': void 0
          }
        }).success(function(data) {
          $scope.images = [data];
          $scope.product.croppedImage = null;
          $scope.product.selectedImage = data;
          $scope.product.selectedImage.ourSrc = data.src;
          $scope.customFile = null;
          return $scope.step = 3;
        }).error(function() {
          $scope.customFile = null;
          return alert('Bohužel se nám nepodařilo zpracovat nahrané foto, zkuste to prosím znovu.');
        });
      }
    };
    $scope.finishCropping = function() {
      $scope.croppFinished = true;
      $scope.step = 4;
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
        $scope.product.selectedImage.ourSrc = data.src;
        return $scope.step = 3;
      });
    };
    $scope.getProduct = function() {
      $scope.loadingImages = true;
      return $http.get('/products/getInfo?url=' + encodeURIComponent($scope.url)).success(function(data) {
        $scope.product = {
          name: data.title,
          images: data.images
        };
        $scope.product.tags = [];
        $scope.product.categories = [];
        $scope.step = 2;
        return $scope.loadingImages = false;
      });
    };
    return $scope.submit = function() {
      var categories, category, i, j, k, len, len1, len2, product, ref, ref1, ref2, tag, value;
      product = {
        name: $scope.product.name,
        vendor: $scope.product.vendor,
        price: $scope.product.price,
        description: $scope.product.description,
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
    var dataUrl, page, parseProducts;
    $scope.products = [];
    $scope.boxes = [];
    $scope.switchType = {
      product: null,
      style: {
        left: 0,
        top: 0
      },
      show: function(product, $event) {
        $scope.switchType.style.left = $event.pageX + 'px';
        $scope.switchType.style.top = $event.pageY + 'px';
        return $scope.switchType.product = product;
      },
      "switch": function(box) {
        var product;
        if (!$scope.switchType.product) {
          return false;
        }
        product = $scope.switchType.product;
        return $http.get('/product/' + product.id + '/toBox?box=' + box.id).success(function(product) {
          var i, key, len, oldProduct, pos, ref;
          pos = -1;
          ref = $scope.products;
          for (key = i = 0, len = ref.length; i < len; key = ++i) {
            oldProduct = ref[key];
            if (oldProduct.id === product.id) {
              pos = key;
            }
          }
          if (key !== -1) {
            $scope.products[pos] = product;
          } else {
            $scope.products.push(product);
          }
          return $scope.switchType.product = null;
        });
      }
    };
    page = 0;
    dataUrl = '/products';
    parseProducts = function(products) {
      var i, j, k, landscapeProducts, len, len1, len2, parsedProducts, portraitProducts, product, squareProducts;
      parsedProducts = [];
      squareProducts = products.filter(function(item) {
        return item.layout === 'square';
      });
      landscapeProducts = products.filter(function(item) {
        return item.layout === 'landscape';
      });
      portraitProducts = products.filter(function(item) {
        return item.layout === 'portrait';
      });
      for (i = 0, len = landscapeProducts.length; i < len; i++) {
        product = landscapeProducts[i];
        parsedProducts.push(product);
        if (portraitProducts.length > 1) {
          parsedProducts.push(portraitProducts.pop());
          parsedProducts.push(portraitProducts.pop());
        } else if (squareProducts.length > 1) {
          parsedProducts.push(squareProducts.pop());
          parsedProducts.push(squareProducts.pop());
        }
      }
      for (j = 0, len1 = portraitProducts.length; j < len1; j++) {
        product = portraitProducts[j];
        parsedProducts.push(product);
        if (squareProducts.length > 2) {
          parsedProducts.push(squareProducts.pop());
          parsedProducts.push(squareProducts.pop());
        }
      }
      for (k = 0, len2 = squareProducts.length; k < len2; k++) {
        product = squareProducts[k];
        parsedProducts.push(product);
      }
      return parsedProducts;
    };
    $scope.getNextPage = function() {
      var query;
      $scope.loadingImages = true;
      query = window.location.search.substring(1);
      return $http.get(dataUrl + (page ? '?page=' + page : '?') + query).success(function(data) {
        $scope.products = $scope.products.concat(parseProducts(data.products));
        $scope.loadingImages = false;
        return page++;
      });
    };
    $scope.init = function() {
      var isUser, path;
      path = window.location.pathname;
      isUser = path.indexOf('user') !== -1 || path.indexOf('profile') !== -1;
      if (isUser) {
        dataUrl = path + '/products';
      }
      $scope.getNextPage();
      return $http.get('/boxes').success(function(data) {
        $scope.boxes = data.map(function(item) {
          item.large = item.name.length > 12;
          if (item.large && item.name.length > 28) {
            item.name = item.name.substr(0, 24) + '...';
          }
          return item;
        });
        return $scope.boxes.sort(function(a, b) {
          if (a.large && !b.large) {
            return 1;
          } else if (!a.large && b.large) {
            return -1;
          } else {
            return 1;
          }
        });
      });
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
      if (product.color) {
        classes.push('corner ' + product.color);
      }
      classes.push(product.layout);
      return classes.join(' ');
    };
    $scope.iWantThis = function(product, $event) {
      return $http.get('/product/' + product.id + '/like?ajax=1').success(function(data) {
        product.color = data.color;
        return product.liked = true;
      });
    };
    $scope.iDontWantThis = function(product, $event) {
      return $http.get('/product/' + product.id + '/dislike?ajax=1').success(function() {
        product.color = data.color;
        product.liked = false;
        return product.owned = false;
      });
    };
    $scope.iHaveThis = function(product, $event) {
      return $http.get('/product/' + product.id + '/own?ajax=1').success(function() {
        product.color = data.color;
        product.liked = true;
        return product.owned = true;
      });
    };
    $scope.iDontHaveThis = function(product, $event) {
      return $http.get('/product/' + product.id + '/disown?ajax=1').success(function() {
        product.color = data.color;
        return product.owned = false;
      });
    };
    $scope.$on("scrolledToBottom", function() {
      if (page !== 0) {
        return $scope.getNextPage();
      }
    });
    $scope.$on("drop", function(event, data) {
      var box, dragProduct;
      dragProduct = data.drag;
      box = data.drop;
      return $http.get('/product/' + dragProduct.id + '/toBox?box=' + box.id).success(function(product) {
        var i, key, len, oldProduct, pos, ref;
        pos = -1;
        ref = $scope.products;
        for (key = i = 0, len = ref.length; i < len; key = ++i) {
          oldProduct = ref[key];
          if (oldProduct.id === product.id) {
            pos = key;
          }
        }
        if (key !== -1) {
          return $scope.products[pos] = product;
        } else {
          return $scope.products.push(product);
        }
      });
    });
    $scope.byColor = function(item) {
      if ($scope.$parent.activeColor) {
        return item.color === $scope.$parent.activeColor;
      } else {
        return true;
      }
    };
    return $scope.init();
  }
]);

app.controller('BoxesController', [
  '$scope', '$http', function($scope, $http) {
    $scope.boxes = [];
    $http.get('/boxes').success(function(data) {
      $scope.boxes = data.map(function(item) {
        item.large = item.name.length > 12;
        if (item.large && item.name.length > 28) {
          item.name = item.name.substr(0, 24) + '...';
        }
        return item;
      });
      return $scope.boxes.sort(function(a, b) {
        if (a.large && !b.large) {
          return 1;
        } else if (!a.large && b.large) {
          return -1;
        } else {
          return 1;
        }
      });
    });
    $scope.addBox = function() {
      var $base;
      $base = $scope.$parent.$parent;
      $base.modalController.box.init(function(box) {
        return $http.post('/boxes/create', box).success(function(box) {
          $scope.boxes.push(box);
          return $scope.modalController.close();
        });
      });
      return $base.showModal('edit-box');
    };
    $scope.editBoxes = function() {
      var $base;
      $base = $scope.$parent.$parent;
      $base.modalController.boxes.init(function(boxes) {
        $scope.boxes = boxes;
        return $scope.modalController.close();
      }, $scope.boxes);
      return $base.showModal('boxes');
    };
    $scope.isLarge = function(name) {
      return name.length > 12;
    };
    return $scope.$on("reachedBoxesLimit", function(event, data) {
      if (data.type === 'over') {
        return $scope.scrollClass = 'scrolling';
      } else {
        return $scope.scrollClass = '';
      }
    });
  }
]);
