(function() {
    var util = YAHOO.util, lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect, JSON = lang.JSON, widget = YAHOO.widget;


    /**
     * Module Proxy handle the drag/dropping from the module list to the layer (in the WiringEditor)
     * @class ModuleProxy
     * @constructor
     * @param {HTMLElement} el
     * @param {WireIt.WiringEditor} WiringEditor
     */
    WireIt.ModuleProxy = function(el, WiringEditor) {

        this._WiringEditor = WiringEditor;

        // Init the DDProxy
        WireIt.ModuleProxy.superclass.constructor.call(this, el, "module", {
            dragElId: "moduleProxy"
        });

        this.isTarget = false;
    };
    YAHOO.extend(WireIt.ModuleProxy, YAHOO.util.DDProxy, {
        /**
         * copy the html and apply selected classes
         * @method startDrag
         */
        startDrag: function(e) {
            WireIt.ModuleProxy.superclass.startDrag.call(this, e);
            var del = this.getDragEl(),
                    lel = this.getEl();
            del.innerHTML = lel.innerHTML;
            del.className = lel.className;
        },
        /**
         * Override default behavior of DDProxy
         * @method endDrag
         */
        endDrag: function(e) {
        },
        /**
         * Add the module to the WiringEditor on drop on layer
         * @method onDragDrop
         */
        onDragDrop: function(e, ddTargets) {
            // The layer is the only target :
            var layerTarget = ddTargets[0],
                    layer = ddTargets[0]._layer,
                    del = this.getDragEl(),
                    pos = YAHOO.util.Dom.getXY(del),
                    layerPos = YAHOO.util.Dom.getXY(layer.el);
            this._WiringEditor.addModule(this._module, [pos[0] - layerPos[0] + layer.el.scrollLeft, pos[1] - layerPos[1] + layer.el.scrollTop]);
        }

    });


    /**
     * The WiringEditor class provides a full page interface 
     * @class WiringEditor
     * @constructor
     * @param {Object} options
     */
    WireIt.WiringEditor = function(options) {

        /**
         * Hash object to reference module definitions by their name
         * @property modulesByName
         * @type {Object}
         */
        this.modulesByName = {};

        // set the default options
        this.setOptions(options);

        /**
         * Container DOM element
         * @property el
         */
        this.el = Dom.get(options.parentEl);

        /**
         * @property helpPanel
         * @type {YAHOO.widget.Panel}
         */
        this.helpPanel = new widget.Panel('helpPanel', {
            fixedcenter: true,
            draggable: true,
            visible: false,
            modal: true
        });
        this.helpPanel.setHeader("TelComp2.0 Project Help!");
        this.helpPanel.setBody("\
<h3>What is Pipes?</h3>\n\
<p>TelComp2.0 Project is a online service that lets you remix popular service types from Web 2.0 (Facebook, Twitter, so on) and Telco (IM, Calls, etc) domains, \n\
in order to create Services Telco2.0 by using a visual editor. </p>\
You can generate your own Telco2.0 Services without ever having to write a line of code \n\
<a href=\"http://localhost:8084/TelComp-SCE/faces/help.xhtml\"  target=\"_blank\">Learn how</a>");         
        this.helpPanel.render();


        /**
         * @property layout
         * @type {YAHOO.widget.Layout}
         */
        this.layout = new widget.Layout(this.el, this.options.layoutOptions);
        this.layout.render();

        // Right accordion
        this.renderAccordion();

        /**
         * @property layer
         * @type {WireIt.Layer}
         */
        this.layer = new WireIt.Layer(this.options.layerOptions);
        this.layer.eventChanged.subscribe(this.onLayerChanged, this, true);

        /**
         * @property leftEl
         * @type {DOMElement}
         */
        this.leftEl = Dom.get('here');
        this.leftEl2 = Dom.get('here2');
        this.leftEl3 = Dom.get('control-structures');


        // Render module list
        this.buildModulesList();
        this.buildModulesList2();

        // Render buttons
        this.renderButtons();

        // Saved status
        this.renderSavedStatus();

        // Properties Form
        this.renderPropertiesForm();

        // LoadWirings
        if (this.adapter.init && YAHOO.lang.isFunction(this.adapter.init)) {
            this.adapter.init();
        }
        this.load();
    };

    WireIt.WiringEditor.prototype = {
        /**
         * @method setOptions
         * @param {Object} options
         */
        setOptions: function(options) {
            console.log("Ingresa a setOptions: " + options.toString());

            /**
             * @property options
             * @type {Object}
             */
            this.options = {};

            // Load the modules from options
            this.modules = options.modules || [];
            for (var i = 0; i < this.modules.length; i++) {
                var m = this.modules[i];
                this.modulesByName[m.name] = m;
                console.log("Var m.name: '%s'", m.name);
            }

            this.adapter = options.adapter || WireIt.WiringEditor.adapters.JsonRpc;

            this.options.languageName = options.languageName || 'anonymousLanguage';

            this.options.propertiesFields = options.propertiesFields || [
                {
                    "type": "string",
                    inputParams: {
                        "name": "name",
                        label: "Search",
                        typeInvite: "Enter a query..."
                    }
                },
                //{"type": "text", inputParams: {"name": "description", label: "Description", cols: 30, rows: 4} }
            ];

            this.options.layoutOptions = options.layoutOptions || {
                units: [
                    {
                        position: 'top',
                        height: 50,
                        body: 'top',
                        background: '#fff'
                    },
                    {
                        position: 'right',
                        width: 265,
                        resize: true,
                        body: 'right',
                        gutter: '5px',
                        collapse: true,
                        collapseSize: 25,
                        header: 'Modules',
                        scroll: true,
                        animate: true
                    },
                    {
                        position: 'center',
                        body: 'center',
                        gutter: '1px'
                    },
                    {
                        position: 'left',
                        width: 259,
//                        resize: true,
                        body: 'left',
                        gutter: '1px',
                        collapse: true,
                        collapseSize: 25,
                        header: 'Map',
                        scroll: true,
                        animate: true
                    }
                ]
            };

            this.options.layerOptions = {};
            var layerOptions = options.layerOptions || {};
            this.options.layerOptions.parentEl = layerOptions.parentEl ? layerOptions.parentEl : Dom.get('center');
            this.options.layerOptions.layerMap = YAHOO.lang.isUndefined(layerOptions.layerMap) ? true : layerOptions.layerMap;
            this.options.layerOptions.layerMapOptions = layerOptions.layerMapOptions || {
                parentEl: 'layerMap'
            };

            this.options.accordionViewParams = options.accordionViewParams || {
                collapsible: true,
                expandable: true, // remove this parameter to open only one panel at a time
                width: '100%',
                expandItem: 0,
                animationSpeed: '0.3',
                animate: true,
                effect: YAHOO.util.Easing.easeBothStrong
            };
        },
        /**
         * @method setOptions
         * @param {Object} options
         */
        setAjaxOptions: function(options) {
            console.log("Ingresa a setAjaxOpetions: " + options.toString());

            /**
             * @property options
             * @type {Object}
             */
            this.options = {};

            // Load the modules from options
            this.modules = options.modules || [];
            for (var i = 0; i < this.modules.length; i++) {
                var m = this.modules[i];
                this.modulesByName[m.name] = m;
                console.log("Var m.name: '%s'", m.name);
            }

            this.adapter = options.adapter || WireIt.WiringEditor.adapters.JsonRpc;

            this.options.languageName = options.languageName || 'anonymousLanguage';

            this.options.propertiesFields = options.propertiesFields || [
                {
                    "type": "string",
                    inputParams: {
                        "name": "name",
                        label: "Search",
                        typeInvite: "Enter a query..."
                    }
                },
                //{"type": "text", inputParams: {"name": "description", label: "Description", cols: 30, rows: 4} }
            ];

            this.options.layoutOptions = options.layoutOptions || {
                units: [
                    {
                        position: 'top',
                        height: 50,
                        body: 'top'
                    },
                    {
                        position: 'right',
                        width: 230,
                        resize: true,
                        body: 'right',
                        gutter: '5px',
                        collapse: true,
                        collapseSize: 25,
                        header: 'Modules',
                        scroll: true,
                        animate: true
                    },
                    {
                        position: 'center',
                        body: 'center',
                        gutter: '5px'
                    },
                    {
                        position: 'left',
                        width: 265,
                        resize: true,
                        body: 'left',
                        gutter: '5px',
                        collapse: true,
                        collapseSize: 25,
                        header: 'Map',
                        scroll: true,
                        animate: true
                    }
                ]
            };

            this.options.layerOptions = {};
            var layerOptions = options.layerOptions || {};
            this.options.layerOptions.parentEl = layerOptions.parentEl ? layerOptions.parentEl : Dom.get('center');
            this.options.layerOptions.layerMap = YAHOO.lang.isUndefined(layerOptions.layerMap) ? true : layerOptions.layerMap;
            this.options.layerOptions.layerMapOptions = layerOptions.layerMapOptions || {
                parentEl: 'layerMap'
            };

            this.options.accordionViewParams = options.accordionViewParams || {
                collapsible: true,
                expandable: true, // remove this parameter to open only one panel at a time
                width: '210px',
                expandItem: 0,
                animationSpeed: '0.3',
                animate: true,
                effect: YAHOO.util.Easing.easeBothStrong
            };
        },
        /**
         * Render the accordion using yui-accordion
         */
        renderAccordion: function() {
            this.accordionView = new YAHOO.widget.AccordionView('accordionView', this.options.accordionViewParams);
        },
        /**
         * Render the properties form
         * @method renderPropertiesForm
         */
        renderPropertiesForm: function() {
            this.propertiesForm = new inputEx.Group({
                parentEl: YAHOO.util.Dom.get('propertiesForm'),
                fields: this.options.propertiesFields
            });

            this.propertiesForm.updatedEvt.subscribe(function() {
                this.markUnsaved();
            }, this, true);
        },
        /**
         * Build the left menu on the left
         * @method buildModulesList
         */
        buildModulesList: function() {

            var modules = this.modules;
            for (var i = 0; i < modules.length; i++) {
                this.addModuleToList(modules[i]);
            }

            // Make the layer a drag drop target
            if (!this.ddTarget) {
                this.ddTarget = new YAHOO.util.DDTarget(this.layer.el, "module");
                this.ddTarget._layer = this.layer;
            }

        },
        /**
         * Build the left menu on the left
         * @method buildModulesList
         */
        buildModulesList2: function() {

            var modules = this.modules;
            for (var i = 0; i < modules.length; i++) {
                this.addModuleToList2(modules[i]);
            }

            // Make the layer a drag drop target
            if (!this.ddTarget) {
                this.ddTarget = new YAHOO.util.DDTarget(this.layer.el, "module");
                this.ddTarget._layer = this.layer;
            }

        },
        /**
         * Add a module definition to the left list
         */
        addModuleToList: function(module) {

            var div = WireIt.cn('div', {
                className: "WiringEditor-module"
            });

            if (module.container.icon) {
                div.appendChild(WireIt.cn('img', {
                    src: module.container.icon
                }));
            }
            div.appendChild(WireIt.cn('span', null, null, module.name));

            var ddProxy = new WireIt.ModuleProxy(div, this);
            ddProxy._module = module;

            this.leftEl.appendChild(div);
            //this.leftEl2.appendChild(div);

        },
        /**
         * Add a module definition to the left list
         */
        addModuleToList2: function(module) {

            var div = WireIt.cn('div', {
                className: "WiringEditor-module"
            });

            if (module.container.icon) {
                div.appendChild(WireIt.cn('img', {
                    src: module.container.icon
                }));
            }
            div.appendChild(WireIt.cn('span', null, null, module.name));

            var ddProxy = new WireIt.ModuleProxy(div, this);
            ddProxy._module = module;

            this.leftEl2.appendChild(div);

        },
        /**
         * Add a module definition to the left list
         */
        addModuleToList3: function(module) {

            var div = WireIt.cn('div', {
                className: "WiringEditor-module"
            });

            if (module.container.icon) {
                div.appendChild(WireIt.cn('img', {
                    src: module.container.icon
                }));
            }
            div.appendChild(WireIt.cn('span', null, null, module.name));

            var ddProxy = new WireIt.ModuleProxy(div, this);
            ddProxy._module = module;

            this.leftEl3.appendChild(div);

        },
        /**
         * add a module at the given pos
         */
        addModule: function(module, pos) {
            try {
                var containerConfig = module.container;
                containerConfig.position = pos;
                containerConfig.title = module.name;
                var container = this.layer.addContainer(containerConfig);
                Dom.addClass(container.el, "WiringEditor-module-" + module.name);
            }
            catch (ex) {
                this.alert("Error Layer.addContainer: " + ex.message);
            }
        },
        /**
         * Toolbar
         * @method renderButtons
         */
        renderButtons: function() {
            var toolbar = Dom.get('toolbar');
            // Buttons :
            var newButton = new widget.Button({
                label: "New",
                id: "WiringEditor-newButton",
                container: toolbar
            });
            newButton.on("click", this.onNew, this, true);

            var loadButton = new widget.Button({
                label: "Export",
                id: "WiringEditor-loadButton",
                container: toolbar
            });
            loadButton.on("click", this.onExport, this, true);

            var saveButton = new widget.Button({
                label: "Save",
                id: "WiringEditor-saveButton",
                container: toolbar
            });
            saveButton.on("click", this.onSave, this, true);

            var deleteButton = new widget.Button({
                label: "Delete",
                id: "WiringEditor-deleteButton",
                container: toolbar
            });
            deleteButton.on("click", this.onDelete, this, true);

            var helpButton = new widget.Button({
                label: "Help",
                id: "WiringEditor-helpButton",
                container: toolbar
            });
            helpButton.on("click", this.onHelp, this, true);
        },
        /**
         * @method renderSavedStatus
         */
        renderSavedStatus: function() {
            var top = Dom.get('top');
            this.savedStatusEl = WireIt.cn('div', {
                className: 'savedStatus',
                title: 'Not saved'
            }, {
                display: 'none'
            }, "*");
            top.appendChild(this.savedStatusEl);
        },
        /**
         * save the current module
         * @method saveModule
         */
        saveModule: function() {

            var value = this.getValue();

            if (value.name === "") {
                this.alert("Please choose a name");
                return;
            }

            this.tempSavedWiring = {
                name: value.name,
                working: JSON.stringify(value.working),
                language: this.options.languageName
            };

            this.adapter.saveWiring(this.tempSavedWiring, {
                success: this.saveModuleSuccess,
                failure: this.saveModuleFailure,
                scope: this
            });

        },
        /**
         * saveModule success callback
         * @method saveModuleSuccess
         */
        saveModuleSuccess: function(o) {

            this.markSaved();

            this.alert("Saved !");

            // TODO:
            /*var name = this.tempSavedWiring.name;	
             if(this.modulesByName.hasOwnProperty(name) ) {
             //already exists
             }
             else {
             //new one
             }*/

        },
        /**
         * saveModule failure callback
         * @method saveModuleFailure
         */
        saveModuleFailure: function(errorStr) {
            this.alert("Unable to save the wiring : " + errorStr);
        },
        alert: function(txt) {
            if (!this.alertPanel) {
                this.renderAlertPanel();
            }
            Dom.get('alertPanelBody').innerHTML = txt;
            this.alertPanel.show();
        },
        /**
         * Create a help panel
         * @method onHelp
         */
        onHelp: function() {
            this.helpPanel.show();
        },
        /**
         * @method onNew
         */
        onNew: function() {

            if (!this.isSaved()) {
                if (!confirm("Warning: Your Composition is not saved yet! Press ok to continue anyway.")) {
                    return;
                }
            }

            this.preventLayerChangedEvent = true;

            this.layer.clear();

            this.propertiesForm.clear(false); // false to tell inputEx to NOT send the updatedEvt

            this.markSaved();

            this.preventLayerChangedEvent = false;
        },
        /**
         * @method onDelete
         */
        onDelete: function() {
            if (confirm("Are you sure you want to delete this wiring ?")) {
                this.onNew();
                this.alert("Deleted!");

                var value = this.getValue();
                this.adapter.deleteWiring({
                    name: value.name,
                    language: this.options.languageName
                }, {
                    success: function(result) {
                        this.onNew();
                        this.alert("Deleted !");
                    },
                    failure: function(errorStr) {
                        this.alert("Unable to delete wiring: " + errorStr);
                    },
                    scope: this
                });

            }
        },
        /**
         * @method onSave
         */
        onSave: function() {
            //this.saveModule();
            document.getElementById('downloadFile').click();
        },
        /**
         * @method renderLoadPanel
         */
        renderLoadPanel: function() {
            if (!this.loadPanel) {
                this.loadPanel = new widget.Panel('WiringEditor-loadPanel', {
                    fixedcenter: true,
                    draggable: true,
                    width: '500px',
                    visible: false,
                    modal: true
                });
                this.loadPanel.setHeader("Select the wiring to load");
                this.loadPanel.setBody("Filter: <input type='text' id='loadFilter' /><div id='loadPanelBody'></div>");
                this.loadPanel.render(document.body);

                // Listen the keyup event to filter the module list
                Event.onAvailable('loadFilter', function() {
                    Event.addListener('loadFilter', "keyup", this.inputFilterTimer, this, true);
                }, this, true);

            }
        },
        /**
         * Method called from each keyup on the search filter in load panel.
         * The real filtering occurs only after 500ms so that the filter process isn't called too often
         */
        inputFilterTimer: function() {
            if (this.inputFilterTimeout) {
                clearTimeout(this.inputFilterTimeout);
                this.inputFilterTimeout = null;
            }
            var that = this;
            this.inputFilterTimeout = setTimeout(function() {
                that.updateLoadPanelList(Dom.get('loadFilter').value);
            }, 500);
        },
        /**
         * @method updateLoadPanelList
         */
        updateLoadPanelList: function(filter) {

            var list = WireIt.cn("ul");
            if (lang.isArray(this.pipes)) {
                for (var i = 0; i < this.pipes.length; i++) {
                    var module = this.pipes[i];
                    this.pipesByName[module.name] = module;
                    if (!filter || filter === "" || module.name.match(new RegExp(filter, "i"))) {
                        list.appendChild(WireIt.cn('li', null, {
                            cursor: 'pointer'
                        }, module.name));
                    }
                }
            }
            var panelBody = Dom.get('loadPanelBody');
            panelBody.innerHTML = "";
            panelBody.appendChild(list);

            Event.addListener(list, 'click', function(e, args) {
//                console.log("entró al evento ");
                this.loadPipe(Event.getTarget(e).innerHTML);
            }, this, true);

        },
        /**
         * @method Export
         */
        onExport: function() {
//            console.log(JSON.stringify(this.layer.getWiring()));
            //this.alert(JSON.stringify((this.layer.getWiring())));
//            var json = JSON.stringify(this.layer.getWiring());
//            document.getElementById('json-graph').value = JSON.stringify(this.layer.getWiring());
//            document.getElementById('downloadLink').click();
              document.getElementById('jsonResoult').innerHTML = JSON.stringify(this.layer.getWiring());
            //this.alert("Composition exported in json extension: " + "\n" + JSON.stringify(this.layer.getWiring()));
        },
        /**
         * @method load
         */
        load: function() {

            this.adapter.listWirings({
                language: this.options.languageName
            }, {
                success: function(result) {
                    this.onLoadSuccess(result);
                },
                failure: function(errorStr) {
                    this.alert("Unable to load the wirings: " + errorStr);
                },
                scope: this
            }
            );

        },
        /**
         * @method onLoadSuccess
         */
        onLoadSuccess: function(wirings) {
            this.pipes = wirings;
            this.pipesByName = {};

            this.renderLoadPanel();
            this.updateLoadPanelList();

            if (!this.afterFirstRun) {
                var p = window.location.search.substr(1).split('&');
                var oP = {};
                for (var i = 0; i < p.length; i++) {
                    var v = p[i].split('=');
                    oP[v[0]] = window.decodeURIComponent(v[1]);
                }
                this.afterFirstRun = true;
                if (oP.autoload) {
                    this.loadPipe(oP.autoload);
                    return;
                }
            }

            this.loadPanel.show();
        },
        /**
         * @method getPipeByName
         * @param {String} name Pipe's name
         * @return {Object} return the evaled json pipe configuration
         */
        getPipeByName: function(name) {
            var n = this.pipes.length, ret;
            for (var i = 0; i < n; i++) {
                if (this.pipes[i].name === name) {
                    // Try to eval working property:
                    try {
                        ret = JSON.parse(this.pipes[i].working);
                        return ret;
                    }
                    catch (ex) {
                        this.alert("Unable to eval working json for module " + name);
                        return null;
                    }
                }
            }

            return null;
        },
        /**
         * @method loadPipe
         * @param {String} name Pipe name
         */
        loadPipe: function(name) {

            if (!this.isSaved()) {
                if (!confirm("Warning: Your work is not saved yet ! Press ok to continue anyway.")) {
                    return;
                }
            }

            try {

                this.preventLayerChangedEvent = true;

                this.loadPanel.hide();

                var wiring = this.getPipeByName(name), i;

                if (!wiring) {
                    this.alert("The wiring '" + name + "' was not found.");
                    return;
                }

                // TODO: check if current wiring is saved...
                this.layer.clear();

                this.propertiesForm.setValue(wiring.properties, false); // the false tells inputEx to NOT fire the updatedEvt

                if (lang.isArray(wiring.modules)) {

                    // Containers
                    for (i = 0; i < wiring.modules.length; i++) {
                        var m = wiring.modules[i];
                        if (this.modulesByName[m.name]) {
                            var baseContainerConfig = this.modulesByName[m.name].container;
                            YAHOO.lang.augmentObject(m.config, baseContainerConfig);
                            m.config.title = m.name;
                            var container = this.layer.addContainer(m.config);
                            Dom.addClass(container.el, "WiringEditor-module-" + m.name);
                            container.setValue(m.value);
                        }
                        else {
                            throw new Error("WiringEditor: module '" + m.name + "' not found !");
                        }
                    }

                    // Wires
                    if (lang.isArray(wiring.wires)) {
                        for (i = 0; i < wiring.wires.length; i++) {
                            // On doit chercher dans la liste des terminaux de chacun des modules l'index des terminaux...
                            this.layer.addWire(wiring.wires[i]);
                        }
                    }
                }

                this.markSaved();

                this.preventLayerChangedEvent = false;

            }
            catch (ex) {
                this.alert(ex);
            }
        },
        renderAlertPanel: function() {

            /**
             * @property alertPanel
             * @type {YAHOO.widget.Panel}
             */
            this.alertPanel = new widget.Panel('WiringEditor-alertPanel', {
                fixedcenter: true,
                draggable: true,
                width: '500px',
                visible: false,
                modal: true
            });
            this.alertPanel.setHeader("Message");
            this.alertPanel.setBody("<div id='alertPanelBody'></div><button id='alertPanelButton'>Ok</button>");
            this.alertPanel.render(document.body);
            Event.addListener('alertPanelButton', 'click', function() {
                this.alertPanel.hide();
            }, this, true);
        },
        onLayerChanged: function() {
            if (!this.preventLayerChangedEvent) {
                this.markUnsaved();
            }
        },
        markSaved: function() {
            this.savedStatusEl.style.display = 'none';
        },
        markUnsaved: function() {
            this.savedStatusEl.style.display = '';
        },
        isSaved: function() {
            return (this.savedStatusEl.style.display === 'none');
        },
        /**
         * This method return a wiring within the given vocabulary described by the modules list
         * @method getValue
         */
        getValue: function() {

            var i;
            var obj = {
                modules: [],
                wires: [],
                properties: null
            };

            for (i = 0; i < this.layer.containers.length; i++) {
                obj.modules.push({
                    name: this.layer.containers[i].options.title,
                    value: this.layer.containers[i].getValue(),
                    config: this.layer.containers[i].getConfig()
                });
            }

            for (i = 0; i < this.layer.wires.length; i++) {
                var wire = this.layer.wires[i];

                var wireObj = {
                    src: {
                        moduleId: WireIt.indexOf(wire.terminal1.container, this.layer.containers),
                        terminal: wire.terminal1.options.name
                    },
                    tgt: {
                        moduleId: WireIt.indexOf(wire.terminal2.container, this.layer.containers),
                        terminal: wire.terminal2.options.name
                    }
                };
                obj.wires.push(wireObj);
            }

            obj.properties = this.propertiesForm.getValue();

            return {
                name: obj.properties.name,
                working: obj
            };
        }


    };


    /**
     * WiringEditor Adapters
     * @static
     */
    WireIt.WiringEditor.adapters = {};


})();
   