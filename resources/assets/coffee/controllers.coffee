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

	$scope.$on "reachedMenuLimit", (event, data) ->
		if data.type is "over" then $scope.scrollClass = 'scrolling'
		else $scope.scrollClass = ''

	$scope.scrollClass = ''

	$scope.$parent.navigationController = $scope
]

app.controller 'PageController', ['$scope', '$http', ($scope, $http) ->
	$scope.$parent.pageController = $scope
	$scope.draggableProducts =
		drop: (draggedItem, dropedItem) ->
			$scope.$broadcast "drop", {
				drag: draggedItem
				drop: dropedItem
		}
]

app.controller 'ModalController', ['$scope', '$http', '$sce', ($scope, $http, $sce)->
	$scope.stack = []
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

	$scope.box =
		id: null
		name: null
		color: 'red'
		remove: false
		removeContents: false
		callback: null

		confirmMessage: null
		confirmCb: null

		init: (cb, box) ->
			$scope.box.callback = cb
			if box
				$scope.box.id = box.id
				$scope.box.name = box.name
				$scope.box.color = box.color
				$scope.box.remove = $scope.box.removeContents = false

		save: () ->
			if $scope.box.remove
				$scope.box.confirmMessage = 'Opravdu chcete smazat tento seznam?'
				$scope.box.confirmCb = () ->
					if $scope.box.callback then $scope.box.callback($scope.box)
			else if $scope.box.removeContents
				$scope.box.confirmMessage = 'Opravdu chcete smazat obsah tohoto seznamu?'
				$scope.box.confirmCb = () ->
					if $scope.box.callback then $scope.box.callback($scope.box)
			else if $scope.box.callback then $scope.box.callback($scope.box)

		confirm: () ->
			$scope.box.confirmCb()
			$scope.box.cleanConfirmation()

		cleanConfirmation: () ->
			$scope.box.confirmMessage = null
			$scope.box.confirmCb = null

	$scope.boxes =
		boxes: null
		callback: null
		mergeCb: null
		removeCb: null
		removeContentsCb: null

		confirmMessage: ''
		confirmCb: null

		mergeFrom: null
		mergeTo: null

		init: (cb, boxes) ->
			$scope.boxes.callback = cb
			$scope.boxes.boxes = boxes

		showEdit: (box) ->
			$scope.box.init($scope.boxes.edit, box)
			$scope.open 'edit-box'

		edit: (box) ->
			if box.remove then $scope.boxes.remove(box)
			else $http.post('/boxes/update', box).success (box)->
				position = -1
				position = key for existingBox, key in $scope.boxes.boxes when box.id is existingBox.id
				if position != -1
					$scope.boxes.boxes[position].name = box.name
					$scope.boxes.boxes[position].color = box.color
				if $scope.boxes.callback then $scope.boxes.callback($scope.boxes.boxes)

			if box.removeContents then $scope.boxes.removeContents(box)
			$scope.close()

		merge: (from, to) ->
			$scope.$apply ()->
				$scope.boxes.confirmMessage = 'Opravdu chcete sloucit obsah z "' + from.name + '" do "' + to.name + '"?';
				$scope.boxes.mergeFrom = from
				$scope.boxes.mergeTo = to
				$scope.boxes.confirmCb = () ->
					$http.get('/boxes/merge?from='+$scope.boxes.mergeFrom.id+'&to='+$scope.boxes.mergeTo.id).success (data)->
						window.location.reload()

		remove: (box) ->
			$http.get('/boxes/remove?box='+box.id).success ()->
				window.location.reload()

		removeLocalBox: (box) ->
			position = -1
			position = key for item, key in $scope.boxes when item.id is box.id
			if position != -1 then $scope.boxes.splice(position, 1)

		removeContents: (box) ->
			$http.get('/boxes/removeContents?box='+box.id).success ()-> window.location.reload()

		confirm: () ->
			$scope.boxes.confirmCb()
			$scope.boxes.cleanConfirmation()

		cleanConfirmation: () ->
			$scope.boxes.confirmMessage = ''
			$scope.boxes.confirmCb = null

		drop: (from, to) -> $scope.boxes.merge(from, to)

	getModal = (type, cb) ->
		$scope.url = '/modal/' + type
		cb()

	$scope.isVisible = () -> return $scope.visible

	$scope.close = () ->
		$scope.stack.pop()
		if $scope.stack.length then $scope.open $scope.stack.pop()
		else $scope.visible = false

	$scope.open = (type) ->
		$scope.stack.push type
		getModal type, () ->
			$scope.type = type
			$scope.visible = true

	$scope.$parent.modalController = $scope
]

app.controller 'AddProductController', ['$scope', '$http', '$sce', ($scope, $http, $sce)->
	$scope.step = 1;
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
				$scope.step = 3
			.error () ->
				$scope.customFile = null
				alert('Bohužel se nám nepodařilo zpracovat nahrané foto, zkuste to prosím znovu.');

	$scope.finishCropping = () ->
		$scope.croppFinished = true
		$scope.step = 4
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
			$scope.step = 3

	$scope.getProduct = () ->
		$scope.loadingImages = true
		$http.get( '/products/getInfo?url=' + encodeURIComponent($scope.url)  ).success (data) ->
			$scope.product = {
				name: data.title,
				images: data.images
			}
			$scope.product.tags = []
			$scope.product.categories = []
			$scope.step = 2
			$scope.loadingImages = false

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
		$scope.loadingImages = true
		query = window.location.search.substring(1)
		$http.get(dataUrl + (if page then '?page='+page else '?' ) + query).success (data) ->
			$scope.products = $scope.products.concat(data.products)
			$scope.loadingImages = false
			page++

	$scope.init = () ->
		path = window.location.pathname;
		isUser = path.indexOf('user') != -1 or path.indexOf('profile') != -1
		if isUser then dataUrl = path + '/products'
		$scope.getNextPage()

	$scope.getClasses = (product) ->
		classes = []
		if product.liked then classes.push 'liked'
		if product.owned then classes.push 'owned'
		if product.color then classes.push 'corner ' + product.color

		classes.push product.layout

		return classes.join ' '

	$scope.iWantThis = (product, $event) ->
		$http.get('/product/'+product.id+'/like?ajax=1').success (data) ->
			product.color = data.color
			product.liked = true

	$scope.iDontWantThis = (product, $event) ->
		$http.get('/product/'+product.id+'/dislike?ajax=1').success () ->
			product.color = data.color
			product.liked = false
			product.owned = false

	$scope.iHaveThis = (product, $event) ->
		$http.get('/product/'+product.id+'/own?ajax=1').success () ->
			product.color = data.color
			product.liked = true
			product.owned = true
	$scope.iDontHaveThis = (product, $event) ->
		$http.get('/product/'+product.id+'/disown?ajax=1').success () ->
			product.color = data.color
			product.owned = false

	$scope.$on "scrolledToBottom", () ->
		if page != 0 then $scope.getNextPage()

	$scope.$on "drop", (event, data) ->
		dragProduct = data.drag
		box = data.drop
		$http.get('/product/'+dragProduct.id+'/toBox?box='+box.id).success (product) ->
			pos = -1
			pos = key for oldProduct, key in $scope.products when oldProduct.id is product.id
			if key != -1 then	$scope.products[pos] = product
			else $scope.products.push product

	$scope.init();

]

app.controller 'BoxesController', ['$scope', '$http', ($scope, $http) ->
	$scope.boxes = []

	$http.get('/boxes').success (data) -> $scope.boxes = data

	$scope.addBox = () ->
		$base = $scope.$parent.$parent
		$base.modalController.box.init (box) ->
			$http.post('/boxes/create', box).success (box)->
				$scope.boxes.push box
				$scope.modalController.close()

		$base.showModal('edit-box')

	$scope.editBoxes = () ->
		$base = $scope.$parent.$parent
		$base.modalController.boxes.init(
				(boxes) ->
					$scope.boxes = boxes
					$scope.modalController.close()
				$scope.boxes
		)
		$base.showModal('boxes')

	$scope.$on "reachedBoxesLimit", (event, data) ->
		if data.type is 'over' then $scope.scrollClass = 'scrolling'
		else $scope.scrollClass = ''


]