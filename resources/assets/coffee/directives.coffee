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
	scope:
		limit: '@'
		onChange: '&'
	link: (scope, element, attrs) ->
		scope.overScroll = false

		windowElement = angular.element($window)
		timeout = null
		lastPosition = null

		handler = () ->
			position = windowElement.scrollTop()
			if scope.overScroll and position < scope.limit
				scope.overScroll = false
				scope.onChange()
			else if !scope.overScroll and position > scope.limit
				scope.overScroll = true
				scope.onChange()

			currPosition = position + windowElement.height()
			if currPosition > $document.height() - 50
				if currPosition > lastPosition
					lastPosition = currPosition
					window.clearTimeout(timeout)
					timeout = window.setTimeout(
						() ->
							scope.$emit "scrolledToBottom", {}
							console.log 'bottom'
						, 1000
					)

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


