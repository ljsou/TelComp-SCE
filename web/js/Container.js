(function() {

    var util = YAHOO.util;
    var Dom = util.Dom, Event = util.Event, CSS_PREFIX = "WireIt-";

    /**
     * Visual module that contains terminals. The wires are updated when the module is dragged around.
     * @class Container
     * @namespace WireIt
     * @constructor
     * @param {Object}   options      Configuration object (see options property)
     * @param {WireIt.Layer}   layer The WireIt.Layer (or subclass) instance that contains this container
     */
    WireIt.Container = function(options, layer) {

        // Set the options
        this.setOptions(options);

        /**
         * the WireIt.Layer object that schould contain this container
         * @property layer
         * @type {WireIt.Layer}
         */
        this.layer = layer;

        /**
         * List of the terminals 
         * @property terminals
         * @type {Array}
         */
        this.terminals = [];

        /**
         * List of all the wires connected to this container terminals
         * @property wires
         * @type {Array}
         */
        this.wires = [];

        /**
         * Container DOM element
         * @property el
         * @type {HTMLElement}
         */
        this.el = null;

        /**
         * Body element
         * @property bodyEl
         * @type {HTMLElement}
         */
        this.bodyEl = null;

        /**
         * Event that is fired when a wire is added
         * You can register this event with myTerminal.eventAddWire.subscribe(function(e,params) { var wire=params[0];}, scope);
         * @event eventAddWire
         */
        this.eventAddWire = new util.CustomEvent("eventAddWire");

        /**
         * Event that is fired when a wire is removed
         * You can register this event with myTerminal.eventRemoveWire.subscribe(function(e,params) { var wire=params[0];}, scope);
         * @event eventRemoveWire
         */
        this.eventRemoveWire = new util.CustomEvent("eventRemoveWire");

        // Render the div object
        this.render();

        // Init the terminals
        this.initTerminals(this.options.terminals);

        // Make the container draggable
        if (this.options.draggable) {

            if (this.options.resizable) {
                // Make resizeable   
                this.ddResize = new WireIt.util.DDResize(this);
                this.ddResize.eventResize.subscribe(this.onResize, this, true);
            }

            // Use the drag'n drop utility to make the container draggable
            this.dd = new WireIt.util.DD(this.terminals, this.el);

            // Sets ddHandle as the drag'n drop handle
            if (this.options.ddHandle) {
                this.dd.setHandleElId(this.ddHandle);
            }

            // Mark the resize handle as an invalid drag'n drop handle and vice versa
            if (this.options.resizable) {
                this.dd.addInvalidHandleId(this.ddResizeHandle);
                this.ddResize.addInvalidHandleId(this.ddHandle);
            }
        }

    };

    WireIt.Container.prototype = {
        /**
         * set the options
         * @method setOptions
         */
        setOptions: function(options) {

            /**
             * Main options object
             * <ul>
             *    <li>terminals: list of the terminals configuration</li>
             *    <li>draggable: boolean that enables drag'n drop on this container (default: true)</li>
             *    <li>className: CSS class name for the container element (default 'WireIt-Container')</li>
             *    <li>position: initial position of the container</li>
             *    <li>ddHandle: (only if draggable) boolean indicating we use a handle for drag'n drop (default true)</li>
             *    <li>ddHandleClassName: CSS class name for the drag'n drop handle (default 'WireIt-Container-ddhandle')</li>
             *    <li>resizable: boolean that makes the container resizable (default true)</li>
             *    <li>resizeHandleClassName: CSS class name for the resize handle (default 'WireIt-Container-resizehandle')</li>
             *    <li>width: initial width of the container (no default so it autoadjusts to the content)</li>
             *    <li>height: initial height of the container (default 100)</li>
             *    <li>close: display a button to close the container (default true)</li>
             *    <li>closeButtonClassName: CSS class name for the close button (default "WireIt-Container-closebutton")</li>
             *    <li>title: text that will appear in the module header</li>
             *    <li>icon: image url to be displayed in the module header</li>
             *    <li>preventSelfWiring: option to prevent connections between terminals of this same container (default true)</li>
             * </ul>
             * @property options
             * @type {Object}
             */
            this.options = {};
            this.options.terminals = options.terminals || [];
            this.options.draggable = (typeof options.draggable === "undefined") ? true : options.draggable;
            this.options.position = options.position || [100, 100];
            this.options.className = options.className || CSS_PREFIX + 'Container';

            this.options.ddHandle = (typeof options.ddHandle === "undefined") ? true : options.ddHandle;
            this.options.ddHandleClassName = options.ddHandleClassName || CSS_PREFIX + "Container-ddhandle";

            this.options.resizable = (typeof options.resizable === "undefined") ? true : options.resizable;
            this.options.resizeHandleClassName = options.resizeHandleClassName || CSS_PREFIX + "Container-resizehandle";

            this.options.width = options.width; // no default
            this.options.height = options.height;

            this.options.close = (typeof options.close === "undefined") ? true : options.close;
            this.options.closeButtonClassName = options.closeButtonClassName || CSS_PREFIX + "Container-closebutton";

            this.options.title = options.title; // no default
            console.log("this.options.title");
            console.log(this.options.title);

//      console.log(options.idcomp);
            this.options.idcomp = (typeof options.idcomp === "undefined") ? false : options.idcomp;

            this.options.icon = options.icon;

            this.options.preventSelfWiring = (typeof options.preventSelfWiring === "undefined") ? true : options.preventSelfWiring;
        },
        /**
         * Function called when the container is being resized.
         * It doesn't do anything, so please override it.
         * @method onResize
         */
        onResize: function(event, args) {
            var size = args[0];
            WireIt.sn(this.bodyEl, null, {
                width: (size[0] - 24) + "px"
//                height: (size[1] - 44) + "px"
            });
        },
        /**
         * Render the dom of the container
         * @method render
         */
        render: function() {

            // Create the element
            this.el = WireIt.cn('div', {className: this.options.className});

            if (this.options.width) {
                this.el.style.width = this.options.width + "px";
            }
            if (this.options.height) {
                this.el.style.height = this.options.height + "px";
            }

            // Adds a handler for mousedown so we can notice the layer
            Event.addListener(this.el, "dblclick", this.onMouseDown, this, true);
            Event.addListener(this.el, "click", this.onClick, this, true);

            if (this.options.ddHandle) {
                // Create the drag/drop handle
                this.ddHandle = WireIt.cn('div', {className: this.options.ddHandleClassName});
                this.el.appendChild(this.ddHandle);

                // Set title
                if (this.options.title) {
                    this.ddHandle.appendChild(WireIt.cn('span', null, null, this.options.title));
                }

                // Icon
                if (this.options.icon) {
                    var iconCn = WireIt.cn('img', {src: this.options.icon, className: 'WireIt-Container-icon'});
                    this.ddHandle.appendChild(iconCn);
                }

            }

            // Create the body element
            this.bodyEl = WireIt.cn('div', {className: "body"});
            this.el.appendChild(this.bodyEl);

            if (this.options.resizable) {
                // Create the resize handle
                this.ddResizeHandle = WireIt.cn('div', {className: this.options.resizeHandleClassName});
                this.el.appendChild(this.ddResizeHandle);
            }

            if (this.options.close) {
                // Close button
                this.closeButton = WireIt.cn('div', {className: this.options.closeButtonClassName});
                this.el.appendChild(this.closeButton);
                Event.addListener(this.closeButton, "click", this.onCloseButton, this, true);
            }

            // Append to the layer element
            this.layer.el.appendChild(this.el);

            // Set the position
            this.el.style.left = this.options.position[0] + "px";
            this.el.style.top = this.options.position[1] + "px";
        },
        /**
         * Sets the content of the body element
         * @method setBody
         * @param {String or HTMLElement} content
         */
        setBody: function(content) {
            if (typeof content === "string") {
                this.bodyEl.innerHTML = content;
            }
            else {
                this.bodyEl.innerHTML = "";
                this.bodyEl.appendChild(content);
            }
        },
        /**
         * Called when the user made a mouse down on the container and sets the focus to this container (only if within a Layer)
         * @method onMouseDown
         */
        onMouseDown: function() {
            console.log("Evento! en: " + this.options.title);
            console.log("ID: " + this.options.idcomp);
            //document.getElementById("here2").innerText = this.el.innerText;
            if (this.options.xtype === "WireIt.InOutContainer") {
                document.getElementById('simSearch').value = new String(this.options.idcomp);
                document.getElementById('simBtn').click();
                document.getElementById("dvLoading").style.display = "block";
            } else {
                console.log("this is not a InOutContainer");
                console.log("this is not a InOutContainer");
            }
            //loadSearchPanel(telcompLanguage);
            if (this.layer) {
                if (this.layer.focusedContainer && this.layer.focusedContainer !== this) {
                    this.layer.focusedContainer.removeFocus();
                }
                this.setFocus();
                this.layer.focusedContainer = this;
            }
        },
        onClick: function() {
            console.log("Click! en: " + this.options.title);
            console.log("ID: " + this.options.idcomp);
            //document.getElementById("here2").innerText = this.el.innerText;
            if (this.options.xtype === "WireIt.InOutContainer") {
                document.getElementById('componentInfo').value = new String(this.options.idcomp);
                document.getElementById('componentInfoBtn').click();
            } else {
                console.log("this is not a InOutContainer");
                //alert("this is not a InOutContainer");
            }
        },
        /**
         * Adds the class that shows the container as "focused"
         * @method setFocus
         */
        setFocus: function() {
            Dom.addClass(this.el, CSS_PREFIX + "Container-focused");
        },
        /**
         * Remove the class that shows the container as "focused"
         * @method removeFocus
         */
        removeFocus: function() {
            Dom.removeClass(this.el, CSS_PREFIX + "Container-focused");
        },
        /**
         * Called when the user clicked on the close button
         * @method onCloseButton
         */
        onCloseButton: function(e, args) {
            Event.stopEvent(e);
            this.layer.removeContainer(this);
        },
        /**
         * Remove this container from the dom
         * @method remove
         */
        remove: function() {

            // Remove the terminals (and thus remove the wires)
            this.removeAllTerminals();

            // Remove from the dom
            this.layer.el.removeChild(this.el);

            // Remove all event listeners
            Event.purgeElement(this.el);
        },
        /**
         * Call the addTerminal method for each terminal configuration.
         * @method initTerminals
         */
        initTerminals: function(terminalConfigs) {
            for (var i = 0; i < terminalConfigs.length; i++) {
                this.addTerminal(terminalConfigs[i]);
            }
        },
        /**
         * Instanciate the terminal from the class pointer "xtype" (default WireIt.Terminal)
         * @method addTerminal
         * @return {WireIt.Terminal}  terminal Created terminal
         */
        addTerminal: function(terminalConfig) {

            // Terminal type
            var type = eval(terminalConfig.xtype || "WireIt.Terminal");

            // Instanciate the terminal
            var term = new type(this.el, terminalConfig, this);

            // Add the terminal to the list
            this.terminals.push(term);

            // Event listeners
            term.eventAddWire.subscribe(this.onAddWire, this, true);
            term.eventRemoveWire.subscribe(this.onRemoveWire, this, true);

            return term;
        },
        /**
         * This method is called when a wire is added to one of the terminals
         * @method onAddWire
         * @param {Event} event The eventAddWire event fired by the terminal
         * @param {Array} args This array contains a single element args[0] which is the added Wire instance
         */
        onAddWire: function(event, args) {
//            console.log("Evento! " + JSON.stringify(event));
            var wire = args[0];
            var i;
            var add = true;
            if (this.options.xtype === "WireIt.InOutContainer") {
                console.log("is a WireIt.InOutContainer");
                // add the wire to the list if it isn't in
                if (WireIt.indexOf(wire, this.wires) === -1) {
                    this.wires.push(wire);
                    this.eventAddWire.fire(wire);
                    var wireName = wire.wireID + this.options.title;
                    /**
                     * El código desde aquí hasta la línea 392 tiene el objetivo de evluar si existen aristas con el mismo "wireID", 
                     * ya que el wireID está conformado por los nombres de los contenedores que une; así, como pueden existir 
                     * diversas aristas entre dos módulos, como es el caso de los FormContainer y InOutContainer, era necesario diferenciar
                     * tales wires.
                     * 
                     * this.wires.length solo consideraba los wires conectados al presente InOutContainer provenientes del FormContainer. Entonces, cuando existían dos o más
                     * InOutContainers contectados con un FormContainer mediante diversos wires, estos mantenían el mismo ID, ya que no se tenía en cuenta la totalidad de 
                     * los wires en el canvas, si no, aquellos que comportía la pareja (InOutContainers-FormContainer). 
                     * 
                     * Por lo tanto, es necesario adicionar this.layer.wires.length, el cual contiene todos los wires del canvas.
                     * 
                     */
                    for (i = 0; i < this.layer.wires.length; i++) {
                        if (this.layer.wires[i].wireID === wireName) {
                            var ind = this.layer.wires.length - i;
                            wire.wireID = wire.wireID + this.options.title + "_" + ind;
                            add = false;
                            break;
                        }
                    }
                    if (add) {
                        wire.wireID = wire.wireID + this.options.title;
                    }

                    console.log("WireID: " + wire.wireID);
                    if ((wire.terminal1.container.options.title === this.options.title)) {
                        console.log("Terminal1 (InOutContainer)" + wire.terminal1.container.options.title + "(" + wire.terminal1.container.options.idcomp + ")");
                        document.getElementById('queryIdInput').value = wire.terminal1.container.options.idcomp;
                        document.getElementById('initQueryDataBtn').click();
                    } else if (wire.terminal2.container.options.title === this.options.title) {
                        console.log("Terminal2 (InOutContainer)" + wire.terminal2.container.options.title + "(" + wire.terminal2.container.options.idcomp + ")");
                        document.getElementById('targetIdInput').value = wire.terminal2.container.options.idcomp;
                        document.getElementById('initTargetDataBtn').click();
                    }
                }
            } else if (this.options.xtype === "WireIt.FormContainer") {
                console.log("is a WireIt.FormContainer");
                if (WireIt.indexOf(wire, this.wires) === -1) {
                    this.wires.push(wire);
                    this.eventAddWire.fire(wire);
                    wire.wireID = wire.wireID + this.options.title;
//                    console.log("idComp: " + this.options.idcomp);
                    console.log("WireID: " + wire.wireID);
                    if ((wire.terminal1.container.options.title === this.options.title)) {
                        console.log("Terminal1 (FormContainer)" + wire.terminal1.container.options.title + "(" + wire.terminal1.container.options.idcomp + ")");
                        document.getElementById('operationName').value = wire.terminal1.container.options.title;
                        document.getElementById('operationNameBtn').click();
                        document.getElementById('userDataQuery').value = wire.terminal1.options.name;
                        document.getElementById('userDataQueryBtn').click();
                    } else if (wire.terminal2.container.options.title === this.options.title) {
                        console.log("Terminal2 (FormContainer)" + wire.terminal2.container.options.title + "(" + wire.terminal2.container.options.idcomp + ")");
                        document.getElementById('userDataTarget').value = wire.terminal2.container.options.idcomp;
                        document.getElementById('userDataTargetBtn').click();
                    }
                }
            } else {
                console.log("is a WireIt.ImageContainer ");
            }
        }
        ,
        /**
         * This method is called when a wire is removed from one of the terminals
         * @method onRemoveWire
         * @param {Event} event The eventRemoveWire event fired by the terminal
         * @param {Array} args This array contains a single element args[0] which is the removed Wire instance
         */
        onRemoveWire: function(event, args) {
            console.log("onRemoveWire...");
            var wire = args[0];
            var index = WireIt.indexOf(wire, this.wires);
            if (index !== -1) {
                this.eventRemoveWire.fire(wire);
                this.wires[index] = null;
            }
            this.wires = WireIt.compact(this.wires);
        },
        /**
         * Remove all terminals
         * @method removeAllTerminals
         */
        removeAllTerminals: function() {
            for (var i = 0; i < this.terminals.length; i++) {
                this.terminals[i].remove();
            }
            this.terminals = [];
        },
        /**
         * Redraw all the wires connected to the terminals of this container
         * @method redrawAllTerminals
         */
        redrawAllWires: function() {
            for (var i = 0; i < this.terminals.length; i++) {
                this.terminals[i].redrawAllWires();
            }
        },
        /**
         * Return the config of this container.
         * @method getConfig
         */
        getConfig: function() {
            var obj = {};

//      // Position
//      obj.position = Dom.getXY(this.el);
//      if(this.layer) {
//         // remove the layer position to the container position
//         var layerPos = Dom.getXY(this.layer.el);
//         obj.position[0] -= layerPos[0];
//         obj.position[1] -= layerPos[1];
//         // add the scroll position of the layer to the container position
//         obj.position[0] += this.layer.el.scrollLeft;
//         obj.position[1] += this.layer.el.scrollTop;
//      }
//   
            // xtype
//      if(this.options.xtype) {
//         obj.xtype = this.options.xtype;
//      }
            if (this.options.title) {
                obj.title = this.options.title;
            }

            if (this.options.idcomp) {
                obj.idcomp = this.options.idcomp;
            }



            return obj;
        },
        /**
         * Subclasses should override this method.
         * @method getValue
         * @return {Object} value
         */
        getValue: function() {
            return {};
        },
        /**
         * Subclasses should override this method.
         * @method setValue
         * @param {Any} val Value 
         */
        setValue: function(val) {
        },
        /**
         * @method getTerminal
         */
        getTerminal: function(name) {
            var term;
            for (var i = 0; i < this.terminals.length; i++) {
                term = this.terminals[i];
                if (term.options.name === name) {
                    return term;
                }
            }
            return null;
        }

    };

})();