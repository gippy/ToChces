app.factory 'cropHost', [
	'$document'
	'cropAreaPortrait'
	'cropAreaSquare'
	'cropAreaLandscape'
	'cropEXIF'
	($document, CropAreaPortrait, CropAreaSquare, CropAreaLandscape, cropEXIF) ->

		### STATIC FUNCTIONS ###

		# Get Element's Offset

		getElementOffset = (elem) ->
			box = elem.getBoundingClientRect()
			body = document.body
			docElem = document.documentElement
			scrollTop = window.pageYOffset or docElem.scrollTop or body.scrollTop
			scrollLeft = window.pageXOffset or docElem.scrollLeft or body.scrollLeft
			clientTop = docElem.clientTop or body.clientTop or 0
			clientLeft = docElem.clientLeft or body.clientLeft or 0
			top = box.top + scrollTop - clientTop
			left = box.left + scrollLeft - clientLeft
			{
				top: Math.round(top)
				left: Math.round(left)
			}

		(elCanvas, opts, events) ->

			### PRIVATE VARIABLES ###

			# Object Pointers
			ctx = null
			image = null
			theArea = null
			# Dimensions
			minCanvasDims = [
				286
				286
			]
			maxCanvasDims = [
				589
				589
			]
			# Result Image size
			resImgSize = 200
			# Result Image type
			resImgFormat = 'image/png'
			# Result Image quality
			resImgQuality = null
			# Resets CropHost

			resetCropHost = ->
				if image != null
					theArea.setImage image
					imageDims = [
						image.width
						image.height
					]
					imageRatio = image.width / image.height
					canvasDims = imageDims
					if canvasDims[0] > maxCanvasDims[0]
						canvasDims[0] = maxCanvasDims[0]
						canvasDims[1] = canvasDims[0] / imageRatio
					else if canvasDims[0] < minCanvasDims[0]
						canvasDims[0] = minCanvasDims[0]
						canvasDims[1] = canvasDims[0] / imageRatio
					if canvasDims[1] > maxCanvasDims[1]
						canvasDims[1] = maxCanvasDims[1]
						canvasDims[0] = canvasDims[1] * imageRatio
					else if canvasDims[1] < minCanvasDims[1]
						canvasDims[1] = minCanvasDims[1]
						canvasDims[0] = canvasDims[1] * imageRatio
					elCanvas.prop('width', canvasDims[0]).prop('height', canvasDims[1]).css
						'margin-left': -canvasDims[0] / 2 + 'px'
						'margin-top': -canvasDims[1] / 2 + 'px'
					theArea.setX ctx.canvas.width / 2
					theArea.setY ctx.canvas.height / 2
					theArea.setSize Math.min(200, ctx.canvas.width / 2, ctx.canvas.height / 2)
				else
					elCanvas.prop('width', 0).prop('height', 0).css 'margin-top': 0
				drawScene()
				return

			###*
			# Returns event.changedTouches directly if event is a TouchEvent.
			# If event is a jQuery event, return changedTouches of event.originalEvent
			###

			getChangedTouches = (event) ->
				if angular.isDefined(event.changedTouches)
					event.changedTouches
				else
					event.originalEvent.changedTouches

			onMouseMove = (e) ->
				if image != null
					offset = getElementOffset(ctx.canvas)
					pageX = undefined
					pageY = undefined
					if e.type == 'touchmove'
						pageX = getChangedTouches(e)[0].pageX
						pageY = getChangedTouches(e)[0].pageY
					else
						pageX = e.pageX
						pageY = e.pageY
					theArea.processMouseMove pageX - (offset.left), pageY - (offset.top)
					drawScene()
				return

			onMouseDown = (e) ->
				e.preventDefault()
				e.stopPropagation()
				if image != null
					offset = getElementOffset(ctx.canvas)
					pageX = undefined
					pageY = undefined
					if e.type == 'touchstart'
						pageX = getChangedTouches(e)[0].pageX
						pageY = getChangedTouches(e)[0].pageY
					else
						pageX = e.pageX
						pageY = e.pageY
					theArea.processMouseDown pageX - (offset.left), pageY - (offset.top)
					drawScene()
				return

			onMouseUp = (e) ->
				if image != null
					offset = getElementOffset(ctx.canvas)
					pageX = undefined
					pageY = undefined
					if e.type == 'touchend'
						pageX = getChangedTouches(e)[0].pageX
						pageY = getChangedTouches(e)[0].pageY
					else
						pageX = e.pageX
						pageY = e.pageY
					theArea.processMouseUp pageX - (offset.left), pageY - (offset.top)
					drawScene()
				return

			### PRIVATE FUNCTIONS ###

			# Draw Scene

			drawScene = ->
				# clear canvas
				ctx.clearRect 0, 0, ctx.canvas.width, ctx.canvas.height
				if image != null
					# draw source image
					ctx.drawImage image, 0, 0, ctx.canvas.width, ctx.canvas.height
					ctx.save()
					# and make it darker
					ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
					ctx.fillRect 0, 0, ctx.canvas.width, ctx.canvas.height
					ctx.restore()
					# draw Area
					theArea.draw()
				return

			@getResultImageDataURI = ->
				temp_ctx = undefined
				temp_canvas = undefined
				temp_canvas = angular.element('<canvas></canvas>')[0]
				temp_ctx = temp_canvas.getContext('2d')
				temp_canvas.width = resImgSize
				temp_canvas.height = resImgSize
				if image != null
					temp_ctx.drawImage image, (theArea.getX() - (theArea.getSize() / 2)) * image.width / ctx.canvas.width, (theArea.getY() - (theArea.getSize() / 2)) * image.height / ctx.canvas.height, theArea.getSize() * image.width / ctx.canvas.width, theArea.getSize() * image.height / ctx.canvas.height, 0, 0, resImgSize, resImgSize
				if resImgQuality != null
					return temp_canvas.toDataURL(resImgFormat, resImgQuality)
				temp_canvas.toDataURL resImgFormat

			@setNewImageSource = (imageSource) ->
				image = null
				resetCropHost()
				events.trigger 'image-updated'
				if ! !imageSource
					newImage = new Image
					if imageSource.substring(0, 4).toLowerCase() == 'http'
						newImage.crossOrigin = 'anonymous'

					newImage.onload = ->
						events.trigger 'load-done'
						cropEXIF.getData newImage, ->
							`var ctx`
							orientation = cropEXIF.getTag(newImage, 'Orientation')
							if [
								3
								6
								8
							].indexOf(orientation) > -1
								canvas = document.createElement('canvas')
								ctx = canvas.getContext('2d')
								cw = newImage.width
								ch = newImage.height
								cx = 0
								cy = 0
								deg = 0
								switch orientation
									when 3
										cx = -newImage.width
										cy = -newImage.height
										deg = 180
									when 6
										cw = newImage.height
										ch = newImage.width
										cy = -newImage.height
										deg = 90
									when 8
										cw = newImage.height
										ch = newImage.width
										cx = -newImage.width
										deg = 270
								canvas.width = cw
								canvas.height = ch
								ctx.rotate deg * Math.PI / 180
								ctx.drawImage newImage, cx, cy
								image = new Image
								image.src = canvas.toDataURL('image/png')
							else
								image = newImage
							resetCropHost()
							events.trigger 'image-updated'
							return
						return

					newImage.onerror = ->
						events.trigger 'load-error'
						return

					events.trigger 'load-start'
					newImage.src = imageSource
				return

			@setMaxDimensions = (width, height) ->
				maxCanvasDims = [
					width
					height
				]
				if image != null
					curWidth = ctx.canvas.width
					curHeight = ctx.canvas.height
					imageDims = [
						image.width
						image.height
					]
					imageRatio = image.width / image.height
					canvasDims = imageDims
					if canvasDims[0] > maxCanvasDims[0]
						canvasDims[0] = maxCanvasDims[0]
						canvasDims[1] = canvasDims[0] / imageRatio
					else if canvasDims[0] < minCanvasDims[0]
						canvasDims[0] = minCanvasDims[0]
						canvasDims[1] = canvasDims[0] / imageRatio
					if canvasDims[1] > maxCanvasDims[1]
						canvasDims[1] = maxCanvasDims[1]
						canvasDims[0] = canvasDims[1] * imageRatio
					else if canvasDims[1] < minCanvasDims[1]
						canvasDims[1] = minCanvasDims[1]
						canvasDims[0] = canvasDims[1] * imageRatio
					elCanvas.prop('width', canvasDims[0]).prop('height', canvasDims[1]).css
						'margin-left': -canvasDims[0] / 2 + 'px'
						'margin-top': -canvasDims[1] / 2 + 'px'
					ratioNewCurWidth = ctx.canvas.width / curWidth
					ratioNewCurHeight = ctx.canvas.height / curHeight
					ratioMin = Math.min(ratioNewCurWidth, ratioNewCurHeight)
					theArea.setX theArea.getX() * ratioNewCurWidth
					theArea.setY theArea.getY() * ratioNewCurHeight
					theArea.setSize theArea.getSize() * ratioMin
				else
					elCanvas.prop('width', 0).prop('height', 0).css 'margin-top': 0
				drawScene()
				return

			@setAreaMinSize = (size) ->
				size = parseInt(size, 10)
				if !isNaN(size)
					theArea.setMinSize size
					drawScene()
				return

			@setResultImageSize = (size) ->
				size = parseInt(size, 10)
				if !isNaN(size)
					resImgSize = size
				return

			@setResultImageFormat = (format) ->
				resImgFormat = format
				return

			@setResultImageQuality = (quality) ->
				quality = parseFloat(quality)
				if !isNaN(quality) and quality >= 0 and quality <= 1
					resImgQuality = quality
				return

			@setAreaType = (type) ->
				console.log type
				curSize = theArea.getSize()
				curMinSize = theArea.getMinSize()
				curX = theArea.getX()
				curY = theArea.getY()
				AreaClass = CropAreaSquare
				###
				if type == 'portrait'
					AreaClass = CropAreaPortrait
				else if type == 'landscape'
					AreaClass = CropAreaLandscape
        ###
				theArea = new AreaClass(ctx, events)
				theArea.setMinSize curMinSize
				theArea.setSize curSize
				theArea.setX curX
				theArea.setY curY
				# resetCropHost();
				if image != null
					theArea.setImage image
				drawScene()
				return

			### Life Cycle begins ###

			# Init Context var
			ctx = elCanvas[0].getContext('2d')
			# Init CropArea
			theArea = new CropAreaSquare(ctx, events)
			# Init Mouse Event Listeners
			$document.on 'mousemove', onMouseMove
			elCanvas.on 'mousedown', onMouseDown
			$document.on 'mouseup', onMouseUp
			# Init Touch Event Listeners
			$document.on 'touchmove', onMouseMove
			elCanvas.on 'touchstart', onMouseDown
			$document.on 'touchend', onMouseUp
			# CropHost Destructor

			@destroy = ->
				$document.off 'mousemove', onMouseMove
				elCanvas.off 'mousedown', onMouseDown
				$document.off 'mouseup', onMouseMove
				$document.off 'touchmove', onMouseMove
				elCanvas.off 'touchstart', onMouseDown
				$document.off 'touchend', onMouseMove
				elCanvas.remove()
				return

			return
]