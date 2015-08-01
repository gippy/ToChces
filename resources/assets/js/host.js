app.factory('cropHost', [
  '$document', 'cropAreaPortrait', 'cropAreaSquare', 'cropAreaLandscape', 'cropEXIF', function($document, CropAreaPortrait, CropAreaSquare, CropAreaLandscape, cropEXIF) {

    /* STATIC FUNCTIONS */
    var getElementOffset;
    getElementOffset = function(elem) {
      var body, box, clientLeft, clientTop, docElem, left, scrollLeft, scrollTop, top;
      box = elem.getBoundingClientRect();
      body = document.body;
      docElem = document.documentElement;
      scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
      clientTop = docElem.clientTop || body.clientTop || 0;
      clientLeft = docElem.clientLeft || body.clientLeft || 0;
      top = box.top + scrollTop - clientTop;
      left = box.left + scrollLeft - clientLeft;
      return {
        top: Math.round(top),
        left: Math.round(left)
      };
    };
    return function(elCanvas, opts, events) {

      /* PRIVATE VARIABLES */
      var ctx, drawScene, getChangedTouches, image, maxCanvasDims, minCanvasDims, onMouseDown, onMouseMove, onMouseUp, resImgFormat, resImgQuality, resImgSize, resetCropHost, theArea;
      ctx = null;
      image = null;
      theArea = null;
      minCanvasDims = [286, 286];
      maxCanvasDims = [589, 589];
      resImgSize = 200;
      resImgFormat = 'image/png';
      resImgQuality = null;
      resetCropHost = function() {
        var canvasDims, imageDims, imageRatio;
        if (image !== null) {
          theArea.setImage(image);
          imageDims = [image.width, image.height];
          imageRatio = image.width / image.height;
          canvasDims = imageDims;
          if (canvasDims[0] > maxCanvasDims[0]) {
            canvasDims[0] = maxCanvasDims[0];
            canvasDims[1] = canvasDims[0] / imageRatio;
          } else if (canvasDims[0] < minCanvasDims[0]) {
            canvasDims[0] = minCanvasDims[0];
            canvasDims[1] = canvasDims[0] / imageRatio;
          }
          if (canvasDims[1] > maxCanvasDims[1]) {
            canvasDims[1] = maxCanvasDims[1];
            canvasDims[0] = canvasDims[1] * imageRatio;
          } else if (canvasDims[1] < minCanvasDims[1]) {
            canvasDims[1] = minCanvasDims[1];
            canvasDims[0] = canvasDims[1] * imageRatio;
          }
          elCanvas.prop('width', canvasDims[0]).prop('height', canvasDims[1]).css({
            'margin-left': -canvasDims[0] / 2 + 'px',
            'margin-top': -canvasDims[1] / 2 + 'px'
          });
          theArea.setX(ctx.canvas.width / 2);
          theArea.setY(ctx.canvas.height / 2);
          theArea.setSize(Math.min(200, ctx.canvas.width / 2, ctx.canvas.height / 2));
        } else {
          elCanvas.prop('width', 0).prop('height', 0).css({
            'margin-top': 0
          });
        }
        drawScene();
      };

      /**
      			 * Returns event.changedTouches directly if event is a TouchEvent.
      			 * If event is a jQuery event, return changedTouches of event.originalEvent
       */
      getChangedTouches = function(event) {
        if (angular.isDefined(event.changedTouches)) {
          return event.changedTouches;
        } else {
          return event.originalEvent.changedTouches;
        }
      };
      onMouseMove = function(e) {
        var offset, pageX, pageY;
        if (image !== null) {
          offset = getElementOffset(ctx.canvas);
          pageX = void 0;
          pageY = void 0;
          if (e.type === 'touchmove') {
            pageX = getChangedTouches(e)[0].pageX;
            pageY = getChangedTouches(e)[0].pageY;
          } else {
            pageX = e.pageX;
            pageY = e.pageY;
          }
          theArea.processMouseMove(pageX - offset.left, pageY - offset.top);
          drawScene();
        }
      };
      onMouseDown = function(e) {
        var offset, pageX, pageY;
        e.preventDefault();
        e.stopPropagation();
        if (image !== null) {
          offset = getElementOffset(ctx.canvas);
          pageX = void 0;
          pageY = void 0;
          if (e.type === 'touchstart') {
            pageX = getChangedTouches(e)[0].pageX;
            pageY = getChangedTouches(e)[0].pageY;
          } else {
            pageX = e.pageX;
            pageY = e.pageY;
          }
          theArea.processMouseDown(pageX - offset.left, pageY - offset.top);
          drawScene();
        }
      };
      onMouseUp = function(e) {
        var offset, pageX, pageY;
        if (image !== null) {
          offset = getElementOffset(ctx.canvas);
          pageX = void 0;
          pageY = void 0;
          if (e.type === 'touchend') {
            pageX = getChangedTouches(e)[0].pageX;
            pageY = getChangedTouches(e)[0].pageY;
          } else {
            pageX = e.pageX;
            pageY = e.pageY;
          }
          theArea.processMouseUp(pageX - offset.left, pageY - offset.top);
          drawScene();
        }
      };

      /* PRIVATE FUNCTIONS */
      drawScene = function() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (image !== null) {
          ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.save();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.restore();
          theArea.draw();
        }
      };
      this.getResultImageDataURI = function() {
        var temp_canvas, temp_ctx;
        temp_ctx = void 0;
        temp_canvas = void 0;
        temp_canvas = angular.element('<canvas></canvas>')[0];
        temp_ctx = temp_canvas.getContext('2d');
        temp_canvas.width = resImgSize;
        temp_canvas.height = resImgSize;
        if (image !== null) {
          temp_ctx.drawImage(image, (theArea.getX() - (theArea.getSize() / 2)) * image.width / ctx.canvas.width, (theArea.getY() - (theArea.getSize() / 2)) * image.height / ctx.canvas.height, theArea.getSize() * image.width / ctx.canvas.width, theArea.getSize() * image.height / ctx.canvas.height, 0, 0, resImgSize, resImgSize);
        }
        if (resImgQuality !== null) {
          return temp_canvas.toDataURL(resImgFormat, resImgQuality);
        }
        return temp_canvas.toDataURL(resImgFormat);
      };
      this.setNewImageSource = function(imageSource) {
        var newImage;
        image = null;
        resetCropHost();
        events.trigger('image-updated');
        if (!!imageSource) {
          newImage = new Image;
          if (imageSource.substring(0, 4).toLowerCase() === 'http') {
            newImage.crossOrigin = 'anonymous';
          }
          newImage.onload = function() {
            events.trigger('load-done');
            cropEXIF.getData(newImage, function() {
              var ctx;
              var canvas, ch, cw, cx, cy, deg, orientation;
              orientation = cropEXIF.getTag(newImage, 'Orientation');
              if ([3, 6, 8].indexOf(orientation) > -1) {
                canvas = document.createElement('canvas');
                ctx = canvas.getContext('2d');
                cw = newImage.width;
                ch = newImage.height;
                cx = 0;
                cy = 0;
                deg = 0;
                switch (orientation) {
                  case 3:
                    cx = -newImage.width;
                    cy = -newImage.height;
                    deg = 180;
                    break;
                  case 6:
                    cw = newImage.height;
                    ch = newImage.width;
                    cy = -newImage.height;
                    deg = 90;
                    break;
                  case 8:
                    cw = newImage.height;
                    ch = newImage.width;
                    cx = -newImage.width;
                    deg = 270;
                }
                canvas.width = cw;
                canvas.height = ch;
                ctx.rotate(deg * Math.PI / 180);
                ctx.drawImage(newImage, cx, cy);
                image = new Image;
                image.src = canvas.toDataURL('image/png');
              } else {
                image = newImage;
              }
              resetCropHost();
              events.trigger('image-updated');
            });
          };
          newImage.onerror = function() {
            events.trigger('load-error');
          };
          events.trigger('load-start');
          newImage.src = imageSource;
        }
      };
      this.setMaxDimensions = function(width, height) {
        var canvasDims, curHeight, curWidth, imageDims, imageRatio, ratioMin, ratioNewCurHeight, ratioNewCurWidth;
        maxCanvasDims = [width, height];
        if (image !== null) {
          curWidth = ctx.canvas.width;
          curHeight = ctx.canvas.height;
          imageDims = [image.width, image.height];
          imageRatio = image.width / image.height;
          canvasDims = imageDims;
          if (canvasDims[0] > maxCanvasDims[0]) {
            canvasDims[0] = maxCanvasDims[0];
            canvasDims[1] = canvasDims[0] / imageRatio;
          } else if (canvasDims[0] < minCanvasDims[0]) {
            canvasDims[0] = minCanvasDims[0];
            canvasDims[1] = canvasDims[0] / imageRatio;
          }
          if (canvasDims[1] > maxCanvasDims[1]) {
            canvasDims[1] = maxCanvasDims[1];
            canvasDims[0] = canvasDims[1] * imageRatio;
          } else if (canvasDims[1] < minCanvasDims[1]) {
            canvasDims[1] = minCanvasDims[1];
            canvasDims[0] = canvasDims[1] * imageRatio;
          }
          elCanvas.prop('width', canvasDims[0]).prop('height', canvasDims[1]).css({
            'margin-left': -canvasDims[0] / 2 + 'px',
            'margin-top': -canvasDims[1] / 2 + 'px'
          });
          ratioNewCurWidth = ctx.canvas.width / curWidth;
          ratioNewCurHeight = ctx.canvas.height / curHeight;
          ratioMin = Math.min(ratioNewCurWidth, ratioNewCurHeight);
          theArea.setX(theArea.getX() * ratioNewCurWidth);
          theArea.setY(theArea.getY() * ratioNewCurHeight);
          theArea.setSize(theArea.getSize() * ratioMin);
        } else {
          elCanvas.prop('width', 0).prop('height', 0).css({
            'margin-top': 0
          });
        }
        drawScene();
      };
      this.setAreaMinSize = function(size) {
        size = parseInt(size, 10);
        if (!isNaN(size)) {
          theArea.setMinSize(size);
          drawScene();
        }
      };
      this.setResultImageSize = function(size) {
        size = parseInt(size, 10);
        if (!isNaN(size)) {
          resImgSize = size;
        }
      };
      this.setResultImageFormat = function(format) {
        resImgFormat = format;
      };
      this.setResultImageQuality = function(quality) {
        quality = parseFloat(quality);
        if (!isNaN(quality) && quality >= 0 && quality <= 1) {
          resImgQuality = quality;
        }
      };
      this.setAreaType = function(type) {
        var AreaClass, curMinSize, curSize, curX, curY;
        console.log(type);
        curSize = theArea.getSize();
        curMinSize = theArea.getMinSize();
        curX = theArea.getX();
        curY = theArea.getY();
        AreaClass = CropAreaSquare;

        /*
        				if type == 'portrait'
        					AreaClass = CropAreaPortrait
        				else if type == 'landscape'
        					AreaClass = CropAreaLandscape
         */
        theArea = new AreaClass(ctx, events);
        theArea.setMinSize(curMinSize);
        theArea.setSize(curSize);
        theArea.setX(curX);
        theArea.setY(curY);
        if (image !== null) {
          theArea.setImage(image);
        }
        drawScene();
      };

      /* Life Cycle begins */
      ctx = elCanvas[0].getContext('2d');
      theArea = new CropAreaSquare(ctx, events);
      $document.on('mousemove', onMouseMove);
      elCanvas.on('mousedown', onMouseDown);
      $document.on('mouseup', onMouseUp);
      $document.on('touchmove', onMouseMove);
      elCanvas.on('touchstart', onMouseDown);
      $document.on('touchend', onMouseUp);
      this.destroy = function() {
        $document.off('mousemove', onMouseMove);
        elCanvas.off('mousedown', onMouseDown);
        $document.off('mouseup', onMouseMove);
        $document.off('touchmove', onMouseMove);
        elCanvas.off('touchstart', onMouseDown);
        $document.off('touchend', onMouseMove);
        elCanvas.remove();
      };
    };
  }
]);
