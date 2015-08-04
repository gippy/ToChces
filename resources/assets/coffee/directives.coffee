app.directive 'productImageOption', () ->
	return {
		restrict: 'AE',
		require: 'ngModel',
		link: (scope, elem, attr, model) ->

			loadSize = () ->
				w = elem.width()
				h = elem.height()
				viewValue = model.$viewValue
				viewValue.width = w
				viewValue.height = h
				if h < w then viewValue.type = 'landscape'
				else if w < h then viewValue.type = 'portrait'
				else viewValue.type = 'square'

				ratio = h / 286
				width = w * ratio

				viewValue.class="product-image option"
				if width < 286 then viewValue.class += ' ' + 'hidden'

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


