app.controller 'BodyController', ['$scope', ($scope)->
	$scope.navigationController = null
	$scope.pageController = null
	$scope.modalController = null

	$scope.isModalVisible = () -> $scope.modalController and $scope.modalController.isVisible()
	$scope.showModal = (type) -> if $scope.modalController then $scope.modalController.open(type)
]

app.controller 'NavigationController', ['$scope', ($scope) ->
	$scope.showCategories = () -> $scope.$parent.showModal('categories')
	$scope.showSignIn = () -> $scope.$parent.showModal('login')
	$scope.showRegister = () -> $scope.$parent.showModal('register')
	$scope.showProfile = () -> $scope.$parent.showModal('profile')

	$scope.scrollClass = ''
	$scope.scrollChanged = () -> $scope.scrollClass = if $scope.scrollClass then '' else 'scrolling'

	$scope.$parent.navigationController = $scope
]

app.controller 'PageController', ['$scope', '$http', ($scope, $http) ->
	$scope.$parent.pageController = $scope
]

app.controller 'ModalController', ['$scope', '$http', '$sce', ($scope, $http, $sce)->
	modals = {}

	$scope.visible = false
	$scope.content = ''
	$scope.type = ''

	getModal = (type, cb) -> $http.get( '/modal/' + type ).success (html) -> cb $sce.trustAsHtml(html)

	$scope.isVisible = () -> return $scope.visible
	$scope.close = () -> $scope.visible = false
	$scope.open = (type) ->
		if modals.hasOwnProperty(type)
			$scope.content = modals[type]
			$scope.type = type
			$scope.visible = true
		else
			getModal type, (content) ->
				modals[type] = content
				$scope.open(type)

	$scope.$parent.modalController = $scope
]

app.controller 'AddProductController', ['$scope', '$http', '$sce', ($scope, $http, $sce)->
	$scope.url = ''
	$scope.product = {
		name: ''
		images: ''
	}

	$scope.getImage = (image) ->
		$scope.product.selectedImage = image
		$scope.product.croppedImage = ''
		$http.get( '/products/getImage?url=' + image.src ).success (data) ->
			$scope.product.selectedImage.ourSrc = data.src
			console.log $scope.product.selectedImage

	$scope.getProduct = () ->
		$http.get( '/products/getInfo?url=' + $scope.url  ).success (data) ->
			$scope.product = data.product;

	$scope.submit = () ->
		product =
			name: $scope.product.name
			vendor: $scope.product.vendor
			price: $scope.product.price
			url: $scope.url
			image: $scope.product.croppedImage

		$http.post('/add', product).success (data) -> window.location = data.path

]

app.controller 'ProductsController', ['$scope', '$http', '$sce', ($scope, $http) ->
	$scope.products = []

	page = 0
	dataUrl = '/products'

	$scope.getNextPage = () ->
		$http.get(dataUrl + (if page then '?page='+page else '' )).success (data) ->
			$scope.products = $scope.products.concat(data.products)

	$scope.init = () ->
		path = window.location.pathname;
		isUser = path.indexOf('user') != -1 or path.indexOf('profile') != -1
		if isUser then dataUrl = path + '/products'
		$scope.getNextPage()

	$scope.getClasses = (product) ->
		classes = []
		if product.liked then classes.push 'liked'
		if product.owned then classes.push 'owned'
		return classes.join ' '

	$scope.iWantThis = (product, $event) ->
		$http.get('/product/'+product.id+'/like').success () -> product.liked = true
	$scope.iHaveThis = (product, $event) ->
		$http.get('/product/'+product.id+'/own').success () -> product.owned = product.liked = true

	$scope.init();

]