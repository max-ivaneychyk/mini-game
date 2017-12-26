

	var event = {},
		events = {};

	/**
	 * @global
	 * @param {String} name название события
	 * @param {{}} objEvent объект события
	 * @param {{}} ctx контекст события
	 * @param {array} listners массив слушателей события
	 * @constructor
	 * @desc записываеться в {@link event.utils~instance}
	 */
	function Event(name) {
		this.name = name;
		this.listners = [];
	}

	/**
	 * @memberOf Event
	 * @type {{constructor: Event, once: Event.once, on: Event.on, onDel: Event.onDel, trigger: Event.trigger}}
	 */
	Event.prototype = {
		constructor: Event,
		lastListenerRunFirst: function () {
			var lastFunc = this.listners.splice(this.listners.length - 1)[0];
			this.listners.unshift(lastFunc);
		},
		/**
		 * @desc добавить одноразовый ивент
		 * @param {Function} handler обработчик события
		 */
		once: function (handler) {
			var action =  () => {
					handler.apply(this, arguments);
					this.onDel(action);
				};

			action.onceNameFunc = true;
			this.on(action);
			return this;
		},
		/**
		 * @desc добавить ивент
		 * @param {Function} handler обработчик события
		 */
		on: function (handler) {
			if (handler && handler.call) {
				this.listners.push(handler);
			} else {
				console.warn(handler, 'is not a function');
			}
			return this;
		},
		/**
		 * @desc удалить ивент
		 * @param {Function} link обработчик события
		 */
		onDel: function (link) {
			var key = this.listners.length;
			for (; key--;) {
				if (this.listners[key] === link) {
					this.listners.splice(key, 1);
				}
			}
			return null;
		},
		/**
		 * @desc вызвать (action) ивента, заставить ивент сработать
		 * @param data
		 */
		emit: function (data) {
			// clone handlers
			var listeners = [].concat(this.listners);
			// event data
			data = data || {};
			data._eventName = this.name;

			//console.log('EMIT EVENT -', this.name, data);
			// exe all handlers
			listeners.forEach(function (handler, num) {
				handler(data, num);
			});
		}
	};
	/**
	 * @memberOf event
	 * @desc добавить событие
	 * @param {String} name имя события
	 * @param {{}} objEvent объект события
	 * @param {{}} ctx контекст события
	 * @param {array} listners массив слушателей события
	 * @returns {{}} объект событий
	 */
	event.addEvent = function (name) {
		try {
			if (!event.hasEvent(name)) {
				events[name] = new Event(name);
			}
		} catch (err) {
			console.error('create event error =>', err);
		}
		return events[name];
	};
	/**
	 * @memberOf event
	 * @desc проверить наличие события
	 * @param {String} name имя события
	 * @returns {{}} объект события
	 */
	event.hasEvent = function (name) {
		return events[name];
	};
	/**
	 * @memberOf event
	 * @desc вернет уже существующее или новосозданое событие
	 * @param {String} name имя события
	 * @returns {{}} объект события
	 */
	event.event = function (name) {
		if (!event.hasEvent(name)) {
			event.addEvent(name);
		}
		return events[name];
	};
	/**
	 * @memberOf event
	 * @desc проверяет наличие ивента и тригерит его
	 * @param {String} name имя события
	 */
	event.emit = function (name, data) {
		if (event.hasEvent(name)) {
			events[name].emit(data);
		} else {
			console.warn('Not found handlers event -> ' + name);
		}
	};

	event.on = function (name, handler) {
		return event.event(name).on(handler);
	};

	event.on.every = function (arrNamesEvents, handler) {
		arrNamesEvents.forEach(function (eventName) {
			event.on(eventName, handler);
		});
	};

	event.once = function (name, handler) {
		return event.event(name).once(handler);
	};

	event.once.oneOf = function (arrNamesEvents, handler) {
		var f = function (data) {
			arrNamesEvents.forEach(function (eventName) {
				event.onDel(eventName, f);
			});

			handler(data);
		};

		arrNamesEvents.forEach(function (eventName) {
			event.on(eventName, f);
		});
	};

	event.once.every = function (arrNamesEvents, handler) {
		var countEvents = arrNamesEvents.length;

		arrNamesEvents.forEach(function (eventName) {
			event.once(eventName, function f() {
				countEvents--;
				// all events triggered
				if (!countEvents) {
					handler();
					// clear memory
					arrNamesEvents = null;
					handler = null;
				}
			});
		});
	};

	event.onDel = function (name, link) {
		if (events[name]) {
			events[name].onDel(link);
		}
	};
	event.getEventList = function () {// dev only
		return events;
	};



	/* Browser Events */
	[
        'resize',

        'keydown',
        'keyup',

        'touchstart',
        'touchmove',
        'touchend',

        'mousedown',
        'mouseup',

        'deviceorientation'
	].forEach(windowEventName => {
        window.addEventListener(windowEventName,  e => event.emit('on-' + windowEventName, e), false);
	});


export default event;




