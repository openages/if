export default {
      "Module.Item": {
            "type": "object",
            "properties": {
                  "module": {
                        "type": "string",
                        "enum": [
                              "todo",
                              "memo",
                              "note",
                              "kanban",
                              "workflow",
                              "whiteboard",
                              "ppt",
                              "schedule",
                              "pomodoro",
                              "flag",
                              "api",
                              "dataflow",
                              "table",
                              "form",
                              "chart",
                              "setting"
                        ],
                        "maxLength": 30
                  },
                  "dirtree": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "type": {
                                          "type": "string",
                                          "enum": [
                                                "dir",
                                                "file"
                                          ]
                                    },
                                    "children": {
                                          "type": "array",
                                          "items": {
                                                "type": "object",
                                                "properties": {
                                                      "type": {
                                                            "type": "string",
                                                            "const": "file"
                                                      },
                                                      "id": {
                                                            "type": "string"
                                                      },
                                                      "name": {
                                                            "type": "string"
                                                      },
                                                      "icon": {
                                                            "type": "string"
                                                      },
                                                      "icon_hue": {
                                                            "type": "number"
                                                      }
                                                },
                                                "required": [
                                                      "id",
                                                      "name",
                                                      "type"
                                                ]
                                          }
                                    },
                                    "id": {
                                          "type": "string"
                                    },
                                    "name": {
                                          "type": "string"
                                    },
                                    "icon": {
                                          "type": "string"
                                    },
                                    "icon_hue": {
                                          "type": "number"
                                    }
                              },
                              "required": [
                                    "id",
                                    "name",
                                    "type"
                              ]
                        }
                  }
            },
            "required": [
                  "module",
                  "dirtree"
            ]
      },
      "App.ModuleType": {
            "type": "string",
            "enum": [
                  "todo",
                  "memo",
                  "note",
                  "kanban",
                  "workflow",
                  "whiteboard",
                  "ppt",
                  "schedule",
                  "pomodoro",
                  "flag",
                  "api",
                  "dataflow",
                  "table",
                  "form",
                  "chart",
                  "setting"
            ],
            "maxLength": 30
      },
      "DirTree.Item": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "enum": [
                              "dir",
                              "file"
                        ]
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "type": {
                                          "type": "string",
                                          "const": "file"
                                    },
                                    "id": {
                                          "type": "string"
                                    },
                                    "name": {
                                          "type": "string"
                                    },
                                    "icon": {
                                          "type": "string"
                                    },
                                    "icon_hue": {
                                          "type": "number"
                                    }
                              },
                              "required": [
                                    "id",
                                    "name",
                                    "type"
                              ]
                        }
                  },
                  "id": {
                        "type": "string"
                  },
                  "name": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  },
                  "icon_hue": {
                        "type": "number"
                  }
            },
            "required": [
                  "id",
                  "name",
                  "type"
            ]
      },
      "DirTree.Dir": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "const": "dir"
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "type": {
                                          "type": "string",
                                          "const": "file"
                                    },
                                    "id": {
                                          "type": "string"
                                    },
                                    "name": {
                                          "type": "string"
                                    },
                                    "icon": {
                                          "type": "string"
                                    },
                                    "icon_hue": {
                                          "type": "number"
                                    }
                              },
                              "required": [
                                    "id",
                                    "name",
                                    "type"
                              ]
                        }
                  },
                  "id": {
                        "type": "string"
                  },
                  "name": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  },
                  "icon_hue": {
                        "type": "number"
                  }
            },
            "required": [
                  "children",
                  "id",
                  "name",
                  "type"
            ]
      },
      "DirTree.File": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "const": "file"
                  },
                  "id": {
                        "type": "string"
                  },
                  "name": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  },
                  "icon_hue": {
                        "type": "number"
                  }
            },
            "required": [
                  "id",
                  "name",
                  "type"
            ]
      }
} as const