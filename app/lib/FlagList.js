/**
 * @file модуль с флагами состояния жлементов приложения. Объекты: {@link game.flag}.
 */
'use strict';

let Flag = {
    _collection: {},
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
    }
};

export default Flag;

