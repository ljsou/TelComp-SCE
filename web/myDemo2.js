/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var controlStructures = {
    // Set a unique name for the language
    languageName: "",
    modules: [
        {
            "name": "User_Data",
            "container": {
                "xtype": "WireIt.FormContainer",
                "title": "Post",
                "icon": "res/icons/user_data.png",
                "idcomp": "user-data",
                "collapsible": true,
                "collapsed": true,
                "fields": [
                    {"type": "list",
                        "inputParams": {
                            "elementType": {
                                "type": "string",
                                "inputParams": {
                                    "size": 15,
                                    "label": "Input",
                                    "name": "empty",
                                    "typeInvite": "Enter the user data",
                                    "required": true,
                                    "wirable": true
                                }
                            }
//                            "useButtons": true
                        }
                    }
                ],
                "width": "225"
            }
        },
        {
            "name": "Data_Module",
            "container": {
                "xtype": "WireIt.FormContainer",
                "title": "Post",
                "icon": "res/icons/data4.png",
                "idcomp": "data-module",
                "collapsible": true,
                "collapsed": true,
                "fields": [
                    {"type": "list",
                        "inputParams": {
                            "elementType": {
                                "type": "string",
                                "inputParams": {
                                    "size": 15,
                                    "label": "Input",
                                    "name": "empty",
                                    "typeInvite": "Enter the input",
                                    "required": true,
                                    "wirable": true
                                }
                            }
//                            "useButtons": true
                        }
                    }
                ],
                "width": "225"
            }
        },
//        {
//            "name": "DataModule",
//            "container": {
//                "xtype": "WireIt.FormContainer",
//                "icon": "res/icons/application_edit.png",
//                "idcom": "data",
//                // inputEx options :
//                "title": "WireIt.FormContainer demo",
//                "collapsible": true,
//                "collapsed": false,
//                "useButtons": "true",
//                "fields": [
//                    {
//                        "type": "string",
//                        "inputParams": {
////                            "label": "Input 1",
//                            "name": "input1",
//                            "typeInvite": "input1",
//                            "value": ""
////                            "description": 'Enter your lastname'
//                        }
//                    },
//                    {
//                        "type": "string",
//                        "inputParams": {
////                            "label": "Input 2",
//                            "name": "input1",
//                            "typeInvite": "input2",
//                            "value": ""
////                            "description": 'Enter your lastname'
//                        }
//                    }
//                ],
//                "terminals": [
//                    {
//                        "name": "_OUTPUT1",
//                        "direction": [1, 0],
//                        "offsetPosition": {
//                            "left": 134,
//                            "top": 25
//                        },
//                        "ddConfig": {
//                            "type": "output",
//                            "allowedTypes": ["input"]
//                        }
//                    },
//                    {
//                        "name": "_OUTPUT2",
//                        "direction": [1, 0],
//                        "offsetPosition": {
//                            "left": 134,
//                            "top": 46
//                        },
//                        "ddConfig": {
//                            "type": "output",
//                            "allowedTypes": ["input"]
//                        }
//                    }
//                ],
//                "favoritecolors": {"type": "array", "_inputex": {label: "Favorites colors", elementType: {"type": "color"}}},
//                "width": "150"
////                "legend": "Tell us about yourself..."
//            }
//        },
        {
            "name": "AND-Join",
            "container": {
                "xtype": "WireIt.ImageContainer",
                "image": "res/control/andJoin.png",
                "icon": "res/icons/arrow_join.png",
                'idcomp': "and-join",
                "terminals": [
                    {
                        "name": "_INPUT1",
                        "direction": [-1, 0],
                        "offsetPosition": {
                            "left": -15,
                            "top": -13
                        },
                        "ddConfig": {
                            "type": "input",
                            "allowedTypes": ["output"]
                        },
                        "nMaxWires": 1
                    },
                    {
                        "name": "_INPUT2",
                        "direction": [-1, 0],
                        "offsetPosition": {
                            "left": -15,
                            "top": 25
                        },
                        "ddConfig": {
                            "type": "input",
                            "allowedTypes": ["output"]
                        }
                    },
                    {
                        "name": "_OUTPUT",
                        "direction": [1, 0],
                        "offsetPosition": {
                            "left": 42,
                            "top": 8
                        },
                        "ddConfig": {
                            "type": "output",
                            "allowedTypes": ["input"]
                        }
                    }
                ]
            }

        },
        {
            "name": "AND-Split",
            "container": {
                "xtype": "WireIt.ImageContainer",
                "image": "res/control/andSplit.png",
                "icon": "res/icons/arrow_join.png",
                'idcomp': "and-split",
                "terminals": [
                    {
                        "name": "_OUTPUT1",
                        "direction": [1, 0],
                        "offsetPosition": {
                            "left": 42,
                            "top": -13
                        },
                        "ddConfig": {
                            "type": "output",
                            "allowedTypes": ["input"]
                        },
                        "nMaxWires": 1
                    },
                    {
                        "name": "_OUTPUT2",
                        "direction": [1, 0],
                        "offsetPosition": {
                            "left": 42,
                            "top": 28
                        },
                        "ddConfig": {
                            "type": "output",
                            "allowedTypes": ["input"]
                        }
                    },
                    {
                        "name": "_INPUT",
                        "direction": [-1, 0],
                        "offsetPosition": {
                            "left": -15,
                            "top": 8
                        },
                        "ddConfig": {
                            "type": "input",
                            "allowedTypes": ["output"]
                        }
                    }
                ]
            }

        },
//        {
//            "name": "OR",
//            "container": {
//                "xtype": "WireIt.ImageContainer",
//                "image": "res/control/gate_or.png",
//                "icon": "res/icons/arrow_join.png",
//                'idcomp': "or",
//                "terminals": [
//                    {
//                        "name": "_INPUT1",
//                        "direction": [-1, 0],
//                        "offsetPosition": {
//                            "left": -3,
//                            "top": 2
//                        },
//                        "ddConfig": {
//                            "type": "input",
//                            "allowedTypes": ["output"]
//                        },
//                        "nMaxWires": 1
//                    },
//                    {
//                        "name": "_INPUT2",
//                        "direction": [-1, 0],
//                        "offsetPosition": {
//                            "left": -3,
//                            "top": 37
//                        },
//                        "ddConfig": {
//                            "type": "input",
//                            "allowedTypes": ["output"]
//                        }
//                    },
//                    {
//                        "name": "_OUTPUT",
//                        "direction": [1, 0],
//                        "offsetPosition": {
//                            "left": 103,
//                            "top": 20
//                        },
//                        "ddConfig": {
//                            "type": "output",
//                            "allowedTypes": ["input"]
//                        }
//                    }
//                ]
//            }
//        },
        {
            "name": "START",
            "container": {
                "xtype": "WireIt.ImageContainer",
                "image": "res/control/start.png",
                "icon": "res/icons/arrow_right.png",
                'idcomp': "start",
                "terminals": [
//                    {
//                        "name": "_INPUT",
//                        "direction": [-1, 0],
//                        "offsetPosition": {
//                            "left": -12,
//                            "top": 23
//                        },
//                        "ddConfig": {
//                            "type": "input",
//                            "allowedTypes": ["output"]
//                        },
//                        "nMaxWires": 1
//                    },
                    {
                        "name": "_OUTPUT",
                        "direction": [1, 0],
                        "offsetPosition": {
                            "left": 7,
                            "top": 25
                        },
                        "ddConfig": {
                            "type": "output",
                            "allowedTypes": ["input"]
                        }
                    }
                ]
            }
        },
        {
            "name": "END",
            "container": {
                "xtype": "WireIt.ImageContainer",
                "image": "res/control/end.png",
                "icon": "res/icons/arrow_right.png",
                'idcomp': "end",
                "terminals": [
                    {
                        "name": "_INPUT",
                        "direction": [-1, 0],
                        "offsetPosition": {
                            "left": 7,
                            "top": -15
                        },
                        "ddConfig": {
                            "type": "input",
                            "allowedTypes": ["output"]
                        },
                        "nMaxWires": 1
                    }
//                    {
//                        "name": "_OUTPUT",
//                        "direction": [1, 0],
//                        "offsetPosition": {
//                            "left": 117,
//                            "top": 23
//                        },
//                        "ddConfig": {
//                            "type": "output",
//                            "allowedTypes": ["input"]
//                        }
//                    }
                ]
            }
        }
//        {
//            "name": "NAND",
//            "container": {
//                "xtype": "WireIt.ImageContainer",
//                "image": "res/control/gate_nand.png",
//                "icon": "res/icons/arrow_join.png",
//                'idcomp': "nand",
//                "terminals": [
//                    {
//                        "name": "_INPUT1",
//                        "direction": [-1, 0],
//                        "offsetPosition": {
//                            "left": -3,
//                            "top": 2
//                        },
//                        "ddConfig": {
//                            "type": "input",
//                            "allowedTypes": ["output"]
//                        },
//                        "nMaxWires": 1
//                    },
//                    {
//                        "name": "_INPUT2",
//                        "direction": [-1, 0],
//                        "offsetPosition": {
//                            "left": -3,
//                            "top": 37
//                        },
//                        "ddConfig": {
//                            "type": "input",
//                            "allowedTypes": ["output"]
//                        },
//                        "nMaxWires": 1
//                    },
//                    {
//                        "name": "_OUTPUT",
//                        "direction": [1, 0],
//                        "offsetPosition": {
//                            "left": 103,
//                            "top": 20
//                        },
//                        "ddConfig": {
//                            "type": "output",
//                            "allowedTypes": ["input"]
//                        }
//                    }
//                ]
//            }
//        },
//        {
//            "name": "XOR",
//            "container": {
//                "xtype": "WireIt.ImageContainer",
//                "image": "res/control/gate_xor.png",
//                "icon": "res/icons/arrow_join.png",
//                'idcomp': "xor",
//                "terminals": [
//                    {
//                        "name": "_INPUT1",
//                        "direction": [-1, 0],
//                        "offsetPosition": {
//                            "left": -3,
//                            "top": 2
//                        },
//                        "ddConfig": {
//                            "type": "input",
//                            "allowedTypes": ["output"]
//                        },
//                        "nMaxWires": 1
//                    },
//                    {
//                        "name": "_INPUT2",
//                        "direction": [-1, 0],
//                        "offsetPosition": {
//                            "left": -3,
//                            "top": 37
//                        },
//                        "ddConfig": {
//                            "type": "input",
//                            "allowedTypes": ["output"]
//                        },
//                        "nMaxWires": 1
//                    },
//                    {
//                        "name": "_OUTPUT",
//                        "direction": [1, 0],
//                        "offsetPosition": {
//                            "left": 103,
//                            "top": 20
//                        },
//                        "ddConfig": {
//                            "type": "output",
//                            "allowedTypes": ["input"]
//                        }
//                    }
//                ]
//            }
//        }
    ]

};