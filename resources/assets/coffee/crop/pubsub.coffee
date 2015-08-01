app.factory 'cropPubSub', [ ->
	->
		events = {}
		# Subscribe

		@on = (names, handler) ->
			names.split(' ').forEach (name) ->
				if !events[name]
					events[name] = []
				events[name].push handler
				return
			this

		# Publish

		@trigger = (name, args) ->
			angular.forEach events[name], (handler) ->
				handler.call null, args
				return
			this

		return
]