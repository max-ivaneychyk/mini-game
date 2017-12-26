/**
 * @file модуль с флагами состояния жлементов приложения. Объекты: {@link game.flag}.
 */
'use strict';

(function () {
    var game = window.game,
       utils = game.utils;


    game.flag = {
        _collection: {
            'auto': false,
            'noEnrolledWin': false,
            'noEnrolledJp': false,
            'enroll': false,
            'gamble': false,
            'info': false,
            'menu': false,
            'slots': false,
            'bonus': false,
            'win': false,
            'freespin': false,
            'freespin-complete': false,
            'bannerFlag': false,
            'jpFlag': false,
            'ajaxRes': false,
            'gamble_showed': false,
            'gamble_defeated': false,
            'after_gamble': false
        },
        get: function (name) {
            if (typeof name !== 'string') {
                return name;
            }

            var reversResult, result;
            if (name[0] === '!') {
                reversResult = true;
                result = this._collection[name.slice(1)];
            } else {
                reversResult = false;
                result = this._collection[name];
            }

            return reversResult ? !result : result;
        },
        set: function (name, flag) {
            this._collection[name] = Boolean(flag);
        },
        check: function () {
            var isTrue = true;
            for (var i = 0, len = arguments.length; i < len; i++) {
                if (!this.get(arguments[i])) {
                    isTrue = false;
                    break;
                }
            }
            return isTrue;
        },
        or: function () {
            var isTrue = false;
            for (var i = 0, len = arguments.length; i < len; i++) {
                if (this.get(arguments[i])) {
                    isTrue = true;
                    break;
                }
            }
            return isTrue;
        },
        makeBackUp: function () {
            utils.storage.set('backUp_flags', JSON.stringify(this._collection));
        },
        getBackUp: function () {
            return JSON.parse(utils.storage.get('backUp_flags'));
        }
    };
})();
