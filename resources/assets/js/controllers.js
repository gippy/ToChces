app.controller('BodyController', [
  '$scope', function($scope) {
    $scope.navigationController = null;
    $scope.pageController = null;
    $scope.modalController = null;
    $scope.isModalVisible = function() {
      return $scope.modalController && $scope.modalController.isVisible();
    };
    return $scope.showModal = function(type) {
      if ($scope.modalController) {
        return $scope.modalController.open(type);
      }
    };
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
    var getModal, modals;
    modals = {};
    $scope.visible = false;
    $scope.content = '';
    $scope.type = '';
    getModal = function(type, cb) {
      return $http.get('/modal/' + type).success(function(html) {
        return cb($sce.trustAsHtml(html));
      });
    };
    $scope.isVisible = function() {
      return $scope.visible;
    };
    $scope.close = function() {
      return $scope.visible = false;
    };
    $scope.open = function(type) {
      if (modals.hasOwnProperty(type)) {
        $scope.content = modals[type];
        $scope.type = type;
        return $scope.visible = true;
      } else {
        return getModal(type, function(content) {
          modals[type] = content;
          return $scope.open(type);
        });
      }
    };
    return $scope.$parent.modalController = $scope;
  }
]);

app.controller('AddProductController', [
  '$scope', '$http', '$sce', function($scope, $http, $sce) {
    $scope.url = '';
    $scope.product = {
      name: '',
      images: ''
    };
    $scope.getImage = function(image) {
      $scope.product.selectedImage = image;
      $scope.product.croppedImage = '';
      return $http.get('/products/getImage?url=' + image.src).success(function(data) {
        $scope.product.selectedImage.ourSrc = data.src;
        return console.log($scope.product.selectedImage);
      });
    };
    $scope.getProduct = function() {
      return $http.get('/products/getInfo?url=' + $scope.url).success(function(data) {
        return $scope.product = data.product;
      });
    };
    return $scope.submit = function() {
      var product;
      product = {
        name: $scope.product.name,
        vendor: $scope.product.vendor,
        price: $scope.product.price,
        url: $scope.url,
        image: $scope.product.croppedImage
      };
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
      return $http.get(dataUrl + (page ? '?page=' + page : '')).success(function(data) {
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
      return classes.join(' ');
    };
    $scope.iWantThis = function(product, $event) {
      return $http.get('/product/' + product.id + '/like').success(function() {
        return product.liked = true;
      });
    };
    $scope.iHaveThis = function(product, $event) {
      return $http.get('/product/' + product.id + '/own').success(function() {
        return product.owned = product.liked = true;
      });
    };
    return $scope.init();
  }
]);
