var app;

app = angular.module('ToChcete', ['ngTagsInput', 'masonry']);

app.filter('crowns', function() {
  return function(num, fractionSize) {
    var DECIMAL_SEP, formattedText, fraction, group, hasExponent, i, isInfinity, isNegative, j, k, lgroup, match, numStr, number, parts, pos, ref, ref1, ref2, whole;
    DECIMAL_SEP = ',';
    if (angular.isString(num) && num.indexOf('Kč') !== -1) {
      num.toLowerCase().replace('kč', '').replace(' ', '');
    } else if (angular.isObject(num)) {
      return '';
    }
    isNegative = num < 0;
    num = Math.abs(num);
    isInfinity = num === Infinity;
    if (!isInfinity && !isFinite(num)) {
      return '';
    }
    numStr = num + '';
    formattedText = '';
    hasExponent = false;
    parts = [];
    if (isInfinity) {
      formattedText = '\u221e';
    }
    if (!isInfinity && numStr.indexOf('e') !== -1) {
      match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
      if (match && match[2] === '-' && match[3] > fractionSize + 1) {
        num = 0;
      } else {
        formattedText = numStr;
        hasExponent = true;
      }
    }
    if (!isInfinity && !hasExponent) {
      if (angular.isUndefined(fractionSize)) {
        fractionSize = 0;
      }
      number = +(Math.round(+(num.toString() + 'e' + fractionSize)).toString() + 'e' + -fractionSize);
      fraction = ('' + number).split(DECIMAL_SEP);
      whole = fraction[0];
      fraction = fraction[1] || '';
      pos = 0;
      lgroup = 3;
      group = 3;
      if (whole.length >= (lgroup + group)) {
        pos = whole.length - lgroup;
        for (i = j = 0, ref = pos - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          if ((pos - i) % group === 0 && i !== 0) {
            formattedText += ' ';
          }
          formattedText += whole.charAt(i);
        }
      }
      for (i = k = ref1 = pos, ref2 = whole.length - 1; ref1 <= ref2 ? k <= ref2 : k >= ref2; i = ref1 <= ref2 ? ++k : --k) {
        if ((whole.length - i) % lgroup === 0 && i !== 0) {
          formattedText += ' ';
        }
        formattedText += whole.charAt(i);
      }
      while (fraction.length < fractionSize) {
        fraction += '0';
      }
      if (fractionSize && fractionSize !== "0") {
        formattedText += ',' + fraction.substr(0, fractionSize);
      }
    } else {
      if (fractionSize > 0 && number < 1) {
        formattedText = number.toFixed(fractionSize);
        number = parseFloat(formattedText);
        formattedText = formattedText.replace('.', ',');
      }
    }
    if (number === 0) {
      isNegative = false;
    }
    parts.push(isNegative ? "-" : "", formattedText);
    return parts.join('') + ' Kč';
  };
});

app.service('anchorSmoothScroll', function() {
  var currentYPosition, elmYPosition, scrollTo;
  currentYPosition = function() {
    if (self.pageYOffset) {
      return self.pageYOffset;
    }
    if (document.documentElement && document.documentElement.scrollTop) {
      return document.documentElement.scrollTop;
    }
    if (document.body.scrollTop) {
      return document.body.scrollTop;
    }
    return 0;
  };
  elmYPosition = function(eID) {
    var elm, node, y;
    elm = document.getElementById(eID);
    if (!elm) {
      return 0;
    }
    y = elm.offsetTop;
    node = elm;
    while (node.offsetParent && node.offsetParent !== document.body) {
      node = node.offsetParent;
      y += node.offsetTop;
    }
    return y;
  };
  return scrollTo = function(eID) {
    var distance, i, leapY, results, speed, startY, step, stopY, timer;
    startY = currentYPosition();
    stopY = elmYPosition(eID);
    distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
      return;
    }
    speed = Math.round(distance / 100);
    if (speed >= 20) {
      speed = 20;
    }
    step = Math.round(distance / 25);
    leapY = stopY > startY ? startY + step : startY - step;
    timer = 0;
    if (stopY > startY) {
      i = startY;
      while (i < stopY) {
        setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
        leapY += step;
        if (leapY > stopY) {
          leapY = stopY;
        }
        timer++;
        i += step;
      }
      return;
    }
    i = startY;
    results = [];
    while (i > stopY) {
      setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
      leapY -= step;
      if (leapY < stopY) {
        leapY = stopY;
      }
      timer++;
      results.push(i -= step);
    }
    return results;
  };
});
