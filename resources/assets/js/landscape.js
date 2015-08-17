app.factory('cropAreaLandscape', [
  'cropArea', function(CropArea) {
    var CropAreaLandscape;
    CropAreaLandscape = function() {
      CropArea.apply(this, arguments);
      this._resizeCtrlBaseRadius = 10;
      this._resizeCtrlNormalRatio = 0.75;
      this._resizeCtrlHoverRatio = 1;
      this._iconMoveNormalRatio = 0.9;
      this._iconMoveHoverRatio = 1.2;
      this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlNormalRatio;
      this._resizeCtrlHoverVerticalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio;
      this._resizeCtrlHoverHorizontalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio * 2;
      this._posDragStartX = 0;
      this._posDragStartY = 0;
      this._posResizeStartX = 0;
      this._posResizeStartY = 0;
      this._posResizeStartSize = 0;
      this._resizeCtrlIsHover = -1;
      this._areaIsHover = false;
      this._resizeCtrlIsDragging = -1;
      this._areaIsDragging = false;
    };
    CropAreaLandscape.prototype = new CropArea;
    CropAreaLandscape.prototype._calcCorners = function() {
      var hSize, vSize;
      hSize = this._size;
      vSize = this._size / 2;
      return [[this._x - hSize, this._y - vSize], [this._x + hSize, this._y - vSize], [this._x - hSize, this._y + vSize], [this._x + hSize, this._y + vSize]];
    };
    CropAreaLandscape.prototype._calcDimensions = function() {
      var hSize, vSize;
      hSize = this._size;
      vSize = this._size / 2;
      return {
        left: this._x - hSize,
        top: this._y - vSize,
        right: this._x + hSize,
        bottom: this._y + vSize
      };
    };
    CropAreaLandscape.prototype._isCoordWithinArea = function(coord) {
      var dimensions;
      dimensions = this._calcDimensions();
      return coord[0] >= dimensions.left && coord[0] <= dimensions.right && coord[1] >= dimensions.top && coord[1] <= dimensions.bottom;
    };
    CropAreaLandscape.prototype._isCoordWithinResizeCtrl = function(coord) {
      var i, len, res, resizeIconCenterCoords, resizeIconsCenterCoords;
      resizeIconsCenterCoords = this._calcCorners();
      res = -1;
      i = 0;
      len = resizeIconsCenterCoords.length;
      while (i < len) {
        resizeIconCenterCoords = resizeIconsCenterCoords[i];
        if (coord[0] > resizeIconCenterCoords[0] - this._resizeCtrlHoverHorizontalRadius && coord[0] < resizeIconCenterCoords[0] + this._resizeCtrlHoverHorizontalRadius && coord[1] > resizeIconCenterCoords[1] - this._resizeCtrlHoverVerticalRadius && coord[1] < resizeIconCenterCoords[1] + this._resizeCtrlHoverVerticalRadius) {
          res = i;
          break;
        }
        i++;
      }
      return res;
    };
    CropAreaLandscape.prototype._drawArea = function(ctx, centerCoords, size) {
      var hSize, vSize;
      hSize = size;
      vSize = size / 2;
      ctx.rect(centerCoords[0] - hSize, centerCoords[1] - vSize, size * 2, size);
    };
    CropAreaLandscape.prototype._drawImage = function(ctx, image, centerCoords, size) {
      var xLeft, xRatio, yRatio, yTop;
      xRatio = image.width / ctx.canvas.width;
      yRatio = image.height / ctx.canvas.height;
      xLeft = centerCoords[0] - size;
      yTop = centerCoords[1] - (size / 2);
      return ctx.drawImage(image, xLeft * xRatio, yTop * yRatio, size * xRatio * 2, size * yRatio, xLeft, yTop, size * 2, size);
    };
    CropAreaLandscape.prototype.drawResultImage = function(ctx, draw_ctx, canvas, image, resultSize) {
      var cropHeight, cropWidth, cropX, cropY, resultHeight, resultWidth, xRatio, yRatio;
      xRatio = image.width / ctx.canvas.width;
      yRatio = image.height / ctx.canvas.height;
      cropX = (this.getX() - this.getSize()) * xRatio;
      cropY = (this.getY() - (this.getSize() / 2)) * yRatio;
      cropWidth = this.getSize() * xRatio * 2;
      cropHeight = this.getSize() * yRatio;
      resultWidth = resultSize * 2;
      resultHeight = resultSize;
      canvas.width = resultWidth;
      canvas.height = resultHeight;
      return draw_ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, resultWidth, resultHeight);
    };
    CropAreaLandscape.prototype.draw = function() {
      var i, len, resizeIconCenterCoords, resizeIconsCenterCoords;
      CropArea.prototype.draw.apply(this, arguments);
      this._cropCanvas.drawIconMove([this._x, this._y], this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio);
      resizeIconsCenterCoords = this._calcCorners();
      i = 0;
      len = resizeIconsCenterCoords.length;
      while (i < len) {
        resizeIconCenterCoords = resizeIconsCenterCoords[i];
        this._cropCanvas.drawIconResizeCircle(resizeIconCenterCoords, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover === i ? this._resizeCtrlHoverRatio : this._resizeCtrlNormalRatio);
        i++;
      }
    };
    CropAreaLandscape.prototype.processMouseMove = function(mouseCurX, mouseCurY) {
      var cursor, hoveredResizeBox, iFR, iFX, iFY, posModifier, res, wasSize, xMulti, yMulti;
      cursor = 'default';
      res = false;
      this._resizeCtrlIsHover = -1;
      this._areaIsHover = false;
      if (this._areaIsDragging) {
        this._x = mouseCurX - this._posDragStartX;
        this._y = mouseCurY - this._posDragStartY;
        this._areaIsHover = true;
        cursor = 'move';
        res = true;
        this._events.trigger('area-move');
      } else if (this._resizeCtrlIsDragging > -1) {
        xMulti = void 0;
        yMulti = void 0;
        switch (this._resizeCtrlIsDragging) {
          case 0:
            xMulti = -1;
            yMulti = -1;
            cursor = 'nwse-resize';
            break;
          case 1:
            xMulti = 1;
            yMulti = -0.5;
            cursor = 'nesw-resize';
            break;
          case 2:
            xMulti = -1;
            yMulti = 0.5;
            cursor = 'nesw-resize';
            break;
          case 3:
            xMulti = 1;
            yMulti = 0.5;
            cursor = 'nwse-resize';
        }
        iFX = (mouseCurX - this._posResizeStartX) * xMulti;
        iFY = (mouseCurY - this._posResizeStartY) * yMulti;
        iFR = void 0;
        if (iFX > iFY) {
          iFR = this._posResizeStartSize + iFY;
        } else {
          iFR = this._posResizeStartSize + iFX;
        }
        wasSize = this._size;
        this._size = Math.max(this._minSize, iFR);
        posModifier = (this._size - wasSize) / 2;
        this._x += posModifier * xMulti;
        this._y += posModifier * yMulti;
        this._resizeCtrlIsHover = this._resizeCtrlIsDragging;
        res = true;
        this._events.trigger('area-resize');
      } else {
        hoveredResizeBox = this._isCoordWithinResizeCtrl([mouseCurX, mouseCurY]);
        if (hoveredResizeBox > -1) {
          switch (hoveredResizeBox) {
            case 0:
              cursor = 'nwse-resize';
              break;
            case 1:
              cursor = 'nesw-resize';
              break;
            case 2:
              cursor = 'nesw-resize';
              break;
            case 3:
              cursor = 'nwse-resize';
          }
          this._areaIsHover = false;
          this._resizeCtrlIsHover = hoveredResizeBox;
          res = true;
        } else if (this._isCoordWithinArea([mouseCurX, mouseCurY])) {
          cursor = 'move';
          this._areaIsHover = true;
          res = true;
        }
      }
      this._dontDragOutside();
      angular.element(this._ctx.canvas).css({
        'cursor': cursor
      });
      return res;
    };
    CropAreaLandscape.prototype.processMouseDown = function(mouseDownX, mouseDownY) {
      var isWithinResizeCtrl;
      isWithinResizeCtrl = this._isCoordWithinResizeCtrl([mouseDownX, mouseDownY]);
      if (isWithinResizeCtrl > -1) {
        this._areaIsDragging = false;
        this._areaIsHover = false;
        this._resizeCtrlIsDragging = isWithinResizeCtrl;
        this._resizeCtrlIsHover = isWithinResizeCtrl;
        this._posResizeStartX = mouseDownX;
        this._posResizeStartY = mouseDownY;
        this._posResizeStartSize = this._size;
        this._events.trigger('area-resize-start');
      } else if (this._isCoordWithinArea([mouseDownX, mouseDownY])) {
        this._areaIsDragging = true;
        this._areaIsHover = true;
        this._resizeCtrlIsDragging = -1;
        this._resizeCtrlIsHover = -1;
        this._posDragStartX = mouseDownX - this._x;
        this._posDragStartY = mouseDownY - this._y;
        this._events.trigger('area-move-start');
      }
    };
    CropAreaLandscape.prototype.processMouseUp = function() {
      if (this._areaIsDragging) {
        this._areaIsDragging = false;
        this._events.trigger('area-move-end');
      }
      if (this._resizeCtrlIsDragging > -1) {
        this._resizeCtrlIsDragging = -1;
        this._events.trigger('area-resize-end');
      }
      this._areaIsHover = false;
      this._resizeCtrlIsHover = -1;
      this._posDragStartX = 0;
      this._posDragStartY = 0;
    };
    CropAreaLandscape.prototype._dontDragOutside = function() {
      var h, hSize, vSize, w;
      h = this._ctx.canvas.height;
      w = this._ctx.canvas.width;
      hSize = this._size * 2;
      vSize = this._size;
      if (hSize > w) {
        this._size = w / 2;
      }
      if (vSize > h) {
        this._size = h;
      }
      if (this._x < this._size) {
        this._x = this._size;
      }
      if (this._x > w - this._size) {
        this._x = w - this._size;
      }
      if (this._y < this._size / 2) {
        this._y = this._size / 2;
      }
      if (this._y > h - (this._size / 2)) {
        this._y = h - (this._size / 2);
      }
    };
    return CropAreaLandscape;
  }
]);
