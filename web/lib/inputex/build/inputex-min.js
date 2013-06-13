/* 
 Distributed under the MIT License :
 Visit http://javascript.neyric.com/inputex for more informations
 
 Copyright (c) 2007-2008, Eric Abouaf <neyric at via.ecp.fr>
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
(function() {
    var B = YAHOO.lang;
    YAHOO.inputEx = function(C) {
        var D = null;
        if (C.type) {
            D = YAHOO.inputEx.getFieldClass(C.type);
            if (D === null) {
                D = YAHOO.inputEx.StringField
            }
        } else {
            D = C.fieldClass ? C.fieldClass : A.StringField
        }
        var E = new D(C.inputParams);
        return E
    };
    var A = YAHOO.inputEx;
    B.augmentObject(A, {VERSION: "0.2.1", spacerUrl: "images/space.gif", stateEmpty: "empty", stateRequired: "required", stateValid: "valid", stateInvalid: "invalid", messages: {required: "This field is required", invalid: "This field is invalid", valid: "This field is valid", defaultDateFormat: "m/d/Y", months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}, widget: {}, regexps: {email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, url: /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/i, password: /^[0-9a-zA-Z\x20-\x7E]*$/}, typeClasses: {}, registerType: function(C, D) {
            if (!B.isString(C)) {
                throw new Error("inputEx.registerType: first argument must be a string")
            }
            if (!B.isFunction(D)) {
                throw new Error("inputEx.registerType: second argument must be a function")
            }
            this.typeClasses[C] = D
        }, getFieldClass: function(C) {
            return B.isFunction(this.typeClasses[C]) ? this.typeClasses[C] : null
        }, getType: function(C) {
            for (var D in this.typeClasses) {
                if (this.typeClasses.hasOwnProperty(D)) {
                    if (this.typeClasses[D] == C) {
                        return D
                    }
                }
            }
            return null
        }, buildField: function(C) {
            return A(C)
        }, sn: function(F, E, C) {
            if (!F) {
                return
            }
            if (E) {
                for (var D in E) {
                    var H = E[D];
                    if (B.isFunction(H)) {
                        continue
                    }
                    if (D == "className") {
                        D = "class";
                        F.className = H
                    }
                    if (H !== F.getAttribute(D)) {
                        try {
                            if (H === false) {
                                F.removeAttribute(D)
                            } else {
                                F.setAttribute(D, H)
                            }
                        } catch (G) {
                        }
                    }
                }
            }
            if (C) {
                for (var D in C) {
                    if (B.isFunction(C[D])) {
                        continue
                    }
                    if (F.style[D] != C[D]) {
                        F.style[D] = C[D]
                    }
                }
            }
        }, cn: function(C, G, D, I) {
            if (C == "input" && YAHOO.env.ua.ie) {
                var F = "<" + C;
                if (G !== "undefined") {
                    for (var E in G) {
                        F += " " + E + '="' + G[E] + '"'
                    }
                }
                F += "/>";
                return document.createElement(F)
            } else {
                var H = document.createElement(C);
                this.sn(H, G, D);
                if (I) {
                    H.innerHTML = I
                }
                return H
            }
        }, indexOf: function(F, C) {
            var D = C.length, E;
            for (E = 0; E < D; E++) {
                if (C[E] == F) {
                    return E
                }
            }
            return -1
        }, compactArray: function(C) {
            var F = [], D = C.length, E;
            for (E = 0; E < D; E++) {
                if (!B.isNull(C[E]) && !B.isUndefined(C[E])) {
                    F.push(C[E])
                }
            }
            return F
        }})
})();
var inputEx = YAHOO.inputEx;
(function() {
    var A = YAHOO.inputEx, B = YAHOO.lang;
    A.visus = {trimpath: function(E, F) {
            if (!TrimPath) {
                alert("TrimPath is not on the page. Please load inputex/lib/trimpath-template.js");
                return
            }
            var D = TrimPath.parseTemplate(E.template);
            var C = D.process(F);
            return C
        }, func: function(C, D) {
            return C.func(D)
        }, dump: function(C, D) {
            return B.dump(D)
        }};
    A.renderVisu = function(I, E, F) {
        var C = I || {};
        var J = C.visuType || "dump";
        if (!A.visus.hasOwnProperty(J)) {
            throw new Error("inputEx: no visu for visuType: " + J)
        }
        var G = A.visus[J];
        if (!B.isFunction(G)) {
            throw new Error("inputEx: no visu for visuType: " + J)
        }
        var K = null;
        try {
            K = G(C, E)
        } catch (H) {
            throw new Error("inputEx: error while running visu " + J + " : " + H.message);
            return
        }
        var D = null;
        if (F) {
            if (B.isString(F)) {
                D = YAHOO.util.Dom.get(F)
            } else {
                D = F
            }
        }
        if (D) {
            if (YAHOO.lang.isObject(K) && K.tagName) {
                D.innerHTML = "";
                D.appendChild(K)
            } else {
                D.innerHTML = K
            }
        }
        return K
    }
})();
(function() {
    var A = YAHOO.inputEx, B = YAHOO.lang;
    A.JsonSchema = {inputExToSchema: function(C) {
        }};
    A.JsonSchema.Builder = function(C) {
        var C = C || {};
        this.options = C;
        this.schemaToParamMap = C.schemaToParamMap || {title: "label", description: "description", _inputex: null};
        this.referenceResolver = C.referenceResolver || null;
        this.defaultOptions = C.defaultOptions || {};
        this.schemaIdentifierMap = C.schemaIdentifierMap || {}
    };
    A.JsonSchema.Builder.prototype = {defaultReferenceResolver: function(C) {
            return this.schemaIdentifierMap[C] || null
        }, schemaToInputEx: function(E, N) {
            var H = {inputParams: {label: N, name: N}};
            var O = this.schemaToParamMap;
            var G = E["$ref"];
            if (G) {
                var L = null;
                if (this.referenceResolver) {
                    L = this.referenceResolver(G)
                }
                if (L === null) {
                    L = this.defaultReferenceResolver(G)
                }
                if (L === null) {
                    throw"Schema for property :" + N + " $references " + G + ", not found"
                }
                L = B.merge(L);
                for (var I in E) {
                    if (E.hasOwnProperty(I) && B.isUndefined(L[I]) && I != "$ref") {
                        L[I] = E[I]
                    }
                }
                E = L
            }
            if (!E.optional) {
                H.inputParams.required = true
            }
            for (var R in O) {
                if (O.hasOwnProperty(R)) {
                    var K = O[R];
                    var Q = E[R];
                    if (!B.isUndefined(Q)) {
                        if (K === null) {
                            if (B.isObject(Q)) {
                                for (var C in Q) {
                                    if (Q.hasOwnProperty(C)) {
                                        H.inputParams[C] = Q[C]
                                    }
                                }
                            }
                        } else {
                            H.inputParams[K] = Q
                        }
                    }
                }
            }
            if (E.type) {
                var P = E.type;
                if (B.isArray(P)) {
                    if (P.length === 0 || (P.length == 1 && P[0] == "any")) {
                        P = "array"
                    } else {
                        P = P[0]
                    }
                } else {
                    if (B.isObject(P)) {
                    }
                }
                H.type = P;
                if (!B.isUndefined(E["default"])) {
                    H.inputParams.value = E["default"]
                }
                if (P == "array") {
                    H.type = "list";
                    if (B.isObject(E.items) && !B.isArray(E.items)) {
                        H.inputParams.elementType = this.schemaToInputEx(E.items, N)
                    }
                } else {
                    if (P == "object") {
                        H.type = "group";
                        if (E.title && B.isUndefined(H.inputParams.legend)) {
                            H.inputParams.legend = E.title
                        }
                        var M = [];
                        if (N) {
                            H.inputParams.name = N
                        }
                        for (var R in E.properties) {
                            if (E.properties.hasOwnProperty(R)) {
                                M.push(this.schemaToInputEx(E.properties[R], R))
                            }
                        }
                        H.inputParams.fields = M
                    } else {
                        if (P == "string" && E["enum"]) {
                            H.type = "select";
                            if (E.options) {
                                H.inputParams.selectOptions = [];
                                H.inputParams.selectValues = [];
                                for (var J = 0; J < E.options.length; J++) {
                                    var F = E.options[J];
                                    H.inputParams.selectOptions[J] = F.label;
                                    H.inputParams.selectValues[J] = F.value
                                }
                            } else {
                                H.inputParams.selectValues = E["enum"]
                            }
                        } else {
                            if (P == "string") {
                                if (!B.isUndefined(E.pattern) && B.isUndefined(H.inputParams.regexp)) {
                                    if (B.isString(E.pattern)) {
                                        H.inputParams.regexp = new RegExp(E.pattern)
                                    } else {
                                        H.inputParams.regexp = E.pattern
                                    }
                                }
                                if (!B.isUndefined(E.maxLength) && B.isUndefined(H.inputParams.maxLength)) {
                                    H.inputParams.maxLength = E.maxLength
                                }
                                if (!B.isUndefined(E.minLength) && B.isUndefined(H.inputParams.minLength)) {
                                    H.inputParams.minLength = E.minLength
                                }
                                if (!B.isUndefined(E.readonly) && B.isUndefined(H.inputParams.readonly)) {
                                    H.inputParams.readonly = E.readonly
                                }
                                if (E.format) {
                                    if (E.format == "html") {
                                        H.type = "html"
                                    } else {
                                        if (E.format == "date") {
                                            H.type = "date";
                                            H.inputParams.tooltipIcon = true
                                        } else {
                                            if (E.format == "url") {
                                                H.type = "url"
                                            } else {
                                                if (E.format == "email") {
                                                    H.type = "email"
                                                } else {
                                                    if (E.format == "text") {
                                                        H.type = "text"
                                                    } else {
                                                        if (E.format == "time") {
                                                            H.type = "time"
                                                        } else {
                                                            if (E.format == "ip-address") {
                                                                H.type = "IPv4"
                                                            } else {
                                                                if (E.format == "color") {
                                                                    H.type = "color"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (var D in this.defaultOptions) {
                if (this.defaultOptions.hasOwnProperty(D) && B.isUndefined(H.inputParams[D])) {
                    H.inputParams[D] = this.defaultOptions[D]
                }
            }
            return H
        }, formFromInstance: function(F) {
            if (!F || !F["$schema"]) {
                throw new Error("Invalid json schema instance object. Object must have a '$schema' property.")
            }
            var C = this.schemaToInputEx(F["$schema"]);
            for (var D = 0; D < C.fields.length; D++) {
                var E = C.fields[D].inputParams.name;
                C.fields[D].inputParams.value = F[E]
            }
            return C
        }}
})();
(function() {
    var C = YAHOO.inputEx, B = YAHOO.util.Dom, D = YAHOO.lang, A = YAHOO.util;
    C.Field = function(E) {
        if (!E) {
            var E = {}
        }
        this.setOptions(E);
        this.render();
        this.updatedEvt = new A.CustomEvent("updated", this);
        this.initEvents();
        if (!D.isUndefined(this.options.value)) {
            this.setValue(this.options.value, false)
        }
        if (E.parentEl) {
            if (D.isString(E.parentEl)) {
                B.get(E.parentEl).appendChild(this.getEl())
            } else {
                E.parentEl.appendChild(this.getEl())
            }
        }
    };
    C.Field.prototype = {setOptions: function(E) {
            this.options = {};
            this.options.name = E.name;
            this.options.value = E.value;
            this.options.id = E.id || B.generateId();
            this.options.label = E.label;
            this.options.description = E.description;
            this.options.messages = {};
            this.options.messages.required = (E.messages && E.messages.required) ? E.messages.required : C.messages.required;
            this.options.messages.invalid = (E.messages && E.messages.invalid) ? E.messages.invalid : C.messages.invalid;
            this.options.className = E.className ? E.className : "inputEx-Field";
            this.options.required = D.isUndefined(E.required) ? false : E.required;
            this.options.showMsg = D.isUndefined(E.showMsg) ? false : E.showMsg
        }, render: function() {
            this.divEl = C.cn("div", {className: "inputEx-fieldWrapper"});
            if (this.options.id) {
                this.divEl.id = this.options.id
            }
            if (this.options.required) {
                B.addClass(this.divEl, "inputEx-required")
            }
            if (this.options.label) {
                this.labelDiv = C.cn("div", {id: this.divEl.id + "-label", className: "inputEx-label", "for": this.divEl.id + "-field"});
                this.labelEl = C.cn("label");
                this.labelEl.appendChild(document.createTextNode(this.options.label));
                this.labelDiv.appendChild(this.labelEl);
                this.divEl.appendChild(this.labelDiv)
            }
            this.fieldContainer = C.cn("div", {className: this.options.className});
            this.renderComponent();
            if (this.options.description) {
                this.fieldContainer.appendChild(C.cn("div", {id: this.divEl.id + "-desc", className: "inputEx-description"}, null, this.options.description))
            }
            this.divEl.appendChild(this.fieldContainer);
            this.divEl.appendChild(C.cn("div", null, {clear: "both"}, " "))
        }, fireUpdatedEvt: function() {
            var E = this;
            setTimeout(function() {
                E.updatedEvt.fire(E.getValue(), E)
            }, 50)
        }, renderComponent: function() {
        }, getEl: function() {
            return this.divEl
        }, initEvents: function() {
        }, getValue: function() {
        }, setValue: function(F, E) {
            this.setClassFromState();
            if (E !== false) {
                this.fireUpdatedEvt()
            }
        }, setClassFromState: function() {
            if (this.previousState) {
                var E = "inputEx-" + ((this.previousState == C.stateRequired) ? C.stateInvalid : this.previousState);
                B.removeClass(this.divEl, E)
            }
            var F = this.getState();
            if (!(F == C.stateEmpty && B.hasClass(this.divEl, "inputEx-focused"))) {
                var E = "inputEx-" + ((F == C.stateRequired) ? C.stateInvalid : F);
                B.addClass(this.divEl, E)
            }
            if (this.options.showMsg) {
                this.displayMessage(this.getStateString(F))
            }
            this.previousState = F
        }, getStateString: function(E) {
            if (E == C.stateRequired) {
                return this.options.messages.required
            } else {
                if (E == C.stateInvalid) {
                    return this.options.messages.invalid
                } else {
                    return""
                }
            }
        }, getState: function() {
            if (this.isEmpty()) {
                return this.options.required ? C.stateRequired : C.stateEmpty
            }
            return this.validate() ? C.stateValid : C.stateInvalid
        }, validate: function() {
            return true
        }, onFocus: function(F) {
            var E = this.getEl();
            B.removeClass(E, "inputEx-empty");
            B.addClass(E, "inputEx-focused")
        }, onBlur: function(E) {
            B.removeClass(this.getEl(), "inputEx-focused");
            this.setClassFromState()
        }, onChange: function(E) {
            this.fireUpdatedEvt()
        }, close: function() {
        }, disable: function() {
        }, enable: function() {
        }, focus: function() {
        }, destroy: function() {
            var E = this.getEl();
            this.updatedEvt.unsubscribeAll();
            if (B.inDocument(E)) {
                E.parentNode.removeChild(E)
            }
            A.Event.purgeElement(E, true)
        }, displayMessage: function(G) {
            if (!this.fieldContainer) {
                return
            }
            if (!this.msgEl) {
                this.msgEl = C.cn("div", {className: "inputEx-message"});
                try {
                    var E = this.divEl.getElementsByTagName("div");
                    this.divEl.insertBefore(this.msgEl, E[(E.length - 1 >= 0) ? E.length - 1 : 0])
                } catch (F) {
                    alert(F)
                }
            }
            this.msgEl.innerHTML = G
        }, show: function() {
            this.divEl.style.display = ""
        }, hide: function() {
            this.divEl.style.display = "none"
        }, clear: function(E) {
            this.setValue(D.isUndefined(this.options.value) ? "" : this.options.value, E)
        }, isEmpty: function() {
            return this.getValue() === ""
        }}
})();
(function() {
    var C = YAHOO.inputEx, D = YAHOO.lang, B = YAHOO.util.Dom, A = YAHOO.util.Event;
    C.Group = function(E) {
        C.Group.superclass.constructor.call(this, E);
        if (this.hasInteractions) {
            for (var F = 0; F < this.inputs.length; F++) {
                this.runInteractions(this.inputs[F], this.inputs[F].getValue())
            }
        }
    };
    D.extend(C.Group, C.Field, {setOptions: function(E) {
            this.options = {};
            this.options.className = E.className || "inputEx-Group";
            this.options.fields = E.fields;
            this.options.id = E.id;
            this.options.name = E.name;
            this.options.value = E.value;
            this.options.flatten = E.flatten;
            this.options.legend = E.legend || "";
            this.inputConfigs = E.fields;
            this.options.collapsible = D.isUndefined(E.collapsible) ? false : E.collapsible;
            this.options.collapsed = D.isUndefined(E.collapsed) ? false : E.collapsed;
            this.options.disabled = D.isUndefined(E.disabled) ? false : E.disabled;
            this.inputs = [];
            this.inputsNames = {}
        }, render: function() {
            this.divEl = C.cn("div", {className: this.options.className});
            if (this.options.id) {
                this.divEl.id = this.options.id
            }
            this.renderFields(this.divEl);
            if (this.options.disabled) {
                this.disable()
            }
        }, renderFields: function(G) {
            this.fieldset = C.cn("fieldset");
            this.legend = C.cn("legend", {className: "inputEx-Group-legend"});
            if (this.options.collapsible) {
                var I = C.cn("div", {className: "inputEx-Group-collapseImg"}, null, " ");
                this.legend.appendChild(I);
                C.sn(this.fieldset, {className: "inputEx-Expanded"})
            }
            if (!D.isUndefined(this.options.legend) && this.options.legend !== "") {
                this.legend.appendChild(document.createTextNode(" " + this.options.legend))
            }
            if (this.options.collapsible || (!D.isUndefined(this.options.legend) && this.options.legend !== "")) {
                this.fieldset.appendChild(this.legend)
            }
            for (var F = 0; F < this.options.fields.length; F++) {
                var E = this.options.fields[F];
                var H = this.renderField(E);
                this.fieldset.appendChild(H.getEl())
            }
            if (this.options.collapsed) {
                this.toggleCollapse()
            }
            G.appendChild(this.fieldset)
        }, renderField: function(F) {
            var E = C.buildField(F);
            this.inputs.push(E);
            if (E.options.name) {
                this.inputsNames[E.options.name] = E
            }
            if (!this.hasInteractions && F.interactions) {
                this.hasInteractions = true
            }
            E.updatedEvt.subscribe(this.onChange, this, true);
            return E
        }, initEvents: function() {
            if (this.options.collapsible) {
                A.addListener(this.legend, "click", this.toggleCollapse, this, true)
            }
        }, toggleCollapse: function() {
            if (B.hasClass(this.fieldset, "inputEx-Expanded")) {
                B.replaceClass(this.fieldset, "inputEx-Expanded", "inputEx-Collapsed")
            } else {
                B.replaceClass(this.fieldset, "inputEx-Collapsed", "inputEx-Expanded")
            }
        }, validate: function() {
            var F = true;
            for (var G = 0; G < this.inputs.length; G++) {
                var E = this.inputs[G];
                E.setClassFromState();
                var H = E.getState();
                if (H == C.stateRequired || H == C.stateInvalid) {
                    F = false
                }
            }
            return F
        }, enable: function() {
            for (var E = 0; E < this.inputs.length; E++) {
                this.inputs[E].enable()
            }
        }, disable: function() {
            for (var E = 0; E < this.inputs.length; E++) {
                this.inputs[E].disable()
            }
        }, setValue: function(H, F) {
            if (!H) {
                return
            }
            for (var G = 0; G < this.inputs.length; G++) {
                var I = this.inputs[G];
                var E = I.options.name;
                if (E && !D.isUndefined(H[E])) {
                    I.setValue(H[E], false)
                } else {
                    I.clear(false)
                }
            }
            if (F !== false) {
                this.fireUpdatedEvt()
            }
        }, getValue: function() {
            var G = {};
            for (var F = 0; F < this.inputs.length; F++) {
                var E = this.inputs[F].getValue();
                if (this.inputs[F].options.name) {
                    if (this.inputs[F].options.flatten && D.isObject(E)) {
                        D.augmentObject(G, E)
                    } else {
                        G[this.inputs[F].options.name] = E
                    }
                }
            }
            return G
        }, close: function() {
            for (var E = 0; E < this.inputs.length; E++) {
                this.inputs[E].close()
            }
        }, focus: function() {
            if (this.inputs.length > 0) {
                this.inputs[0].focus()
            }
        }, getFieldByName: function(E) {
            if (!this.inputsNames.hasOwnProperty(E)) {
                return null
            }
            return this.inputsNames[E]
        }, onChange: function(F, G) {
            var H = G[0];
            var E = G[1];
            this.runInteractions(E, H);
            this.fireUpdatedEvt()
        }, runAction: function(E, G) {
            var F = this.getFieldByName(E.name);
            if (YAHOO.lang.isFunction(F[E.action])) {
                F[E.action].call(F)
            } else {
                if (YAHOO.lang.isFunction(E.action)) {
                    E.action.call(F, G)
                } else {
                    throw new Error("action " + E.action + " is not a valid action for field " + E.name)
                }
            }
        }, runInteractions: function(F, K) {
            var H = C.indexOf(F, this.inputs);
            var J = this.options.fields[H];
            if (YAHOO.lang.isUndefined(J.interactions)) {
                return
            }
            var L = J.interactions;
            for (var I = 0; I < L.length; I++) {
                var E = L[I];
                if (E.valueTrigger === K) {
                    for (var G = 0; G < E.actions.length; G++) {
                        this.runAction(E.actions[G], K)
                    }
                }
            }
        }, clear: function(E) {
            for (var F = 0; F < this.inputs.length; F++) {
                this.inputs[F].clear(false)
            }
            if (E !== false) {
                this.fireUpdatedEvt()
            }
        }});
    C.registerType("group", C.Group)
})();
(function() {
    var B = YAHOO.util, E = YAHOO.lang, A = YAHOO.util.Event, D = YAHOO.inputEx, C = B.Dom;
    D.Form = function(F) {
        D.Form.superclass.constructor.call(this, F)
    };
    E.extend(D.Form, D.Group, {setOptions: function(F) {
            D.Form.superclass.setOptions.call(this, F);
            this.buttons = [];
            this.options.buttons = F.buttons || [];
            this.options.action = F.action;
            this.options.method = F.method;
            if (F.ajax) {
                this.options.ajax = {};
                this.options.ajax.method = F.ajax.method || "POST";
                this.options.ajax.uri = F.ajax.uri || "default.php";
                this.options.ajax.callback = F.ajax.callback || {};
                this.options.ajax.callback.scope = F.ajax.callback.scope || this;
                this.options.ajax.showMask = E.isUndefined(F.ajax.showMask) ? false : F.ajax.showMask
            }
            if (E.isFunction(F.onSubmit)) {
                this.options.onSubmit = F.onSubmit
            }
        }, render: function() {
            this.divEl = D.cn("div", {className: this.options.className});
            if (this.options.id) {
                this.divEl.id = this.options.id
            }
            this.form = D.cn("form", {method: this.options.method || "POST", action: this.options.action || "", className: this.options.className || "inputEx-Form"});
            this.divEl.appendChild(this.form);
            this.form.setAttribute("autocomplete", "off");
            if (this.options.formName) {
                this.form.name = this.options.formName
            }
            this.renderFields(this.form);
            this.renderButtons();
            if (this.options.disabled) {
                this.disable()
            }
        }, renderButtons: function() {
            this.buttonDiv = D.cn("div", {className: "inputEx-Form-buttonBar"});
            var H, F;
            for (var G = 0; G < this.options.buttons.length; G++) {
                H = this.options.buttons[G];
                F = D.cn("input", {type: H.type, value: H.value});
                if (H.onClick) {
                    F.onclick = H.onClick
                }
                this.buttons.push(F);
                this.buttonDiv.appendChild(F)
            }
            this.form.appendChild(this.buttonDiv)
        }, initEvents: function() {
            D.Form.superclass.initEvents.call(this);
            A.addListener(this.form, "submit", this.options.onSubmit || this.onSubmit, this, true)
        }, onSubmit: function(F) {
            if (!this.validate()) {
                A.stopEvent(F);
                return
            }
            if (this.options.ajax) {
                A.stopEvent(F);
                this.asyncRequest()
            }
        }, asyncRequest: function() {
            if (this.options.ajax.showMask) {
                this.showMask()
            }
            var F = "value=" + E.JSON.stringify(this.getValue());
            B.Connect.asyncRequest(this.options.ajax.method, this.options.ajax.uri, {success: function(G) {
                    if (this.options.ajax.showMask) {
                        this.hideMask()
                    }
                    if (E.isFunction(this.options.ajax.callback.success)) {
                        this.options.ajax.callback.success.call(this.options.ajax.callback.scope, G)
                    }
                }, failure: function(G) {
                    if (this.options.ajax.showMask) {
                        this.hideMask()
                    }
                    if (E.isFunction(this.options.ajax.callback.failure)) {
                        this.options.ajax.callback.failure.call(this.options.ajax.callback.scope, G)
                    }
                }, scope: this}, F)
        }, renderMask: function() {
            if (this.maskRendered) {
                return
            }
            C.setStyle(this.divEl, "position", "relative");
            if (YAHOO.env.ua.ie) {
                C.setStyle(this.divEl, "zoom", 1)
            }
            this.formMask = D.cn("div", {className: "inputEx-Form-Mask"}, {display: "none", width: this.divEl.offsetWidth + "px", height: this.divEl.offsetHeight + "px"}, "<div class='inputEx-Form-Mask-bg'/><center><br/><div class='inputEx-Form-Mask-spinner'></div><br /><span>" + D.messages.ajaxWait + "</span></div>");
            this.divEl.appendChild(this.formMask);
            this.maskRendered = true
        }, showMask: function() {
            this.renderMask();
            this.toggleSelectsInIE(false);
            this.formMask.style.display = ""
        }, hideMask: function() {
            this.toggleSelectsInIE(true);
            this.formMask.style.display = "none"
        }, toggleSelectsInIE: function(F) {
            if (!!YAHOO.env.ua.ie && YAHOO.env.ua.ie < 7) {
                var H = !!F ? YAHOO.util.Dom.removeClass : YAHOO.util.Dom.addClass;
                var G = this;
                YAHOO.util.Dom.getElementsBy(function() {
                    return true
                }, "select", this.divEl, function(I) {
                    H.call(G, I, "inputEx-hidden")
                })
            }
        }, enable: function() {
            D.Form.superclass.enable.call(this);
            for (var F = 0; F < this.buttons.length; F++) {
                this.buttons[F].disabled = false
            }
        }, disable: function() {
            D.Form.superclass.disable.call(this);
            for (var F = 0; F < this.buttons.length; F++) {
                this.buttons[F].disabled = true
            }
        }});
    D.messages.ajaxWait = "Please wait...";
    D.registerType("form", D.Form)
})();
(function() {
    var B = YAHOO.inputEx, C = YAHOO.lang, A = YAHOO.util.Dom;
    B.CombineField = function(D) {
        B.CombineField.superclass.constructor.call(this, D)
    };
    C.extend(B.CombineField, B.Field, {setOptions: function(D) {
            B.CombineField.superclass.setOptions.call(this, D);
            this.options.className = D.className ? D.className : "inputEx-Field inputEx-CombineField";
            this.options.separators = D.separators;
            this.options.fields = D.fields
        }, renderComponent: function() {
            this.inputs = [];
            this.appendSeparator(0);
            if (!this.options.fields) {
                return
            }
            for (var D = 0; D < this.options.fields.length; D++) {
                if (this.options.required) {
                    this.options.fields[D].required = true
                }
                var E = this.renderField(this.options.fields[D]);
                E.divEl.removeChild(E.divEl.childNodes[E.divEl.childNodes.length - 1]);
                YAHOO.util.Dom.setStyle(E.getEl(), "float", "left");
                this.fieldContainer.appendChild(E.getEl());
                this.appendSeparator(D + 1)
            }
        }, appendSeparator: function(E) {
            if (this.options.separators && this.options.separators[E]) {
                var D = B.cn("div", {className: "inputEx-CombineField-separator"}, null, this.options.separators[E]);
                this.fieldContainer.appendChild(D)
            }
        }, renderField: function(E) {
            if (this.options.required) {
                if (!E.inputParams) {
                    E.inputParams = {}
                }
                E.inputParams.required = true
            }
            var D = B(E);
            this.inputs.push(D);
            D.updatedEvt.subscribe(this.onChange, this, true);
            YAHOO.util.Event.addBlurListener(D.getEl(), this.onBlur, this, true);
            return D
        }, validate: function() {
            for (var E = 0; E < this.inputs.length; E++) {
                var D = this.inputs[E];
                var F = D.getState();
                if (F == B.stateRequired || F == B.stateInvalid) {
                    return false
                }
            }
            return true
        }, setValue: function(D, E) {
            for (var F = 0; F < this.inputs.length; F++) {
                this.inputs[F].setValue(D[F], false)
            }
            B.CombineField.superclass.setValue.call(this, D, E)
        }, getValue: function() {
            var D = [];
            for (var E = 0; E < this.inputs.length; E++) {
                D.push(this.inputs[E].getValue())
            }
            return D
        }, setClassFromState: function() {
            B.CombineField.superclass.setClassFromState.call(this);
            for (var D = 0; D < this.inputs.length; D++) {
                this.inputs[D].setClassFromState()
            }
        }, clear: function(D) {
            for (var E = 0; E < this.inputs.length; E++) {
                this.inputs[E].clear(false)
            }
            this.setClassFromState();
            if (D !== false) {
                this.fireUpdatedEvt()
            }
        }, isEmpty: function() {
            for (var D = 0; D < this.inputs.length; D++) {
                if (!this.inputs[D].isEmpty()) {
                    return false
                }
            }
            return true
        }});
    B.registerType("combine", B.CombineField)
})();
(function() {
    var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;
    C.StringField = function(E) {
        C.StringField.superclass.constructor.call(this, E);
        if (this.options.typeInvite) {
            this.updateTypeInvite()
        }
    };
    D.extend(C.StringField, C.Field, {setOptions: function(E) {
            C.StringField.superclass.setOptions.call(this, E);
            this.options.regexp = E.regexp;
            this.options.size = E.size;
            this.options.maxLength = E.maxLength;
            this.options.minLength = E.minLength;
            this.options.typeInvite = E.typeInvite;
            this.options.readonly = E.readonly
        }, renderComponent: function() {
            this.wrapEl = C.cn("div", {className: "inputEx-StringField-wrapper"});
            var E = {};
            E.type = "text";
            E.id = this.divEl.id ? this.divEl.id + "-field" : YAHOO.util.Dom.generateId();
            if (this.options.size) {
                E.size = this.options.size
            }
            if (this.options.name) {
                E.name = this.options.name
            }
            if (this.options.readonly) {
                E.readonly = "readonly"
            }
            if (this.options.maxLength) {
                E.maxLength = this.options.maxLength
            }
            this.el = C.cn("input", E);
            this.wrapEl.appendChild(this.el);
            this.fieldContainer.appendChild(this.wrapEl)
        }, initEvents: function() {
            A.addListener(this.el, "change", this.onChange, this, true);
            if (YAHOO.env.ua.ie) {
                var E = this.el;
                new YAHOO.util.KeyListener(this.el, {keys: [13]}, {fn: function() {
                        E.blur();
                        E.focus()
                    }}).enable()
            }
            A.addFocusListener(this.el, this.onFocus, this, true);
            A.addBlurListener(this.el, this.onBlur, this, true);
            A.addListener(this.el, "keypress", this.onKeyPress, this, true);
            A.addListener(this.el, "keyup", this.onKeyUp, this, true)
        }, getValue: function() {
            return(this.options.typeInvite && this.el.value == this.options.typeInvite) ? "" : this.el.value
        }, setValue: function(F, E) {
            this.el.value = F;
            C.StringField.superclass.setValue.call(this, F, E)
        }, validate: function() {
            var F = this.getValue();
            if (F == "") {
                return !this.options.required
            }
            var E = true;
            if (this.options.regexp) {
                E = E && F.match(this.options.regexp)
            }
            if (this.options.minLength) {
                E = E && F.length >= this.options.minLength
            }
            return E
        }, disable: function() {
            this.el.disabled = true
        }, enable: function() {
            this.el.disabled = false
        }, focus: function() {
            if (!!this.el && !D.isUndefined(this.el.focus)) {
                this.el.focus()
            }
        }, getStateString: function(E) {
            if (E == C.stateInvalid && this.options.minLength && this.el.value.length < this.options.minLength) {
                return C.messages.stringTooShort[0] + this.options.minLength + C.messages.stringTooShort[1]
            }
            return C.StringField.superclass.getStateString.call(this, E)
        }, setClassFromState: function() {
            C.StringField.superclass.setClassFromState.call(this);
            if (this.options.typeInvite) {
                this.updateTypeInvite()
            }
        }, updateTypeInvite: function() {
            if (!B.hasClass(this.divEl, "inputEx-focused")) {
                if (this.isEmpty()) {
                    B.addClass(this.divEl, "inputEx-typeInvite");
                    this.el.value = this.options.typeInvite
                } else {
                    B.removeClass(this.divEl, "inputEx-typeInvite")
                }
            } else {
                if (B.hasClass(this.divEl, "inputEx-typeInvite")) {
                    this.el.value = "";
                    this.previousState = null;
                    B.removeClass(this.divEl, "inputEx-typeInvite")
                }
            }
        }, onFocus: function(E) {
            C.StringField.superclass.onFocus.call(this, E);
            if (this.options.typeInvite) {
                this.updateTypeInvite()
            }
        }, onKeyPress: function(E) {
        }, onKeyUp: function(E) {
        }});
    C.messages.stringTooShort = ["This field should contain at least ", " numbers or characters"];
    C.registerType("string", C.StringField)
})();
(function() {
    var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;
    C.AutoComplete = function(E) {
        C.AutoComplete.superclass.constructor.call(this, E)
    };
    D.extend(C.AutoComplete, C.StringField, {setOptions: function(E) {
            C.AutoComplete.superclass.setOptions.call(this, E);
            this.options.className = E.className ? E.className : "inputEx-Field inputEx-AutoComplete";
            this.options.datasource = E.datasource;
            this.options.autoComp = E.autoComp;
            this.options.returnValue = E.returnValue
        }, initEvents: function() {
            C.AutoComplete.superclass.initEvents.call(this);
            A.removeBlurListener(this.el, this.onBlur)
        }, renderComponent: function() {
            this.wrapEl = C.cn("div", {className: "inputEx-StringField-wrapper"});
            var E = {type: "text", id: YAHOO.util.Dom.generateId()};
            if (this.options.size) {
                E.size = this.options.size
            }
            if (this.options.readonly) {
                E.readonly = "readonly"
            }
            if (this.options.maxLength) {
                E.maxLength = this.options.maxLength
            }
            this.el = C.cn("input", E);
            var F = {type: "hidden", value: ""};
            if (this.options.name) {
                F.name = this.options.name
            }
            this.hiddenEl = C.cn("input", F);
            this.wrapEl.appendChild(this.el);
            this.wrapEl.appendChild(this.hiddenEl);
            this.fieldContainer.appendChild(this.wrapEl);
            this.listEl = C.cn("div", {id: B.generateId()});
            this.fieldContainer.appendChild(this.listEl);
            A.onAvailable([this.el, this.listEl], this.buildAutocomplete, this, true)
        }, buildAutocomplete: function() {
            if (!this._nElementsReady) {
                this._nElementsReady = 0
            }
            this._nElementsReady++;
            if (this._nElementsReady != 2) {
                return
            }
            this.oAutoComp = new YAHOO.widget.AutoComplete(this.el.id, this.listEl.id, this.options.datasource, this.options.autoComp);
            this.oAutoComp.itemSelectEvent.subscribe(this.itemSelectHandler, this, true);
            this.oAutoComp.textboxBlurEvent.subscribe(this.onBlur, this, true)
        }, itemSelectHandler: function(G, F) {
            var E = F[2];
            this.setValue(this.options.returnValue ? this.options.returnValue(E) : E[0])
        }, onChange: function(E) {
            this.setClassFromState();
            YAHOO.lang.later(50, this, function() {
                if (this.el.value == "") {
                    this.setValue("")
                }
            });
            this.fireUpdatedEvt()
        }, setValue: function(F, E) {
            this.hiddenEl.value = F;
            this.setClassFromState();
            if (E !== false) {
                this.fireUpdatedEvt()
            }
        }, getValue: function() {
            return this.hiddenEl.value
        }});
    C.registerType("autocomplete", C.AutoComplete)
})();
(function() {
    var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;
    C.CheckBox = function(E) {
        C.CheckBox.superclass.constructor.call(this, E)
    };
    D.extend(C.CheckBox, C.Field, {setOptions: function(E) {
            C.CheckBox.superclass.setOptions.call(this, E);
            this.options.className = E.className ? E.className : "inputEx-Field inputEx-CheckBox";
            this.options.rightLabel = E.rightLabel || "";
            this.sentValues = E.sentValues || [true, false];
            this.options.sentValues = this.sentValues;
            this.checkedValue = this.sentValues[0];
            this.uncheckedValue = this.sentValues[1]
        }, renderComponent: function() {
            var E = this.divEl.id ? this.divEl.id + "-field" : YAHOO.util.Dom.generateId();
            this.el = C.cn("input", {id: E, type: "checkbox", checked: (this.options.checked === false) ? false : true});
            this.fieldContainer.appendChild(this.el);
            this.rightLabelEl = C.cn("label", {"for": E, className: "inputEx-CheckBox-rightLabel"}, null, this.options.rightLabel);
            this.fieldContainer.appendChild(this.rightLabelEl);
            this.hiddenEl = C.cn("input", {type: "hidden", name: this.options.name || "", value: this.el.checked ? this.checkedValue : this.uncheckedValue});
            this.fieldContainer.appendChild(this.hiddenEl)
        }, initEvents: function() {
            A.addListener(this.el, "change", this.onChange, this, true);
            if (YAHOO.env.ua.ie) {
                A.addListener(this.el, "click", function() {
                    YAHOO.lang.later(10, this, this.fireUpdatedEvt)
                }, this, true)
            }
            A.addFocusListener(this.el, this.onFocus, this, true);
            A.addBlurListener(this.el, this.onBlur, this, true)
        }, onChange: function(E) {
            this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;
            if (!YAHOO.env.ua.ie) {
                C.CheckBox.superclass.onChange.call(this, E)
            }
        }, getValue: function() {
            return this.el.checked ? this.checkedValue : this.uncheckedValue
        }, setValue: function(F, E) {
            if (F === this.checkedValue) {
                this.hiddenEl.value = F;
                this.el.checked = true
            } else {
                this.hiddenEl.value = F;
                this.el.checked = false
            }
            C.CheckBox.superclass.setValue.call(this, F, E)
        }, disable: function() {
            this.el.disabled = true
        }, enable: function() {
            this.el.disabled = false
        }});
    C.registerType("boolean", C.CheckBox)
})();
(function() {
    var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;
    C.ColorField = function(E) {
        C.ColorField.superclass.constructor.call(this, E)
    };
    D.extend(C.ColorField, C.Field, {setOptions: function(E) {
            C.ColorField.superclass.setOptions.call(this, E);
            this.options.className = E.className ? E.className : "inputEx-Field inputEx-ColorField inputEx-PickerField";
            this.options.palette = E.palette;
            this.options.colors = E.colors;
            if (E.ratio) {
                this.options.ratio = E.ratio
            }
            if (E.cellPerLine) {
                this.options.cellPerLine = E.cellPerLine
            }
            if (E.overlayPadding) {
                this.options.overlayPadding = E.overlayPadding
            }
            if (E.cellHeight) {
                this.options.cellHeight = E.cellHeight
            }
            if (E.cellWidth) {
                this.options.cellWidth = E.cellWidth
            }
            if (E.cellMargin) {
                this.options.cellMargin = E.cellMargin
            }
        }, renderComponent: function() {
            this.el = C.cn("input", {type: "hidden", name: this.options.name || "", value: this.options.value || "#DD7870"});
            this.colorEl = C.cn("div", {className: "inputEx-ColorField-button"}, {backgroundColor: this.el.value});
            this.wrapEl = C.cn("div", {className: "inputEx-PickerField-wrapper"});
            this.wrapEl.appendChild(this.el);
            this.wrapEl.appendChild(this.colorEl);
            this.oOverlay = new YAHOO.widget.Overlay(B.generateId(), {visible: false});
            this.oOverlay.setBody(" ");
            this.oOverlay.body.id = B.generateId();
            this.button = new YAHOO.widget.Button({type: "menu", menu: this.oOverlay, label: "&nbsp;&nbsp;&nbsp;&nbsp;"});
            this.button.appendTo(this.wrapEl);
            this.oOverlay.render(this.wrapEl);
            B.setStyle(this.oOverlay.body.parentNode, "position", "absolute");
            A.addListener(this.colorEl, "mousedown", function(E) {
                if (!this.oOverlay.cfg.getProperty("visible")) {
                    A.stopEvent(E);
                    this.renderPalette();
                    this.button._showMenu()
                }
            }, this, true);
            this.button.on("mousedown", this.renderPalette, this, true);
            this.fieldContainer.appendChild(this.wrapEl)
        }, renderPalette: function() {
            if (this.paletteRendered) {
                return
            }
            var I = this.options.palette || 1;
            this.colors = this.options.colors || this.setDefaultColors(I);
            this.length = this.colors.length;
            this.ratio = this.options.ratio || [16, 9];
            this.cellPerLine = this.options.cellPerLine || Math.ceil(Math.sqrt(this.length * this.ratio[0] / this.ratio[1]));
            this.cellPerColumn = Math.ceil(this.length / this.cellPerLine);
            this.overlayPadding = this.options.overlayPadding || 7;
            this.cellWidth = this.options.cellWidth || 17;
            this.cellHeight = this.options.cellHeight || 17;
            this.cellMargin = this.options.cellMargin || 4;
            var H = document.getElementById(this.oOverlay.body.id);
            var F = this.renderColorGrid();
            H.appendChild(F);
            var G = (this.cellWidth + 2 * this.cellMargin) * this.cellPerLine + (YAHOO.env.ua.ie == 6 ? 3 * this.overlayPadding : 0);
            var E = (this.cellHeight + 2 * this.cellMargin) * this.cellPerColumn + (YAHOO.env.ua.ie == 6 ? 3 * this.overlayPadding : 0);
            B.setStyle(H, "width", G + "px");
            B.setStyle(H, "height", E + "px");
            B.setStyle(H, "padding", this.overlayPadding + "px");
            this.button.unsubscribe("mousedown", this.renderPalette);
            this.paletteRendered = true
        }, setDefaultColors: function(E) {
            return C.ColorField.palettes[E - 1]
        }, renderColorGrid: function() {
            var F = C.cn("div");
            for (var E = 0; E < this.length; E++) {
                var G = C.cn("div", {className: "inputEx-ColorField-square"}, {backgroundColor: this.colors[E], width: this.cellWidth + "px", height: this.cellHeight + "px", margin: this.cellMargin + "px"});
                A.addListener(G, "mousedown", this.onColorClick, this, true);
                F.appendChild(G)
            }
            return F
        }, onColorClick: function(H) {
            var G = A.getTarget(H);
            A.stopEvent(H);
            this.oOverlay.hide();
            var F = B.getStyle(G, "background-color");
            var E = C.ColorField.ensureHexa(F);
            this.setValue(E)
        }, setValue: function(F, E) {
            this.el.value = F;
            B.setStyle(this.colorEl, "background-color", this.el.value);
            C.ColorField.superclass.setValue.call(this, F, E)
        }, getValue: function() {
            return this.el.value
        }, close: function() {
            this.oOverlay.hide()
        }});
    C.messages.selectColor = "Select a color :";
    C.ColorField.palettes = [["#FFEA99", "#FFFF66", "#FFCC99", "#FFCAB2", "#FF99AD", "#FFD6FF", "#FF6666", "#E8EEF7", "#ADC2FF", "#ADADFF", "#CCFFFF", "#D6EAAD", "#B5EDBC", "#CCFF99"], ["#DEDFDE", "#FFFF6B", "#EFCB7B", "#FFBE94", "#FFB6B5", "#A5E3FF", "#A5CBFF", "#99ABEF", "#EFB2E7", "#FF9AAD", "#94E7C6", "#A5FFD6", "#CEFFA5", "#E7EF9C", "#FFE38C"], ["#000000", "#993300", "#333300", "#003300", "#003366", "#000080", "#333399", "#333333", "#800000", "#FF6600", "#808000", "#008000", "#008080", "#0000FF", "#666699", "#808080", "#FF0000", "#FF9900", "#99CC00", "#339966", "#33CCCC", "#3366FF", "#800080", "#969696", "#FF00FF", "#FFCC00", "#FFFF00", "#00FF00", "#00FFFF", "#00CCFF", "#993366", "#C0C0C0", "#FF99CC", "#FFCC99", "#FFFF99", "#CCFFCC", "#CCFFFF", "#99CCFF", "#CC99FF", "#F0F0F0"], ["#FFFFCC", "#FFFF99", "#CCFFCC", "#CCFF66", "#99FFCC", "#CCFFFF", "#66CCCC", "#CCCCFF", "#99CCFF", "#9999FF", "#6666CC", "#9966CC", "#CC99FF", "#FFCCFF", "#FF99FF", "#CC66CC", "#FFCCCC", "#FF99CC", "#FFCCCC", "#CC6699", "#FF9999", "#FF9966", "#FFCC99", "#FFFFCC", "#FFCC66", "#FFFF99", "#CCCC66"], ["#D0D0D0", "#31A8FA", "#8EC1E5", "#58D7CF", "#89E2BB", "#A7F7F8", "#F6B77C", "#FE993F", "#FE6440", "#F56572", "#FA9AA3", "#F7B1CA", "#E584AF", "#D1C3EF", "#AB77B8", "#C69FE7", "#90D28A", "#C2F175", "#EDEA9A", "#F3DF70", "#F8D1AE", "#F98064", "#F54F5E", "#EC9099", "#F0B5BA", "#EDA0BB", "#D375AC", "#BC8DBE", "#8C77B8"], ["#EEEEEE", "#84CBFC", "#BCDAF0", "#9BE7E3", "#B9EED7", "#CBFBFB", "#FAD4B1", "#FFC28C", "#FFA28D", "#F9A3AB", "#FCC3C8", "#FBD1E0", "#F0B6CF", "#E4DBF6", "#CDAED5", "#DDC6F1", "#BDE4B9", "#DBF7AD", "#F5F3C3", "#F8ECAA", "#FBE4CF", "#FCB3A2", "#F9969F", "#F4BDC2", "#F6D3D6", "#F5C6D7", "#E5ADCE", "#D7BBD8", "#BAAED5"]];
    C.ColorField.ensureHexa = function(F) {
        var G, E;
        F = F.replace(/\s/g, "");
        if (!!F.match(/^rgb\((?:\d{1,3},){2}\d{1,3}\)$/)) {
            var H = function(J) {
                var I = parseInt(J, 10).toString(16);
                if (I.length == 1) {
                    I = "0" + I
                }
                return I
            };
            G = F.split(/([(,)])/);
            E = "#" + H(G[2]) + H(G[4]) + H(G[6])
        } else {
            if (!!F.match(/^#[\da-fA-F]{6}$/)) {
                E = F
            } else {
                E = "#FFFFFF"
            }
        }
        return E
    };
    C.registerType("color", C.ColorField)
})();
(function() {
    var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;
    C.DateField = function(E) {
        C.DateField.superclass.constructor.call(this, E)
    };
    D.extend(C.DateField, C.StringField, {setOptions: function(E) {
            C.DateField.superclass.setOptions.call(this, E);
            this.options.className = E.className ? E.className : "inputEx-Field inputEx-DateField";
            this.options.messages.invalid = C.messages.invalidDate;
            this.options.dateFormat = E.dateFormat || C.messages.defaultDateFormat
        }, validate: function() {
            var L = this.el.value;
            var M = L.split("/");
            if (M.length != 3) {
                return false
            }
            if (isNaN(parseInt(M[0], 10)) || isNaN(parseInt(M[1], 10)) || isNaN(parseInt(M[2], 10))) {
                return false
            }
            var I = this.options.dateFormat.split("/");
            var E = C.indexOf("Y", I);
            if (M[E].length != 4) {
                return false
            }
            var K = parseInt(M[C.indexOf("d", I)], 10);
            var F = parseInt(M[E], 10);
            var H = parseInt(M[C.indexOf("m", I)], 10) - 1;
            var J = new Date(F, H, K);
            var G = J.getFullYear();
            return((J.getDate() == K) && (J.getMonth() == H) && (G == F))
        }, setValue: function(I, F) {
            if (I === "") {
                C.DateField.superclass.setValue.call(this, "", F);
                return
            }
            var H = "";
            if (I instanceof Date) {
                H = this.options.dateFormat.replace("Y", I.getFullYear());
                var E = I.getMonth() + 1;
                H = H.replace("m", ((E < 10) ? "0" : "") + E);
                var G = I.getDate();
                H = H.replace("d", ((G < 10) ? "0" : "") + G)
            } else {
                H = I
            }
            C.DateField.superclass.setValue.call(this, H, F)
        }, getValue: function() {
            var G = C.DateField.superclass.getValue.call(this);
            if (G === "") {
                return""
            }
            var F = G.split("/");
            var H = this.options.dateFormat.split("/");
            var J = parseInt(F[C.indexOf("d", H)], 10);
            var I = parseInt(F[C.indexOf("Y", H)], 10);
            var E = parseInt(F[C.indexOf("m", H)], 10) - 1;
            return(new Date(I, E, J))
        }});
    C.messages.invalidDate = "Invalid date, ex: 03/27/2008";
    C.registerType("date", C.DateField)
})();
(function() {
    var B = YAHOO.inputEx, C = YAHOO.lang, A = YAHOO.util.Event;
    B.DateSplitField = function(D) {
        if (!D.dateFormat) {
            D.dateFormat = B.messages.defaultDateFormat
        }
        var F = D.dateFormat.split("/");
        this.yearIndex = B.indexOf("Y", F);
        this.monthIndex = B.indexOf("m", F);
        this.dayIndex = B.indexOf("d", F);
        D.fields = [];
        for (var E = 0; E < 3; E++) {
            if (E == this.dayIndex) {
                D.fields.push({type: "integer", inputParams: {typeInvite: B.messages.dayTypeInvite, size: 2}})
            } else {
                if (E == this.yearIndex) {
                    D.fields.push({type: "integer", inputParams: {typeInvite: B.messages.yearTypeInvite, size: 4}})
                } else {
                    D.fields.push({type: "integer", inputParams: {typeInvite: B.messages.monthTypeInvite, size: 2}})
                }
            }
        }
        D.separators = D.separators || [false, "&nbsp;", "&nbsp;", false];
        B.DateSplitField.superclass.constructor.call(this, D);
        this.initAutoTab()
    };
    C.extend(B.DateSplitField, B.CombineField, {setValue: function(G, E) {
            var D = [];
            if (!G || !C.isFunction(G.getTime) || !C.isNumber(G.getTime())) {
                D[this.monthIndex] = "";
                D[this.yearIndex] = "";
                D[this.dayIndex] = ""
            } else {
                for (var F = 0; F < 3; F++) {
                    D.push(F == this.dayIndex ? G.getDate() : (F == this.yearIndex ? G.getFullYear() : G.getMonth() + 1))
                }
            }
            B.DateSplitField.superclass.setValue.call(this, D, E)
        }, getValue: function() {
            if (this.isEmpty()) {
                return""
            }
            var D = B.DateSplitField.superclass.getValue.call(this);
            return new Date(D[this.yearIndex], D[this.monthIndex] - 1, D[this.dayIndex])
        }, validate: function() {
            var F = B.DateSplitField.superclass.validate.call(this);
            if (!F) {
                return false
            }
            var E = B.DateSplitField.superclass.getValue.call(this);
            var D = E[this.dayIndex];
            var H = E[this.monthIndex];
            var G = E[this.yearIndex];
            var I = this.getValue();
            if (I == "") {
                return true
            }
            if (D == "" || H == "" || G == "") {
                return false
            }
            if (G < 0 || G > 9999 || D < 1 || D > 31 || H < 1 || H > 12) {
                return false
            }
            return(I != "Invalid Date")
        }, isEmpty: function() {
            var D = B.DateSplitField.superclass.getValue.call(this);
            return(D[this.monthIndex] == "" && D[this.yearIndex] == "" && D[this.dayIndex] == "")
        }, initAutoTab: function() {
            var D = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
            var G = function(H) {
                for (var I = 0, J = D.length; I < J; I++) {
                    if (H == D[I]) {
                        return true
                    }
                }
                return false
            };
            var F = this;
            var E = function(H) {
                C.later(0, F, function() {
                    var I = F.inputs[H];
                    if (I.el.value.length == I.options.size) {
                        F.inputs[H + 1].focus()
                    }
                })
            };
            A.addListener(this.inputs[0].el, "keypress", function(H) {
                if (G(A.getCharCode(H))) {
                    E(0)
                }
            }, this, true);
            A.addListener(this.inputs[1].el, "keypress", function(H) {
                if (G(A.getCharCode(H))) {
                    E(1)
                }
            }, this, true)
        }});
    B.messages.monthTypeInvite = "Month";
    B.messages.dayTypeInvite = "Day";
    B.messages.yearTypeInvite = "Year";
    B.registerType("datesplit", B.DateSplitField)
})();
(function() {
    var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;
    C.DatePickerField = function(E) {
        C.DatePickerField.superclass.constructor.call(this, E)
    };
    D.extend(C.DatePickerField, C.DateField, {setOptions: function(E) {
            C.DatePickerField.superclass.setOptions.call(this, E);
            this.options.className = E.className ? E.className : "inputEx-Field inputEx-DateField inputEx-PickerField inputEx-DatePickerField";
            this.options.readonly = true;
            this.options.calendar = E.calendar || C.messages.defautCalendarOpts
        }, renderComponent: function() {
            C.DatePickerField.superclass.renderComponent.call(this);
            this.oOverlay = new YAHOO.widget.Overlay(B.generateId(), {visible: false});
            this.oOverlay.setBody(" ");
            this.oOverlay.body.id = B.generateId();
            this.button = new YAHOO.widget.Button({type: "menu", menu: this.oOverlay, label: "&nbsp;&nbsp;&nbsp;&nbsp;"});
            this.button.appendTo(this.wrapEl);
            this.oOverlay.render(this.wrapEl);
            B.setStyle(this.oOverlay.body.parentNode, "position", "absolute");
            A.addListener(this.el, "click", function() {
                this.renderCalendar();
                if (!this.oOverlay.justHidden) {
                    this.button._showMenu()
                }
            }, this, true);
            this.oOverlay.hideEvent.subscribe(function() {
                this.oOverlay.justHidden = true;
                YAHOO.lang.later(250, this, function() {
                    this.oOverlay.justHidden = false
                })
            }, this, true);
            this.button.on("click", this.renderCalendar, this, true)
        }, renderCalendar: function() {
            if (!!this.calendarRendered) {
                return
            }
            var F = B.generateId();
            this.calendar = new YAHOO.widget.Calendar(F, this.oOverlay.body.id, this.options.calendar);
            if (C.messages.shortMonths) {
                this.calendar.cfg.setProperty("MONTHS_SHORT", C.messages.shortMonths)
            }
            if (C.messages.months) {
                this.calendar.cfg.setProperty("MONTHS_LONG", C.messages.months)
            }
            if (C.messages.weekdays1char) {
                this.calendar.cfg.setProperty("WEEKDAYS_1CHAR", C.messages.weekdays1char)
            }
            if (C.messages.shortWeekdays) {
                this.calendar.cfg.setProperty("WEEKDAYS_SHORT", C.messages.shortWeekdays)
            }
            var E = function() {
                var I = B.get(F).tBodies[0], H = I.getElementsByTagName("a"), G;
                if (H.length > 0) {
                    B.batch(H, function(J) {
                        if (B.hasClass(J.parentNode, "today")) {
                            G = J
                        }
                    });
                    if (!G) {
                        G = H[0]
                    }
                    D.later(0, G, function() {
                        try {
                            G.focus()
                        } catch (J) {
                        }
                    })
                }
            };
            this.calendar.renderEvent.subscribe(E, this.calendar, true);
            this.oOverlay.beforeShowEvent.subscribe(this.beforeShowOverlay, this, true);
            this.beforeShowOverlay();
            this.calendar.selectEvent.subscribe(function(K, I, M) {
                if (!!this.ignoreNextSelectEvent) {
                    this.ignoreNextSelectEvent = false;
                    return
                }
                this.oOverlay.hide();
                var H = I[0][0];
                var J = H[0], L = H[1], G = H[2];
                this.setValue(new Date(J, L - 1, G))
            }, this, true);
            this.button.unsubscribe("click", this.renderCalendar);
            this.calendarRendered = true
        }, beforeShowOverlay: function() {
            var E = this.getValue();
            if (!!E && !!this.calendar) {
                this.ignoreNextSelectEvent = true;
                this.calendar.select(E);
                this.calendar.cfg.setProperty("pagedate", (E.getMonth() + 1) + "/" + E.getFullYear());
                this.calendar.render()
            }
        }});
    C.messages.defautCalendarOpts = {navigator: true};
    C.registerType("datepicker", C.DatePickerField)
})();
(function() {
    var A = YAHOO.inputEx;
    A.EmailField = function(B) {
        A.EmailField.superclass.constructor.call(this, B)
    };
    YAHOO.lang.extend(A.EmailField, A.StringField, {setOptions: function(B) {
            A.EmailField.superclass.setOptions.call(this, B);
            this.options.messages.invalid = A.messages.invalidEmail;
            this.options.regexp = A.regexps.email
        }, getValue: function() {
            return this.el.value.toLowerCase()
        }});
    A.messages.invalidEmail = "Invalid email, ex: sample@test.com";
    A.registerType("email", A.EmailField)
})();
(function() {
    var A = YAHOO.inputEx;
    A.HiddenField = function(B) {
        A.HiddenField.superclass.constructor.call(this, B)
    };
    YAHOO.lang.extend(A.HiddenField, A.Field, {render: function() {
            this.type = A.HiddenField;
            this.divEl = A.cn("div", null, {display: "none"});
            this.el = A.cn("input", {type: "hidden"});
            if (this.options.name) {
                this.el.name = this.options.name
            }
            this.divEl.appendChild(this.el)
        }, setValue: function(C, B) {
            this.el.value = C;
            A.HiddenField.superclass.setValue.call(this, C, B)
        }, getValue: function() {
            return this.el.value
        }});
    A.registerType("hidden", A.HiddenField)
})();
(function() {
    var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;
    C.InPlaceEdit = function(E) {
        C.InPlaceEdit.superclass.constructor.call(this, E)
    };
    D.extend(C.InPlaceEdit, C.Field, {setOptions: function(E) {
            C.InPlaceEdit.superclass.setOptions.call(this, E);
            this.options.animColors = E.animColors || {from: "#ffff99", to: "#ffffff"};
            this.options.visu = E.visu;
            this.options.editorField = E.editorField
        }, renderComponent: function() {
            this.renderVisuDiv();
            this.renderEditor()
        }, renderEditor: function() {
            this.editorContainer = C.cn("div", {className: "inputEx-InPlaceEdit-editor"}, {display: "none"});
            this.editorField = C.buildField(this.options.editorField);
            this.editorContainer.appendChild(this.editorField.getEl());
            B.setStyle(this.editorField.getEl(), "float", "left");
            this.okButton = C.cn("input", {type: "button", value: C.messages.okEditor, className: "inputEx-InPlaceEdit-OkButton"});
            B.setStyle(this.okButton, "float", "left");
            this.editorContainer.appendChild(this.okButton);
            this.cancelLink = C.cn("a", {className: "inputEx-InPlaceEdit-CancelLink"}, null, C.messages.cancelEditor);
            this.cancelLink.href = "";
            B.setStyle(this.cancelLink, "float", "left");
            this.editorContainer.appendChild(this.cancelLink);
            this.editorContainer.appendChild(C.cn("div", null, {clear: "both"}));
            this.fieldContainer.appendChild(this.editorContainer)
        }, onVisuMouseOver: function(E) {
            if (this.colorAnim) {
                this.colorAnim.stop(true)
            }
            C.sn(this.formattedContainer, null, {backgroundColor: this.options.animColors.from})
        }, onVisuMouseOut: function(E) {
            if (this.colorAnim) {
                this.colorAnim.stop(true)
            }
            this.colorAnim = new YAHOO.util.ColorAnim(this.formattedContainer, {backgroundColor: this.options.animColors}, 1);
            this.colorAnim.onComplete.subscribe(function() {
                B.setStyle(this.formattedContainer, "background-color", "")
            }, this, true);
            this.colorAnim.animate()
        }, renderVisuDiv: function() {
            this.formattedContainer = C.cn("div", {className: "inputEx-InPlaceEdit-visu"});
            if (D.isFunction(this.options.formatDom)) {
                this.formattedContainer.appendChild(this.options.formatDom(this.options.value))
            } else {
                if (D.isFunction(this.options.formatValue)) {
                    this.formattedContainer.innerHTML = this.options.formatValue(this.options.value)
                } else {
                    this.formattedContainer.innerHTML = D.isUndefined(this.options.value) ? C.messages.emptyInPlaceEdit : this.options.value
                }
            }
            this.fieldContainer.appendChild(this.formattedContainer)
        }, initEvents: function() {
            A.addListener(this.formattedContainer, "click", this.openEditor, this, true);
            A.addListener(this.formattedContainer, "mouseover", this.onVisuMouseOver, this, true);
            A.addListener(this.formattedContainer, "mouseout", this.onVisuMouseOut, this, true);
            A.addListener(this.okButton, "click", this.onOkEditor, this, true);
            A.addListener(this.cancelLink, "click", this.onCancelEditor, this, true);
            if (this.editorField.el) {
                A.addListener(this.editorField.el, "keyup", this.onKeyUp, this, true);
                A.addListener(this.editorField.el, "keydown", this.onKeyDown, this, true)
            }
        }, onKeyUp: function(E) {
            if (E.keyCode == 13) {
                this.onOkEditor()
            }
            if (E.keyCode == 27) {
                this.onCancelEditor(E)
            }
        }, onKeyDown: function(E) {
            if (E.keyCode == 9) {
                this.onOkEditor()
            }
        }, onOkEditor: function() {
            var F = this.editorField.getValue();
            this.setValue(F);
            this.editorContainer.style.display = "none";
            this.formattedContainer.style.display = "";
            var E = this;
            setTimeout(function() {
                E.updatedEvt.fire(F)
            }, 50)
        }, onCancelEditor: function(E) {
            A.stopEvent(E);
            this.editorContainer.style.display = "none";
            this.formattedContainer.style.display = ""
        }, openEditor: function() {
            var E = this.getValue();
            this.editorContainer.style.display = "";
            this.formattedContainer.style.display = "none";
            if (!D.isUndefined(E)) {
                this.editorField.setValue(E)
            }
            this.editorField.focus();
            if (this.editorField.el && D.isFunction(this.editorField.el.setSelectionRange) && (!!E && !!E.length)) {
                this.editorField.el.setSelectionRange(0, E.length)
            }
        }, getValue: function() {
            var E = (this.editorContainer.style.display == "");
            return E ? this.editorField.getValue() : this.value
        }, setValue: function(F, E) {
            this.value = F;
            if (D.isUndefined(F) || F == "") {
                C.renderVisu(this.options.visu, C.messages.emptyInPlaceEdit, this.formattedContainer)
            } else {
                C.renderVisu(this.options.visu, this.value, this.formattedContainer)
            }
            if (this.editorContainer.style.display == "") {
                this.editorField.setValue(F)
            }
            C.InPlaceEdit.superclass.setValue.call(this, F, E)
        }, close: function() {
            this.editorContainer.style.display = "none";
            this.formattedContainer.style.display = ""
        }});
    C.messages.emptyInPlaceEdit = "(click to edit)";
    C.messages.cancelEditor = "cancel";
    C.messages.okEditor = "Ok";
    C.registerType("inplaceedit", C.InPlaceEdit)
})();
(function() {
    var B = YAHOO.inputEx, C = YAHOO.lang, A = YAHOO.util.Event;
    B.IntegerField = function(D) {
        B.IntegerField.superclass.constructor.call(this, D)
    };
    YAHOO.lang.extend(B.IntegerField, B.StringField, {setOptions: function(D) {
            B.IntegerField.superclass.setOptions.call(this, D);
            this.options.negative = C.isUndefined(D.negative) ? false : D.negative
        }, getValue: function() {
            if ((this.options.typeInvite && this.el.value == this.options.typeInvite) || this.el.value == "") {
                return""
            }
            return parseInt(this.el.value, 10)
        }, validate: function() {
            var D = this.getValue();
            if (D == "") {
                return true
            }
            if (isNaN(D)) {
                return false
            }
            return !!this.el.value.match(new RegExp(this.options.negative ? "^[+-]?[0-9]*$" : "^\\+?[0-9]*$"))
        }});
    B.registerType("integer", B.IntegerField)
})();
(function() {
    var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;
    C.ListField = function(E) {
        console.log("aquí fue!");
        this.subFields = [];
        C.ListField.superclass.constructor.call(this, E)
    };
    D.extend(C.ListField, C.Field, {setOptions: function(E) {
            C.ListField.superclass.setOptions.call(this, E);
            this.options.className = E.className ? E.className : "inputEx-Field inputEx-ListField";
            this.options.sortable = D.isUndefined(E.sortable) ? false : E.sortable;
            this.options.elementType = E.elementType || {type: "string"};
            this.options.useButtons = D.isUndefined(E.useButtons) ? false : E.useButtons;
            this.options.unique = D.isUndefined(E.unique) ? false : E.unique;
            this.options.listAddLabel = E.listAddLabel || C.messages.listAddLink;
            this.options.listRemoveLabel = E.listRemoveLabel || C.messages.listRemoveLink;
        }, renderComponent: function() {
            if (this.options.useButtons) {
                this.addButton = C.cn("img", {src: C.spacerUrl, className: "inputEx-ListField-addButton"});
                this.fieldContainer.appendChild(this.addButton)
            }
            this.fieldContainer.appendChild(C.cn("span", null, {marginLeft: "4px"}, this.options.listLabel));
            this.childContainer = C.cn("div", {className: "inputEx-ListField-childContainer"});
            this.fieldContainer.appendChild(this.childContainer);
            if (!this.options.useButtons) {
                this.addButton = C.cn("a", {className: "inputEx-List-link"}, null, this.options.listAddLabel);
                this.fieldContainer.appendChild(this.addButton)
            }
        }, initEvents: function() {
            A.addListener(this.addButton, "click", this.onAddButton, this, true)
        }, validate: function() {
            var F = true;
            var J = {};
            for (var G = 0; G < this.subFields.length && F; G++) {
                var E = this.subFields[G];
                E.setClassFromState();
                var H = E.getState();
                if (H == C.stateRequired || H == C.stateInvalid) {
                    F = false
                }
                if (this.options.unique) {
                    var I = D.dump(E.getValue());
                    if (J[I]) {
                        F = false
                    } else {
                        J[I] = true
                    }
                }
            }
            return F
        }, setValue: function(H, E) {
            if (!D.isArray(H)) {
                return
            }
            for (var G = 0; G < H.length; G++) {
                if (G == this.subFields.length) {
                    this.addElement(H[G])
                } else {
                    this.subFields[G].setValue(H[G], false)
                }
            }
            var F = this.subFields.length - H.length;
            if (F > 0) {
                for (var G = 0; G < F; G++) {
                    this.removeElement(H.length)
                }
            }
            C.ListField.superclass.setValue.call(this, H, E)
        }, getValue: function() {
            var E = [];
            for (var F = 0; F < this.subFields.length; F++) {
                E[F] = this.subFields[F].getValue()
            }
            return E
        }, addElement: function(F) {
            var E = this.renderSubField(F);
            this.subFields.push(E);
            return E
        }, onAddButton: function(F) {
            A.stopEvent(F);
            var E = this.addElement();
            E.focus();
            this.fireUpdatedEvt()
        }, renderSubField: function(L) {
            var H = C.cn("div");
            if (this.options.useButtons) {
                var F = C.cn("img", {src: C.spacerUrl, className: "inputEx-ListField-delButton"});
                A.addListener(F, "click", this.onDelete, this, true);
                H.appendChild(F)
            }
            var K = D.merge({}, this.options.elementType);
            if (!K.inputParams) {
                K.inputParams = {}
            }
            if (!D.isUndefined(L)) {
                K.inputParams.value = L
            }
            var I = C.buildField(K);
            var G = I.getEl();
            B.setStyle(G, "margin-left", "4px");
            B.setStyle(G, "float", "left");
            H.appendChild(G);
            I.updatedEvt.subscribe(this.onChange, this, true);
            if (this.options.sortable) {
                var J = C.cn("div", {className: "inputEx-ListField-Arrow inputEx-ListField-ArrowUp"});
                A.addListener(J, "click", this.onArrowUp, this, true);
                var E = C.cn("div", {className: "inputEx-ListField-Arrow inputEx-ListField-ArrowDown"});
                A.addListener(E, "click", this.onArrowDown, this, true);
                H.appendChild(J);
                H.appendChild(E)
            }
            if (!this.options.useButtons) {
                var F = C.cn("a", {className: "inputEx-List-link"}, null, this.options.listRemoveLabel);
                A.addListener(F, "click", this.onDelete, this, true);
                H.appendChild(F)
            }
            H.appendChild(C.cn("div", null, {clear: "both"}));
            this.childContainer.appendChild(H);
            return I
        }, onArrowUp: function(K) {
            var H = A.getTarget(K).parentNode;
            var F = null;
            var G = -1;
            for (var I = 1; I < H.parentNode.childNodes.length; I++) {
                var E = H.parentNode.childNodes[I];
                if (E == H) {
                    F = H.parentNode.childNodes[I - 1];
                    G = I;
                    break
                }
            }
            if (F) {
                var L = this.childContainer.removeChild(H);
                var J = this.childContainer.insertBefore(L, F);
                var M = this.subFields[G];
                this.subFields[G] = this.subFields[G - 1];
                this.subFields[G - 1] = M;
                if (this.arrowAnim) {
                    this.arrowAnim.stop(true)
                }
                this.arrowAnim = new YAHOO.util.ColorAnim(J, {backgroundColor: {from: "#eeee33", to: "#eeeeee"}}, 0.4);
                this.arrowAnim.onComplete.subscribe(function() {
                    B.setStyle(J, "background-color", "")
                });
                this.arrowAnim.animate();
                this.fireUpdatedEvt()
            }
        }, onArrowDown: function(K) {
            var G = A.getTarget(K).parentNode;
            var F = -1;
            var J = null;
            for (var H = 0; H < G.parentNode.childNodes.length; H++) {
                var E = G.parentNode.childNodes[H];
                if (E == G) {
                    J = G.parentNode.childNodes[H + 1];
                    F = H;
                    break
                }
            }
            if (J) {
                var L = this.childContainer.removeChild(G);
                var I = B.insertAfter(L, J);
                var M = this.subFields[F];
                this.subFields[F] = this.subFields[F + 1];
                this.subFields[F + 1] = M;
                if (this.arrowAnim) {
                    this.arrowAnim.stop(true)
                }
                this.arrowAnim = new YAHOO.util.ColorAnim(I, {backgroundColor: {from: "#eeee33", to: "#eeeeee"}}, 1);
                this.arrowAnim.onComplete.subscribe(function() {
                    B.setStyle(I, "background-color", "")
                });
                this.arrowAnim.animate();
                this.fireUpdatedEvt()
            }
        }, onDelete: function(I) {
            A.stopEvent(I);
            var F = A.getTarget(I).parentNode;
            var E = -1;
            var H = F.childNodes[this.options.useButtons ? 1 : 0];
            for (var G = 0; G < this.subFields.length; G++) {
                if (this.subFields[G].getEl() == H) {
                    E = G;
                    break
                }
            }
            if (E != -1) {
                this.removeElement(E)
            }
            this.fireUpdatedEvt()
        }, removeElement: function(F) {
            var E = this.subFields[F].getEl().parentNode;
            this.subFields[F] = undefined;
            this.subFields = C.compactArray(this.subFields);
            E.parentNode.removeChild(E)
        }});
    C.registerType("list", C.ListField);
    C.messages.listAddLink = "Add2";
    C.messages.listRemoveLink = "remove2"
})();
(function() {
    var B = YAHOO.inputEx, A = YAHOO.util.Event, C = YAHOO.lang;
    B.NumberField = function(D) {
        B.NumberField.superclass.constructor.call(this, D)
    };
    YAHOO.lang.extend(B.NumberField, B.StringField, {getValue: function() {
            if ((this.options.typeInvite && this.el.value == this.options.typeInvite) || this.el.value == "") {
                return""
            }
            return parseFloat(this.el.value)
        }, validate: function() {
            var D = this.getValue();
            if (D == "") {
                return true
            }
            if (isNaN(D)) {
                return false
            }
            return !!this.el.value.match(/^([\+\-]?((([0-9]+(\.)?)|([0-9]*\.[0-9]+))([eE][+-]?[0-9]+)?))$/)
        }});
    B.registerType("number", B.NumberField)
})();
(function() {
    var A = YAHOO.inputEx;
    A.PairField = function(B) {
        B.fields = [B.leftFieldOptions || {}, B.rightFieldOptions || {}];
        B.separators = [false, " : ", false];
        A.PairField.superclass.constructor.call(this, B)
    };
    YAHOO.lang.extend(A.PairField, A.CombineField);
    A.registerType("pair", A.PairField)
})();
(function() {
    var B = YAHOO.inputEx, A = YAHOO.util.Event, C = YAHOO.lang;
    B.PasswordField = function(D) {
        B.PasswordField.superclass.constructor.call(this, D)
    };
    C.extend(B.PasswordField, B.StringField, {setOptions: function(D) {
            B.PasswordField.superclass.setOptions.call(this, D);
            this.options.className = D.className ? D.className : "inputEx-Field inputEx-PasswordField";
            this.options.regexp = B.regexps.password;
            this.options.strengthIndicator = YAHOO.lang.isUndefined(D.strengthIndicator) ? false : D.strengthIndicator;
            this.options.capsLockWarning = YAHOO.lang.isUndefined(D.capsLockWarning) ? false : D.capsLockWarning
        }, renderComponent: function() {
            this.wrapEl = B.cn("div", {className: "inputEx-StringField-wrapper"});
            var D = {};
            D.type = "password";
            D.size = this.options.size;
            if (this.options.name) {
                D.name = this.options.name
            }
            this.el = B.cn("input", D);
            this.wrapEl.appendChild(this.el);
            this.fieldContainer.appendChild(this.wrapEl);
            if (this.options.capsLockWarning) {
                this.capsLockWarning = B.cn("div", {className: "capsLockWarning"}, {display: "none"}, B.messages.capslockWarning);
                this.wrapEl.appendChild(this.capsLockWarning)
            }
            if (this.options.strengthIndicator) {
                this.strengthEl = B.cn("div", {className: "inputEx-Password-StrengthIndicator"}, null, B.messages.passwordStrength);
                this.strengthBlocks = [];
                for (var E = 0; E < 4; E++) {
                    this.strengthBlocks[E] = B.cn("div", {className: "inputEx-Password-StrengthIndicatorBlock"});
                    this.strengthEl.appendChild(this.strengthBlocks[E])
                }
                this.wrapEl.appendChild(this.strengthEl)
            }
        }, setConfirmationField: function(D) {
            this.options.confirmPasswordField = D;
            this.options.messages.invalid = B.messages.invalidPasswordConfirmation;
            this.options.confirmPasswordField.options.confirmationPasswordField = this
        }, validate: function() {
            if (this.options.confirmPasswordField) {
                if (this.options.confirmPasswordField.getValue() != this.getValue()) {
                    return false
                }
            }
            return B.PasswordField.superclass.validate.call(this)
        }, getStateString: function(D) {
            if (D == B.stateInvalid && this.options.minLength && this.el.value.length < this.options.minLength) {
                return B.messages.invalidPassword[0] + this.options.minLength + B.messages.invalidPassword[1]
            }
            return B.StringField.superclass.getStateString.call(this, D)
        }, onInput: function(D) {
            B.PasswordField.superclass.onInput.call(this, D);
            if (this.options.confirmationPasswordField) {
                this.options.confirmationPasswordField.setClassFromState()
            }
        }, onKeyPress: function(H) {
            B.PasswordField.superclass.onKeyPress.call(this, H);
            if (this.options.capsLockWarning) {
                var G = H ? H : window.event;
                if (!G) {
                    return
                }
                var E = G.target ? G.target : G.srcElement;
                var I = -1;
                if (G.which) {
                    I = G.which
                } else {
                    if (G.keyCode) {
                        I = G.keyCode
                    }
                }
                var F = false;
                if (G.shiftKey) {
                    F = G.shiftKey
                } else {
                    if (G.modifiers) {
                        F = !!(G.modifiers & 4)
                    }
                }
                var D = ((I >= 65 && I <= 90) && !F) || ((I >= 97 && I <= 122) && F);
                this.setCapsLockWarning(D)
            }
        }, onKeyUp: function(D) {
            B.PasswordField.superclass.onKeyUp.call(this, D);
            if (this.options.strengthIndicator) {
                C.later(0, this, this.updateStrengthIndicator)
            }
        }, setCapsLockWarning: function(D) {
            this.capsLockWarning.style.display = D ? "" : "none"
        }, updateStrengthIndicator: function() {
            var F = B.PasswordField.getPasswordStrength(this.getValue());
            for (var E = 0; E < 4; E++) {
                var D = (F >= E * 25) && (F > 0);
                YAHOO.util.Dom.setStyle(this.strengthBlocks[E], "background-color", D ? "#4AE817" : "#FFFFFF")
            }
        }});
    B.PasswordField.getPasswordStrength = function(K) {
        var G = (K.length);
        if (G > 7) {
            G = 7
        }
        var I = K.replace(/[0-9]/g, "");
        var J = (K.length - I.length);
        if (J > 3) {
            J = 3
        }
        var D = K.replace(/\W/g, "");
        var F = (K.length - D.length);
        if (F > 3) {
            F = 3
        }
        var E = K.replace(/[A-Z]/g, "");
        var L = (K.length - E.length);
        if (L > 3) {
            L = 3
        }
        var H = ((G * 10) - 20) + (J * 10) + (F * 20) + (L * 10);
        if (H < 0) {
            H = 0
        }
        if (H > 100) {
            H = 100
        }
        return H
    };
    B.messages.invalidPassword = ["The password schould contain at least ", " numbers or characters"];
    B.messages.invalidPasswordConfirmation = "Passwords are different !";
    B.messages.capslockWarning = "Warning: CapsLock is on";
    B.messages.passwordStrength = "Password Strength";
    B.registerType("password", B.PasswordField)
})();
(function() {
    var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;
    C.RadioField = function(E) {
        C.RadioField.superclass.constructor.call(this, E)
    };
    D.extend(C.RadioField, C.Field, {setOptions: function(E) {
            C.RadioField.superclass.setOptions.call(this, E);
            this.options.className = E.className ? E.className : "inputEx-Field inputEx-RadioField";
            if (D.isUndefined(E.allowAny) || E.allowAny === false) {
                this.options.allowAny = false
            } else {
                this.options.allowAny = {};
                if (D.isArray(E.allowAny.separators)) {
                    this.options.allowAny.separators = E.allowAny.separators
                }
                this.options.allowAny.validator = (D.isFunction(E.allowAny.validator)) ? E.allowAny.validator : function(F) {
                    return true
                };
                this.options.allowAny.value = (!D.isUndefined(E.allowAny.value)) ? E.allowAny.value : ""
            }
            this.options.choices = E.choices;
            this.options.values = D.isArray(E.values) ? E.values : E.choices
        }, renderComponent: function() {
            this.optionEls = [];
            for (var I = 0; I < this.options.choices.length; I++) {
                var J = C.cn("div", {className: "inputEx-RadioField-choice"});
                var H = this.divEl.id ? this.divEl.id + "-field-opt" + I : YAHOO.util.Dom.generateId();
                var G = C.cn("input", {id: H, type: "radio", name: this.options.name, value: this.options.values[I]});
                J.appendChild(G);
                var F = C.cn("label", {"for": H, className: "inputEx-RadioField-rightLabel"}, null, "" + this.options.choices[I]);
                J.appendChild(F);
                this.fieldContainer.appendChild(J);
                this.optionEls.push(G)
            }
            if (this.options.allowAny) {
                var J = C.cn("div", {className: "inputEx-RadioField-choice"});
                if (YAHOO.env.ua.ie) {
                    this.radioAny = document.createElement("<input type='radio' name='" + this.options.name + "'>")
                } else {
                    this.radioAny = C.cn("input", {type: "radio", name: this.options.name})
                }
                J.appendChild(this.radioAny);
                this.anyField = new C.StringField({value: this.options.allowAny.value});
                B.setStyle(this.radioAny, "float", "left");
                B.setStyle(this.anyField.getEl(), "float", "left");
                this.anyField.disable();
                if (this.options.allowAny.separators) {
                    var E = C.cn("div", null, {margin: "3px"}, this.options.allowAny.separators[0] || "");
                    B.setStyle(E, "float", "left");
                    J.appendChild(E)
                }
                J.appendChild(this.anyField.getEl());
                if (this.options.allowAny.separators) {
                    var E = C.cn("div", null, {margin: "3px"}, this.options.allowAny.separators[1] || "");
                    B.setStyle(E, "float", "left");
                    J.appendChild(E)
                }
                this.fieldContainer.appendChild(J);
                this.optionEls.push(this.radioAny)
            }
        }, initEvents: function() {
            A.addListener(this.optionEls, "change", this.onChange, this, true);
            A.addFocusListener(this.optionEls, this.onFocus, this, true);
            A.addBlurListener(this.optionEls, this.onBlur, this, true);
            if (YAHOO.env.ua.ie) {
                A.addListener(this.optionEls, "click", function() {
                    YAHOO.lang.later(10, this, this.fireUpdatedEvt)
                }, this, true)
            }
            if (this.anyField) {
                this.anyField.updatedEvt.subscribe(function(E) {
                    C.RadioField.superclass.onChange.call(this, E)
                }, this, true);
                A.addBlurListener(this.anyField.el, this.onBlur, this, true)
            }
        }, onChange: function(E) {
            if (this.radioAny) {
                if (this.radioAny == A.getTarget(E)) {
                    this.anyField.enable();
                    D.later(50, this.anyField, "focus")
                } else {
                    this.anyField.disable()
                }
            }
            if (!YAHOO.env.ua.ie) {
                C.RadioField.superclass.onChange.call(this, E)
            }
        }, getValue: function() {
            for (var E = 0; E < this.optionEls.length; E++) {
                if (this.optionEls[E].checked) {
                    if (this.radioAny && this.radioAny == this.optionEls[E]) {
                        var F = this.anyField.getValue();
                        return F
                    }
                    return this.options.values[E]
                }
            }
            return""
        }, setValue: function(I, E) {
            var G = true, H;
            for (var F = 0; F < this.optionEls.length; F++) {
                if (I == this.options.values[F]) {
                    this.optionEls[F].checked = true;
                    G = false
                } else {
                    this.optionEls[F].checked = false
                }
                if (this.radioAny && this.radioAny == this.optionEls[F]) {
                    H = this.optionEls[F]
                }
            }
            if (this.radioAny && G) {
                H.checked = true;
                this.anyField.enable();
                this.anyField.setValue(I, false)
            }
            C.StringField.superclass.setValue.call(this, I, E)
        }, validate: function() {
            if (this.options.allowAny) {
                for (var E = 0; E < this.optionEls.length; E++) {
                    if (this.optionEls[E].checked) {
                        if (this.radioAny && this.radioAny == this.optionEls[E]) {
                            var F = this.anyField.getValue();
                            return this.options.allowAny.validator(F)
                        }
                    }
                }
            }
            return true
        }});
    C.registerType("radio", C.RadioField)
})();
(function() {
    var A = YAHOO.inputEx, B = YAHOO.lang;
    A.RTEField = function(C) {
        A.RTEField.superclass.constructor.call(this, C)
    };
    B.extend(A.RTEField, A.Field, {setOptions: function(C) {
            A.RTEField.superclass.setOptions.call(this, C);
            this.options.opts = C.opts || {};
            this.options.type = C.type
        }, renderComponent: function() {
            if (!A.RTEfieldsNumber) {
                A.RTEfieldsNumber = 0
            }
            var H = "inputEx-RTEField-" + A.RTEfieldsNumber;
            var D = {id: H};
            if (this.options.name) {
                D.name = this.options.name
            }
            this.el = A.cn("textarea", D);
            A.RTEfieldsNumber += 1;
            this.fieldContainer.appendChild(this.el);
            var F = {height: "300px", width: "580px", dompath: true};
            var G = this.options.opts;
            for (var E in G) {
                if (B.hasOwnProperty(G, E)) {
                    F[E] = G[E]
                }
            }
            var C = ((this.options.type && (this.options.type == "simple")) ? YAHOO.widget.SimpleEditor : YAHOO.widget.Editor);
            if (C) {
                this.editor = new C(H, F);
                this.editor.render()
            } else {
                alert("Editor is not on the page")
            }
        }, setValue: function(D, C) {
            if (this.editor) {
                var E = this.el.id + "_editor";
                if (!YAHOO.util.Dom.get(E)) {
                    this.el.value = D
                } else {
                    this.editor.setEditorHTML(D)
                }
            }
            if (C !== false) {
                this.fireUpdatedEvt()
            }
        }, getValue: function() {
            try {
                this.editor.saveHTML();
                return this.el.value
            } catch (C) {
            }
        }});
    A.registerType("html", A.RTEField)
})();
(function() {
    var B = YAHOO.inputEx, A = YAHOO.util.Event, C = YAHOO.lang;
    B.SelectField = function(D) {
        B.SelectField.superclass.constructor.call(this, D)
    };
    C.extend(B.SelectField, B.Field, {setOptions: function(D) {
            B.SelectField.superclass.setOptions.call(this, D);
            this.options.multiple = C.isUndefined(D.multiple) ? false : D.multiple;
            this.options.selectValues = [];
            this.options.selectOptions = [];
            for (var E = 0, F = D.selectValues.length; E < F; E++) {
                this.options.selectValues.push(D.selectValues[E]);
                this.options.selectOptions.push("" + ((D.selectOptions && !C.isUndefined(D.selectOptions[E])) ? D.selectOptions[E] : D.selectValues[E]))
            }
        }, renderComponent: function() {
            this.el = B.cn("select", {id: this.divEl.id ? this.divEl.id + "-field" : YAHOO.util.Dom.generateId(), name: this.options.name || ""});
            if (this.options.multiple) {
                this.el.multiple = true;
                this.el.size = this.options.selectValues.length
            }
            this.optionEls = {};
            var D;
            for (var E = 0; E < this.options.selectValues.length; E++) {
                D = B.cn("option", {value: this.options.selectValues[E]}, null, this.options.selectOptions[E]);
                this.optionEls[this.options.selectOptions[E]] = D;
                this.el.appendChild(D)
            }
            this.fieldContainer.appendChild(this.el)
        }, initEvents: function() {
            A.addListener(this.el, "change", this.onChange, this, true);
            A.addFocusListener(this.el, this.onFocus, this, true);
            A.addBlurListener(this.el, this.onBlur, this, true)
        }, setValue: function(H, E) {
            var D = 0;
            var G;
            for (var F = 0; F < this.options.selectValues.length; F++) {
                if (H === this.options.selectValues[F]) {
                    G = this.el.childNodes[F];
                    G.selected = "selected"
                }
            }
            B.SelectField.superclass.setValue.call(this, H, E)
        }, getValue: function() {
            return this.options.selectValues[this.el.selectedIndex]
        }, disable: function() {
            this.el.disabled = true
        }, enable: function() {
            this.el.disabled = false
        }, addOption: function(E) {
            var J = E.value;
            var G = "" + (!C.isUndefined(E.option) ? E.option : E.value);
            var K = this.options.selectOptions.length;
            var D = K;
            if (C.isNumber(E.position) && E.position >= 0 && E.position <= D) {
                D = parseInt(E.position, 10)
            } else {
                if (C.isString(E.before)) {
                    for (var F = 0; F < K; F++) {
                        if (this.options.selectOptions[F] === E.before) {
                            D = F;
                            break
                        }
                    }
                } else {
                    if (C.isString(E.after)) {
                        for (var F = 0; F < K; F++) {
                            if (this.options.selectOptions[F] === E.after) {
                                D = F + 1;
                                break
                            }
                        }
                    }
                }
            }
            this.options.selectValues = this.options.selectValues.slice(0, D).concat([J]).concat(this.options.selectValues.slice(D, K));
            this.options.selectOptions = this.options.selectOptions.slice(0, D).concat([G]).concat(this.options.selectOptions.slice(D, K));
            var I = B.cn("option", {value: J}, null, G);
            this.optionEls[G] = I;
            if (D < K) {
                YAHOO.util.Dom.insertBefore(I, this.el.childNodes[D])
            } else {
                this.el.appendChild(I)
            }
            if (!!E.selected) {
                var H = this;
                setTimeout(function() {
                    H.setValue(J)
                }, 0)
            }
        }, removeOption: function(G) {
            var F;
            var I = this.options.selectOptions.length;
            var E = this.el.selectedIndex;
            if (C.isNumber(G.position) && G.position >= 0 && G.position <= I) {
                F = parseInt(G.position, 10)
            } else {
                if (C.isString(G.option)) {
                    for (var H = 0; H < I; H++) {
                        if (this.options.selectOptions[H] === G.option) {
                            F = H;
                            break
                        }
                    }
                } else {
                    if (C.isString(G.value)) {
                        for (var H = 0; H < I; H++) {
                            if (this.options.selectValues[H] === G.value) {
                                F = H;
                                break
                            }
                        }
                    }
                }
            }
            if (!C.isNumber(F)) {
                throw new Error("SelectField : invalid or missing position, option or value in removeOption")
            }
            this.options.selectValues.splice(F, 1);
            var D = this.options.selectOptions.splice(F, 1);
            this.el.removeChild(this.optionEls[D]);
            delete this.optionEls[D];
            if (E == F) {
                this.clear()
            }
        }});
    B.registerType("select", B.SelectField)
})();
(function() {
    var B = YAHOO.inputEx, A = YAHOO.util.Event;
    B.Textarea = function(C) {
        B.Textarea.superclass.constructor.call(this, C)
    };
    YAHOO.lang.extend(B.Textarea, B.StringField, {setOptions: function(C) {
            B.Textarea.superclass.setOptions.call(this, C);
            this.options.rows = C.rows || 6;
            this.options.cols = C.cols || 23
        }, renderComponent: function() {
            this.wrapEl = B.cn("div", {className: "inputEx-StringField-wrapper"});
            var C = {};
            C.id = this.divEl.id ? this.divEl.id + "-field" : YAHOO.util.Dom.generateId();
            C.rows = this.options.rows;
            C.cols = this.options.cols;
            if (this.options.name) {
                C.name = this.options.name
            }
            this.el = B.cn("textarea", C, null, this.options.value);
            this.wrapEl.appendChild(this.el);
            this.fieldContainer.appendChild(this.wrapEl)
        }, validate: function() {
            var C = B.Textarea.superclass.validate.call(this);
            if (this.options.maxLength) {
                C = C && this.getValue().length <= this.options.maxLength
            }
            return C
        }, getStateString: function(C) {
            if (C == B.stateInvalid && this.options.minLength && this.el.value.length < this.options.minLength) {
                return B.messages.stringTooShort[0] + this.options.minLength + B.messages.stringTooShort[1]
            } else {
                if (C == B.stateInvalid && this.options.maxLength && this.el.value.length > this.options.maxLength) {
                    return B.messages.stringTooLong[0] + this.options.maxLength + B.messages.stringTooLong[1]
                }
            }
            return B.Textarea.superclass.getStateString.call(this, C)
        }});
    B.messages.stringTooLong = ["This field should contain at most ", " numbers or characters"];
    B.registerType("text", B.Textarea)
})();
(function() {
    var B = YAHOO.inputEx, A = YAHOO.util.Event, C = YAHOO.lang;
    B.TimeField = function(E) {
        var I = [];
        for (var G = 0; G < 24; G++) {
            var H = "";
            if (G < 10) {
                H = "0"
            }
            H += G;
            I.push(H)
        }
        var D = [];
        var F = [];
        for (var G = 0; G < 60; G++) {
            var H = "";
            if (G < 10) {
                H = "0"
            }
            H += G;
            D.push(H);
            F.push(H)
        }
        E.fields = [{type: "select", inputParams: {selectOptions: I, selectValues: I}}, {type: "select", inputParams: {selectOptions: D, selectValues: D}}, {type: "select", inputParams: {selectOptions: F, selectValues: F}}];
        E.separators = E.separators || [false, ":", ":", false];
        B.TimeField.superclass.constructor.call(this, E)
    };
    C.extend(B.TimeField, B.CombineField, {getValue: function() {
            var D = B.TimeField.superclass.getValue.call(this);
            return D.join(":")
        }, setValue: function(E, D) {
            B.TimeField.superclass.setValue.call(this, E.split(":"), D)
        }});
    B.registerType("time", B.TimeField)
})();
(function() {
    var B = YAHOO.inputEx, A = YAHOO.util.Event, C = YAHOO.lang;
    B.DateTimeField = function(D) {
        D.fields = [{type: "datepicker", inputParams: {}}, {type: "time", inputParams: {}}];
        if (D.dateFormat) {
            D.fields[0].inputParams.dateFormat = D.dateFormat
        }
        D.separators = D.separators || [false, "&nbsp;&nbsp;", false];
        B.DateTimeField.superclass.constructor.call(this, D)
    };
    C.extend(B.DateTimeField, B.CombineField, {getValue: function() {
            var E = this.inputs[0].getValue();
            if (E == "") {
                return null
            }
            var D = this.inputs[1].getValue().split(":");
            E.setHours(D[0]);
            E.setMinutes(D[1]);
            E.setSeconds(D[2]);
            return E
        }, setValue: function(I, E) {
            if (!C.isObject(I)) {
                return
            }
            var G = I.getHours();
            var D = I.getMinutes();
            var F = I.getSeconds();
            var H = ([(G < 10 ? "0" : "") + G, (D < 10 ? "0" : "") + D, (F < 10 ? "0" : "") + F]).join(":");
            B.DateTimeField.superclass.setValue.call(this, [I, H], E)
        }});
    B.registerType("datetime", B.DateTimeField)
})();
(function() {
    var A = YAHOO.inputEx;
    A.UneditableField = function(B) {
        A.UneditableField.superclass.constructor.call(this, B)
    };
    YAHOO.lang.extend(A.UneditableField, A.Field, {setOptions: function(B) {
            A.UneditableField.superclass.setOptions.call(this, B);
            this.options.visu = B.visu
        }, setValue: function(C, B) {
            this.value = C;
            A.renderVisu(this.options.visu, C, this.fieldContainer);
            A.UneditableField.superclass.setValue.call(this, C, B)
        }, getValue: function() {
            return this.value
        }});
    A.registerType("uneditable", A.UneditableField)
})();
(function() {
    var A = YAHOO.inputEx, B = YAHOO.lang;
    A.UrlField = function(C) {
        A.UrlField.superclass.constructor.call(this, C)
    };
    B.extend(A.UrlField, A.StringField, {setOptions: function(C) {
            A.UrlField.superclass.setOptions.call(this, C);
            this.options.className = C.className ? C.className : "inputEx-Field inputEx-UrlField";
            this.options.messages.invalid = A.messages.invalidUrl;
            this.options.favicon = B.isUndefined(C.favicon) ? (("https:" == document.location.protocol) ? false : true) : C.favicon;
            this.options.size = C.size || 50;
            this.options.regexp = A.regexps.url
        }, render: function() {
            A.UrlField.superclass.render.call(this);
            this.el.size = this.options.size;
            if (!this.options.favicon) {
                YAHOO.util.Dom.addClass(this.el, "nofavicon")
            }
            if (this.options.favicon) {
                this.favicon = A.cn("img", {src: A.spacerUrl});
                this.fieldContainer.insertBefore(this.favicon, this.fieldContainer.childNodes[0]);
                YAHOO.util.Event.addListener(this.favicon, "click", function() {
                    this.focus()
                }, this, true)
            }
        }, setClassFromState: function() {
            A.UrlField.superclass.setClassFromState.call(this);
            if (this.options.favicon) {
                this.updateFavicon((this.previousState == A.stateValid) ? this.getValue() : null)
            }
        }, updateFavicon: function(D) {
            var C = D ? D.match(/https?:\/\/[^\/]*/) + "/favicon.ico" : A.spacerUrl;
            if (C != this.favicon.src) {
                A.sn(this.favicon, null, {visibility: "hidden"});
                this.favicon.src = C;
                if (this.timer) {
                    clearTimeout(this.timer)
                }
                var E = this;
                this.timer = setTimeout(function() {
                    E.displayFavicon()
                }, 1000)
            }
        }, displayFavicon: function() {
            A.sn(this.favicon, null, {visibility: (this.favicon.naturalWidth != 0) ? "visible" : "hidden"})
        }});
    A.messages.invalidUrl = "Invalid URL, ex: http://www.test.com";
    A.registerType("url", A.UrlField)
})();
(function() {
    var D = YAHOO.inputEx, B = YAHOO.util.DragDropMgr, C = YAHOO.util.Dom, A = YAHOO.util.Event;
    D.widget.DDListItem = function(E) {
        D.widget.DDListItem.superclass.constructor.call(this, E);
        this.setXConstraint(0, 0);
        this.goingUp = false;
        this.lastY = 0
    };
    YAHOO.extend(D.widget.DDListItem, YAHOO.util.DDProxy, {startDrag: function(F, H) {
            var E = this.getDragEl();
            var G = this.getEl();
            C.setStyle(G, "visibility", "hidden");
            this._originalIndex = D.indexOf(G, G.parentNode.childNodes);
            E.className = G.className;
            E.innerHTML = G.innerHTML
        }, endDrag: function(F) {
            C.setStyle(this.id, "visibility", "");
            var G = this.getEl();
            var E = D.indexOf(G, G.parentNode.childNodes);
            if (this._originalIndex != E) {
                this._list.listReorderedEvt.fire()
            }
        }, onDragDrop: function(I, J) {
            if (B.interactionInfo.drop.length === 1) {
                var H = B.interactionInfo.point;
                var G = B.interactionInfo.sourceRegion;
                if (!G.intersect(H)) {
                    var E = C.get(J);
                    if (E.nodeName.toLowerCase() != "li") {
                        var F = B.getDDById(J);
                        E.appendChild(this.getEl());
                        F.isEmpty = false;
                        B.refreshCache()
                    }
                }
            }
        }, onDrag: function(E) {
            var F = A.getPageY(E);
            if (F < this.lastY) {
                this.goingUp = true
            } else {
                if (F > this.lastY) {
                    this.goingUp = false
                }
            }
            this.lastY = F
        }, onDragOver: function(I, J) {
            var G = this.getEl();
            var F = C.get(J);
            if (F.nodeName.toLowerCase() == "li") {
                var E = G.parentNode;
                var H = F.parentNode;
                if (this.goingUp) {
                    H.insertBefore(G, F)
                } else {
                    H.insertBefore(G, F.nextSibling)
                }
                B.refreshCache()
            }
        }});
    D.widget.DDList = function(E) {
        this.ul = D.cn("ul");
        if (E.id) {
            this.ul.id = E.id
        }
        if (E.value) {
            this.setValue(E.value)
        }
        this.itemRemovedEvt = new YAHOO.util.CustomEvent("itemRemoved", this);
        this.listReorderedEvt = new YAHOO.util.CustomEvent("listReordered", this);
        if (E.parentEl) {
            if (YAHOO.lang.isString(E.parentEl)) {
                C.get(E.parentEl).appendChild(this.ul)
            } else {
                E.parentEl.appendChild(this.ul)
            }
        }
    };
    D.widget.DDList.prototype = {addItem: function(G) {
            var E = D.cn("li", {className: "inputEx-DDList-item"});
            E.appendChild(D.cn("span", null, null, G));
            var H = D.cn("a", null, null, "remove");
            E.appendChild(H);
            A.addListener(H, "click", function(K) {
                var J = A.getTarget(K);
                var I = J.parentNode;
                this.removeItem(D.indexOf(I, this.ul.childNodes))
            }, this, true);
            var F = new D.widget.DDListItem(E);
            F._list = this;
            this.ul.appendChild(E)
        }, _removeItem: function(E) {
            var F = this.ul.childNodes[E].childNodes[0].innerHTML;
            this.ul.removeChild(this.ul.childNodes[E]);
            return F
        }, removeItem: function(E) {
            var F = this._removeItem(E);
            this.itemRemovedEvt.fire(F)
        }, getValue: function() {
            var F = [];
            for (var E = 0; E < this.ul.childNodes.length; E++) {
                F.push(this.ul.childNodes[E].childNodes[0].innerHTML)
            }
            return F
        }, updateItem: function(E, F) {
            this.ul.childNodes[E].childNodes[0].innerHTML = F
        }, setValue: function(H) {
            if (!YAHOO.lang.isArray(H)) {
                H = []
            }
            var I = this.ul.childNodes.length;
            var G = H.length;
            for (var F = 0; F < G; F++) {
                if (F < I) {
                    this.updateItem(F, H[F])
                } else {
                    this.addItem(H[F])
                }
            }
            for (var E = G; E < I; E++) {
                this._removeItem(G)
            }
        }}
})();
(function() {
    var A = YAHOO.inputEx;
    A.MultiSelectField = function(B) {
        A.MultiSelectField.superclass.constructor.call(this, B)
    };
    YAHOO.lang.extend(A.MultiSelectField, A.SelectField, {renderComponent: function() {
            A.MultiSelectField.superclass.renderComponent.call(this);
            this.ddlist = new A.widget.DDList({parentEl: this.fieldContainer})
        }, initEvents: function() {
            YAHOO.util.Event.addListener(this.el, "change", this.onAddNewItem, this, true);
            this.ddlist.itemRemovedEvt.subscribe(this.onItemRemoved, this, true);
            this.ddlist.listReorderedEvt.subscribe(this.fireUpdatedEvt, this, true)
        }, onItemRemoved: function(C, E) {
            var D = E[0];
            var B = A.indexOf(D, this.options.selectValues);
            this.el.childNodes[B].disabled = false;
            this.fireUpdatedEvt()
        }, onAddNewItem: function() {
            if (this.el.selectedIndex != 0) {
                this.ddlist.addItem(this.options.selectValues[this.el.selectedIndex]);
                this.el.childNodes[this.el.selectedIndex].disabled = true;
                this.el.selectedIndex = 0;
                this.fireUpdatedEvt()
            }
        }, setValue: function(E, C) {
            this.ddlist.setValue(E);
            for (var D = 0; D < this.el.childNodes.length; D++) {
                this.el.childNodes[D].disabled = false
            }
            for (D = 0; D < E.length; D++) {
                var B = A.indexOf(E[D], this.options.selectValues);
                this.el.childNodes[B].disabled = true
            }
            if (C !== false) {
                this.fireUpdatedEvt()
            }
        }, getValue: function() {
            return this.ddlist.getValue()
        }});
    A.registerType("multiselect", A.MultiSelectField)
})();
(function() {
    var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;
    C.AutoComplete = function(E) {
        C.AutoComplete.superclass.constructor.call(this, E)
    };
    D.extend(C.AutoComplete, C.StringField, {setOptions: function(E) {
            C.AutoComplete.superclass.setOptions.call(this, E);
            this.options.className = E.className ? E.className : "inputEx-Field inputEx-AutoComplete";
            this.options.datasource = E.datasource;
            this.options.autoComp = E.autoComp;
            this.options.returnValue = E.returnValue
        }, initEvents: function() {
            C.AutoComplete.superclass.initEvents.call(this);
            A.removeBlurListener(this.el, this.onBlur)
        }, renderComponent: function() {
            this.wrapEl = C.cn("div", {className: "inputEx-StringField-wrapper"});
            var E = {type: "text", id: YAHOO.util.Dom.generateId()};
            if (this.options.size) {
                E.size = this.options.size
            }
            if (this.options.readonly) {
                E.readonly = "readonly"
            }
            if (this.options.maxLength) {
                E.maxLength = this.options.maxLength
            }
            this.el = C.cn("input", E);
            var F = {type: "hidden", value: ""};
            if (this.options.name) {
                F.name = this.options.name
            }
            this.hiddenEl = C.cn("input", F);
            this.wrapEl.appendChild(this.el);
            this.wrapEl.appendChild(this.hiddenEl);
            this.fieldContainer.appendChild(this.wrapEl);
            this.listEl = C.cn("div", {id: B.generateId()});
            this.fieldContainer.appendChild(this.listEl);
            A.onAvailable([this.el, this.listEl], this.buildAutocomplete, this, true)
        }, buildAutocomplete: function() {
            if (!this._nElementsReady) {
                this._nElementsReady = 0
            }
            this._nElementsReady++;
            if (this._nElementsReady != 2) {
                return
            }
            this.oAutoComp = new YAHOO.widget.AutoComplete(this.el.id, this.listEl.id, this.options.datasource, this.options.autoComp);
            this.oAutoComp.itemSelectEvent.subscribe(this.itemSelectHandler, this, true);
            this.oAutoComp.textboxBlurEvent.subscribe(this.onBlur, this, true)
        }, itemSelectHandler: function(G, F) {
            var E = F[2];
            this.setValue(this.options.returnValue ? this.options.returnValue(E) : E[0])
        }, onChange: function(E) {
            this.setClassFromState();
            YAHOO.lang.later(50, this, function() {
                if (this.el.value == "") {
                    this.setValue("")
                }
            });
            this.fireUpdatedEvt()
        }, setValue: function(F, E) {
            this.hiddenEl.value = F;
            this.setClassFromState();
            if (E !== false) {
                this.fireUpdatedEvt()
            }
        }, getValue: function() {
            return this.hiddenEl.value
        }});
    C.registerType("autocomplete", C.AutoComplete)
})();
(function() {
    var A = YAHOO.inputEx;
    A.MultiAutoComplete = function(B) {
        A.MultiAutoComplete.superclass.constructor.call(this, B)
    };
    YAHOO.lang.extend(A.MultiAutoComplete, A.AutoComplete, {renderComponent: function() {
            A.MultiAutoComplete.superclass.renderComponent.call(this);
            this.ddlist = new A.widget.DDList({parentEl: this.fieldContainer});
            this.ddlist.itemRemovedEvt.subscribe(function() {
                this.setClassFromState();
                this.fireUpdatedEvt()
            }, this, true);
            this.ddlist.listReorderedEvt.subscribe(this.fireUpdatedEvt, this, true)
        }, itemSelectHandler: function(D, C) {
            var B = C[2];
            this.ddlist.addItem(this.options.returnValue ? this.options.returnValue(B) : B[0]);
            this.el.value = "";
            this.fireUpdatedEvt()
        }, setValue: function(C, B) {
            this.ddlist.setValue(C);
            this.setClassFromState();
            if (B !== false) {
                this.fireUpdatedEvt()
            }
        }, getValue: function() {
            return this.ddlist.getValue()
        }, getState: function() {
            var B = this.getValue();
            if (B.length === 0) {
                return this.options.required ? A.stateRequired : A.stateEmpty
            }
            return this.validate() ? A.stateValid : A.stateInvalid
        }, validate: function() {
            return true
        }, onChange: function(B) {
        }});
    A.registerType("multiautocomplete", A.MultiAutoComplete)
})();
(function() {
    var A = YAHOO.inputEx;
    A.UneditableField = function(B) {
        A.UneditableField.superclass.constructor.call(this, B)
    };
    YAHOO.lang.extend(A.UneditableField, A.Field, {setOptions: function(B) {
            A.UneditableField.superclass.setOptions.call(this, B);
            this.options.visu = B.visu
        }, setValue: function(C, B) {
            this.value = C;
            A.renderVisu(this.options.visu, C, this.fieldContainer);
            A.UneditableField.superclass.setValue.call(this, C, B)
        }, getValue: function() {
            return this.value
        }});
    A.registerType("uneditable", A.UneditableField)
})();
(function() {
    var A = YAHOO.inputEx, B = YAHOO.lang;
    A.SliderField = function(C) {
        A.SliderField.superclass.constructor.call(this, C)
    };
    YAHOO.lang.extend(A.SliderField, A.Field, {setOptions: function(C) {
            A.SliderField.superclass.setOptions.call(this, C);
            this.options.className = C.className ? C.className : "inputEx-SliderField";
            this.options.minValue = B.isUndefined(C.minValue) ? 0 : C.minValue;
            this.options.maxValue = B.isUndefined(C.maxValue) ? 100 : C.maxValue;
            this.options.displayValue = B.isUndefined(C.displayValue) ? true : C.displayValue
        }, renderComponent: function() {
            this.sliderbg = A.cn("div", {id: YAHOO.util.Dom.generateId(), className: "inputEx-SliderField-bg"});
            this.sliderthumb = A.cn("div", {className: "inputEx-SliderField-thumb"});
            this.sliderbg.appendChild(this.sliderthumb);
            this.fieldContainer.appendChild(this.sliderbg);
            if (this.options.displayValue) {
                this.valueDisplay = A.cn("div", {className: "inputEx-SliderField-value"}, null, String(this.options.minValue));
                this.fieldContainer.appendChild(this.valueDisplay)
            }
            this.fieldContainer.appendChild(A.cn("div", null, {clear: "both"}));
            this.slider = YAHOO.widget.Slider.getHorizSlider(this.sliderbg, this.sliderthumb, 0, 100)
        }, initEvents: function() {
            this.slider.on("slideEnd", this.fireUpdatedEvt, this, true);
            if (this.options.displayValue) {
                this.updatedEvt.subscribe(function(C, E) {
                    var D = E[0];
                    this.valueDisplay.innerHTML = D
                }, this, true)
            }
        }, setValue: function(F, D) {
            var C = F;
            if (C < this.options.minValue) {
                C = this.options.minValue
            }
            if (C > this.options.maxValue) {
                C = this.options.maxValue
            }
            var E = Math.floor(C - this.options.minValue) * 100 / this.options.maxValue;
            this.slider.setValue(E);
            A.SliderField.superclass.setValue.call(this, F, D)
        }, getValue: function() {
            var C = Math.floor(this.options.minValue + (this.options.maxValue - this.options.minValue) * this.slider.getValue() / 100);
            return C
        }});
    A.registerType("slider", A.SliderField)
})();