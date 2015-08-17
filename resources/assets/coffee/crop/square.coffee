app.factory 'cropAreaSquare', [
	'cropArea'
	(CropArea) ->

		CropAreaSquare = ->
			CropArea.apply this, arguments
			@_resizeCtrlBaseRadius = 10
			@_resizeCtrlNormalRatio = 0.75
			@_resizeCtrlHoverRatio = 1
			@_iconMoveNormalRatio = 0.9
			@_iconMoveHoverRatio = 1.2
			@_resizeCtrlNormalRadius = @_resizeCtrlBaseRadius * @_resizeCtrlNormalRatio
			@_resizeCtrlHoverRadius = @_resizeCtrlBaseRadius * @_resizeCtrlHoverRatio
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

		CropAreaSquare.prototype = new CropArea

		CropAreaSquare::_calcSquareCorners = ->
			hSize = @_size / 2
			[
				[
					@_x - hSize
					@_y - hSize
				]
				[
					@_x + hSize
					@_y - hSize
				]
				[
					@_x - hSize
					@_y + hSize
				]
				[
					@_x + hSize
					@_y + hSize
				]
			]

		CropAreaSquare::_calcSquareDimensions = ->
			hSize = @_size / 2
			{
			left: @_x - hSize
			top: @_y - hSize
			right: @_x + hSize
			bottom: @_y + hSize
			}

		CropAreaSquare::_isCoordWithinArea = (coord) ->
			squareDimensions = @_calcSquareDimensions()
			coord[0] >= squareDimensions.left and coord[0] <= squareDimensions.right and coord[1] >= squareDimensions.top and coord[1] <= squareDimensions.bottom

		CropAreaSquare::_isCoordWithinResizeCtrl = (coord) ->
			resizeIconsCenterCoords = @_calcSquareCorners()
			res = -1
			i = 0
			len = resizeIconsCenterCoords.length
			while i < len
				resizeIconCenterCoords = resizeIconsCenterCoords[i]
				if coord[0] > resizeIconCenterCoords[0] - (@_resizeCtrlHoverRadius) and coord[0] < resizeIconCenterCoords[0] + @_resizeCtrlHoverRadius and coord[1] > resizeIconCenterCoords[1] - (@_resizeCtrlHoverRadius) and coord[1] < resizeIconCenterCoords[1] + @_resizeCtrlHoverRadius
					res = i
					break
				i++
			res

		CropAreaSquare::_drawArea = (ctx, centerCoords, size) ->
			hSize = size / 2
			ctx.rect centerCoords[0] - hSize, centerCoords[1] - hSize, size, size
			return

		CropAreaSquare::_drawImage = (ctx, image, centerCoords, size) ->
			xRatio = image.width / ctx.canvas.width
			yRatio = image.height / ctx.canvas.height

			xLeft = centerCoords[0] - (size / 2)
			yTop = centerCoords[1] - (size / 2)

			ctx.drawImage image, xLeft * xRatio, yTop * yRatio, size * xRatio, size * yRatio, xLeft, yTop, size, size

		CropAreaSquare::draw = ->
			CropArea::draw.apply this, arguments
			# draw move icon
			@_cropCanvas.drawIconMove [
				@_x
				@_y
			], if @_areaIsHover then @_iconMoveHoverRatio else @_iconMoveNormalRatio
			# draw resize cubes
			resizeIconsCenterCoords = @_calcSquareCorners()
			i = 0
			len = resizeIconsCenterCoords.length
			while i < len
				resizeIconCenterCoords = resizeIconsCenterCoords[i]
				@_cropCanvas.drawIconResizeCircle resizeIconCenterCoords, @_resizeCtrlBaseRadius, if @_resizeCtrlIsHover == i then @_resizeCtrlHoverRatio else @_resizeCtrlNormalRatio
				i++
			return

		CropAreaSquare::drawResultImage = (ctx, draw_ctx, canvas, image, resultSize) ->
			xRatio = image.width / ctx.canvas.width
			yRatio = image.height / ctx.canvas.height

			cropX = (@getX() - (@getSize() / 2)) * xRatio
			cropY = (@getY() - @getSize() / 2) * yRatio

			cropWidth = @getSize() * xRatio
			cropHeight = @getSize() * yRatio

			resultWidth = resultSize
			resultHeight = resultSize

			canvas.width = resultWidth
			canvas.height = resultHeight

			draw_ctx.drawImage image, cropX, cropY, cropWidth , cropHeight , 0, 0, resultWidth, resultHeight

		CropAreaSquare::processMouseMove = (mouseCurX, mouseCurY) ->
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
						yMulti = -1
						cursor = 'nesw-resize'
					when 2
					# Bottom Left
						xMulti = -1
						yMulti = 1
						cursor = 'nesw-resize'
					when 3
					# Bottom Right
						xMulti = 1
						yMulti = 1
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

		CropAreaSquare::processMouseDown = (mouseDownX, mouseDownY) ->
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

		CropAreaSquare::processMouseUp = ->
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

		CropAreaSquare
]