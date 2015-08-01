app.directive 'imgCrop', [
	'$timeout'
	'cropHost'
	'cropPubSub'
	($timeout, CropHost, CropPubSub) ->
		{
		restrict: 'A'
		scope:
			image: '='
			resultImage: '='
			changeOnFly: '='
			areaType: '@'
			areaMinSize: '='
			resultImageSize: '='
			resultImageFormat: '@'
			resultImageQuality: '='
			onChange: '&'
			onLoadBegin: '&'
			onLoadDone: '&'
			onLoadError: '&'
		template: '<canvas></canvas>'
		controller: [
			'$scope'
			($scope) ->
				$scope.events = new CropPubSub
				return
		]
		link: (scope, element) ->
			# Init Events Manager
			events = scope.events
			# Init Crop Host
			cropHost = new CropHost(element.find('canvas'), {}, events)
			# Store Result Image to check if it's changed
			storedResultImage = undefined

			updateResultImage = (scope) ->
				resultImage = cropHost.getResultImageDataURI()
				if storedResultImage != resultImage
					storedResultImage = resultImage
					if angular.isDefined(scope.resultImage)
						scope.resultImage = resultImage
					scope.onChange $dataURI: scope.resultImage

			# Wrapper to safely exec functions within $apply on a running $digest cycle

			fnSafeApply = (fn) ->
				->
					$timeout ->
						scope.$apply (scope) ->
							fn scope

			# Setup CropHost Event Handlers
			events.on('load-start', fnSafeApply((scope) ->
				scope.onLoadBegin {}
				return
			)).on('load-done', fnSafeApply((scope) ->
				scope.onLoadDone {}
				return
			)).on('load-error', fnSafeApply((scope) ->
				scope.onLoadError {}
				return
			)).on('area-move area-resize', fnSafeApply((scope) ->
				if ! !scope.changeOnFly
					updateResultImage scope
				return
			)).on 'area-move-end area-resize-end image-updated', fnSafeApply((scope) ->
				updateResultImage scope
				return
			)
			# Sync CropHost with Directive's options
			scope.$watch 'image', ->
				console.log scope.image
				cropHost.setNewImageSource scope.image
				return
			scope.$watch 'areaType', ->
				cropHost.setAreaType scope.areaType
				updateResultImage scope
				return
			scope.$watch 'areaMinSize', ->
				cropHost.setAreaMinSize scope.areaMinSize
				updateResultImage scope
				return
			scope.$watch 'resultImageSize', ->
				cropHost.setResultImageSize scope.resultImageSize
				updateResultImage scope
				return
			scope.$watch 'resultImageFormat', ->
				cropHost.setResultImageFormat scope.resultImageFormat
				updateResultImage scope
				return
			scope.$watch 'resultImageQuality', ->
				cropHost.setResultImageQuality scope.resultImageQuality
				updateResultImage scope
				return

			# Update CropHost dimensions when the directive element is resized
			scope.$watch (->
				[
					element[0].clientWidth
					element[0].clientHeight
				]
			), ((value) ->
				cropHost.setMaxDimensions value[0], value[1]
				updateResultImage scope
				return
			), true

			# Destroy CropHost Instance when the directive is destroying
			scope.$on '$destroy', ->
				cropHost.destroy()
				return
			return

		}
]