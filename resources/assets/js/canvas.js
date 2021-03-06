app.factory('cropCanvas', [
  function() {
    var colors, shapeArrowE, shapeArrowN, shapeArrowNE, shapeArrowNW, shapeArrowS, shapeArrowSE, shapeArrowSW, shapeArrowW;
    shapeArrowNW = [[-0.5, -2], [-3, -4.5], [-0.5, -7], [-7, -7], [-7, -0.5], [-4.5, -3], [-2, -0.5]];
    shapeArrowNE = [[0.5, -2], [3, -4.5], [0.5, -7], [7, -7], [7, -0.5], [4.5, -3], [2, -0.5]];
    shapeArrowSW = [[-0.5, 2], [-3, 4.5], [-0.5, 7], [-7, 7], [-7, 0.5], [-4.5, 3], [-2, 0.5]];
    shapeArrowSE = [[0.5, 2], [3, 4.5], [0.5, 7], [7, 7], [7, 0.5], [4.5, 3], [2, 0.5]];
    shapeArrowN = [[-1.5, -2.5], [-1.5, -6], [-5, -6], [0, -11], [5, -6], [1.5, -6], [1.5, -2.5]];
    shapeArrowW = [[-2.5, -1.5], [-6, -1.5], [-6, -5], [-11, 0], [-6, 5], [-6, 1.5], [-2.5, 1.5]];
    shapeArrowS = [[-1.5, 2.5], [-1.5, 6], [-5, 6], [0, 11], [5, 6], [1.5, 6], [1.5, 2.5]];
    shapeArrowE = [[2.5, -1.5], [6, -1.5], [6, -5], [11, 0], [6, 5], [6, 1.5], [2.5, 1.5]];
    colors = {
      areaOutline: '#fff',
      resizeBoxStroke: '#fff',
      resizeBoxFill: '#444',
      resizeBoxArrowFill: '#fff',
      resizeCircleStroke: '#fff',
      resizeCircleFill: '#444',
      moveIconFill: '#fff'
    };
    return function(ctx) {

      /* Base functions */
      var calcPoint, drawFilledPolygon;
      calcPoint = function(point, offset, scale) {
        return [scale * point[0] + offset[0], scale * point[1] + offset[1]];
      };
      drawFilledPolygon = function(shape, fillStyle, centerCoords, scale) {
        var p, pc, pc0;
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        pc = void 0;
        pc0 = calcPoint(shape[0], centerCoords, scale);
        ctx.moveTo(pc0[0], pc0[1]);
        for (p in shape) {
          if (p > 0) {
            pc = calcPoint(shape[p], centerCoords, scale);
            ctx.lineTo(pc[0], pc[1]);
          }
        }
        ctx.lineTo(pc0[0], pc0[1]);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      };

      /* Icons */
      this.drawIconMove = function(centerCoords, scale) {
        drawFilledPolygon(shapeArrowN, colors.moveIconFill, centerCoords, scale);
        drawFilledPolygon(shapeArrowW, colors.moveIconFill, centerCoords, scale);
        drawFilledPolygon(shapeArrowS, colors.moveIconFill, centerCoords, scale);
        drawFilledPolygon(shapeArrowE, colors.moveIconFill, centerCoords, scale);
      };
      this.drawIconResizeCircle = function(centerCoords, circleRadius, scale) {
        var scaledCircleRadius;
        scaledCircleRadius = circleRadius * scale;
        ctx.save();
        ctx.strokeStyle = colors.resizeCircleStroke;
        ctx.lineWidth = 2;
        ctx.fillStyle = colors.resizeCircleFill;
        ctx.beginPath();
        ctx.arc(centerCoords[0], centerCoords[1], scaledCircleRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      };
      this.drawIconResizeBoxBase = function(centerCoords, boxSize, scale) {
        var scaledBoxSize;
        scaledBoxSize = boxSize * scale;
        ctx.save();
        ctx.strokeStyle = colors.resizeBoxStroke;
        ctx.lineWidth = 2;
        ctx.fillStyle = colors.resizeBoxFill;
        ctx.fillRect(centerCoords[0] - (scaledBoxSize / 2), centerCoords[1] - (scaledBoxSize / 2), scaledBoxSize, scaledBoxSize);
        ctx.strokeRect(centerCoords[0] - (scaledBoxSize / 2), centerCoords[1] - (scaledBoxSize / 2), scaledBoxSize, scaledBoxSize);
        ctx.restore();
      };
      this.drawIconResizeBoxNESW = function(centerCoords, boxSize, scale) {
        this.drawIconResizeBoxBase(centerCoords, boxSize, scale);
        drawFilledPolygon(shapeArrowNE, colors.resizeBoxArrowFill, centerCoords, scale);
        drawFilledPolygon(shapeArrowSW, colors.resizeBoxArrowFill, centerCoords, scale);
      };
      this.drawIconResizeBoxNWSE = function(centerCoords, boxSize, scale) {
        this.drawIconResizeBoxBase(centerCoords, boxSize, scale);
        drawFilledPolygon(shapeArrowNW, colors.resizeBoxArrowFill, centerCoords, scale);
        drawFilledPolygon(shapeArrowSE, colors.resizeBoxArrowFill, centerCoords, scale);
      };

      /* Crop Area */
      this.drawCropArea = function(image, centerCoords, size, fnDrawClipPath, fnDrawImage) {
        ctx.save();
        ctx.strokeStyle = colors.areaOutline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        fnDrawClipPath(ctx, centerCoords, size);
        ctx.stroke();
        ctx.clip();
        if (size > 0) {
          fnDrawImage(ctx, image, centerCoords, size);
        }
        ctx.beginPath();
        fnDrawClipPath(ctx, centerCoords, size);
        ctx.stroke();
        ctx.clip();
        ctx.restore();
      };
    };
  }
]);
