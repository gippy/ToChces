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
					if w > h and ( w < 286 or (h * ratio) < 286 ) then viewValue.type = 'hidden'
					else if h > w and ( h < 286 or (w * ratio) ) then viewValue.type = 'hidden'
					else if w is h and w < 286 then viewValue.type = 'hidden'
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

app.directive 'scrollOver', ($window) -> return {
	restrict: 'A'
	scope:
		limit: '@'
		onChange: '&'
	link: (scope, element, attrs) ->
		scope.overScroll = false

		windowElement = angular.element($window)

		handler = () ->
			position = windowElement.scrollTop()
			if scope.overScroll and position < scope.limit
				scope.overScroll = false
				scope.onChange()
			else if !scope.overScroll and position > scope.limit
				scope.overScroll = true
				scope.onChange()

		windowElement.on 'scroll', scope.$apply.bind(scope, handler)
		handler()

}


