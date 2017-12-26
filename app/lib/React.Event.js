import Event from './Event';

export default function (lib) {

    lib.Event = Object.assign({}, Event);

    lib.Event.__list = [];

    lib.Event.__list.add = function (nameComponent) {
        this.push(nameComponent)
    };

    lib.Event.__list.remove = function (nameComponent) {
        let index = this.indexOf(nameComponent);
        if (index + 1 ) {
            this.splice(index, 1)
        }
    };


    lib.Event.emit = function (eventName, componentsList, data) {
        if (arguments.length === 2) {
            return Event.emit.apply(this, arguments);
        }

        if (arguments.length !== 3) {
            return console.error('Bad arguments list');
        }

        if (componentsList === 'ALL') {
            componentsList = this.__list;
        }

        [].concat(componentsList).forEach(nameComponent => {
            Event.emit(`${eventName}[${nameComponent}]`, data);
        });
    };

    function updateListComponentsDecorate(f, addOrRemove) {
        return function (name) {
            let nameComponent = name.replace(/.*\[/, '').replace(']', '');
            if (nameComponent) {
                addOrRemove ?
                    lib.Event.__list.add(nameComponent) :
                    lib.Event.__list.remove(nameComponent);
            }
            return f.apply(this, arguments);
        }
    }

    lib.Event.on = updateListComponentsDecorate(lib.Event.on, true);
    lib.Event.onDel = updateListComponentsDecorate(lib.Event.onDel, false);
}

