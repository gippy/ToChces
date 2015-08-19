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
