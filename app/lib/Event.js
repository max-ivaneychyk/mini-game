/**
 * @file модуль управления событями приложения Конструкторы: {@link Event}.
 * Методы: {@link game.addEvent}, {@link game.hasEvent}, {@link game.on}, {@link game.once}, {@link game.onDel}, {@link game.getEventList},
 */
(function () {
	var game = window.game,
		utils = game.utils,
		events = {};

	/**
	 * @global
	 * @param {String} name название события
	 * @param {{}} objEvent объект события
	 * @param {{}} ctx контекст события
	 * @param {array} listners массив слушателей события
	 * @constructor
	 * @desc записываеться в {@link game.utils~instance}
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
			var action = function () {
					handler.apply(this, arguments);
					this.onDel(action);
				}.bind(this);

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
	 * @memberOf game
	 * @desc добавить событие
	 * @param {String} name имя события
	 * @param {{}} objEvent объект события
	 * @param {{}} ctx контекст события
	 * @param {array} listners массив слушателей события
	 * @returns {{}} объект событий
	 */
	game.addEvent = function (name) {
		try {
			if (!game.hasEvent(name)) {
				events[name] = utils.create('Event', name);
			}
		} catch (err) {
			console.error('create event error =>', err);
		}
		return events[name];
	};
	/**
	 * @memberOf game
	 * @desc проверить наличие события
	 * @param {String} name имя события
	 * @returns {{}} объект события
	 */
	game.hasEvent = function (name) {
		return events[name];
	};
	/**
	 * @memberOf game
	 * @desc вернет уже существующее или новосозданое событие
	 * @param {String} name имя события
	 * @returns {{}} объект события
	 */
	game.event = function (name) {
		if (!game.hasEvent(name)) {
			game.addEvent(name);
		}
		return events[name];
	};
	/**
	 * @memberOf game
	 * @desc проверяет наличие ивента и тригерит его
	 * @param {String} name имя события
	 */
	game.emitEvent = function (name, data) {
		if (game.hasEvent(name)) {
			events[name].emit(data);
		} else {
			console.warn('Not found event -> ' + name);
		}
	};
	/**
	 * @memberOf game
	 * @desc добавить обработчик к событию
	 * @param {String} name имя события
	 * @param {Function} handler обработчик события
	 */
	game.on = function (name, handler) {
		return game.event(name).on(handler);
	};
    /**
     * @memberOf game
     * @desc если хоть один ивент проскочит, то выполнить обработчик
     * @param {array} arrNamesEvents массив имен событий
     * @param {Function} handler обработчик события
     */
	game.oneOf = function (arrNamesEvents, handler) {
		var f = function (data) {
			arrNamesEvents.forEach(function (eventName) {
				game.onDel(eventName, f);
			});

			handler(data);
		};

		arrNamesEvents.forEach(function (eventName) {
			game.on(eventName, f);
		});
	};
    /**
     * @memberOf game
     * @desc если проскочат все именты, то выполнить обработчик
     * @param {array} arrNamesEvents массив имен событий
     * @param {Function} handler обработчик события
     */
	game.everyEvent = function (arrNamesEvents, handler) {
		arrNamesEvents.forEach(function (eventName) {
			game.on(eventName, handler);
		});
	};
	/**
	 * @memberOf game
	 * @desc добавить однократный обработчик к событию
	 * @param {String} name имя события
	 * @param {Function} handler обработчик события
	 */
	game.once = function (name, handler) {
		return game.event(name).once(handler);
	};
	/**
	 * @memberOf game
	 * @desc добавить однократный обработчик к массиву событий
	 * @param {array} arrNamesEvents имена событий
	 * @param {Function} handler обработчик события
	 */
	game.once.every = function (arrNamesEvents, handler) {
		var countEvents = arrNamesEvents.length;

		arrNamesEvents.forEach(function (eventName) {
			game.once(eventName, function f() {
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
	/**
	 * @memberOf game
	 * @desc удалить обработчик события
	 * @param {String} name имя события
	 * @param {Function} link обработчик события
	 */
	game.onDel = function (name, link) {
		if (events[name]) {
			events[name].onDel(link);
		}
	};
	/**
	 * @memberOf game
	 * @desc получить объект всех событий
	 * @returns {{}} объект всех событий
	 */
	game.getEventList = function () {// dev only
		return events;
	};
    /**
     * @memberOf game
     * @desc очистить список ивентов
     */
	game.clearEventList = function () {
		var slotStopEvents = events['on-slots-stop'].listners;

		slotStopEvents.forEach(function (event, index) {
			if (event.onceNameFunc) {
				slotStopEvents.splice(index, 1);
			}
		});
	};

	utils.record('Event', Event);
})();


/**
 * @desc нигерская магия
 */
(function () {
	var HIDDEN = 'hidden',
		game = window.game;

	function onchange(evt) {
		var v = 'visible', h = HIDDEN,
			evtMap = {
				focus: v,
				focusin: v,
				pageshow: v,
				blur: h,
				focusout: h,
				pagehide: h
			};

		evt = evt || window.event;
		if (evt.type in evtMap) { // при загрузке
			// console.log(this[HIDDEN]);//undefined
		} else if (game.appStatus && this[HIDDEN]) { // при блюре (сворачивание или переключение вкладки)
			// console.log(this[HIDDEN]);//true
			game.emitEvent('on-hidden-game');
		} else if (game.appStatus && !this[HIDDEN]) { // при фокусе (возвращение вкладки или развёртывание страници)
			// console.log(this[HIDDEN]);//false
			game.emitEvent('on-visible-game');
		}
	}

	game.visible = true;

	if (HIDDEN in document) {
		document.addEventListener('visibilitychange', onchange);
	} else if ((HIDDEN = 'mozHidden') in document) {
		document.addEventListener('mozvisibilitychange', onchange);
	} else if ((HIDDEN = 'webkitHidden') in document) {
		document.addEventListener('webkitvisibilitychange', onchange);
	} else if ((HIDDEN = 'msHidden') in document) {
		document.addEventListener('msvisibilitychange', onchange);
	} else if ('onfocusin' in document) {
		document.onfocusin = document.onfocusout = onchange;
	} else {
		window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
	}

	if (document[HIDDEN] !== undefined) {
		onchange({type: document[HIDDEN] ? 'blur' : 'focus'});
	}

	game.addEvent('on-hide-message-banner');
	game.addEvent('on-show-game-win-animation');
	game.addEvent('on-winner-play');
	game.addEvent('on-hidden-game');
	game.addEvent('on-visible-game');
	game.addEvent('on-came-response');
	game.addEvent('on-came-bonus-response');
	game.addEvent('on-came-origin-response');
	game.addEvent('balance-update');
	game.addEvent('action-complit');
})();
