// This file should be placed between "inputEx/field.js" and all other inputEx fields
// see http://javascript.neyric.com/inputex
(function() {

    var lang = YAHOO.lang;

    /**
     * Copy of the original inputEx.Field class that we're gonna override to extend it.
     * @class BaseField
     * @namespace inputEx
     */
    inputEx.BaseField = inputEx.Field;

    /**
     * Class to make inputEx Fields "wirable".Re-create inputEx.Field adding the wirable properties
     * @class Field
     * @namespace inputEx
     * @extends inputEx.BaseField
     */
    inputEx.Field = function(options) {
        inputEx.Field.superclass.constructor.call(this, options);
    };

    lang.extend(inputEx.Field, inputEx.BaseField, {
        /**
         * Adds a wirable option to every field
         * @method setOptions
         */
        setOptions: function(options) {
            inputEx.Field.superclass.setOptions.call(this, options);

            this.options.wirable = lang.isUndefined(options.wirable) ? false : options.wirable;
            this.options.container = options.container;
        },
        /**
         * Adds a terminal to each field
         * @method render
         */
        render: function() {
            inputEx.Field.superclass.render.call(this);

            if (this.options.wirable) {
                this.renderTerminal();
            }
        },
        /**
         * Render the associated input terminal
         * @method renderTerminal
         */
        renderTerminal: function() {

            var wrapper = inputEx.cn('div', {className: 'WireIt-InputExTerminal'});
            this.divEl.insertBefore(wrapper, this.fieldContainer);

            this.terminal = new WireIt.Terminal(wrapper, {
                name: this.options.name,
                "direction": [1, 0],
                "offsetPosition": {
                    "left": 168,
                    "top": -2
                },
                fakeDirection: [0, 1],
                ddConfig: {
                    type: "output",
                    allowedTypes: ["input"]
                },
                nMaxWires: 1}, this.options.container);

            // Dfly name for this terminal
            this.terminal.dflyName = "input_" + this.options.name;

            // Reference to the container
            if (this.options.container) {
                this.options.container.terminals.push(this.terminal);
            }

            // Register the events
            this.terminal.eventAddWire.subscribe(this.onAddWire, this, true);
            this.terminal.eventRemoveWire.subscribe(this.onRemoveWire, this, true);
        },

        /**
         * Remove the input wired state on the 
         * @method onAddWire
         */
        onAddWire: function(e, params) {
            this.options.container.onAddWire(e, params);

//            this.disable();
            var value = this.el.value;
            this.el.value = value;
            this.terminal.el.title = this.el.value;
            this.terminal.options.name = this.el.value;
            
//            console.log(this.terminal.el);
//            console.log(this.terminal.options.name);
//            console.log("value3: " + this.el.value);
        },
        /**
         * Remove the input wired state on the 
         * @method onRemoveWire
         */
        onRemoveWire: function(e, params) {
                        
            this.options.container.onRemoveWire(e, params);
//            this.enable();
//            this.el.value = "";
        }

    });


})();