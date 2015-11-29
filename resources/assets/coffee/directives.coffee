app.directive 'productImageOption', () ->
	return {
		restrict: 'AE',
		require: 'ngModel',
		link: (scope, elem, attr, model) ->

			loadSize = () ->
				img = new Image()
				img.src = model.$viewValue.src
				w = img.width
				h = img.height

				viewValue = model.$viewValue
				viewValue.width = w
				viewValue.height = h

				ratio = viewValue.ratio = if w > h then w/h else h/w

				if h < w and ratio > 1.5 and w >= 584 and h >= 286
					viewValue.type = 'landscape'
				else if w < h and ratio > 1.5 and w >= 286 and h >= 584
					viewValue.type = 'portrait'
				else
					if w > h and ( w < 200 or (h * ratio) < 200 ) then viewValue.type = 'hidden'
					else if h > w and ( h < 200 or (w * ratio) < 200 ) then viewValue.type = 'hidden'
					else if w is h and w < 200 then viewValue.type = 'hidden'
					else viewValue.type = 'square'

				viewValue.class="product-image option " + viewValue.type

				model.$setViewValue(viewValue);

			if elem.width() then loadSize()
			else elem.on 'load', loadSize

			elem.bind 'error', () ->
				viewValue = model.$viewValue
				viewValue.class="product-image hidden"

				model.$setViewValue(viewValue);
	}

app.directive 'scrollOver', ($window, $document) -> return {
	restrict: 'A'
	link: (scope, element, attrs) ->
		windowElement = angular.element($window)
		lastPosition = null
		lastCurrPosition = null

		menuLimit = 50
		boxesLimit = 300
		bottomLimit = 50

		handler = () ->
			position = windowElement.scrollTop()
			if position >= menuLimit and lastPosition < menuLimit
				scope.$broadcast 'reachedMenuLimit', {type: "over", position: position}
			else if position < menuLimit and lastPosition >= menuLimit
				scope.$broadcast 'reachedMenuLimit', {type: "under", position: position}
			if position >= boxesLimit and lastPosition < boxesLimit
				scope.$broadcast 'reachedBoxesLimit', {type: "over", position: position}
			else if position < boxesLimit and lastPosition >= boxesLimit
				scope.$broadcast 'reachedBoxesLimit', {type: "under", position: position}
			lastPosition = position

			currPosition = position + windowElement.height()
			limit = $document.height() - bottomLimit
			if currPosition > limit and lastCurrPosition <= limit then scope.$broadcast "scrolledToBottom", {}
			lastCurrPosition = currPosition

		windowElement.on 'scroll', scope.$apply.bind(scope, handler)
		handler()

}

app.directive 'fileField', () -> {
	scope: true
	link: (scope, element, attrs) ->
		element.bind 'change', (event) ->
			files = event.target.files
			if files.length then scope.$emit "fileSelected", {files: files}
}

app.directive 'drag', () -> {
scope:
	topScope: "="
require: 'ngModel',

link: (scope, element, attrs, model) ->
	element.attr('draggable', true)

	element.bind 'dragstart', (event) ->
		event.originalEvent.dataTransfer.effectAllowed = "link";
		scope.topScope.dragModel = model
		$('body').addClass('dragging')

	element.bind 'dragend', () ->
		if !scope.topScope.droping then scope.topScope.dragModel = null
		$('body').removeClass('dragging')
}

app.directive 'drop', () -> {
	scope:
		topScope: "="
	require: 'ngModel',

	link: (scope, element, attrs, model) ->
		element.attr('draggable', true)
		element.bind 'dragover', (event) -> event.preventDefault()

		element.bind 'dragenter', (event) ->
			event.preventDefault()
			event.originalEvent.dataTransfer.dropEffect = "link";
			scope.topScope.dropModel = model

		element.bind 'dragleave', () ->
			scope.topScope.dropModel = null

		element.bind 'drop', () ->
			scope.topScope.droping = true
			scope.topScope.drop(scope.topScope.dragModel.$viewValue, scope.topScope.dropModel.$viewValue)
			scope.topScope.dragModel = null
			scope.topScope.dropModel = null
			scope.topScope.droping = false
}


