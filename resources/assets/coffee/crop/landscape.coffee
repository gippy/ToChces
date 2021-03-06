app.factory 'cropAreaLandscape', [
	'cropArea'
	(CropArea) ->

		CropAreaLandscape = ->
			CropArea.apply this, arguments
			@_resizeCtrlBaseRadius = 10
			@_resizeCtrlNormalRatio = 0.75
			@_resizeCtrlHoverRatio = 1
			@_iconMoveNormalRatio = 0.9
			@_iconMoveHoverRatio = 1.2
			@_resizeCtrlNormalRadius = @_resizeCtrlBaseRadius * @_resizeCtrlNormalRatio
			@_resizeCtrlHoverVerticalRadius = @_resizeCtrlBaseRadius * @_resizeCtrlHoverRatio
			@_resizeCtrlHoverHorizontalRadius = @_resizeCtrlBaseRadius * @_resizeCtrlHoverRatio * 2
			@_posDragStartX = 0
			@_posDragStartY = 0
			@_posResizeStartX = 0
			@_posResizeStartY = 0
			@_posResizeStartSize = 0
			@_resizeCtrlIsHover = -1
			@_areaIsHover = false
			@_resizeCtrlIsDragging = -1
			@_areaIsDragging = false
			return

		CropAreaLandscape.prototype = new CropArea

		CropAreaLandscape::_calcCorners = ->
			hSize = @_size
			vSize = @_size / 2
			[
				[
					@_x - hSize
					@_y - vSize
				]
				[
					@_x + hSize
					@_y - vSize
				]
				[
					@_x - hSize
					@_y + vSize
				]
				[
					@_x + hSize
					@_y + vSize
				]
			]

		CropAreaLandscape::_calcDimensions = ->
			hSize = @_size
			vSize = @_size / 2
			{
			left: @_x - hSize
			top: @_y - vSize
			right: @_x + hSize
			bottom: @_y + vSize
			}

		CropAreaLandscape::_isCoordWithinArea = (coord) ->
			dimensions = @_calcDimensions()
			coord[0] >= dimensions.left and coord[0] <= dimensions.right and coord[1] >= dimensions.top and coord[1] <= dimensions.bottom

		CropAreaLandscape::_isCoordWithinResizeCtrl = (coord) ->
			resizeIconsCenterCoords = @_calcCorners()
			res = -1
			i = 0
			len = resizeIconsCenterCoords.length
			while i < len
				resizeIconCenterCoords = resizeIconsCenterCoords[i]
				if coord[0] > resizeIconCenterCoords[0] - (@_resizeCtrlHoverHorizontalRadius) and coord[0] < resizeIconCenterCoords[0] + (@_resizeCtrlHoverHorizontalRadius) and coord[1] > resizeIconCenterCoords[1] - (@_resizeCtrlHoverVerticalRadius) and coord[1] < resizeIconCenterCoords[1] + (@_resizeCtrlHoverVerticalRadius)
					res = i
					break
				i++
			res

		CropAreaLandscape::_drawArea = (ctx, centerCoords, size) ->
			hSize = size
			vSize = size / 2
			ctx.rect centerCoords[0] - hSize, centerCoords[1] - vSize, size*2, size
			return

		CropAreaLandscape::_drawImage  = (ctx, image, centerCoords, size) ->
			xRatio = image.width / ctx.canvas.width
			yRatio = image.height / ctx.canvas.height

			xLeft = centerCoords[0] - (size)
			yTop = centerCoords[1] - (size / 2)

			ctx.drawImage image, xLeft * xRatio, yTop * yRatio, size * xRatio * 2, size * yRatio, xLeft, yTop, size * 2, size

		CropAreaLandscape::drawResultImage = (ctx, draw_ctx, canvas, image, resultSize) ->
			xRatio = image.width / ctx.canvas.width
			yRatio = image.height / ctx.canvas.height

			cropX = (@getX() - @getSize()) * xRatio
			cropY = (@getY() - (@getSize() / 2)) * yRatio

			cropWidth = @getSize() * xRatio * 2
			cropHeight = @getSize() * yRatio

			resultWidth = resultSize * 2
			resultHeight = resultSize

			canvas.width = resultWidth
			canvas.height = resultHeight

			draw_ctx.drawImage image, cropX, cropY, cropWidth , cropHeight , 0, 0, resultWidth, resultHeight

		CropAreaLandscape::draw = ->
			CropArea::draw.apply this, arguments
			# draw move icon
			@_cropCanvas.drawIconMove [
				@_x
				@_y
			], if @_areaIsHover then @_iconMoveHoverRatio else @_iconMoveNormalRatio
			# draw resize cubes
			resizeIconsCenterCoords = @_calcCorners()
			i = 0
			len = resizeIconsCenterCoords.length
			while i < len
				resizeIconCenterCoords = resizeIconsCenterCoords[i]
				@_cropCanvas.drawIconResizeCircle resizeIconCenterCoords, @_resizeCtrlBaseRadius, if @_resizeCtrlIsHover == i then @_resizeCtrlHoverRatio else @_resizeCtrlNormalRatio
				i++
			return

		CropAreaLandscape::processMouseMove = (mouseCurX, mouseCurY) ->
			cursor = 'default'
			res = false
			@_resizeCtrlIsHover = -1
			@_areaIsHover = false
			if @_areaIsDragging
				@_x = mouseCurX - (@_posDragStartX)
				@_y = mouseCurY - (@_posDragStartY)
				@_areaIsHover = true
				cursor = 'move'
				res = true
				@_events.trigger 'area-move'
			else if @_resizeCtrlIsDragging > -1
				xMulti = undefined
				yMulti = undefined
				switch @_resizeCtrlIsDragging
					when 0
					# Top Left
						xMulti = -1
						yMulti = -1
						cursor = 'nwse-resize'
					when 1
					# Top Right
						xMulti = 1
						yMulti = -0.5
						cursor = 'nesw-resize'
					when 2
					# Bottom Left
						xMulti = -1
						yMulti = 0.5
						cursor = 'nesw-resize'
					when 3
					# Bottom Right
						xMulti = 1
						yMulti = 0.5
						cursor = 'nwse-resize'
				iFX = (mouseCurX - (@_posResizeStartX)) * xMulti
				iFY = (mouseCurY - (@_posResizeStartY)) * yMulti
				iFR = undefined
				if iFX > iFY
					iFR = @_posResizeStartSize + iFY
				else
					iFR = @_posResizeStartSize + iFX
				wasSize = @_size
				@_size = Math.max(@_minSize, iFR)
				posModifier = (@_size - wasSize) / 2
				@_x += posModifier * xMulti
				@_y += posModifier * yMulti
				@_resizeCtrlIsHover = @_resizeCtrlIsDragging
				res = true
				@_events.trigger 'area-resize'
			else
				hoveredResizeBox = @_isCoordWithinResizeCtrl([
					mouseCurX
					mouseCurY
				])
				if hoveredResizeBox > -1
					switch hoveredResizeBox
						when 0
							cursor = 'nwse-resize'
						when 1
							cursor = 'nesw-resize'
						when 2
							cursor = 'nesw-resize'
						when 3
							cursor = 'nwse-resize'
					@_areaIsHover = false
					@_resizeCtrlIsHover = hoveredResizeBox
					res = true
				else if @_isCoordWithinArea([
					mouseCurX
					mouseCurY
				])
					cursor = 'move'
					@_areaIsHover = true
					res = true
			@_dontDragOutside()
			angular.element(@_ctx.canvas).css 'cursor': cursor
			res

		CropAreaLandscape::processMouseDown = (mouseDownX, mouseDownY) ->
			isWithinResizeCtrl = @_isCoordWithinResizeCtrl([
				mouseDownX
				mouseDownY
			])
			if isWithinResizeCtrl > -1
				@_areaIsDragging = false
				@_areaIsHover = false
				@_resizeCtrlIsDragging = isWithinResizeCtrl
				@_resizeCtrlIsHover = isWithinResizeCtrl
				@_posResizeStartX = mouseDownX
				@_posResizeStartY = mouseDownY
				@_posResizeStartSize = @_size
				@_events.trigger 'area-resize-start'
			else if @_isCoordWithinArea([
				mouseDownX
				mouseDownY
			])
				@_areaIsDragging = true
				@_areaIsHover = true
				@_resizeCtrlIsDragging = -1
				@_resizeCtrlIsHover = -1
				@_posDragStartX = mouseDownX - (@_x)
				@_posDragStartY = mouseDownY - (@_y)
				@_events.trigger 'area-move-start'
			return

		CropAreaLandscape::processMouseUp = ->
			if @_areaIsDragging
				@_areaIsDragging = false
				@_events.trigger 'area-move-end'
			if @_resizeCtrlIsDragging > -1
				@_resizeCtrlIsDragging = -1
				@_events.trigger 'area-resize-end'
			@_areaIsHover = false
			@_resizeCtrlIsHover = -1
			@_posDragStartX = 0
			@_posDragStartY = 0
			return

		CropAreaLandscape::_dontDragOutside = ->
			h = @_ctx.canvas.height
			w = @_ctx.canvas.width

			hSize = @_size * 2
			vSize = @_size

			if hSize > w
				@_size = w / 2
			if vSize > h
				@_size = h

			if @_x < @_size
				@_x = @_size

			if @_x > w - @_size
				@_x = w - @_size

			if @_y < @_size / 2
				@_y = @_size / 2

			if @_y > h - (@_size / 2)
				@_y = h - (@_size / 2)

			return

		CropAreaLandscape
]