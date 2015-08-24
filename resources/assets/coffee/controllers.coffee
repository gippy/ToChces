app.controller 'BodyController', ['$scope', '$http', ($scope, $http)->
	$scope.navigationController = null
	$scope.pageController = null
	$scope.modalController = null

	$scope.categories = []

	$scope.isModalVisible = () -> $scope.modalController and $scope.modalController.isVisible()
	$scope.showModal = (type) -> if $scope.modalController then $scope.modalController.open(type)

	$scope.hasActiveCategory = () ->
		if !$scope.categories.length then return false
		return true for category in $scope.categories when category.is_active
		return false

	$scope.deselectCategories = () ->
		if $scope.hasActiveCategory
			category.is_active = false for category in $scope.categories

	$scope.saveCategories = () ->
		categories = []
		categories.push category.id for category in $scope.categories when category.is_active
		window.location = '/categories/save?ids='+categories.join(',')

	$http.get('/categories').success (categories) -> $scope.categories = categories
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
	$scope.visible = false
	$scope.content = ''
	$scope.type = ''
	$scope.url = ''

	$scope.login =
		email: ''
		password: ''
		submit: ()->
			if !$scope.login.password.$invalid and !$scope.login.email.$invalid
				$http.post('/auth/login', {
					email: $scope.login.email,
					password: $scope.login.password
				}).success((data)->
					alert(data.success)
				).error((data) ->
					error = if data and data.error then data.error else 'Přihlášení se nepodařilo, zkuste to prosím znovu'
					alert error
				)

	$scope.register =
		email: ''
		name: ''
		password: ''
		confirmation: ''
		submit: ()->
			emailValid = !$scope.register.email.$invalid
			nameValid = !$scope.register.name.$invalid
			passwordValid = !$scope.register.password.$invalid and $scope.register.password is $scope.register.confirmation
			if emailValid and nameValid and passwordValid
				$http.post('/auth/register', {
					name: $scope.register.name,
					email: $scope.register.email,
					password: $scope.register.password
					confirmation: $scope.register.confirmation
				}).success((data)->
					alert(data.success)
				).error((data) ->
					alert(data.error)
				)

	getModal = (type, cb) ->
		$scope.url = '/modal/' + type
		cb()

	$scope.isVisible = () -> return $scope.visible
	$scope.close = () -> $scope.visible = false
	$scope.open = (type) ->
		if $scope.visible then $scope.close()
		getModal type, () ->
			$scope.type = type
			$scope.visible = true

	$scope.$parent.modalController = $scope
]

app.controller 'AddProductController', ['$scope', '$http', '$sce', ($scope, $http, $sce)->
	$scope.url = ''
	$scope.product = {
		name: ''
		images: ''
		tags: []
		categories: []
		finalSrc: ''
	}
	$scope.croppFinished = false
	$scope.customFile = null

	$scope.validateFile =  (fileName) ->
		allowedExtensions = ["jpg",'jpeg', "png"]
		fileExtension = fileName.split('.').pop()
		return true for extension in allowedExtensions when extension is fileExtension
		return false

	$scope.$on 'fileSelected', (event, args) ->
		$scope.$apply () ->
			console.log args.files
			if $scope.validateFile(args.files[0].name)
				$scope.customFile = args.files[0]
				$scope.uploadFile()

	$scope.uploadFile = () ->
		file = $scope.customFile
		if file
			formData = new FormData()
			formData.append 'file', file
			$http.post('/product/saveTempImage', formData, {
				transformRequest: angular.identity
				headers: {'Content-type': undefined}
			})
			.success (data) ->
				$scope.images = [data]
				$scope.product.croppedImage = null
				$scope.product.selectedImage = data
				$scope.product.selectedImage.ourSrc = data.src
				$scope.customFile = null
			.error () ->
				$scope.customFile = null
				alert('Bohužel se nám nepodařilo zpracovat nahrané foto, zkuste to prosím znovu.');

	$scope.finishCropping = () ->
		$scope.croppFinished = true
		$scope.product.finalSrc = $scope.product.croppedImage

	$scope.sizeAndType = (image) ->
		if image.type == 'hidden' then return  1000
		modifier = if image.contentType is "image/png" then 100 else 1
		ratio = if image.ratio then image.ratio else 1
		return ratio * modifier

	$scope.getImage = (image) ->
		$scope.product.selectedImage = image
		$scope.product.croppedImage = ''
		$http.get( '/products/getImage?url=' + encodeURIComponent(image.src) ).success (data) ->
			$scope.product.selectedImage.ourSrc = data.src

	$scope.getProduct = () ->
		$http.get( '/products/getInfo?url=' + encodeURIComponent($scope.url)  ).success (data) ->
			$scope.product = {
				name: data.title,
				images: data.images
			}
			$scope.product.tags = []
			$scope.product.categories = []

	$scope.submit = () ->
		product =
			name: $scope.product.name
			vendor: $scope.product.vendor
			price: $scope.product.price
			url: $scope.url
			image: $scope.product.finalSrc
			layout: $scope.product.selectedImage.type
			tags: []

		categories = {}
		categories[category.id] = category for category in $scope.$parent.categories

		product.tags.push categories[category].name for value, category in $scope.product.categories when value

		product.tags.push tag.text for tag in $scope.product.tags


		$http.post('/add', product).success (data) -> window.location = data.path

]

app.controller 'ProductsController', ['$scope', '$http', '$sce', ($scope, $http) ->
	$scope.products = []

	page = 0
	dataUrl = '/products'

	$scope.getNextPage = () ->
		query = window.location.search.substring(1)
		$http.get(dataUrl + (if page then '?page='+page else '?' ) + query).success (data) ->
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

		classes.push product.layout

		return classes.join ' '

	$scope.iWantThis = (product, $event) ->
		$http.get('/product/'+product.id+'/like').success () -> product.liked = true
	$scope.iDontWantThis = (product, $event) ->
		$http.get('/product/'+product.id+'/dislike').success () -> product.liked = product.owned = true
	$scope.iHaveThis = (product, $event) ->
		$http.get('/product/'+product.id+'/own').success () -> product.owned = product.liked = true
	$scope.iDontHaveThis = (product, $event) ->
		$http.get('/product/'+product.id+'/disown').success () -> product.owned = false

	$scope.init();

]