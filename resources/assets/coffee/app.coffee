app = angular.module 'ToChcete', ['ngTagsInput', 'masonry']

app.filter 'crowns', () -> return (num, fractionSize) ->
	DECIMAL_SEP = ','
	if angular.isString(num) and num.indexOf('Kč') isnt -1 then num.toLowerCase().replace('kč', '').replace(' ', '')
	else if angular.isObject(num) then return ''

	isNegative = num < 0
	num = Math.abs(num)

	isInfinity = num is Infinity
	if !isInfinity and !isFinite(num) then return ''

	numStr = num + ''
	formattedText = ''
	hasExponent = false
	parts = []

	if isInfinity then formattedText = '\u221e'

	if !isInfinity and numStr.indexOf('e') isnt -1
		match = numStr.match(/([\d\.]+)e(-?)(\d+)/)
		if match and match[2] is '-' and match[3] > fractionSize + 1
			num = 0
		else
			formattedText = numStr
			hasExponent = true

	if !isInfinity and !hasExponent
		if angular.isUndefined(fractionSize) then fractionSize = 0

		number = +(Math.round(+(num.toString() + 'e' + fractionSize)).toString() + 'e' + -fractionSize)

		fraction = ('' + number).split(DECIMAL_SEP)
		whole = fraction[0]
		fraction = fraction[1] || ''

		pos = 0
		lgroup = 3
		group = 3

		if whole.length >= (lgroup + group)
			pos = whole.length - lgroup
			for i in [0..pos-1]
				if (pos - i) % group is 0 and i isnt 0 then formattedText += ' '
				formattedText += whole.charAt(i)

		for i in [pos..whole.length-1]
			if (whole.length - i) % lgroup is 0 && i isnt 0 then formattedText += ' '
			formattedText += whole.charAt(i)

		while fraction.length < fractionSize
			fraction += '0'

		if fractionSize and fractionSize isnt "0" then formattedText += ',' + fraction.substr(0, fractionSize)
	else
		if fractionSize > 0 && number < 1
			formattedText = number.toFixed(fractionSize)
			number = parseFloat(formattedText);
			formattedText = formattedText.replace('.', ',')

	if number is 0 then isNegative = false

	parts.push(
		if isNegative then "-" else "",
		formattedText
	)
	return parts.join('') + ' Kč'

app.service 'anchorSmoothScroll', ->

	currentYPosition = ->
		if self.pageYOffset
			return self.pageYOffset

		if document.documentElement and document.documentElement.scrollTop
			return document.documentElement.scrollTop

		if document.body.scrollTop
			return document.body.scrollTop

		return 0

	elmYPosition = (eID) ->
		elm = document.getElementById(eID)
		if !elm then return 0

		y = elm.offsetTop
		node = elm
		while node.offsetParent and node.offsetParent != document.body
			node = node.offsetParent
			y += node.offsetTop
		return y

	scrollTo = (eID) ->
		startY = currentYPosition()
		stopY = elmYPosition(eID)
		distance = if stopY > startY then stopY - startY else startY - stopY

		if distance < 100 then return

		speed = Math.round(distance / 100)
		if speed >= 20
			speed = 20

		step = Math.round(distance / 25)
		leapY = if stopY > startY then startY + step else startY - step
		timer = 0
		if stopY > startY
			i = startY
			while i < stopY
				setTimeout 'window.scrollTo(0, ' + leapY + ')', timer * speed
				leapY += step
				if leapY > stopY
					leapY = stopY
				timer++
				i += step
			return
		i = startY
		while i > stopY
			setTimeout 'window.scrollTo(0, ' + leapY + ')', timer * speed
			leapY -= step
			if leapY < stopY
				leapY = stopY
			timer++
			i -= step