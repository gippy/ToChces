app.factory 'cropArea', [
	'cropCanvas'
	(CropCanvas) ->

		CropArea = (ctx, events) ->
			@_ctx = ctx
			@_events = events
			@_minSize = 80
			@_cropCanvas = new CropCanvas(ctx)
			@_image = new Image
			@_x = 0
			@_y = 0
			@_size = 200
			return

		### GETTERS/SETTERS ###

		CropArea::getImage = ->
			@_image

		CropArea::setImage = (image) ->
			@_image = image
			return

		CropArea::getX = ->
			@_x

		CropArea::setX = (x) ->
			@_x = x
			@_dontDragOutside()
			return

		CropArea::getY = ->
			@_y

		CropArea::setY = (y) ->
			@_y = y
			@_dontDragOutside()
			return

		CropArea::getSize = ->
			@_size

		CropArea::setSize = (size) ->
			@_size = Math.max(@_minSize, size)
			@_dontDragOutside()
			return

		CropArea::getMinSize = ->
			@_minSize

		CropArea::setMinSize = (size) ->
			@_minSize = size
			@_size = Math.max(@_minSize, @_size)
			@_dontDragOutside()
			return

		### FUNCTIONS ###

		CropArea::_dontDragOutside = ->
			h = @_ctx.canvas.height
			w = @_ctx.canvas.width
			if @_size > w
				@_size = w
			if @_size > h
				@_size = h
			if @_x < @_size / 2
				@_x = @_size / 2
			if @_x > w - (@_size / 2)
				@_x = w - (@_size / 2)
			if @_y < @_size / 2
				@_y = @_size / 2
			if @_y > h - (@_size / 2)
				@_y = h - (@_size / 2)
			return

		CropArea::_drawArea = ->

		CropArea::draw = ->
			# draw crop area
			@_cropCanvas.drawCropArea @_image, [
				@_x
				@_y
			], @_size, @_drawArea, @_drawImage
			return

		CropArea::drawResultImage = ->

		CropArea::processMouseMove = ->

		CropArea::processMouseDown = ->

		CropArea::processMouseUp = ->

		CropArea
]